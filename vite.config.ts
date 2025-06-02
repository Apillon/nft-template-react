import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // https: {
    //   key: process.env.USERPROFILE + '\\.vite-plugin-mkcert\\cert.key',
    //   cert: process.env.USERPROFILE + '\\.vite-plugin-mkcert\\cert.crt',
    // },
  },
  plugins: [react(), mkcert()],
});
