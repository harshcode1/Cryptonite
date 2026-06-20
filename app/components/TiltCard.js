"use client";
import { useRef } from "react";

export default function TiltCard({ children, className = "", intensity = 10 }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (y - 0.5) * -intensity * 2;
    const ry = (x - 0.5) * intensity * 2;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
    el.style.boxShadow = `${ry * -1.5}px ${rx * 1.5}px 40px rgba(59,130,246,0.25), 0 20px 60px rgba(0,0,0,0.4)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
    el.style.boxShadow = "";
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: "transform 0.15s ease, box-shadow 0.15s ease", transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
