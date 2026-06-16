import { notFound } from "next/navigation";

/**
 * Catch-all under [locale]: any path that doesn't match a real page renders the
 * localized not-found (with full chrome + correct <html lang>), instead of the
 * bare global 404.
 */
export default function CatchAllPage() {
  notFound();
}
