import { useState, useEffect } from 'react'

const Icons = {
  Check: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  Trash: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"></path>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
  Plus: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Calendar: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  Moon: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  ),
  Sun: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  )
};

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    // Apply dark mode class to document element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:3001/api/todos');
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error('Error fetching todos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!input.trim() || isAdding) return;

    const tempId = Date.now();
    const tempTodo = { id: tempId, text: input, completed: false, isTemp: true };
    
    // Optimistic UI update
    setTodos([tempTodo, ...todos]);
    setInput('');
    setIsAdding(true);

    try {
      const res = await fetch('http://localhost:3001/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: tempTodo.text })
      });
      if (res.ok) {
        const newTodo = await res.json();
        // Replace temp todo with real one
        setTodos(prev => prev.map(t => t.id === tempId ? newTodo : t));
      } else {
        // Revert on failure
        setTodos(prev => prev.filter(t => t.id !== tempId));
      }
    } catch (err) {
      console.error('Error adding todo:', err);
      setTodos(prev => prev.filter(t => t.id !== tempId));
    } finally {
      setIsAdding(false);
    }
  };

  const toggleTodo = async (id, completed) => {
    // Optimistic update
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !completed } : t));

    try {
      const res = await fetch(`http://localhost:3001/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      });
      if (!res.ok) {
        // Revert on failure
        setTodos(prev => prev.map(t => t.id === id ? { ...t, completed } : t));
      }
    } catch (err) {
      console.error('Error toggling todo:', err);
      setTodos(prev => prev.map(t => t.id === id ? { ...t, completed } : t));
    }
  };

  const deleteTodo = async (id) => {
    const todoToDelete = todos.find(t => t.id === id);
    // Optimistic update
    setTodos(prev => prev.filter(t => t.id !== id));

    try {
      const res = await fetch(`http://localhost:3001/api/todos/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        // Revert on failure
        setTodos(prev => [...prev, todoToDelete].sort((a, b) => b.id - a.id));
      }
    } catch (err) {
      console.error('Error deleting todo:', err);
      setTodos(prev => [...prev, todoToDelete].sort((a, b) => b.id - a.id));
    }
  };

  // Date formatting
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Stats
  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-700 dark:selection:text-indigo-300 flex items-center justify-center p-4 transition-colors duration-300">
      
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-2xl dark:shadow-black/50 overflow-hidden ring-1 ring-black/5 dark:ring-white/10 flex flex-col max-h-[90vh] transition-colors duration-300">
        
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 p-8 pb-4 z-10 transition-colors duration-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">My Tasks</h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2 mt-1 text-sm">
                <Icons.Calendar className="w-4 h-4" />
                {dateStr}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-all duration-200"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Icons.Sun className="w-5 h-5" /> : <Icons.Moon className="w-5 h-5" />}
              </button>
              <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ring-1 ring-indigo-100 dark:ring-indigo-800">
                {completedCount}/{totalCount} Done
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-6 transition-colors duration-300">
            <div 
              className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Input Form */}
          <form onSubmit={addTodo} className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a new task..."
              className="w-full pl-5 pr-14 py-4 bg-gray-50 dark:bg-gray-700 border-0 rounded-2xl text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-gray-600 transition-all shadow-sm font-medium"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isAdding}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-indigo-600 dark:disabled:hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition-all shadow-sm"
            >
              <Icons.Plus className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Todo List Area */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-3 custom-scrollbar">
          {isLoading ? (
            // Skeleton Loading
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-50 dark:bg-gray-700 rounded-2xl animate-pulse" />
            ))
          ) : todos.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-300 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4">
                <Icons.Check className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">All caught up!</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-[200px]">You have no tasks on your list. Add one to get started.</p>
            </div>
          ) : (
            // List Items
            todos.map(todo => (
              <div 
                key={todo.id}
                className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 border border-transparent ${
                  todo.completed 
                    ? 'bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500' 
                    : 'bg-white dark:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-lg hover:shadow-gray-100 dark:hover:shadow-black/20' // Increased shadow on hover
                } ${todo.isTemp ? 'opacity-70' : ''}`}
              >
                <button
                  onClick={() => toggleTodo(todo.id, todo.completed)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    todo.completed
                      ? 'bg-indigo-500 dark:bg-indigo-400 border-indigo-500 dark:border-indigo-400'
                      : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
                  }`}
                >
                  {todo.completed && <Icons.Check className="w-3.5 h-3.5 text-white" />}
                </button>
                
                <span className={`flex-1 font-medium truncate ${todo.completed ? 'line-through decoration-2 decoration-gray-200 dark:decoration-gray-600' : ''}`}>
                  {todo.text}
                </span>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all focus:opacity-100"
                  aria-label="Delete task"
                >
                  <Icons.Trash className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
