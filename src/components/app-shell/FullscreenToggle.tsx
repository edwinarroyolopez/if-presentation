"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function FullscreenToggle() {
  const [supported, setSupported] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setSupported(Boolean(document.documentElement.requestFullscreen)));
    const onChange = () => setActive(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("fullscreenchange", onChange);
    };
  }, []);

  if (!supported) return null;

  return <Button aria-label={active ? "Salir de pantalla completa" : "Entrar en pantalla completa"} onClick={() => { void (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => undefined); }} variant="ghost"><Icon name="fullscreen" /><span className="fullscreen-label">{active ? "Salir" : "Pantalla"}</span></Button>;
}
