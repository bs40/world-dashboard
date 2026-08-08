import { cn } from "@/lib/utils";

interface EditorialImageProps {
  src: string;
  alt: string;
  className?: string;
  overlay?: boolean;
}

/**
 * Editorial imagery wrapper. All demo images are local procedural SVGs in
 * /public/images; a cool-toned overlay harmonises them with the interface.
 * Plain <img> is intentional: sources are static local SVGs that Next's
 * optimiser would pass through unchanged.
 */
export function EditorialImage({ src, alt, className, overlay = true }: EditorialImageProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      {overlay && (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent mix-blend-multiply"
        />
      )}
    </div>
  );
}
