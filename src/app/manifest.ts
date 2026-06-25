import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Turf Score",
    short_name: "TurfScore",
    description:
      "Real-time cricket scoring for turf matches. Track live scores, ball-by-ball updates, and match results.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f0f0f3",
    theme_color: "#EF4444",
    icons: [
      {
        src: "/images/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
