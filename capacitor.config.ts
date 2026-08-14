import type { CapacitorConfig } from '@capacitor/cli';

// Wrap the Flow web app into native iOS + Android apps.
//   npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
//   npx cap add ios
//   npx cap add android
//   npm run build && npx cap sync
// Then open the ios/ or android/ folder in Xcode / Android Studio to build & ship.
const config: CapacitorConfig = {
  appId: 'app.flow.social',
  appName: 'Flow',
  webDir: 'dist',
  server: {
    // Android cleartext needed to load from http origins in dev only.
    androidScheme: 'https',
  },
};

export default config;
