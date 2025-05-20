import { defineConfig } from 'vite'
import path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        task1: path.resolve(__dirname, 'task1.html'),
        task2: path.resolve(__dirname, 'task2.html'),
        task3: path.resolve(__dirname, 'task3.html'),
        task4: path.resolve(__dirname, 'task4.html'),
        testing: path.resolve(__dirname, 'testing.html'),
      }
    }
  },
  define: {
    'process.env': {}
  }
})