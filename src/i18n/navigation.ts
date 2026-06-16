import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation primitives. Always use these instead of the
 * default `next/link` / `next/navigation` so locale prefixes stay correct.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
