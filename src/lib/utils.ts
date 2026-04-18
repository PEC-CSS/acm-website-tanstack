import type { ClassValue } from "clsx";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Capitalizes the first character of a string.
 * Returns the original value if the string is empty.
 */
export function capitalize(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a string into a URL-friendly slug.
 * Lowercases, normalizes unicode (café → cafe), removes special characters,
 * and collapses spaces, underscores, and hyphens into a single hyphen.
 *
 * @example
 * slugify("Hello World!")  // "hello-world"
 * slugify("café latte")    // "cafe-latte"
 * slugify("hello - world") // "hello-world"
 */
export function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface JWTPayload {
  sub: string;
  exp: number;
  iat: number;
}

export function decodeJWTPayload(token: string): JWTPayload | null {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

interface IImageMetadata {
  format: string;
  width: number;
  height: number;
  space: string;
  channels: number;
  depth: string;
  isProgressive: boolean;
  isPalette: boolean;
  hasProfile: boolean;
  hasAlpha: boolean;
  autoOrient: {
    width: number;
    height: number;
  };
  src: string;
}

const allImages = import.meta.glob("/src/lib/assets/images/**/*", {
  eager: true,
  import: "default",
  query: {
    format: "webp",
    as: "metadata",
  },
}) as Record<string, IImageMetadata>;

/**
 * Resolves a static image asset path and returns its metadata.
 *
 * Accepts three path formats:
 * - `$assets/images/foo.jpg` — alias prefix
 * - `/src/lib/assets/images/foo.jpg` — absolute src path
 * - `foo.jpg` — bare filename, resolved relative to the images directory
 *
 * @throws {Error} If the image asset cannot be found in the glob map
 */
export function resolveStaticImg(path: string) {
  const fullPath = path.startsWith("$assets/images/")
    ? path.replace("$assets/images/", "src/lib/assets/images/")
    : path.startsWith("/src")
      ? path
      : `/src/lib/assets/images/${path}`;

  const resolved = allImages[fullPath];

  if (!resolved) {
    throw new Error(`Image asset not found: ${path}`);
  }

  return {
    width: resolved.width,
    height: resolved.height,
    format: resolved.format,
    src: resolved.src,
  };
}

/**
 * Merges class names using `clsx` and resolves Tailwind CSS conflicts using `tailwind-merge`.
 *
 * @param inputs - Class values to merge. Accepts strings, objects, arrays, and falsy values.
 * @returns A single merged class name string with Tailwind conflicts resolved.
 *
 * @example
 * cn("p-4", "p-2")                        // "p-2" (conflict resolved)
 * cn("flex", { hidden: false, block: true }) // "flex block"
 * cn(undefined, null, "text-sm")           // "text-sm"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
