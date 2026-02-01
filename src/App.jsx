import { useState, useEffect } from 'react'
import './App.css'

const CATEGORIES = ['Personal', 'Work', 'Shopping', 'Health', 'Other']
const PRIORITIES = ['low', 'medium', 'high']
const CATEGORY_COLORS = {
  'Personal': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
  'Work': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
  'Shopping': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
  'Health': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
  'Other': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}
const PRIORITY_ICONS = {
  'low': '🟢',
  'medium': '🟡',
  'high': '🔴'
}

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState('')
  const [category, setCategory] = useState('Personal')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState('all')
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const addTodo = (e) => {
    e.preventDefault()
    if (input.trim() === '') return
    setTodos([...todos, {
      id: Date.now(),
      text: input,
      category,
      priority,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString()
    }])
    setInput('')
    setDueDate('')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEdit = (todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editText } : todo
    ))
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active': return todos.filter(t => !t.completed)
      case 'completed': return todos.filter(t => t.completed)
      default: return todos
    }
  }

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    highPriority: todos.filter(t => t.priority === 'high' && !t.completed).length
  }

  const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return new Date(dueDate) < today
  }

  const isDueSoon = (dueDate) => {
    if (!dueDate) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
    return diff >= 0 && diff <= 2
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'}`}>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-4xl sm:text-5xl font-bold ${darkMode ? 'text-white' : 'text-white'} mb-2`}>
                ✨ Todo List
              </h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-white/80'} text-lg`}>
                Stay organized, get things done
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-full shadow-lg transition-all hover:scale-110 ${
                darkMode 
                  ? 'bg-yellow-400 text-yellow-900' 
                  : 'bg-white text-gray-800'
              }`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Stats Card */}
          <div className={`rounded-2xl shadow-xl p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{stats.total}</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{stats.completed}</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Done</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{stats.pending}</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{stats.highPriority}</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Urgent</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Progress</span>
                <span className={`text-sm font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{progress}%</span>
              </div>
              <div className={`h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Add Todo Form */}
          <form onSubmit={addTodo} className={`rounded-2xl shadow-xl p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Add New Task</h2>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What needs to be done?"
              className={`w-full px-4 py-3 rounded-lg mb-4 transition-all ${
                darkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:bg-gray-600' 
                  : 'bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:bg-white'
              }`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
                >
                  {PRIORITIES.map(p => (
                    <option key={p} value={p} style={{ textTransform: 'capitalize' }}>{PRIORITY_ICONS[p]} {p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] shadow-lg"
            >
              ➕ Add Task
            </button>
          </form>

          {/* Filters */}
          <div className={`rounded-2xl shadow-xl p-4 mb-6 flex flex-wrap gap-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {['all', 'active', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                  filter === f
                    ? 'bg-purple-600 text-white shadow-lg'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {f}
              </button>
            ))}
            {stats.completed > 0 && (
              <button
                onClick={clearCompleted}
                className="ml-auto px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                🗑️ Clear Completed
              </button>
            )}
          </div>

          {/* Todo List */}
          <div className="space-y-4">
            {getFilteredTodos().length === 0 ? (
              <div className={`rounded-2xl shadow-xl p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="text-6xl mb-4">📝</div>
                <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  No tasks found
                </h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {filter === 'all' ? 'Add a task above to get started!' : `No ${filter} tasks`}
                </p>
              </div>
            ) : (
              getFilteredTodos().map(todo => (
                <div
                  key={todo.id}
                  className={`rounded-xl shadow-lg p-4 transition-all transform hover:scale-[1.01] ${
                    todo.completed 
                      ? 'opacity-60' 
                      : ''
                  } ${darkMode ? 'bg-gray-800' : 'bg-white'} ${isOverdue(todo.dueDate) && !todo.completed ? 'border-2 border-red-500' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="mt-1 w-5 h-5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      {editingId === todo.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className={`flex-1 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit(todo.id)}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            ✓
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className={`text-lg font-medium break-words ${todo.completed ? 'line-through text-gray-400' : darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {todo.text}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[todo.category]}`}>
                              {todo.category}
                            </span>
                            <span className="text-sm" title={`${todo.priority} priority`}>
                              {PRIORITY_ICONS[todo.priority]}
                            </span>
                            {todo.dueDate && (
                              <span className={`text-xs ${isOverdue(todo.dueDate) && !todo.completed ? 'text-red-500 font-bold' : isDueSoon(todo.dueDate) ? 'text-orange-500 font-medium' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {isOverdue(todo.dueDate) && !todo.completed ? '⚠️ ' : '📅 '}
                                {new Date(todo.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    {!todo.completed && editingId !== todo.id && (
                      <button
                        onClick={() => startEdit(todo)}
                        className={`p-2 rounded-lg transition-all ${darkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-50'}`}
                      >
                        ✏️
                      </button>
                    )}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className={`p-2 rounded-lg transition-all ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50'}`}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className={`text-center mt-8 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <p>💜 Built with React & Tailwind CSS</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
