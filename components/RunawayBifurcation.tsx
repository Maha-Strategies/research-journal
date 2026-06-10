'use client'

import { useMemo, useState } from 'react'

/**
 * RunawayBifurcation
 *
 * Interactive demonstration of the reduced normal form in
 * "A Unified Nonlinear Dynamical Model of Thermodynamic Runaway" (Eqs. 32-33).
 *
 * IMPORTANT (scope): This visualizes the behaviour of the MODEL only. It shows
 * how the normal form loses its stable fixed point through a saddle-node (fold)
 * bifurcation as the forcing parameter Phi rises past a critical value. It is
 * NOT a measurement of Venus or of the mesolimbic dopamine system, and it does
 * not provide evidence for the universality-class hypothesis, which the paper
 * marks as untested (Section IV-E, Level 3).
 *
 * No external dependencies (plain inline SVG). Drop into a Next.js/MDX site and
 * import where needed:  import { RunawayBifurcation } from '../components/RunawayBifurcation'
 */

const GAMMA = 0.1
const PSI_MAX = 2.0
const BETA = 0.1
const DT = 0.02
const STEPS = 8000
const PHI_C = PSI_MAX / (1 + BETA / GAMMA) // = 1.0, analytic fold threshold (Eq. 31)

type Sim = {
  series: { t: number; x: number }[]
  phase: { x: number; y: number }[]
  runaway: boolean
  xFinal: number
  yFinal: number
}

function simulate(phi: number): Sim {
  let x = 0.2
  let y = 0.0
  const series: { t: number; x: number }[] = []
  const phase: { x: number; y: number }[] = []
  let runaway = false
  for (let i = 0; i < STEPS; i++) {
    const s = (x * x) / (1 + x * x)
    const dx = phi - PSI_MAX * s / (1 + y)
    const dy = BETA * s - GAMMA * y
    x += dx * DT
    y += dy * DT
    if (x > 12) { x = 12; runaway = true }
    if (x < 0) x = 0
    if (y < 0) y = 0
    if (i % 20 === 0) {
      series.push({ t: i * DT, x })
      phase.push({ x, y })
    }
  }
  return { series, phase, runaway, xFinal: x, yFinal: y }
}

function Axes({ w, h }: { w: number; h: number }) {
  return (
    <>
      <line x1={36} y1={h - 24} x2={w - 8} y2={h - 24} stroke="currentColor" strokeOpacity={0.25} />
      <line x1={36} y1={8} x2={36} y2={h - 24} stroke="currentColor" strokeOpacity={0.25} />
    </>
  )
}

export function RunawayBifurcation() {
  const [phi, setPhi] = useState(0.4)
  const sim = useMemo(() => simulate(phi), [phi])
  const subCritical = phi < PHI_C
  const accent = subCritical ? '#378ADD' : '#E24B4A'

  const W = 320
  const H = 200
  const xMax = 12.5
  const tMax = STEPS * DT

  const tsPath = sim.series
    .map((p, i) => {
      const px = 36 + (p.t / tMax) * (W - 44)
      const py = (H - 24) - (p.x / xMax) * (H - 32)
      return `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`
    })
    .join(' ')

  const ppPath = sim.phase
    .map((p, i) => {
      const px = 36 + (p.x / xMax) * (W - 44)
      const py = (H - 24) - (p.y / xMax) * (H - 32)
      return `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`
    })
    .join(' ')

  const fpX = 36 + (sim.xFinal / xMax) * (W - 44)
  const fpY = (H - 24) - (sim.yFinal / xMax) * (H - 32)

  return (
    <div style={{ margin: '1.5rem 0', color: 'inherit' }}>
      <div
        style={{
          fontSize: 13,
          lineHeight: 1.6,
          padding: '10px 14px',
          marginBottom: '1rem',
          borderRadius: 8,
          background: 'rgba(127,127,127,0.08)',
        }}
      >
        This visualizes the paper&rsquo;s reduced normal form (Eqs. 32&ndash;33) only. It demonstrates
        how the model folds as forcing rises &mdash; <strong>not</strong> that Venus and addiction share a
        universality class, which the paper marks as an untested hypothesis (Section IV-E, Level 3).
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <label htmlFor="phi" style={{ fontSize: 14, opacity: 0.8, minWidth: 96 }}>
          Forcing Φ
        </label>
        <input
          id="phi"
          type="range"
          min={0.1}
          max={1.6}
          step={0.01}
          value={phi}
          onChange={(e) => setPhi(parseFloat(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: 14, fontWeight: 500, minWidth: 38, fontFamily: 'monospace' }}>
          {phi.toFixed(2)}
        </span>
      </div>

      <div style={{ fontSize: 13, marginBottom: '1rem', color: accent }}>
        {subCritical
          ? 'sub-critical (Φ < Φc = 1.0): stable homeostasis'
          : 'super-critical (Φ > Φc = 1.0): no equilibrium, runaway'}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
        }}
      >
        <figure style={{ margin: 0 }}>
          <figcaption style={{ fontSize: 13, opacity: 0.7, marginBottom: 6 }}>
            Time series — state x(t)
          </figcaption>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Time series of the state variable x over time">
            <Axes w={W} h={H} />
            <path d={tsPath} fill="none" stroke={accent} strokeWidth={2} />
            <text x={36} y={H - 8} fontSize={11} fill="currentColor" fillOpacity={0.6}>time →</text>
            <text x={6} y={16} fontSize={11} fill="currentColor" fillOpacity={0.6}>x</text>
          </svg>
        </figure>

        <figure style={{ margin: 0 }}>
          <figcaption style={{ fontSize: 13, opacity: 0.7, marginBottom: 6 }}>
            Phase portrait (x, y)
          </figcaption>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Phase portrait of the trajectory in the x-y plane">
            <Axes w={W} h={H} />
            <path d={ppPath} fill="none" stroke={accent} strokeWidth={2} />
            {subCritical && <circle cx={fpX} cy={fpY} r={4} fill="#E24B4A" />}
            <text x={36} y={H - 8} fontSize={11} fill="currentColor" fillOpacity={0.6}>x →</text>
            <text x={6} y={16} fontSize={11} fill="currentColor" fillOpacity={0.6}>y</text>
          </svg>
        </figure>
      </div>

      <div style={{ fontSize: 12, opacity: 0.6, marginTop: '1rem', lineHeight: 1.6 }}>
        Parameters fixed at Ψmax = 2.0, β = 0.1, γ = 0.1, Δt = 0.02 (as in the paper), giving the
        analytic fold threshold Φc = Ψmax/(1+β/γ) = 1.0. Trajectories use forward-Euler and are schematic near
        blow-up.
      </div>
    </div>
  )
}

export default RunawayBifurcation
