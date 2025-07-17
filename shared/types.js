// Shared types and constants for RAG Artifact System

const ARTIFACT_TYPES = {
  HTML: 'text/html',
  REACT: 'application/vnd.ant.react',
  CODE: 'application/vnd.ant.code'
};

const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'c',
  'html',
  'css',
  'json',
  'xml',
  'yaml',
  'markdown',
  'sql',
  'bash',
  'shell'
];

const MESSAGE_TYPES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  ERROR: 'error'
};

const ARTIFACT_STATUS = {
  CREATING: 'creating',
  READY: 'ready',
  ERROR: 'error',
  UPDATING: 'updating'
};

// Utility functions
const generateArtifactId = (type) => {
  const prefix = type.split('/').pop().split('.').pop();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}_${timestamp}_${random}`;
};

const validateArtifactType = (type) => {
  return Object.values(ARTIFACT_TYPES).includes(type);
};

const validateLanguage = (language) => {
  return SUPPORTED_LANGUAGES.includes(language.toLowerCase());
};

// Message validation
const validateMessage = (message) => {
  if (!message || typeof message !== 'string') {
    throw new Error('Message must be a non-empty string');
  }
  
  if (message.length > 10000) {
    throw new Error('Message too long (max 10000 characters)');
  }
  
  return true;
};

// Artifact validation
const validateArtifact = (artifact) => {
  const required = ['id', 'type', 'code'];
  const missing = required.filter(field => !artifact[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  if (!validateArtifactType(artifact.type)) {
    throw new Error(`Invalid artifact type: ${artifact.type}`);
  }
  
  if (artifact.language && !validateLanguage(artifact.language)) {
    console.warn(`Unknown language: ${artifact.language}`);
  }
  
  return true;
};

// Error handling
const createErrorResponse = (message, code = 'UNKNOWN_ERROR') => {
  return {
    success: false,
    error: {
      message,
      code,
      timestamp: new Date().toISOString()
    }
  };
};

const createSuccessResponse = (data) => {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString()
  };
};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ARTIFACT_TYPES,
    SUPPORTED_LANGUAGES,
    MESSAGE_TYPES,
    ARTIFACT_STATUS,
    generateArtifactId,
    validateArtifactType,
    validateLanguage,
    validateMessage,
    validateArtifact,
    createErrorResponse,
    createSuccessResponse
  };
}

// Export for browser
if (typeof window !== 'undefined') {
  window.RAGTypes = {
    ARTIFACT_TYPES,
    SUPPORTED_LANGUAGES,
    MESSAGE_TYPES,
    ARTIFACT_STATUS,
    generateArtifactId,
    validateArtifactType,
    validateLanguage,
    validateMessage,
    validateArtifact,
    createErrorResponse,
    createSuccessResponse
  };
}
