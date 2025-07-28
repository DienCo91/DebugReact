"use client"

import { useState } from "react"
import "../counter.css"

export default function SimpleCounter() {
  const [count, setCount] = useState(0)

  const increment = () => {
    setCount(count + 1)
  }

  const decrement = () => {
    setCount(count - 1)
  }

  const reset = () => {
    setCount(0)
  }

  console.log('SimpleCounter -> count: ', count);

  return (
    <div className="counter-container">
      <div className="counter-card">
        <h1 className="counter-title">🔢 Simple Counter</h1>

        <div className="counter-display">
          <span className={`counter-number ${count > 0 ? "positive" : count < 0 ? "negative" : "zero"}`}>{count}</span>
        </div>

        <div className="counter-buttons">
          <button className="counter-btn decrement-btn" onClick={decrement}>
            ➖ Decrease
          </button>

          <button className="counter-btn reset-btn" onClick={reset} disabled={count === 0}>
            🔄 Reset
          </button>

          <button className="counter-btn increment-btn" onClick={increment}>
            ➕ Increase
          </button>
        </div>

        
      </div>
    </div>
  )
}
