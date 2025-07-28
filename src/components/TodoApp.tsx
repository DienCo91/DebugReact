"use client"

import type React from "react"
import { useState, useEffect } from "react"
import "../App.css"

interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingText, setEditingText] = useState("")

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos")
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo:Todo) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }))
      setTodos(parsedTodos)
    }
  }, [])

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (inputValue.trim() !== "") {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date(),
      }
      setTodos([...todos, newTodo])
      setInputValue("")
    }
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const startEditing = (id: number, text: string) => {
    setEditingId(id)
    setEditingText(text)
  }

  const saveEdit = () => {
    if (editingText.trim() !== "") {
      setTodos(todos.map((todo) => (todo.id === editingId ? { ...todo, text: editingText.trim() } : todo)))
    }
    setEditingId(null)
    setEditingText("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText("")
  }

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed
    if (filter === "completed") return todo.completed
    return true
  })

  const completedCount = todos.filter((todo) => todo.completed).length
  const activeCount = todos.length - completedCount

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo()
    }
  }

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit()
    } else if (e.key === "Escape") {
      cancelEdit()
    }
  }

  return (
    <div className="todo-app">
      <div className="container">
        <div className="todo-wrapper">
          {/* Header */}
          <div className="header">
            <h1>📝 Todo List</h1>
            <p>Organize your tasks efficiently</p>
          </div>

          {/* Add Todo Input */}
          <div className="add-todo-section">
            <div className="input-group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new task..."
                className="todo-input"
              />
              <button onClick={addTodo} className="add-btn">
                ➕ Add
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="filter-section">
            <div className="filter-buttons">
              {(["all", "active", "completed"] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`filter-btn ${filter === filterType ? "active" : ""}`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  {filterType === "active" && activeCount > 0 && (
                    <span className="badge badge-blue">{activeCount}</span>
                  )}
                  {filterType === "completed" && completedCount > 0 && (
                    <span className="badge badge-green">{completedCount}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Todo List */}
          <div className="todo-list">
            {filteredTodos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <p>{filter === "all" ? "No tasks yet. Add one above!" : `No ${filter} tasks found.`}</p>
              </div>
            ) : (
              <div className="todo-items">
                {filteredTodos.map((todo, index) => (
                  <div
                    key={todo.id}
                    className={`todo-item ${todo.completed ? "completed" : ""}`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <div className="todo-content">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`checkbox ${todo.completed ? "checked" : ""}`}
                      >
                        {todo.completed && "✓"}
                      </button>

                      {/* Todo Text */}
                      <div className="todo-text">
                        {editingId === todo.id ? (
                          <input
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onKeyPress={handleEditKeyPress}
                            onBlur={saveEdit}
                            className="edit-input"
                            autoFocus
                          />
                        ) : (
                          <div>
                            <p className={`task-text ${todo.completed ? "strikethrough" : ""}`}>{todo.text}</p>
                            <p className="task-date">
                              Created: {todo.createdAt.toLocaleDateString()} at {todo.createdAt.toLocaleTimeString()}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="action-buttons">
                        {editingId === todo.id ? (
                          <>
                            <button onClick={saveEdit} className="action-btn save-btn">
                              ✓
                            </button>
                            <button onClick={cancelEdit} className="action-btn cancel-btn">
                              ✕
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEditing(todo.id, todo.text)} className="action-btn edit-btn">
                              ✏️
                            </button>
                            <button onClick={() => deleteTodo(todo.id)} className="action-btn delete-btn">
                              🗑️
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Stats */}
          {todos.length > 0 && (
            <div className="footer-stats">
              <div className="stats-content">
                <div className="stats-text">
                  <span className="stat-number">{activeCount}</span> active,{" "}
                  <span className="stat-number">{completedCount}</span> completed
                </div>
                {completedCount > 0 && (
                  <button onClick={clearCompleted} className="clear-btn">
                    Clear Completed
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
