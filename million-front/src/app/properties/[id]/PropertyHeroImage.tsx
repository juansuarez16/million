"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { shimmerDataURL } from "@/shared/ui/imagePlaceholder";

type Props = {
  src?: string;   // puede venir vacío
  alt: string;
};

export default function PropertyHeroImage({ src, alt }: Props) {
  const fallback = "/fallback-property.svg";

  // siempre un string válido para <Image src=...>
  const [current, setCurrent] = useState<string>(src && src.trim() !== "" ? src : fallback);

  // si cambia el prop src, actualiza el estado (con fallback si viene vacío)
  useEffect(() => {
    setCurrent(src && src.trim() !== "" ? src : fallback);
  }, [src]);

  return (
    <Image
      src={current}
      alt={alt}
      width={1280}
      height={720}
      className="h-auto w-full object-cover"
      priority
      placeholder="blur"
      blurDataURL={shimmerDataURL(32, 18)}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}
