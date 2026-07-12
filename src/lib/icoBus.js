// Tiny event bus between UI (Header / screens) and the ico WebGL background.
// The original wired DOM click listeners onto <a> tags by index; this keeps
// the same visual transitions with explicit events instead.

const EVENT = 'ico-transition'

// mode: 'zoom'      → camera dives into the mesh, blur 17 (WORK/SHOP/RECORD)
//       'zoomHide'  → same dive but meshes hidden, blur 37 (MEMORY/ABOUT)
//       'reset'     → back to the initial framing (logo click / main screen)
//       'hide'      → container fades out (earth screen enter)
//       'show'      → container fades back in (earth screen leave)
export function icoTransition(mode) {
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { mode } }))
}

export function onIcoTransition(handler) {
    const listener = (e) => handler(e.detail.mode)
    window.addEventListener(EVENT, listener)
    return () => window.removeEventListener(EVENT, listener)
}
