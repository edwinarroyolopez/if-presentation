"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function PresentationDialog({ children, describedBy, id, labelledBy, onClose, open }: { children: React.ReactNode; describedBy?: string; id: string; labelledBy: string; onClose: () => void; open: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (!dialog.open) dialog.showModal();
      document.body.classList.add("dialog-scroll-lock");
      requestAnimationFrame(() => closeRef.current?.focus());
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };
    const onCloseEvent = () => {
      document.body.classList.remove("dialog-scroll-lock");
      openerRef.current?.focus();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !dialog.open) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')).filter((node) => !node.hasAttribute("disabled") && node.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("close", onCloseEvent);
    dialog.addEventListener("keydown", onKeyDown);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onCloseEvent);
      dialog.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("dialog-scroll-lock");
    };
  }, [onClose]);

  return <dialog aria-describedby={describedBy} aria-labelledby={labelledBy} aria-modal="true" className="presentation-dialog" id={id} ref={dialogRef}>
    <div className="presentation-dialog-shell">
      <button aria-label="Cerrar" className="presentation-dialog-close" onClick={onClose} ref={closeRef} type="button"><X aria-hidden="true" size={18} /></button>
      {children}
    </div>
  </dialog>;
}

export function PresentationDialogHeader({ eyebrow, id, title, description }: { eyebrow: string; id: string; title: string; description?: string }) {
  return <header className="presentation-dialog-head"><div><span>{eyebrow}</span><h2 id={id}>{title}</h2>{description ? <p>{description}</p> : null}</div></header>;
}

export function PresentationDialogBody({ children }: { children: React.ReactNode }) {
  return <div className="presentation-dialog-body">{children}</div>;
}

export function PresentationDialogFooter({ children }: { children: React.ReactNode }) {
  return <footer className="presentation-dialog-foot">{children}</footer>;
}
