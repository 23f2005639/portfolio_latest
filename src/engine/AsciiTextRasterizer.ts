/**
 * Offscreen rasterizer for converting typography and headings
 * into an image source suitable for the Glyph AsciiRenderer.
 */
export interface TextRasterizerOptions {
  width: number
  height: number
  lines: string[]
  fontFamily?: string
  fontSize?: number
  fontWeight?: string | number
  letterSpacing?: number
  lineHeight?: number
  sublines?: string[]
  subFontSize?: number
  align?: 'left' | 'center' | 'right'
}

export class AsciiTextRasterizer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  constructor() {
    this.canvas = document.createElement('canvas')
    const ctx = this.canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) throw new Error('Failed to get offscreen rasterizer 2d context')
    this.ctx = ctx
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas
  }

  render(options: TextRasterizerOptions): HTMLCanvasElement {
    const {
      width,
      height,
      lines,
      fontFamily = 'Inter, -apple-system, sans-serif',
      fontSize = 56,
      fontWeight = '800',
      letterSpacing = 2,
      lineHeight = 1.15,
      sublines = [],
      subFontSize = 18,
      align = 'center',
    } = options

    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = Math.max(1, width)
      this.canvas.height = Math.max(1, height)
    }

    const ctx = this.ctx
    // Fill with pure white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Render dark high-contrast text (which gets sampled as low brightness)
    ctx.fillStyle = '#000000'
    ctx.textAlign = align
    ctx.textBaseline = 'middle'

    const totalLines = lines.length + sublines.length
    const lineSpacing = fontSize * lineHeight
    const subLineSpacing = subFontSize * 1.3
    const totalHeight = lines.length * lineSpacing + sublines.length * subLineSpacing

    let currentY = (height - totalHeight) / 2 + fontSize / 2

    const startX = align === 'center' ? width / 2 : align === 'left' ? 32 : width - 32

    // Main lines
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
    for (const line of lines) {
      if (letterSpacing > 0 && ctx.letterSpacing !== undefined) {
        ctx.letterSpacing = `${letterSpacing}px`
      }
      ctx.fillText(line, startX, currentY)
      currentY += lineSpacing
    }

    // Sub lines (monospaced / lighter)
    if (sublines.length > 0) {
      currentY += 8
      ctx.font = `500 ${subFontSize}px 'JetBrains Mono', monospace`
      if (ctx.letterSpacing !== undefined) {
        ctx.letterSpacing = '1px'
      }
      for (const sub of sublines) {
        ctx.fillText(sub, startX, currentY)
        currentY += subLineSpacing
      }
    }

    return this.canvas
  }
}
