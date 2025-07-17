const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;
const ARTIFACT_SERVICE_URL = process.env.ARTIFACT_SERVICE_URL || 'http://localhost:3001';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Chat message handler
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    console.log(`💬 Processing message from ${userId}: ${message}`);
    
    // Simulate LLM processing
    const response = await processLLMMessage(message);
    
    // Check if response contains artifacts
    if (response.artifacts && response.artifacts.length > 0) {
      for (const artifact of response.artifacts) {
        await createArtifact(artifact);
      }
    }
    
    res.json({
      success: true,
      response: response.text,
      artifacts: response.artifacts || []
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Create artifact via artifact service
async function createArtifact(artifact) {
  try {
    console.log(`🔧 Creating artifact: ${artifact.id} (${artifact.type})`);
    const response = await axios.post(`${ARTIFACT_SERVICE_URL}/api/artifacts/create`, artifact);
    return response.data;
  } catch (error) {
    console.error('Error creating artifact:', error.message);
    throw error;
  }
}

// Mock LLM processing function
async function processLLMMessage(message) {
  // This would be replaced with actual LLM API call
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('create html') || lowerMessage.includes('make a webpage') || lowerMessage.includes('html page')) {
    return {
      text: "I'll create an HTML page for you with some interactive elements.",
      artifacts: [{
        id: `html_${Date.now()}`,
        type: 'text/html',
        code: `
<div class="max-w-4xl mx-auto p-8">
    <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg shadow-lg mb-8">
        <h1 class="text-4xl font-bold mb-4">🎉 Welcome to My Artifact!</h1>
        <p class="text-xl opacity-90">This is a sample HTML artifact created by the RAG system.</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md border">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Interactive Demo</h2>
            <p class="text-gray-600 mb-4">Click the button below to see some magic!</p>
            <button id="magicBtn" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200">
                ✨ Click Me!
            </button>
            <div id="magicResult" class="mt-4 p-4 bg-gray-100 rounded hidden">
                <p class="text-green-600 font-semibold">🎊 Magic happened! You clicked the button!</p>
            </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md border">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Dynamic Content</h2>
            <p class="text-gray-600 mb-4">Current time: <span id="currentTime" class="font-mono text-blue-600"></span></p>
            <div class="space-y-2">
                <div class="bg-gray-200 rounded-full h-2">
                    <div id="progressBar" class="bg-green-500 h-2 rounded-full transition-all duration-1000" style="width: 0%"></div>
                </div>
                <p class="text-sm text-gray-500">Loading progress...</p>
            </div>
        </div>
    </div>
    
    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <p class="text-yellow-800">💡 <strong>Tip:</strong> This artifact demonstrates HTML with interactive JavaScript, styled with Tailwind CSS!</p>
    </div>
</div>

<script>
    // Magic button functionality
    document.getElementById('magicBtn').addEventListener('click', function() {
        const result = document.getElementById('magicResult');
        result.classList.remove('hidden');
        result.style.animation = 'fadeIn 0.5s ease-in';
        this.textContent = '🎉 Magic Done!';
        this.classList.add('bg-green-500');
        this.classList.remove('bg-blue-500');
    });
    
    // Update time every second
    function updateTime() {
        const now = new Date();
        document.getElementById('currentTime').textContent = now.toLocaleTimeString();
    }
    setInterval(updateTime, 1000);
    updateTime();
    
    // Animate progress bar
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
        }
        document.getElementById('progressBar').style.width = progress + '%';
    }, 200);
    
    // Add CSS for fade in animation
    const style = document.createElement('style');
    style.textContent = \`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    \`;
    document.head.appendChild(style);
</script>`,
        language: 'html'
      }]
    };
  }
  
  if (lowerMessage.includes('react component') || lowerMessage.includes('create react') || lowerMessage.includes('counter')) {
    return {
      text: "I'll create an interactive React component for you with state management.",
      artifacts: [{
        id: `react_${Date.now()}`,
        type: 'application/vnd.ant.react',
        code: `
function App() {
  const [count, setCount] = React.useState(0);
  const [name, setName] = React.useState('');
  const [todos, setTodos] = React.useState([
    { id: 1, text: 'Try the counter', completed: false },
    { id: 2, text: 'Add your name', completed: false }
  ]);
  
  const addTodo = () => {
    if (name.trim()) {
      const newTodo = {
        id: Date.now(),
        text: \`\${name} added this todo\`,
        completed: false
      };
      setTodos([...todos, newTodo]);
      setName('');
    }
  };
  
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🚀 React Demo App</h1>
        <p className="text-gray-600">Interactive components with state management</p>
      </div>
      
      {/* Counter Section */}
      <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Counter Demo</h2>
        <div className="text-center">
          <p className="text-5xl font-bold text-blue-600 mb-4">{count}</p>
          <div className="space-x-3">
            <button 
              onClick={() => setCount(count - 1)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            >
              ➖ Decrease
            </button>
            <button 
              onClick={() => setCount(0)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            >
              🔄 Reset
            </button>
            <button 
              onClick={() => setCount(count + 1)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            >
              ➕ Increase
            </button>
          </div>
        </div>
      </div>
      
      {/* Todo Section */}
      <div className="mb-6 p-6 bg-green-50 rounded-lg border border-green-200">
        <h2 className="text-xl font-semibold text-green-800 mb-4">Todo List</h2>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <button
            onClick={addTodo}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            ➕ Add
          </button>
        </div>
        
        <ul className="space-y-2">
          {todos.map(todo => (
            <li 
              key={todo.id} 
              className="flex items-center gap-3 p-3 bg-white rounded border"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className={\`flex-1 \${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}\`}>
                {todo.text}
              </span>
              {todo.completed && <span className="text-green-500">✅</span>}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Stats */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">📊 Stats</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{count}</p>
            <p className="text-sm text-gray-600">Count</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{todos.filter(t => t.completed).length}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-600">{todos.length}</p>
            <p className="text-sm text-gray-600">Total Todos</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export for the renderer
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}`,
        language: 'javascript'
      }]
    };
  }
  
  if (lowerMessage.includes('calculator') || lowerMessage.includes('calc')) {
    return {
      text: "I'll create a functional calculator for you using React.",
      artifacts: [{
        id: `calc_${Date.now()}`,
        type: 'application/vnd.ant.react',
        code: `
function App() {
  const [display, setDisplay] = React.useState('0');
  const [previousValue, setPreviousValue] = React.useState(null);
  const [operation, setOperation] = React.useState(null);
  const [waitingForOperand, setWaitingForOperand] = React.useState(false);
  
  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };
  
  const inputOperation = (nextOperation) => {
    const inputValue = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);
      
      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }
    
    setWaitingForOperand(true);
    setOperation(nextOperation);
  };
  
  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };
  
  const performCalculation = () => {
    const inputValue = parseFloat(display);
    
    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };
  
  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };
  
  const Button = ({ onClick, className, children, ...props }) => (
    <button
      onClick={onClick}
      className={\`h-16 text-xl font-semibold rounded-lg transition-all duration-150 active:scale-95 \${className}\`}
      {...props}
    >
      {children}
    </button>
  );
  
  return (
    <div className="max-w-sm mx-auto bg-gray-900 p-6 rounded-2xl shadow-2xl">
      <div className="mb-4">
        <div className="bg-black text-white text-right text-4xl font-mono p-4 rounded-lg h-20 flex items-center justify-end overflow-hidden">
          {display}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <Button 
          onClick={clear} 
          className="col-span-2 bg-gray-500 hover:bg-gray-400 text-white"
        >
          Clear
        </Button>
        <Button 
          onClick={() => inputOperation('÷')} 
          className="bg-orange-500 hover:bg-orange-400 text-white"
        >
          ÷
        </Button>
        <Button 
          onClick={() => inputOperation('×')} 
          className="bg-orange-500 hover:bg-orange-400 text-white"
        >
          ×
        </Button>
        
        {/* Row 2 */}
        <Button 
          onClick={() => inputNumber(7)} 
          className="bg-gray-700 hover:bg-gray-600 text-white"
        >
          7
        </Button>
        <Button 
          onClick={() => inputNumber(8)} 
          className="bg-gray-700 hover:bg-gray-600 text-white"
        >
          8
        </Button>
        <Button 
          onClick={() => inputNumber(9)} 
          className="bg-gray-700 hover:bg-gray-600 text-white"
        >
          9
        </Button>
        <Button 
          onClick={() => inputOperation('-')} 
          className="bg-orange-500 hover:bg-orange-400 text-white"
        >
          -
        </Button>
        
        {/* Row 3 */}
        <Button 
          onClick={() => inputNumber(4)} 
          className="bg-gray-700 hover:bg-gray-600 text-white"
        >
          4
        </Button>
        <Button 
          onClick={() => inputNumber(5)} 
          className="bg-gray-700 hover:bg-gray-600 text-white"
        >
          5
        </Button>
        <Button 
          onClick={() => inputNumber(6)} 
          className="bg-gray-700 hover:bg-gray-600 text-white"
        >
          6
        </Button>
        <Button 
          onClick={() => inputOperation('+')} 
          className="bg-orange-500 hover:bg-orange-400 text-white"
        >
          +
        </Button>
        
        {/* Row 4 */}
        <Button 
          onClick={() => inputNumber(1)} 
          className="bg-gray-700 hover:bg-gray-600 text-white"
        >
          1
        </Button>
        <Button 
          onClick={() => inputNumber(2)} 
          className="bg-gray-700 hover:bg-gray-600 text-white"
        >
          2
        </Button>
        <Button 
          onClick={() => inputNumber(3)} 
          className="bg-gray-700 hover:bg-gray-600 text-white"
        >
          3
        </Button>
        <Button 
          onClick={performCalculation} 
          className="row-span-2 bg-orange-500 hover:bg-orange-400 text-white"
        >
          =
        </Button>
        
        {/* Row 5 */}
        <Button 
          onClick={() => inputNumber(0)} 
          className="col-span-2 bg-gray-700 hover:bg-gray-600 text-white"
        >
          0
        </Button>
        <Button 
          onClick={() => {
            if (display.indexOf('.') === -1) {
              setDisplay(display + '.');
            }
          }} 
          className="bg-gray-700 hover:bg-gray-600 text-white"
        >
          .
        </Button>
      </div>
      
      <div className="mt-4 text-center text-gray-400 text-sm">
        🧮 Functional Calculator
      </div>
    </div>
  );
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}`,
        language: 'javascript'
      }]
    };
  }
  
  if (lowerMessage.includes('code') || lowerMessage.includes('function') || lowerMessage.includes('algorithm')) {
    return {
      text: "I'll show you some code examples with syntax highlighting.",
      artifacts: [{
        id: `code_${Date.now()}`,
        type: 'application/vnd.ant.code',
        code: `// Example: Advanced JavaScript Functions

// 1. Higher-order function with closures
function createCounter(initialValue = 0) {
  let count = initialValue;
  
  return {
    increment: (step = 1) => count += step,
    decrement: (step = 1) => count -= step,
    getValue: () => count,
    reset: () => count = initialValue
  };
}

// 2. Async function with error handling
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
}

// 3. Functional programming with array methods
const processUserList = (users) => {
  return users
    .filter(user => user.active)
    .map(user => ({
      ...user,
      fullName: \`\${user.firstName} \${user.lastName}\`,
      isAdmin: user.role === 'admin'
    }))
    .sort((a, b) => a.lastName.localeCompare(b.lastName));
};

// 4. Class with private fields and methods
class TaskManager {
  #tasks = [];
  #nextId = 1;
  
  addTask(description, priority = 'medium') {
    const task = {
      id: this.#nextId++,
      description,
      priority,
      completed: false,
      createdAt: new Date()
    };
    
    this.#tasks.push(task);
    return task;
  }
  
  completeTask(id) {
    const task = this.#findTaskById(id);
    if (task) {
      task.completed = true;
      task.completedAt = new Date();
    }
    return task;
  }
  
  #findTaskById(id) {
    return this.#tasks.find(task => task.id === id);
  }
  
  getTasks(filter = 'all') {
    switch (filter) {
      case 'completed':
        return this.#tasks.filter(task => task.completed);
      case 'pending':
        return this.#tasks.filter(task => !task.completed);
      default:
        return [...this.#tasks];
    }
  }
}

// Usage examples
const counter = createCounter(10);
console.log(counter.getValue()); // 10
counter.increment(5);
console.log(counter.getValue()); // 15

const taskManager = new TaskManager();
taskManager.addTask('Review code', 'high');
taskManager.addTask('Write tests', 'medium');
taskManager.completeTask(1);

console.log(taskManager.getTasks('pending'));`,
        language: 'javascript'
      }]
    };
  }
  
  return {
    text: "Hello! I'm a RAG system that can create interactive artifacts. Try asking me to:\n\n• **\"Create HTML page\"** - I'll generate an interactive HTML artifact\n• **\"Make a React component\"** - I'll create a React component with state\n• **\"Build a calculator\"** - I'll create a functional calculator app\n• **\"Show me some code\"** - I'll display code examples with syntax highlighting\n\nWhat would you like me to create for you?",
    artifacts: []
  };
}

// WebSocket handling
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);
  
  socket.on('chat_message', async (data) => {
    try {
      const response = await processLLMMessage(data.message);
      
      // Create artifacts if any
      if (response.artifacts && response.artifacts.length > 0) {
        for (const artifact of response.artifacts) {
          await createArtifact(artifact);
        }
      }
      
      socket.emit('chat_response', response);
    } catch (error) {
      console.error('Socket error:', error);
      socket.emit('chat_error', { error: error.message });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('👋 User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Express error:', error);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

server.listen(PORT, () => {
  console.log(`🚀 Chat server running on port ${PORT}`);
  console.log(`💬 Visit http://localhost:${PORT} to start chatting`);
  console.log(`🔧 Artifact service should be running on port 3001`);
});

module.exports = { app, server };
