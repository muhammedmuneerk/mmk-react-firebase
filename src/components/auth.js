import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useState } from "react";
import "./Auth.css"; // Assuming you create a separate CSS file for Auth

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage("Sign up successful!");
    } catch (err) {
      console.error(err);
      setMessage("Error signing up: " + err.message);
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Login successful!");
    } catch (err) {
      console.error(err);
      setMessage("Error logging in: " + err.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setMessage("Sign in with Google successful!");
    } catch (err) {
      console.error(err);
      setMessage("Error signing in with Google: " + err.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setMessage("Logged out successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error logging out: " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <input
        placeholder="Email..."
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password..."
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
      <button onClick={signUp}>Sign Up</button>
      <button onClick={signInWithGoogle}>Sign In With Google</button>
      <button onClick={logout}>Logout</button>
      {message && <p>{message}</p>}
    </div>
  );
};
