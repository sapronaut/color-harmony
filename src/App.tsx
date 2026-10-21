import { useState } from 'react'
import { colord, extend } from 'colord'
import a11yPlugin from 'colord/plugins/a11y'
import harmoniesPlugin from 'colord/plugins/harmonies'
import { Copy, Check } from 'lucide-react'

extend([a11yPlugin, harmoniesPlugin])

type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'tetradic' | 'monochromatic'

const HARMONIES: { id: HarmonyType; label: string }[] = [
  { id: 'complementary', label: 'Complementary' },
  { id: 'analogous', label: 'Analogous' },
  { id: 'triadic', label: 'Triadic' },
  { id: 'split-complementary', label: 'Split Complementary' },
  { id: 'tetradic', label: 'Tetradic' },
  { id: 'monochromatic', label: 'Monochromatic' },
]

export default function App() {
  const [hex, setHex] = useState('#6366f1')
  const [copied, setCopied] = useState<string | null>(null)
  const [activeHarmony, setActiveHarmony] = useState<HarmonyType>('complementary')

  const color = colord(hex)
  const isValid = color.isValid()

  const harmonies = isValid ? (color as any).harmonies(activeHarmony) : []

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(value)
    setTimeout(() => setCopied(null), 1400)
  }

  // Contrast against white and black
  const contrastWhite = isValid ? color.contrast('#ffffff') : 0
  const contrastBlack = isValid ? color.contrast('#000000') : 0
  const bestText = contrastWhite > contrastBlack ? '#ffffff' : '#000000'

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-2xl font-semibold tracking-tight">Color Harmony</h1>
          <p className="mt-1 text-sm text-zinc-500">Pick a color. Get harmonious palettes instantly.</p>
        </div>

        {/* Color Input */}
        <div className="mb-10 flex items-center gap-4">
          <div className="relative">
            <input
              type="color"
              value={isValid ? hex : '#6366f1'}
              onChange={e => setHex(e.target.value)}
              className="h-14 w-14 cursor-pointer appearance-none rounded-xl border-0 bg-transparent"
            />
          </div>

          <input
            type="text"
            value={hex}
            onChange={e => setHex(e.target.value)}
            className="w-36 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 font-mono text-sm focus:border-zinc-600 focus:outline-none"
            placeholder="#000000"
          />

          {isValid && (
            <div
              className="flex h-14 flex-1 items-center justify-center rounded-xl text-sm font-medium"
              style={{ backgroundColor: hex, color: bestText }}
            >
              Preview
            </div>
          )}
        </div>

        {/* Harmony Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {HARMONIES.map(h => (
            <button
              key={h.id}
              onClick={() => setActiveHarmony(h.id)}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                activeHarmony === h.id
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>

        {/* Palette */}
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {harmonies.map((c: typeof color, i: number) => {
            const value = c.toHex()
            const textColor = c.contrast('#ffffff') > c.contrast('#000000') ? '#ffffff' : '#000000'

            return (
              <button
                key={i}
                onClick={() => copy(value)}
                className="group relative flex aspect-square flex-col items-center justify-end overflow-hidden rounded-2xl p-3 transition hover:scale-[1.02]"
                style={{ backgroundColor: value }}
              >
                <span
                  className="rounded-md bg-black/20 px-2 py-0.5 font-mono text-xs backdrop-blur-sm"
                  style={{ color: textColor }}
                >
                  {value}
                </span>

                <div className="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100">
                  {copied === value ? (
                    <Check className="h-4 w-4" style={{ color: textColor }} />
                  ) : (
                    <Copy className="h-4 w-4" style={{ color: textColor }} />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Contrast */}
        {isValid && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h2 className="mb-3 text-sm font-medium text-zinc-400">Contrast</h2>
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-zinc-500">on white</span>
                <p className="mt-1 font-mono">
                  {contrastWhite.toFixed(2)}{' '}
                  <span className={contrastWhite >= 4.5 ? 'text-emerald-400' : 'text-amber-400'}>
                    {contrastWhite >= 7 ? 'AAA' : contrastWhite >= 4.5 ? 'AA' : 'Fail'}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-zinc-500">on black</span>
                <p className="mt-1 font-mono">
                  {contrastBlack.toFixed(2)}{' '}
                  <span className={contrastBlack >= 4.5 ? 'text-emerald-400' : 'text-amber-400'}>
                    {contrastBlack >= 7 ? 'AAA' : contrastBlack >= 4.5 ? 'AA' : 'Fail'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}