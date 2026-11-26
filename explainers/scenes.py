"""Explainer films for the portfolio, rendered with ManimGX.

    manimgx inspect explainers/scenes.py ContainerSentinel
    manimgx render explainers/scenes.py ContainerSentinel -r 960x540 --fps 30

Dark, colour with meaning (see the palette below), silent, each ends on black so it loops.
"""

import math

import manimgx as m

m.config.background_color = m.BLACK
INK, SOFT, DIM, FAINT = m.WHITE, m.GREY_A, m.GREY_C, m.GREY_E
FONT = "Liberation Sans"  # metric twin of Arial, the site's font
# Container Sentinel: red = attack, Docker blue = the socket, green = detection agents, yellow = the report
ATTACK, DOCKER, AGENT, REPORT = "#FF5A4E", "#2496ED", "#3DDC97", "#FFD166"
# BPIP: the dashboard's own marker colours (README: red critical, orange high, yellow moderate, blue low)
CRITICAL, HIGH, MODERATE, LOW = "#FF4D4D", "#FF9F1C", "#FFD60A", "#3A6FD8"
EMBED, TIME, PATROL = "#4CC9F0", "#FFB703", "#5B9BFF"


def T(text, **kw):
    return m.Text(text, font=FONT, **kw)


def box(label, w, h=0.7, size=20, color=INK):
    frame = m.RoundedRectangle(width=w, height=h, corner_radius=0.08, stroke_color=color, stroke_width=2)
    text = T(label, font_size=size, color=color).move_to(frame)
    return m.VGroup(frame, text)


def heading(title, sub):
    t = T(title, font_size=30, color=INK)
    s = T(sub, font_size=17, color=DIM)
    group = m.VGroup(t, s).arrange(m.DOWN, aligned_edge=m.LEFT, buff=0.14)
    return group.to_corner(m.UL, buff=0.45)


def caption(text, size=20):
    return T(text, font_size=size, color=SOFT).to_corner(m.UR, buff=0.5)


def path(*points):
    line = m.VMobject(stroke_color=DIM, stroke_width=2)
    line.set_points_as_corners([[x, y, 0] for x, y in points])
    return line


