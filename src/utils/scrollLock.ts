// Ref-counted page scroll lock, so overlapping overlays (e.g. the command menu
// handing off to a project modal) don't unlock scrolling under each other.
let locks = 0;

export function lockScroll() {
  if (locks++ === 0) document.body.style.overflow = "hidden";
  return () => {
    if (--locks === 0) document.body.style.overflow = "";
  };
}
