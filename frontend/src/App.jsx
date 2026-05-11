import { useState, useEffect } from "react";

const API = "http://localhost:8000";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch(`${API}/todos`)
      .then((r) => r.json())
      .then(setTodos);
  }, []);

  const addTodo = async () => {
    if (!input.trim()) return;
    const res = await fetch(`${API}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });
    setTodos(await res.json());
    setInput("");
  };

  const toggleTodo = async (id) => {
    const res = await fetch(`${API}/todos/${id}`, { method: "PATCH" });
    setTodos(await res.json());
  };

  const deleteTodo = async (id) => {
    const res = await fetch(`${API}/todos/${id}`, { method: "DELETE" });
    setTodos(await res.json());
  };

  return (
    <div style={{ maxWidth: 480, margin: "60px auto", fontFamily: "sans-serif" }}>
      <h1>📝 Todo List</h1>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="할 일을 입력하세요"
          style={{ flex: 1, padding: "8px 12px", fontSize: 16 }}
        />
        <button onClick={addTodo} style={{ padding: "8px 16px" }}>추가</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, marginTop: 24 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span
              onClick={() => toggleTodo(todo.id)}
              style={{
                flex: 1,
                cursor: "pointer",
                textDecoration: todo.done ? "line-through" : "none",
                color: todo.done ? "#aaa" : "#000"
              }}
            >
              {todo.done ? "✅" : "⬜"} {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{ color: "red", border: "none", background: "none", cursor: "pointer", fontSize: 18 }}
            >
              🗑
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}