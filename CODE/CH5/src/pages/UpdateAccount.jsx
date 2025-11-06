import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../api/user.js";
import { useAuth } from "../context/AuthContext.jsx";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";

export function UpdateAccount() {
  const [token] = useAuth();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token && typeof token === "string" && token.trim() !== "") {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.sub);
      } catch (err) {
        console.error("Invalid token format:", err);
        navigate("/login");
      }
    } else {
      navigate("/login"); 
    }
  }, [token, navigate]);

  const mutation = useMutation({
    mutationFn: () => updateUser(userId, { username, password, token }),
    onSuccess: () => {
      alert("Account updated successfully!");
      navigate("/");
    },
    onError: () => alert("Failed to update account"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (!userId) return <p>Loading account info...</p>;

  return (
    <div style={{ padding: 16 }}>
      <Link to="/">← Back to Blog</Link>
      <h2>Update Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">New Username:</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Leave blank to keep current"
          />
        </div>
        <div>
          <label htmlFor="password">New Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current"
          />
        </div>
        <br />
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Updating..." : "Update Account"}
        </button>
      </form>
    </div>
  );
}

