"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { PresentationDialog, PresentationDialogBody, PresentationDialogFooter, PresentationDialogHeader } from "./PresentationDialog";

export function InlineInfoDialog({ buttonLabel = "Ver detalle", children, eyebrow, id, title }: { buttonLabel?: string; children: React.ReactNode; eyebrow: string; id: string; title: string }) {
  const [open, setOpen] = useState(false);
  const titleId = `${id}-title`;
  return <>
    <button className="btn ghost" onClick={() => setOpen(true)} type="button"><FileText aria-hidden="true" size={16} />{buttonLabel}</button>
    <PresentationDialog id={id} labelledBy={titleId} onClose={() => setOpen(false)} open={open}>
      <PresentationDialogHeader eyebrow={eyebrow} id={titleId} title={title} />
      <PresentationDialogBody>{children}</PresentationDialogBody>
      <PresentationDialogFooter>Detalle bajo demanda · contenido preservado desde JSON.</PresentationDialogFooter>
    </PresentationDialog>
  </>;
}
