const fs = require('fs-extra');
const path = require('path');
const babel = require('@babel/core');
const { NodeVM } = require('vm2');

class ArtifactRenderer {
  static async render({ id, type, code, language }) {
    const artifactsDir = path.join(__dirname, '../artifacts');
    await fs.ensureDir(artifactsDir);
    
    switch (type) {
      case 'text/html':
        return await this.renderHTML(id, code, artifactsDir);
      case 'application/vnd.ant.react':
        return await this.renderReact(id, code, artifactsDir);
      case 'application/vnd.ant.code':
        return await this.renderCode(id, code, language, artifactsDir);
      default:
        throw new Error(`Unsupported artifact type: ${type}`);
    }
  }

  static async renderHTML(id, code, artifactsDir) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Artifact ${id}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { 
            margin: 0; 
            padding: 20px; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        }
        * {
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    ${code}
</body>
</html>`;
    
    const filePath = path.join(artifactsDir, `${id}.html`);
    await fs.writeFile(filePath, html);
    return filePath;
  }

  static async renderReact(id, code, artifactsDir) {
    try {
      // Transpile JSX to regular JavaScript
      const transpiledCode = babel.transform(code, {
        presets: ['@babel/preset-react']
      }).code;

      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Artifact ${id}</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { 
            margin: 0; 
            padding: 20px; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        }
        * {
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    <script>
        try {
            ${transpiledCode}
            
            // Try to find the component
            let component;
            if (typeof module !== 'undefined' && module.exports) {
                component = module.exports;
            } else if (typeof App !== 'undefined') {
                component = App;
            } else {
                // Look for any React component in the global scope
                const possibleComponents = Object.keys(window).filter(key => 
                    typeof window[key] === 'function' && 
                    key[0] === key[0].toUpperCase()
                );
                component = possibleComponents.length > 0 ? window[possibleComponents[0]] : null;
            }
            
            if (component) {
                ReactDOM.render(React.createElement(component), document.getElementById('root'));
            } else {
                document.getElementById('root').innerHTML = '<div style="color: orange; padding: 20px;">⚠️ No React component found. Make sure to export your component or name it "App".</div>';
            }
        } catch (error) {
            console.error('Rendering error:', error);
            document.getElementById('root').innerHTML = '<div style="color: red; padding: 20px; background: #fee; border: 1px solid #fcc; border-radius: 4px;"><strong>Error rendering component:</strong><br>' + error.message + '</div>';
        }
    </script>
</body>
</html>`;
      
      const filePath = path.join(artifactsDir, `${id}.html`);
      await fs.writeFile(filePath, html);
      return filePath;
    } catch (error) {
      throw new Error(`React compilation failed: ${error.message}`);
    }
  }

  static async renderCode(id, code, language, artifactsDir) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Artifact ${id}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-core.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/plugins/autoloader/prism-autoloader.min.js"></script>
    <style>
        body { 
            margin: 0; 
            padding: 20px; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        }
        .code-container { 
            background: #f8f9fa; 
            border-radius: 8px; 
            overflow: hidden; 
            border: 1px solid #e9ecef;
        }
        .code-header { 
            background: #e9ecef; 
            padding: 10px 15px; 
            font-weight: 600; 
            color: #495057; 
            font-size: 14px;
        }
        pre { 
            margin: 0; 
            padding: 15px; 
            overflow-x: auto; 
        }
        code {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }
    </style>
</head>
<body>
    <div class="code-container">
        <div class="code-header">${language || 'Code'}</div>
        <pre><code class="language-${language || 'javascript'}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
    </div>
</body>
</html>`;
    
    const filePath = path.join(artifactsDir, `${id}.html`);
    await fs.writeFile(filePath, html);
    return filePath;
  }
}

module.exports = ArtifactRenderer;
