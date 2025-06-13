import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: './',
    publicDir: 'public',
    build: {
        outDir: "./dist",
        emptyOutDir: true,
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
                    if (/\.woff2?$/.test(name ?? '')) {
                        return '[name][extname]';
                    }
                    if (/\.eot$/.test(name ?? '')) {
                        return '[name][extname]';
                    }

                    // default value
                    return '[name][extname]';
                }
            },
            input: {
                main: path.resolve('', 'index.html'),
                blog: path.resolve('', 'blog.html'),
                article: path.resolve('', 'article.html')
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