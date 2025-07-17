const express = require('express');
const cors = require('cors');
const path = require('path');
const ArtifactRenderer = require('./artifact-renderer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/artifacts', express.static(path.join(__dirname, '../artifacts')));

// Create artifact endpoint
app.post('/api/artifacts/create', async (req, res) => {
  try {
    const { id, type, code, language } = req.body;
    
    // Validate required fields
    if (!id || !type || !code) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: id, type, and code are required'
      });
    }
    
    const result = await ArtifactRenderer.render({
      id,
      type,
      code,
      language
    });
    
    res.json({
      success: true,
      id,
      url: `/artifacts/${id}.html`,
      previewUrl: `http://localhost:${PORT}/artifacts/${id}.html`
    });
  } catch (error) {
    console.error('Error creating artifact:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Update artifact endpoint
app.put('/api/artifacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, code, language } = req.body;
    
    // Validate required fields
    if (!type || !code) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: type and code are required'
      });
    }
    
    const result = await ArtifactRenderer.render({
      id,
      type,
      code,
      language
    });
    
    res.json({
      success: true,
      id,
      url: `/artifacts/${id}.html`
    });
  } catch (error) {
    console.error('Error updating artifact:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// List artifacts
app.get('/api/artifacts', (req, res) => {
  const fs = require('fs-extra');
  const artifactsDir = path.join(__dirname, '../artifacts');
  
  try {
    const files = fs.readdirSync(artifactsDir);
    const artifacts = files.filter(file => file.endsWith('.html')).map(file => ({
      id: file.replace('.html', ''),
      url: `/artifacts/${file}`,
      createdAt: fs.statSync(path.join(artifactsDir, file)).mtime
    }));
    
    res.json({ success: true, artifacts });
  } catch (error) {
    res.json({ success: true, artifacts: [] });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Artifact service running on port ${PORT}`);
  console.log(`📁 Artifacts available at http://localhost:${PORT}/artifacts/`);
});

module.exports = app;
