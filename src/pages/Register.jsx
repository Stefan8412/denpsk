import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email,
        organization,
        role: email.includes("@admin.com") ? "admin" : "user",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error registering:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold">Register</h2>
      <form className="flex flex-col gap-4" onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2"
        />
        <input
          type="password"
          placeholder="heslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Organizacia"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          required
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