class ContainerSentinel(m.Scene):
    """Five real attacks on a sandbox, then four AI agents explain them (github.com/23f2005639/Docker_Security_Agent)."""

    def construct(self) -> None:
        title = heading("Container Sentinel", "real attacks on a sandbox, then AI agents explain them")

        attacker = box("attacker", 2.0, 0.9, color=ATTACK).move_to([-5.4, 0.6, 0])
        sandbox = m.Rectangle(width=3.6, height=3.0, stroke_color=FAINT, stroke_width=2).move_to([0.6, 0.6, 0])
        sandbox_label = T("sandbox", font_size=18, color=DIM).next_to(sandbox.get_corner(m.DL), m.UR, buff=0.06)
        targets = {
            "nginx": box("nginx-target", 2.9).move_to([0.6, 1.45, 0]),
            "flask": box("flask-target · privileged", 2.9, size=17).move_to([0.6, 0.6, 0]),
            "redis": box("redis-target", 2.9).move_to([0.6, -0.25, 0]),
        }
        host = box("host", 1.8, 0.9).move_to([5.6, 0.6, 0])
        top_route = path((-5.4, 1.05), (-5.4, 2.45), (5.6, 2.45), (5.6, 1.05))
        sock = box("docker.sock", 1.9, 0.45, size=16, color=DOCKER).move_to([0.6, 2.45, 0])
        sock[0].set_fill(m.BLACK, opacity=1)

        self.play(m.FadeIn(title, shift=m.DOWN * 0.2), run_time=0.8)
        self.play(
            m.LaggedStart(
                m.FadeIn(attacker),
                m.Create(sandbox), m.FadeIn(sandbox_label),
                *[m.FadeIn(t) for t in targets.values()],
                m.FadeIn(host), m.Create(top_route), m.FadeIn(sock),
                lag_ratio=0.12,
            ),
            run_time=2.2,
        )

        # the five attacks in src/attacks, each on its real path
        to_target = lambda key: path((-4.4, 0.6), (-2.2, 0.6), (-2.2, targets[key].get_center()[1]), (-0.85, targets[key].get_center()[1]))
        attacks = [
            ("nsenter escape", "flask-target", to_target("flask"), targets["flask"]),
            ("Redis lateral movement", "redis-target", to_target("redis"), targets["redis"]),
            ("Docker socket escape", "the host", top_route, host),
            ("AuthZ bypass", "the host", top_route, host),
            ("runc CVE-2025-31133", "the host", top_route, host),
        ]
        label = None
        for i, (name, hits, route, target) in enumerate(attacks, 1):
            new = caption(f"{i}/5  {name} → {hits}")
            dot = m.Dot(radius=0.1, color=ATTACK).move_to(route.get_start())
            trail = route.copy().set_stroke(ATTACK, width=3)
            self.add(trail, dot)
            self.bring_to_front(sock)
            self.play(
                m.FadeIn(new) if label is None else m.ReplacementTransform(label, new),
                m.Create(trail), m.MoveAlongPath(dot, route),
                run_time=1.0, rate_func=m.smooth,
            )
            label = new
            self.play(
                m.Flash(target, color=ATTACK, line_length=0.25, num_lines=10, flash_radius=0.7),
                target[0].animate.set_fill(ATTACK, opacity=0.28),
                m.FadeOut(dot), run_time=0.55,
            )
            self.play(m.FadeOut(trail), target[0].animate.set_fill(INK, opacity=0), run_time=0.3)

        # detection: events go down to the agents; three run together, then the reporter
        bus = path((0.6, -0.9), (0.6, -1.65))
        rail = path((-4.8, -1.65), (0.6, -1.65))
        names = ["scanner", "monitor", "network", "reporter"]
        agents = [box(n, 1.9, 0.8, size=24, color=AGENT if n != "reporter" else REPORT).move_to([x, -2.65, 0]) for x, n in zip([-4.8, -2.6, -0.4, 2.6], names)]
        drops = [path((x, -1.65), (x, -2.25)) for x in (-4.8, -2.6, -0.4)]
        handoff = m.Arrow(agents[2].get_right(), agents[3].get_left(), buff=0.08, stroke_width=2, color=DIM, max_tip_length_to_length_ratio=0.25)
        report = m.VGroup(
            m.Rectangle(width=0.8, height=1.0, stroke_color=REPORT, stroke_width=2),
            *[m.Line([-0.25, y, 0], [0.25 - (0.12 if k == 2 else 0), y, 0], stroke_width=2, color=REPORT) for k, y in enumerate([0.22, 0.02, -0.18])],
        ).move_to([5.4, -2.65, 0])
        deliver = m.Arrow(agents[3].get_right(), report.get_left(), buff=0.08, stroke_width=2, color=DIM, max_tip_length_to_length_ratio=0.25)

        self.play(
            m.ReplacementTransform(label, cap := caption("events go to the agents")),
            m.Create(bus), m.Create(rail), *[m.Create(d) for d in drops],
            m.LaggedStart(*[m.FadeIn(a, shift=m.UP * 0.15) for a in agents], lag_ratio=0.15),
            run_time=1.4,
        )

        def bar(agent):
            inner = agent[0]
            return m.Rectangle(width=inner.width - 0.2, height=0.09, stroke_width=0, fill_color=inner.get_stroke_color(), fill_opacity=1).next_to(inner.get_bottom(), m.UP, buff=0.09)

        bars = [bar(a) for a in agents]
        self.play(
            m.ReplacementTransform(cap, cap := caption("scanner, monitor and network run together")),
            m.AnimationGroup(*[m.GrowFromEdge(b, m.LEFT, run_time=t) for b, t in zip(bars[:3], [1.5, 1.8, 2.1])]),
            *[a[0].animate.set_stroke(AGENT, width=3) for a in agents[:3]],
        )
        self.play(m.ReplacementTransform(cap, cap := caption("then the reporter writes it up")), m.Create(handoff), run_time=0.6)
        self.play(m.GrowFromEdge(bars[3], m.LEFT), agents[3][0].animate.set_stroke(REPORT, width=3), run_time=1.2)
        self.play(m.Create(deliver), m.FadeIn(report, shift=m.RIGHT * 0.2), run_time=0.8)

        summary = T("5 real attacks  ·  4 agents  ·  1 report", font_size=24, color=INK, t2c={"5 real attacks": ATTACK, "4 agents": AGENT, "1 report": REPORT}).to_edge(m.DOWN, buff=0.25)
        self.play(m.FadeOut(cap), m.FadeIn(summary, shift=m.UP * 0.15), run_time=0.8)
        self.wait(2.2)
        self.play(*[m.FadeOut(mob) for mob in self.mobjects], run_time=0.8)
        self.wait(0.3)


# ---- BPIP ----
COLS, ROWS, CELL = 10, 7, 0.46
HOTS = [(2.0, 1.6, 1.0), (6.8, 4.2, 0.85), (4.0, 5.4, 0.55)]


