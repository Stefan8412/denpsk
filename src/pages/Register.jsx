import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ParticlesBg from "particles-bg";
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
    <div className="flex flex-col items-center justify-center min-h-screen  text-zinc-50">
      <ParticlesBg type="circle" bg={true} color="0000ff" />
      <h2 className="text-2xl font-bold">Registrácia</h2>
      <form className="flex flex-col gap-4" onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded text-black"
        />
        <input
          type="password"
          placeholder="heslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded text-black"
        />
        <input
          type="text"
          placeholder="Organizácia"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          required
          className="border p-2 rounded text-black"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Registrácia
        </button>
      </form>
    </div>
  );
};

export default Register;
