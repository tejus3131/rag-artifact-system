# RAG Artifact System

A complete RAG (Retrieval-Augmented Generation) application that can generate, execute, and display code artifacts (HTML, React, JavaScript) similar to Claude's artifact system.

## Features

- 🤖 **AI Chat Interface** - Interactive chat with artifact generation capabilities
- 🎨 **Multiple Artifact Types** - Support for HTML, React components, and code display
- 🔧 **Dual-Service Architecture** - Separate chat and artifact services for security
- ⚛️ **React Components** - Generate and execute React components with state management
- 🌐 **HTML Artifacts** - Create interactive HTML pages with JavaScript
- 💻 **Code Display** - Syntax-highlighted code examples
- 🐳 **Docker Support** - Easy deployment with Docker Compose
- 🔒 **Security** - Sandboxed execution environment

## Architecture

```
┌─────────────────────┐    HTTP/WebSocket    ┌─────────────────────┐
│   Main Chat App     │ ←──────────────────→ │  Artifact Service   │
│                     │                      │                     │
│ - Chat Interface    │                      │ - Code Execution    │
│ - Message History   │                      │ - Sandboxing        │
│ - Artifact Display  │                      │ - File Generation   │
│ - User Management   │                      │ - Security          │
└─────────────────────┘                      └─────────────────────┘
```

## Quick Start

### Development Mode

1. **Start Artifact Service:**
   ```bash
   cd artifact-service
   npm install
   npm run dev
   ```

2. **Start Chat App:**
   ```bash
   cd chat-app
   npm install
   npm run dev
   ```

3. **Access the Application:**
   - Chat Interface: http://localhost:3000
   - Artifact Service: http://localhost:3001

### Docker Mode

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down
```

## Usage Examples

### 1. Create HTML Artifacts
- **Input:** "Create HTML page"
- **Result:** Interactive HTML page with styling and JavaScript

### 2. Generate React Components
- **Input:** "Make a React component" or "Create a counter"
- **Result:** Functional React component with state management

### 3. Build Calculator
- **Input:** "Build a calculator"
- **Result:** Fully functional calculator with React

### 4. Display Code
- **Input:** "Show me some code"
- **Result:** Syntax-highlighted code examples

## Project Structure

```
rag-artifact-system/
├── chat-app/                 # Main chat application
│   ├── public/              # Static files
│   │   ├── index.html       # Main UI
│   │   └── style.css        # Custom styles
│   ├── src/                 # Server code
│   │   └── server.js        # Express server with Socket.IO
│   ├── Dockerfile           # Chat app Docker config
│   └── package.json         # Dependencies
├── artifact-service/        # Artifact generation service
│   ├── src/                 # Service code
│   │   ├── server.js        # Artifact API server
│   │   └── artifact-renderer.js # Rendering logic
│   ├── artifacts/           # Generated artifacts
│   ├── Dockerfile           # Service Docker config
│   └── package.json         # Dependencies
├── shared/                  # Shared utilities
│   └── types.js            # Type definitions
├── docker-compose.yml       # Docker orchestration
└── README.md               # This file
```

## API Endpoints

### Chat App (Port 3000)
- `POST /api/chat` - Send chat message and get response with artifacts
- `GET /` - Serve main chat interface

### Artifact Service (Port 3001)
- `POST /api/artifacts/create` - Create new artifact
- `PUT /api/artifacts/:id` - Update existing artifact
- `GET /api/artifacts` - List all artifacts
- `GET /artifacts/:id.html` - Serve artifact file
- `GET /health` - Health check

## Environment Variables

### Chat App
- `PORT` - Server port (default: 3000)
- `ARTIFACT_SERVICE_URL` - Artifact service URL (default: http://localhost:3001)

### Artifact Service
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## Security Features

- **Sandboxed Execution** - VM2 for safe code execution
- **Input Validation** - Comprehensive input sanitization
- **CORS Protection** - Cross-origin request handling
- **Error Handling** - Graceful error management
- **Resource Limits** - Memory and execution time limits

## Development

### Adding New Artifact Types

1. **Add type to shared/types.js:**
   ```javascript
   const ARTIFACT_TYPES = {
     HTML: 'text/html',
     REACT: 'application/vnd.ant.react',
     CODE: 'application/vnd.ant.code',
     NEW_TYPE: 'application/vnd.ant.newtype' // Add here
   };
   ```

2. **Implement renderer in artifact-service/src/artifact-renderer.js:**
   ```javascript
   static async renderNewType(id, code, artifactsDir) {
     // Implementation here
   }
   ```

3. **Update switch statement in render method:**
   ```javascript
   case 'application/vnd.ant.newtype':
     return await this.renderNewType(id, code, artifactsDir);
   ```

### Extending LLM Integration

Replace the mock `processLLMMessage` function in `chat-app/src/server.js` with actual LLM API calls:

```javascript
async function processLLMMessage(message) {
  // Replace with actual LLM API call
  const response = await llmAPI.chat({
    message,
    systemPrompt: "You are an AI that generates artifacts..."
  });
  
  return {
    text: response.text,
    artifacts: response.artifacts || []
  };
}
```

## Troubleshooting

### Common Issues

1. **Port Already in Use:**
   ```bash
   # Kill processes on ports 3000/3001
   npx kill-port 3000 3001
   ```

2. **Docker Build Issues:**
   ```bash
   # Clean up Docker
   docker-compose down -v
   docker system prune -f
   docker-compose up --build
   ```

3. **Artifact Not Loading:**
   - Check artifact service is running on port 3001
   - Verify CORS settings
   - Check browser console for errors

4. **React Components Not Rendering:**
   - Ensure component is exported correctly
   - Check browser console for transpilation errors
   - Verify React CDN links are accessible

### Logs

```bash
# View logs in Docker
docker-compose logs -f

# View specific service logs
docker-compose logs -f chat-app
docker-compose logs -f artifact-service
```

## Production Deployment

### Security Checklist

- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Implement authentication
- [ ] Set up monitoring
- [ ] Configure logging
- [ ] Add input sanitization
- [ ] Set resource limits
- [ ] Enable security headers

### Performance Optimization

- [ ] Add Redis for caching
- [ ] Implement CDN for static assets
- [ ] Add load balancing
- [ ] Optimize artifact rendering
- [ ] Add database for persistence
- [ ] Monitor resource usage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the troubleshooting section
- Review the logs
- Open an issue on GitHub
