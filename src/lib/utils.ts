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

export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
