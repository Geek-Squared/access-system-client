import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.fountech.access",
  appName: "fountech-access",
  webDir: "dist",
  server: {
    androidScheme: "https",
    allowNavigation: ["different-armadillo-940.convex.site"],
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
