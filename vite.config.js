import { defineConfig } from 'vite';
import path from 'path';

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
            output: {
                entryFileNames: "assets/js/[name].js",
                chunkFileNames: "assets/js/[name].js",
                assetFileNames: ({name}) => {
                    if (/\.(gif|jpe?g|png|svg|webp)$/.test(name ?? '')) {
                        return 'assets/images/[name][extname]';
                    }
                    if (/\.css$/.test(name ?? '')) {
                        return 'assets/css/[name][extname]';
                    }
                    if (/\.mp4$/.test(name ?? '')) {
                        return 'videos/[name][extname]';
                    }
                    if (/\.ttf$/.test(name ?? '')) {
                        return 'assets/fonts/[name][extname]';
                    }
                    if (/\.ttf$/.test(name ?? '')) {
                        return 'fonts/[name][extname]';
                    }

                    // default value
                    // ref: https://rollupjs.org/guide/en/#outputassetfilenames
                    return '[name][extname]';
                }
            },
            input: {
                main: path.resolve('', 'index.html'),
                blog: path.resolve('', 'blog.html'),
                article: path.resolve('', 'article.html'),
                product: path.resolve('', 'product.html'),
                archive: path.resolve('', 'archive.html'),
                cart: path.resolve('', 'cart.html'),
                checkout: path.resolve('', 'checkout.html'),
                orderConfirmation: path.resolve('', 'order-confirmation.html')
            },
        },
        assetsDir: 'assets',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
        },
    },
    server: {
        port: 3000,
        open: true,
    },
});