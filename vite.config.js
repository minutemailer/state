import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            formats: ['es'],
            entry: resolve(__dirname, 'src/index.js'),
            name: 'MinutemailerState',
            fileName: 'index',
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
        },
    },
});
