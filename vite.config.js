import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: './',
    publicDir: 'public',
    build: {
        outDir: "./dist",
        emptyOutDir: true,
        define: {
            'require': 'window.require',
        },
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                product: resolve(__dirname, 'product.html'),
                blog: resolve(__dirname, 'blog.html'),
                article: resolve(__dirname, 'article.html'),
                cart: resolve(__dirname, 'cart.html'),
                checkout: resolve(__dirname, 'checkout.html'),
                orderConfirmation: resolve(__dirname, 'order-confirmation.html'),
                archive: resolve(__dirname, 'archive.html'),
                category: resolve(__dirname, 'category.html')
            },
            output: {
                entryFileNames: 'assets/bundled/js/[name].bundle.js',
                chunkFileNames: 'assets/bundled/js/[name].[hash].js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name.endsWith('.css')) {
                        return 'assets/bundled/css/[name].bundle.css';
                    }
                    return 'assets/bundled/[ext]/[name].[hash].[ext]';
                }
                }
            },
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        },
        cssMinify: true,
        sourcemap: true,
        assetsDir: 'assets',
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './'),
        },
    },
    server: {
        port: 3000,
        open: true,
    },
});