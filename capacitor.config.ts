import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'todo-list',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resizeOnFullScreen: false
    },
    EdgeToEdge: {
      backgroundColor: "#000000",
    },
    CapacitorHttp: {
      enabled: true
    }
  },
  server: {
    androidScheme: 'http',
    cleartext: true
  }
};

export default config;
