"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function NavigationLoader() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const prevPath = useRef(pathname);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const active = useRef(false);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const start = () => {
    if (active.current) return;
    active.current = true;
    clear();
    setWidth(0);
    setOpacity(1);
    const t1 = setTimeout(() => setWidth(25), 50);
    const t2 = setTimeout(() => setWidth(52), 400);
    const t3 = setTimeout(() => setWidth(74), 1000);
    const t4 = setTimeout(() => setWidth(86), 2200);
    timers.current.push(t1, t2, t3, t4);
  };

  const finish = () => {
    active.current = false;
    clear();
    setWidth(100);
    const t = setTimeout(() => {
      setOpacity(0);
      const t2 = setTimeout(() => setWidth(0), 300);
      timers.current.push(t2);
    }, 280);
    timers.current.push(t);
  };

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      finish();
    }
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("mailto") ||
        href.startsWith("tel") ||
        href.startsWith("#") ||
        href === pathname ||
        a.target === "_blank"
      )
        return;
      start();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 right-0 z-[9999] h-[3px]"
      style={{ opacity, transition: "opacity 0.3s ease" }}
    >
      <div
        style={{
          height: "100%",
          width: `${width}%`,
          background: "linear-gradient(90deg, #f97316, #ef4444)",
          boxShadow: "0 0 12px #f9731680",
          transition:
            width === 100 ? "width 0.25s ease-out" : "width 0.5s ease",
          borderRadius: "0 2px 2px 0",
        }}
      />
    </div>
  );
}
