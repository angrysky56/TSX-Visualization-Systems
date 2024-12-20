import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@common': path.resolve(__dirname, './src/components/common'),
      '@hooks': path.resolve(__dirname, './src/components/hooks'),
      '@layouts': path.resolve(__dirname, './src/components/layouts'),
      '@providers': path.resolve(__dirname, './src/components/providers'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@constants': path.resolve(__dirname, './src/lib/constants'),
      '@utils': path.resolve(__dirname, './src/lib/utils'),
      '@types': path.resolve(__dirname, './src/lib/types'),
      '@services': path.resolve(__dirname, './src/lib/services'),
      '@contexts': path.resolve(__dirname, './src/lib/contexts')
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'quantum-core': ['three', '@react-three/fiber'],
          'milvus': ['@zilliz/milvus2-sdk-node']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
});