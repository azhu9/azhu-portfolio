import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { LuX } from "react-icons/lu";
import { lockScroll } from "../utils/scrollLock";

interface ModalProps {
  label: string;
  onClose: () => void;
  children: React.ReactNode;
}

// Centered overlay panel: Escape or the backdrop closes it, the page behind
// can't scroll, and focus returns to whatever opened it.
const Modal: React.FC<ModalProps> = ({ label, onClose, children }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    // Children may have focused something of their own (e.g. a text input).
    if (!panelRef.current?.contains(document.activeElement)) closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const unlockScroll = lockScroll();
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
      if (document.activeElement === document.body) previous?.focus();
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8" role="dialog" aria-modal="true" aria-label={label}>
      <div className="modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={panelRef}
        className="modal-panel tile relative flex !h-auto max-h-full w-full max-w-3xl flex-col !overflow-y-auto !bg-[hsl(var(--bg)/0.92)] shadow-2xl"
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid size-9 place-content-center rounded-full bg-black/40 text-lg text-white backdrop-blur transition-colors hover:bg-black/60"
        >
          <LuX />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
