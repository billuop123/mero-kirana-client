import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "आफ्नो Kirana",
    short_name: "आफ्नो Kirana",
    description: "Simple POS and inventory management for Nepali kirana shops",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#111827",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
