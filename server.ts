import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// The Angular build output is configured to go directly to 'dist'
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

console.log(`[DEBUG] Resolved distPath: ${distPath}`);
if (fs.existsSync(distPath)) {
    console.log(`[DEBUG] Contents of distPath:`, fs.readdirSync(distPath));
} else {
    console.error(`[CRITICAL] distPath does not exist: ${distPath}`);
}

if (!fs.existsSync(indexPath)) {
    console.error(`[CRITICAL] index.html not found at ${indexPath}`);
}

// Health Check
app.get('/health', (req, res) => res.status(200).send('OK'));

// Serve static files with correct MIME types
app.use(express.static(distPath, {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// Handle SPA routing: return index.html for all non-API routes
app.get('*', (req, res) => {
  if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
  } else {
      console.error(`[CRITICAL] index.html not found at ${indexPath}`);
      res.status(404).send('Application not built or index.html missing.');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
