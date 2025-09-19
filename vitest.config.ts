import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      reporter: ['text', 'html', 'lcov'],
      lines: 80,
      functions: 80,
      branches: 70,
      statements: 80,
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
      ],
    },
  },
});