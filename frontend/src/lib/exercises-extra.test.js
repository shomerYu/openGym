import { describe, it, expect } from 'vitest'
import { EXTRA } from './exercises-extra.js'
import { EXDB as CATALOGUE } from './exercises-data.js'
import { canonMuscle } from './muscles.js'

describe('added exercises', () => {
  it('cannot collide with an upstream id, however the catalogue grows', () => {
    // Upstream ids are numeric strings; ours are x-prefixed. A collision would silently
    // shadow a real exercise in EXIDX, taking its history with it.
    const upstream = new Set(CATALOGUE.map(e => e.id))
    EXTRA.forEach(e => {
      expect(e.id).toMatch(/^x\d{4}$/)
      expect(upstream.has(e.id)).toBe(false)
    })
    expect(new Set(EXTRA.map(e => e.id)).size).toBe(EXTRA.length)
  })

  it('does not duplicate a name the catalogue already has', () => {
    const names = new Set(CATALOGUE.map(e => e.n.toLowerCase()))
    EXTRA.forEach(e => expect(names.has(e.n.toLowerCase())).toBe(false))
  })

  it('carries every field the rest of the app reads off an exercise', () => {
    EXTRA.forEach(e => {
      expect(e.n).toBeTruthy()
      expect(e.bp).toBeTruthy()
      expect(e.eq).toBeTruthy()
      // Library search does `e.tg.includes(q)` and `e.eq.includes(q)` unguarded.
      expect(typeof e.tg).toBe('string')
      expect(Array.isArray(e.sm)).toBe(true)
      expect(e.st.length).toBeGreaterThan(2)
    })
  })

  it('names only muscles the body map can actually draw', () => {
    // A muscle the map cannot resolve is dropped silently, and an exercise whose muscles all
    // drop falls back to shading its whole body part — worse than useless on a core exercise.
    EXTRA.forEach(e => {
      expect(canonMuscle(e.tg), e.n + ' tg=' + e.tg).not.toBe('')
      e.sm.forEach(m => expect(canonMuscle(m), e.n + ' sm=' + m).not.toBe(''))
    })
  })

  it('uses body parts and equipment the filters already offer', () => {
    // A one-off value would create a chip row with a single result behind it.
    const bps = new Set(CATALOGUE.map(e => e.bp)), eqs = new Set(CATALOGUE.map(e => e.eq))
    EXTRA.forEach(e => {
      expect(bps.has(e.bp), e.n + ' bp=' + e.bp).toBe(true)
      expect(eqs.has(e.eq), e.n + ' eq=' + e.eq).toBe(true)
    })
  })
})
