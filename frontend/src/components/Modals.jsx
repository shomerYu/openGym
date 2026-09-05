import { useEffect, useRef } from 'react'
import { useUI } from '../store/useUI.js'

// One bottom sheet (or centered dialog) with swipe-to-dismiss.
function Sheet({ sheet }) {
  const { closeSheet } = useUI()
  const ref = useRef(null)
  const drag = useRef({ startY: null, delta: 0 })

  const onTouchStart = e => {
    const el = ref.current
    // a gesture that begins on a slider (or opted-out control) belongs to that control,
    // not to the sheet's swipe-to-dismiss — so it keeps working while you drag
    if (e.target.closest && e.target.closest('input[type=range], [data-nodrag]')) {
      drag.current = { startY: null, delta: 0 }
      return
    }
    drag.current = { startY: el.scrollTop <= 0 ? e.touches[0].clientY : null, delta: 0 }
  }
  const onTouchMove = e => {
    const el = ref.current, d = drag.current
    if (d.startY === null) return
    d.delta = e.touches[0].clientY - d.startY
    if (d.delta > 0 && el.scrollTop <= 0) {
      e.preventDefault()
      el.style.transition = 'none'
      el.style.transform = `translateY(${d.delta}px)`
    } else d.delta = 0
  }
  const onTouchEnd = () => {
    const el = ref.current, d = drag.current
    if (d.startY === null) return
    el.style.transition = 'transform .2s'
    if (d.delta > 90 && !sheet.locked) { el.style.transform = 'translateY(110%)'; setTimeout(() => closeSheet(sheet.id), 180) }
    else el.style.transform = ''
    d.startY = null
  }

  // non-passive touchmove so preventDefault works (bottom sheets only; centered dialogs have no ref)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => el.removeEventListener('touchmove', onTouchMove)
  }, [])

  const close = () => closeSheet(sheet.id)
  if (sheet.kind === 'center') {
    return (
      <div>
        <div className="mback" onClick={() => { if (!sheet.locked) close() }} />
        <div className="center">{sheet.render(close)}</div>
      </div>
    )
  }
  return (
    <div>
      <div className="mback" onClick={() => { if (!sheet.locked) close() }} />
      <div className="sheet" ref={ref} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="grab" />
        {sheet.render(close)}
      </div>
    </div>
  )
}

/* The phone's back button (and the browser's, and iOS' edge swipe) should dismiss the sheet you
   are looking at, not leave the screen behind it — pressing back on "Start Hinge Day?" belongs
   back on the routine list, and on Android it was closing the app instead.

   A sheet is not a route, so it gets a history entry of its own: opening one pushes an entry at
   the same URL, which makes back a no-op for the router (same hash, nothing re-renders) that we
   answer by closing the top sheet. Closing a sheet any other way spends that entry with a
   history.go, and the pop it causes is swallowed rather than closing a second sheet. Module
   scope, not component state: these have to survive re-renders and stay in step with the one
   real history stack. */
let owned = 0      // entries we pushed — one per open sheet
let swallow = 0    // pops we caused ourselves and must ignore

export default function Modals() {
  const sheets = useUI(s => s.sheets)

  // Keep our history entries in step with what is open, whichever side changed.
  useEffect(() => {
    const n = sheets.length
    while (owned < n) { owned++; history.pushState({ ogSheet: owned }, '', location.href) }
    if (owned > n) {
      const back = owned - n
      owned = n
      // Only spend those entries while we are still standing on one. A sheet that closed
      // *because* it sent you somewhere ("Edit this workout") has already pushed a route on
      // top, and going back would undo that navigation rather than the sheet. The entry it
      // leaves behind is harmless: it sits under the new route at the URL the sheet was
      // opened from, which is where back belongs anyway.
      // One go() is one popstate however many entries it crosses, so swallow one event.
      if (history.state && history.state.ogSheet) { swallow++; history.go(-back) }
    }
  }, [sheets.length])

  useEffect(() => {
    const onPop = () => {
      if (swallow > 0) { swallow--; return }
      const st = useUI.getState()
      const top = st.sheets[st.sheets.length - 1]
      if (!top) return                  // not ours — the router's business
      owned = Math.max(0, owned - 1)    // the entry we pushed for it is gone with the pop
      // A locked sheet is one that has to be answered (the finish summary): put the entry
      // back and leave it standing, rather than dismissing what a tap cannot dismiss either.
      if (top.locked) { owned++; history.pushState({ ogSheet: owned }, '', location.href); return }
      st.closeSheet(top.id)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // lock the page behind any open sheet (iOS-safe)
  useEffect(() => {
    if (!sheets.length) return
    const y = window.scrollY || 0
    const b = document.body.style
    b.position = 'fixed'; b.top = -y + 'px'; b.left = '0'; b.right = '0'; b.width = '100%'
    return () => {
      b.position = b.top = b.left = b.right = b.width = ''
      window.scrollTo(0, y)
    }
  }, [sheets.length > 0])

  if (!sheets.length) return null
  return (
    <div id="modal-root" className="open">
      {sheets.map(s => <Sheet key={s.id} sheet={s} />)}
    </div>
  )
}
