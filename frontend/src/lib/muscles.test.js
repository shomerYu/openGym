import { describe, it, expect } from 'vitest'
import { canonMuscle, musclesOf, MUSCLES } from './muscles.js'

describe('canonMuscle', () => {
  it('passes through the slugs the app itself stores', () => {
    // What a muscle picker writes: the slug the body map draws, no alias needed.
    MUSCLES.forEach(m => expect(canonMuscle(m)).toBe(m))
  })

  it('still maps the dataset spellings, which are not slugs', () => {
    expect(canonMuscle('pectorals')).toBe('chest')
    expect(canonMuscle('lats')).toBe('upper-back')
    expect(canonMuscle('glutes')).toBe('gluteal')
    expect(canonMuscle('shins')).toBe('tibialis')
    expect(canonMuscle('hip flexors')).toBe('hip-flexors')
  })

  it('is case- and space-insensitive, like the dataset is not', () => {
    expect(canonMuscle('  Upper Back ')).toBe('upper-back')
  })

  it('returns empty for anything the map cannot draw', () => {
    expect(canonMuscle('cardiovascular system')).toBe('')
    expect(canonMuscle('ankles')).toBe('')
    expect(canonMuscle('not a muscle')).toBe('')
    expect(canonMuscle(null)).toBe('')
    expect(canonMuscle(undefined)).toBe('')
  })
})

describe('musclesOf', () => {
  it('reads a duplicated exercise, whose muscles are stored as slugs', () => {
    const custom = { id: 'c1', bp: 'chest', tg: 'chest', sm: ['deltoids', 'serratus'] }
    expect(musclesOf(custom)).toEqual({ chest: 1, deltoids: 0.4, serratus: 0.4 })
  })

  it('reads a catalogue exercise, whose muscles are free text', () => {
    const cat = { id: '0025', bp: 'chest', tg: 'pectorals', sm: ['shoulders', 'triceps'] }
    expect(musclesOf(cat)).toEqual({ chest: 1, deltoids: 0.4, triceps: 0.4 })
  })

  it('keeps the primary at full weight when it also appears as a secondary', () => {
    expect(musclesOf({ tg: 'chest', sm: ['chest'] })).toEqual({ chest: 1 })
  })

  it('falls back to the body part when nothing resolves', () => {
    // A from-scratch custom exercise: body part only, no muscles picked.
    expect(musclesOf({ bp: 'chest', tg: '', sm: [] })).toEqual({ chest: 1 })
    expect(musclesOf({ bp: 'upper legs', tg: '', sm: [] }))
      .toEqual({ quadriceps: 0.4, hamstring: 0.35, gluteal: 0.25 })
  })
})
