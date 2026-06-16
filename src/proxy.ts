import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Run on every path EXCEPT:
  //  - /api, /og and /apple-icon route handlers (no extension → must exclude)
  //  - Next internals (_next, _vercel)
  //  - any file with an extension (icon.svg, manifest, sitemap.xml, robots.txt…)
  matcher: "/((?!api|og|apple-icon|_next|_vercel|.*\\..*).*)",
};
