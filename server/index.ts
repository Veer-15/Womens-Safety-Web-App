import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import { apiApp } from './app.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const distPath = path.resolve(__dirname, '../dist');

// Serve static frontend assets in production build
apiApp.use(express.static(distPath));

// Fallback for client-side routing in production
apiApp.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      next();
    }
  });
});

apiApp.listen(PORT, '0.0.0.0', () => {
  console.log(`Sakhi Women Safety Server running on http://0.0.0.0:${PORT}`);
});
