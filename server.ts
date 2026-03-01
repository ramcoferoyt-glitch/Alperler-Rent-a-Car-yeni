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

// Determine the correct dist path
// Angular build output can vary. We check for 'dist/browser' or just 'dist'.
let distPath = path.join(__dirname, 'dist');

// Check if 'dist/browser' exists (common Angular structure)
if (fs.existsSync(path.join(distPath, 'browser'))) {
    distPath = path.join(distPath, 'browser');
} else {
    // Check if 'dist/project-name/browser' exists (another common structure)
    if (fs.existsSync(distPath)) {
        const subdirs = fs.readdirSync(distPath).filter(file => fs.statSync(path.join(distPath, file)).isDirectory());
        // If there's only one directory and it's not 'browser', check inside it
        if (subdirs.length === 1 && subdirs[0] !== 'browser') {
            const potentialPath = path.join(distPath, subdirs[0], 'browser');
            if (fs.existsSync(potentialPath)) {
                distPath = potentialPath;
            } else {
                 // Maybe just dist/project-name
                 const projectPath = path.join(distPath, subdirs[0]);
                 if (fs.existsSync(path.join(projectPath, 'index.html'))) {
                    distPath = projectPath;
                 }
            }
        } else if (subdirs.length > 0) {
            // If multiple dirs, try to find one with index.html or browser folder
             for (const subdir of subdirs) {
                const p = path.join(distPath, subdir, 'browser');
                if (fs.existsSync(p)) {
                    distPath = p;
                    break;
                }
                const p2 = path.join(distPath, subdir);
                if (fs.existsSync(path.join(p2, 'index.html'))) {
                    distPath = p2;
                    break;
                }
             }
        }
    }
}

console.log(`Serving static files from: ${distPath}`);

// Verify index.html exists
const indexPath = path.join(distPath, 'index.html');
if (!fs.existsSync(indexPath)) {
    console.error(`CRITICAL: index.html not found at ${indexPath}`);
    console.log('Contents of distPath:', fs.readdirSync(distPath));
}

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
      console.error(`index.html not found at ${indexPath}`);
      res.status(404).send('Application not built or index.html missing.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
