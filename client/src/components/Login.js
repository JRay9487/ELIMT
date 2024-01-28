import React, { useState } from 'react';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 在這裡添加登入邏輯,例如發送請求到後端
  };

  return (
    <React.Fragment>
      <header>
        <h2>LOGIN</h2>
      </header>

      <main>
        <form action="/login" method="post">
          <label for="username">Account:</label>
          <input type="text" id="username" name="username" required />
          <br />
          <br />

          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required />
          <br />
          <br />

          <input type="submit" value="login" />

          <li>Account : 名字拼音縮寫</li>
          <li>Account : 預設為12345</li>
        </form>
      </main>

      <footer>
        <p>Copyright &copy; 2024 Chun-JUI, LIN.All rights reserved.</p>
      </footer>
    </React.Fragment>
  );
}

export default Login;