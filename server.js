// Local development server. Cloudflare Pages deploys public/ directly.
try { require('dotenv').config(); } catch (_) {}

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const publicDir = path.join(__dirname, 'public');

app.use(cors());
app.use(express.json());
app.use(express.static(publicDir));

const page = file => (req, res) => res.sendFile(path.join(publicDir, file));

app.get('/', page('index.html'));
app.get('/builder', page('builder.html'));
app.get('/chart', page('chart.html'));
app.get('/prescan', page('prescan.html'));
app.get('/about', page('about.html'));
app.get('/policy', page('policy.html'));
app.get('/story', page('story.html'));
app.get('/admin-step', page('admin-step.html'));
app.get('/hystep-preview', page('hystep-preview.html'));

// Compatibility routes. Authentication remains enforced by admin-step.html.
app.get(['/admin', '/admin.html'], (req, res) => res.redirect(302, '/admin-step'));
app.get(['/preview', '/preview.html'], (req, res) => res.redirect(302, '/hystep-preview'));

app.listen(PORT, () => {
  console.log(`HySTEP local server: http://localhost:${PORT}`);
});