def spatial(c, r):
    return 0.12 + sum(w * math.exp(-((c - hc) ** 2 + (r - hr) ** 2) / 3.2) for hc, hr, w in HOTS)


def daily(h):
    return 0.18 + 0.95 * math.exp(-(((h - 9.5) / 1.7) ** 2)) + 1.0 * math.exp(-(((h - 18.5) / 1.8) ** 2)) + 0.35 * math.exp(-(((h - 13.5) / 2.2) ** 2))


def multiplier(h):
    return 3.0 if 8 <= h < 11 or 17 <= h < 20 else 1.0  # peak windows from the repo


def impact(c, r, h):
    return 6.6 * spatial(c, r) * daily(h) * multiplier(h)  # shortcut: illustrative cell rates, not the trained model's output


BANDS = [(15, CRITICAL, "critical  > 15"), (8, HIGH, "high  8–15"), (3, MODERATE, "moderate  3–8"), (-1, LOW, "low  < 3")]


def shade(v):
    return next(color for limit, color, _ in BANDS if v > limit)


class ParkingHotspots(m.Scene):
    """BPIP: a spatio-temporal model of illegal parking across Bengaluru (github.com/23f2005639/parking_violation_system)."""

    def construct(self) -> None:
        title = heading("BPIP  ·  Bengaluru parking hotspots", "predicts where illegal parking piles up, hour by hour")
        self.play(m.FadeIn(title, shift=m.DOWN * 0.2), run_time=0.8)

        cells = m.VGroup(*[
            m.Square(side_length=CELL - 0.06, stroke_color=FAINT, stroke_width=1.5, fill_color="#2a2a2a", fill_opacity=0)
            for _ in range(COLS * ROWS)
        ]).arrange_in_grid(rows=ROWS, cols=COLS, buff=0.06).move_to([-3.55, -0.55, 0])
        at = lambda c, r: cells[r * COLS + c]
        cap = caption("the city as a grid: 7,814 cells")
        self.play(m.LaggedStart(*[m.FadeIn(s, scale=0.6) for s in cells], lag_ratio=0.01), m.FadeIn(cap), run_time=1.8)

        # how one cell is predicted
        pick = at(2, 0)
        self.play(pick.animate.set_stroke(INK, width=3), run_time=0.5)
        heights = [0.15 + 0.55 * abs(math.sin(i * 1.7) * math.cos(i * 0.6)) for i in range(32)]
        embed = m.VGroup(*[m.Rectangle(width=0.06, height=h, stroke_width=0, fill_color=EMBED, fill_opacity=1) for h in heights]).arrange(m.RIGHT, buff=0.035, aligned_edge=m.DOWN).move_to([2.2, 1.45, 0])
        embed_label = T("32-number cell embedding", font_size=15, color=EMBED).next_to(embed, m.UP, buff=0.12)
        time_in = m.VGroup(*[m.Square(side_length=0.26, stroke_color=TIME, stroke_width=2) for _ in range(7)]).arrange(m.RIGHT, buff=0.08).move_to([2.2, 0.15, 0])
        time_label = T("hour sin/cos · weekday · weekend · history", font_size=14, color=TIME).next_to(time_in, m.DOWN, buff=0.12)
        mlp = box("fusion MLP", 2.0, 0.7).move_to([5.45, 0.8, 0])
        mlp_sub = T("GELU · batch norm · dropout", font_size=12, color=DIM).next_to(mlp, m.DOWN, buff=0.08)
        soft = box("softplus", 1.6, 0.55, size=17).move_to([5.45, -0.55, 0])
        out = T(f"{6.6 * spatial(2, 0) * daily(18):.1f} violations / hour", font_size=20, color=INK).move_to([5.45, -1.45, 0])  # same pattern as the grid, 18:00
        feed = path((pick.get_center()[0], pick.get_top()[1] + 0.03), (pick.get_center()[0], 1.38), (embed.get_left()[0] - 0.08, 1.38))
        a1 = m.Arrow(embed.get_right(), mlp.get_left() + m.UP * 0.12, buff=0.1, stroke_width=2, color=DIM, max_tip_length_to_length_ratio=0.15)
        a2 = m.Arrow(time_in.get_right(), mlp.get_left() + m.DOWN * 0.12, buff=0.1, stroke_width=2, color=DIM, max_tip_length_to_length_ratio=0.15)
        a3 = m.Arrow(mlp_sub.get_bottom(), soft.get_top(), buff=0.06, stroke_width=2, color=DIM, max_tip_length_to_length_ratio=0.3)
        a4 = m.Arrow(soft.get_bottom(), out.get_top(), buff=0.06, stroke_width=2, color=DIM, max_tip_length_to_length_ratio=0.3)
        self.play(m.ReplacementTransform(cap, cap := caption("each cell learns its own 32 numbers")), m.Create(feed), m.LaggedStart(*[m.GrowFromEdge(b, m.DOWN) for b in embed], lag_ratio=0.03), m.FadeIn(embed_label), run_time=1.4)
        self.play(m.ReplacementTransform(cap, cap := caption("plus 7 inputs about the time")), m.LaggedStart(*[m.FadeIn(s, scale=0.5) for s in time_in], lag_ratio=0.1), m.FadeIn(time_label), run_time=1.1)
        self.play(m.ReplacementTransform(cap, cap := caption("fused, then a count per hour")), m.GrowArrow(a1), m.GrowArrow(a2), m.FadeIn(mlp), m.FadeIn(mlp_sub), run_time=1.0)
        self.play(m.GrowArrow(a3), m.FadeIn(soft), run_time=0.6)
        self.play(m.GrowArrow(a4), m.Write(out), run_time=0.8)
        loss = T("trained with Poisson loss  ·  RMSE 2.83  ·  MAE 1.59", font_size=17, color=SOFT).move_to([3.5, -2.35, 0])
        self.play(m.ReplacementTransform(cap, cap := caption("validated on held-out data")), m.FadeIn(loss, shift=m.UP * 0.1), run_time=0.8)
        self.wait(1.4)
        model = m.VGroup(embed, embed_label, time_in, time_label, mlp, mlp_sub, soft, out, feed, a1, a2, a3, a4, loss)
        self.play(m.FadeOut(model), pick.animate.set_stroke(FAINT, width=1.5), run_time=0.7)

        # run the day: every cell, every hour
        hour = m.ValueTracker(6)
        clock = m.always_redraw(lambda: T(f"{int(hour.get_value()) % 24:02d}:00 IST", font_size=40, color=INK).move_to([3.6, 1.3, 0]))
        mult = m.always_redraw(lambda: T(
            f"×{multiplier(int(hour.get_value()) % 24):.1f}" + ("  peak" if multiplier(int(hour.get_value()) % 24) > 1 else ""),
            font_size=24, color=CRITICAL if multiplier(int(hour.get_value()) % 24) > 1 else DIM).move_to([3.6, 0.55, 0]))
        legend = m.VGroup(*[
            m.VGroup(m.Square(side_length=0.26, stroke_width=1, stroke_color=FAINT, fill_color=color, fill_opacity=1), T(text, font_size=15, color=DIM)).arrange(m.RIGHT, buff=0.18)
            for _, color, text in BANDS
        ]).arrange(m.DOWN, aligned_edge=m.LEFT, buff=0.14).move_to([3.6, -1.1, 0])
        for i, sq in enumerate(cells):
            c, r = i % COLS, i // COLS
            sq.add_updater(lambda s, c=c, r=r: s.set_fill(shade(impact(c, r, int(hour.get_value()) % 24)), opacity=1))
        note = T("illustrative patch", font_size=15, color=DIM).next_to(cells, m.DOWN, aligned_edge=m.LEFT, buff=0.12)
        self.play(m.ReplacementTransform(cap, cap := caption("impact = predicted count × the hour's multiplier")), m.FadeIn(clock), m.FadeIn(mult), m.FadeIn(legend), m.FadeIn(note), run_time=0.9)
        self.play(hour.animate.set_value(18.99), run_time=7.5, rate_func=m.linear)
        for sq in cells:
            sq.clear_updaters()

        # 18:00: send patrols to the worst five cells
        values = sorted(((impact(i % COLS, i // COLS, 18), i) for i in range(COLS * ROWS)), reverse=True)[:5]
        rings = [m.Square(side_length=CELL + 0.04, stroke_color=INK, stroke_width=4).move_to(cells[i]) for _, i in values]
        units = [m.Triangle(color=PATROL, fill_color=PATROL, fill_opacity=1).scale(0.14).move_to([6.6, -2.9, 0]) for _ in range(5)]
        self.play(m.ReplacementTransform(cap, cap := caption("top hotspots get patrols first")), m.LaggedStart(*[m.Create(r) for r in rings], lag_ratio=0.15), run_time=1.0)
        self.play(m.LaggedStart(*[u.animate.move_to(cells[i]) for u, (_, i) in zip(units, values)], lag_ratio=0.15), run_time=1.8)
        self.wait(2.0)
        self.play(*[m.FadeOut(mob) for mob in self.mobjects], run_time=0.8)
        self.wait(0.3)
