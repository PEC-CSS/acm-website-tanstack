const allImages = import.meta.glob("/src/lib/assets/images/**/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export function resolveStaticImg(path: string): string {
  const fullPath = path.startsWith("$assets/images/")
    ? path.replace("$assets/images/", "src/lib/assets/images/")
    : path.startsWith("/src")
      ? path
      : `/src/lib/assets/images/${path}`;

  const resolved = allImages[fullPath];

  if (!resolved || typeof resolved !== "string") {
    throw new Error(`Image asset not found: ${path}`);
  }

  return resolved;
}
