import type { NextConfig } from "next";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async headers() {
    return [
      {
        source: "/widget/:token*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Framing from any origin is controlled by the `frame-ancestors *`
          // CSP directive below. (X-Frame-Options has no "allow all" value.)
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // 'unsafe-inline' + 'unsafe-eval' required for Next.js Turbopack dev HMR
              // React drops eval() in production automatically
              isDev
                ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
                : "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              // Allow https: avatars in prod, also http: in dev
              isDev ? "img-src https: http: data: blob:" : "img-src https: data: blob:",
              "frame-ancestors *",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
