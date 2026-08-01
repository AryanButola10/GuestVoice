import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

/**
 * SPA fallback plugin for Vite 8.
 * Vite 8 changed its internal routing pipeline, so the standard
 * appType: 'spa' fallback does not catch external redirects like OAuth
 * callbacks. This plugin intercepts those requests and directly serves
 * the transformed index.html so React Router can handle the route.
 */
const spaFallback = {
  name: 'spa-fallback',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = (req.url || '/').split('?')[0];
      const hasExtension = /\.[a-zA-Z0-9]+$/.test(url);
      const isViteInternal = url.startsWith('/@') || url.startsWith('/__');

      if (!hasExtension && !isViteInternal && url !== '/') {
        try {
          const indexPath = path.resolve(process.cwd(), 'index.html');
          let html = fs.readFileSync(indexPath, 'utf-8');
          // Let Vite process index.html (inject HMR scripts etc.)
          html = await server.transformIndexHtml(req.url || '/', html);
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.statusCode = 200;
          res.end(html);
        } catch (e) {
          next(e);
        }
        return;
      }
      next();
    });
  },
};

export default defineConfig({
  plugins: [react(), spaFallback],
})
