import { useState, useEffect } from "react";

const API = "http://localhost:8000";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // 토큰 상태 관리, 초기값은 localStorage에서 가져옴
  const [username, setUsername] = useState(""); // 사용자 이름 상태 관리 
  const [password, setPassword] = useState(""); // 비밀번호 상태 관리
  const [isRegister, setIsRegister] = useState(false); // 회원가입 모드 여부 상태 관리
  const [todos, setTodos] = useState([]); // 할 일 목록 상태 관리
  const [input, setInput] = useState(""); // 할 일 입력값 상태 관리
  const [error, setError] = useState(""); // 에러 메시지 상태 관리  

  useEffect(() => {// 토큰이 변경될 때마다 할 일 목록을 가져오는 효과
    if (token) fetchTodos();
  }, [token]);

  const fetchTodos = async () => {//  할 일 목록을 가져오는 함수, API 호출 시 토큰을 헤더에 포함
    const res = await fetch(`${API}/todos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setTodos(await res.json());
  };

  const handleAuth = async () => {// 로그인 또는 회원가입 처리 함수 
    const endpoint = isRegister ? "/register" : "/login";
    const body = isRegister
      ? JSON.stringify({ username, password })
      : new URLSearchParams({ username, password });
    const headers = isRegister
      ? { "Content-Type": "application/json" }
      : { "Content-Type": "application/x-www-form-urlencoded" };

    const res = await fetch(`${API}${endpoint}`, { method: "POST", headers, body });
    const data = await res.json();

    if (!res.ok) { setError(data.detail); return; } //    에러 발생 시 에러 메시지 설정 후 함수 종료
    if (isRegister) { // 회원가입 성공 시 로그인 페이지로 이동 및 메시지 설정
      setError("회원가입 완료! 로그인 해주세요.");
      setIsRegister(false);
    } else {
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      setError("");
    }
  };

  const logout = () => { // 로그아웃 처리 함수, 토큰 제거 및 상태 초기화  
    localStorage.removeItem("token");
    setToken("");
    setTodos([]);
  };

  const addTodo = async () => { //    새로운 할 일을 추가하는 함수, API 호출 시 토큰을 헤더에 포함  
    if (!input.trim()) return;
    const res = await fetch(`${API}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ text: input }),
    });
    setTodos(await res.json());
    setInput("");
  };

  const toggleTodo = async (id) => { // 할 일 완료 상태를 토글하는 함수, API 호출 시 토큰을 헤더에 포함 
    const res = await fetch(`${API}/todos/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    setTodos(await res.json());
  };

  const deleteTodo = async (id) => {  // 할 일을 삭제하는 함수, API 호출 시 토큰을 헤더에 포함  
    const res = await fetch(`${API}/todos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setTodos(await res.json());
  };

  if (!token) return ( //토큰이 없는 경우 로그인/회원가입 폼을 렌더링 
    <div style={{ maxWidth: 400, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1>{isRegister ? "📝 회원가입" : "🔐 로그인"}</h1>
      <input value={username} onChange={(e) => setUsername(e.target.value)}
        placeholder="아이디" style={{ display: "block", width: "100%", padding: 8, marginBottom: 8 }} />
      <input value={password} onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호" type="password"
        style={{ display: "block", width: "100%", padding: 8, marginBottom: 8 }} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleAuth} style={{ width: "100%", padding: 10, marginBottom: 8 }}>
        {isRegister ? "회원가입" : "로그인"}
      </button>
      <button onClick={() => { setIsRegister(!isRegister); setError(""); }}
        style={{ width: "100%", padding: 10, background: "none", border: "1px solid #ccc" }}>
        {isRegister ? "로그인으로 이동" : "회원가입으로 이동"}
      </button>
    </div>
  );

  return ( //토큰이 있는 경우 할 일 목록과 추가 폼을 렌더링  
    <div style={{ maxWidth: 480, margin: "60px auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>📝 Todo List</h1>
        <button onClick={logout} style={{ padding: "6px 12px", cursor: "pointer" }}>로그아웃</button>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="할 일을 입력하세요"
          style={{ flex: 1, padding: "8px 12px", fontSize: 16 }} />
        <button onClick={addTodo} style={{ padding: "8px 16px" }}>추가</button>
      </div>
      <ul style={{ listStyle: "none", padding: 0, marginTop: 24 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span onClick={() => toggleTodo(todo.id)}
              style={{ flex: 1, cursor: "pointer",
                textDecoration: todo.done ? "line-through" : "none",
                color: todo.done ? "#aaa" : "#000" }}>
              {todo.done ? "✅" : "⬜"} {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}
              style={{ color: "red", border: "none", background: "none", cursor: "pointer", fontSize: 18 }}>
              🗑
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}