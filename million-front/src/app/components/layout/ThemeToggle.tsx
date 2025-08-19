"use client";
import { useEffect, useState } from "react";
import { Button } from "flowbite-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("theme");
      const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const dark = stored ? stored === "dark" : prefers;
      document.documentElement.classList.toggle("dark", dark);
      setIsDark(dark);
    } catch {}
  }, []);

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  };

  if (!mounted) return null;

  return (
    <Button color="gray" size="sm" onClick={toggle} aria-label="Toggle theme">
      {isDark ? "☀️" : "🌙"}
    </Button>
  );
}
