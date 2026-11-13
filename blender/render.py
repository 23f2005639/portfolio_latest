# Run: blender -b -P blender/render.py -- <textures_dir> <out_dir>
# Renders embossed/debossed plaster reliefs used by the site (hero, tileable bg, seal).
import bpy, bmesh, sys, os, math

TEX, OUT = sys.argv[sys.argv.index("--") + 1:][:2]
os.makedirs(OUT, exist_ok=True)
FONT = next((f for f in [  # Noto Black has overlapping contours that break booleans
                         "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"] if os.path.exists(f)), None)
BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]


def reset(w, h, samples=96):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    s = bpy.context.scene
    s.render.engine = 'CYCLES'
    s.cycles.device = 'CPU'
    s.cycles.samples = samples
    s.cycles.use_denoising = True
    s.render.resolution_x, s.render.resolution_y = w, h
    s.view_settings.view_transform = 'Standard'
    s.world = bpy.data.worlds.new("W")
    s.world.use_nodes = True
    bg = s.world.node_tree.nodes["Background"]
    bg.inputs[0].default_value = (0.95, 0.93, 0.9, 1)
    bg.inputs[1].default_value = 0.35
    # raking sun from top-left, matches the CSS emboss shadows
    bpy.ops.object.light_add(type='SUN', rotation=(math.radians(64), 0, math.radians(225)))
    sun = bpy.context.object.data
    sun.energy, sun.angle = 3.2, math.radians(4)
    return s


def camera(scale):
    bpy.ops.object.camera_add(location=(0, 0, 10))
    c = bpy.context.object
    c.data.type, c.data.ortho_scale = 'ORTHO', scale
    bpy.context.scene.camera = c


def material(name, tex, scale, sat=0.12):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links
    bsdf = N["Principled BSDF"]
    mp = N.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (scale,) * 3
    L.new(N.new("ShaderNodeTexCoord").outputs["Object"], mp.inputs["Vector"])

    def img(kind, color=False):
        n = N.new("ShaderNodeTexImage")
        n.image = bpy.data.images.load(f"{TEX}/{tex}/{tex}_1K-JPG_{kind}.jpg")
        if not color:
            n.image.colorspace_settings.name = "Non-Color"
        n.projection, n.projection_blend = 'BOX', 0.3
        L.new(mp.outputs[0], n.inputs[0])
        return n

    hs = N.new("ShaderNodeHueSaturation")
    hs.inputs["Saturation"].default_value = sat
    L.new(img("Color", True).outputs[0], hs.inputs["Color"])
    L.new(hs.outputs[0], bsdf.inputs["Base Color"])
    L.new(img("Roughness").outputs[0], bsdf.inputs["Roughness"])
    nm = N.new("ShaderNodeNormalMap")
    L.new(img("NormalGL").outputs[0], nm.inputs["Color"])
    L.new(nm.outputs[0], bsdf.inputs["Normal"])
    return m


def slab(w, h, mat):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, -0.5), scale=(w, h, 1))
    bpy.ops.object.transform_apply(scale=True)
    o = bpy.context.object
    o.data.materials.append(mat)
    return o


def text(body, size, loc, depth, bevel=0.03, align='LEFT'):
    # text extrudes both ways from z=0: above slab = emboss, as cutter = deboss
    bpy.ops.object.text_add(location=loc)
    o = bpy.context.object
    d = o.data
    d.body, d.size, d.extrude = body, size, depth
    d.bevel_depth, d.bevel_resolution = bevel, 3
    d.align_x, d.align_y = align, 'CENTER'
    if FONT:
        d.font = bpy.data.fonts.load(FONT)
    bpy.ops.object.convert(target='MESH')
    o = bpy.context.object
    # text meshes have duplicate seam verts that break exact booleans
    bm = bmesh.new(); bm.from_mesh(o.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4)
    bm.to_mesh(o.data); bm.free()
    return o


def cut(target, cutters):
    col = bpy.data.collections.new("cutters")
    bpy.context.scene.collection.children.link(col)
    for c in cutters:
        for uc in c.users_collection:
            uc.objects.unlink(c)
        col.objects.link(c)
        c.hide_render = True
    m = target.modifiers.new("deboss", 'BOOLEAN')
    m.operation, m.operand_type, m.collection = 'DIFFERENCE', 'COLLECTION', col
    m.solver = 'MANIFOLD'  # EXACT solver empties the mesh with text cutters


def render(name):
    bpy.context.scene.render.filepath = f"{OUT}/{name}.png"
    bpy.ops.render.render(write_still=True)





if __name__ == "__main__":
    # optional part names after the two dirs: hero bg seal (default: all)
    PARTS = set(sys.argv[sys.argv.index("--") + 3:]) or {"hero", "bg", "seal"}

    if "hero" in PARTS:
        # embossed first name, debossed surname, raised rings, Bayer dot deboss
        reset(1600, 900)
        camera(16)
        plaster = material("plaster", "Plaster003", 0.25)
        base = slab(22, 14, plaster)
        first = text("SHREYAS", 2.3, (-7, 0.7, 0), 0.18, 0.05)
        first.data.materials.append(plaster)
        cutters = [text("NAMDEO", 1.25, (-6.95, -1.55, 0), 0.14, 0.02)]
        for i, v in enumerate(BAYER4):
            bpy.ops.mesh.primitive_cylinder_add(radius=0.07 + 0.019 * v, depth=0.3,
                                                location=(4.3 + (i % 4) * 0.75, -1.6 - (i // 4) * 0.75, 0))
            cutters.append(bpy.context.object)
        cut(base, cutters)
        for r in (1.3, 1.95, 2.6, 3.25):
            bpy.ops.mesh.primitive_torus_add(major_radius=r, minor_radius=0.09, location=(6.9, 3.4, 0))
            bpy.context.object.data.materials.append(plaster)
            bpy.ops.object.shade_smooth()
        render("hero")

    if "bg" in PARTS:
        # flat plaster, frame = exactly 2 texture periods so it tiles seamlessly
        reset(800, 800, 48)
        camera(2)
        slab(4, 4, material("plaster", "Plaster003", 1.0))
        render("bg")

    if "seal" in PARTS:
        # raised concrete coin with debossed monogram
        reset(600, 600)
        camera(6.4)
        slab(10, 10, material("plaster", "Plaster003", 0.25))
        bpy.ops.mesh.primitive_cylinder_add(vertices=128, radius=2.6, depth=0.5)
        coin = bpy.context.object
        coin.data.materials.append(material("concrete", "Concrete034", 0.5, 0.0))
        bev = coin.modifiers.new("bevel", 'BEVEL')
        bev.width, bev.segments = 0.12, 4
        cut(coin, [text("SN", 2.0, (0, 0.05, 0.25), 0.12, 0.02, 'CENTER')])
        render("seal")

