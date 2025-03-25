import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import ParticlesBg from "particles-bg";
import { Link as ScrollLink } from "react-scroll";
import { Menu, X } from "lucide-react";

const Register = () => {
  const [menuOpen, setMenuOpen] = useState(false);
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
  let config = {
    num: [4, 7],
    rps: 0.1,
    radius: [5, 40],
    life: [1.5, 3],
    v: [2, 3],
    tha: [-40, 40],
    // body: "./img/icon.png", // Whether to render pictures
    // rotate: [0, 20],
    alpha: [0.6, 0],
    scale: [1, 0.1],
    position: "center", // all or center or {x:1,y:1,width:100,height:100}
    color: ["random", "#0000ff"],
    cross: "dead", // cross or bround
    random: 15, // or null,
    g: 5, // gravity
    // f: [2, -1], // force
    onParticleUpdate: (ctx, particle) => {
      ctx.beginPath();
      ctx.rect(
        particle.p.x,
        particle.p.y,
        particle.radius * 2,
        particle.radius * 2
      );
      ctx.fillStyle = particle.color;
      ctx.fill();
      ctx.closePath();
    },
  };

  return (
    <div className="flex flex-col min-h-screen  text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex justify-between items-center z-50">
        <div
          className="text-gray-900 font-bold text-lg"
          onClick={() => navigate("/")}
        >
          PSK
        </div>
        <button
          className="md:hidden text-gray-900"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent md:flex ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <ScrollLink
            onClick={() => setMenuOpen(false)}
            to="home-section"
            smooth={true}
            duration={800}
            className="block md:inline-block p-4 md:p-1 text-gray-900 font-bold cursor-pointer hover:text-blue-500"
          >
            Domov
          </ScrollLink>
          <ScrollLink
            onClick={() => setMenuOpen(false)}
            to="program-section"
            smooth={true}
            duration={800}
            className="block md:inline-block p-4 md:p-1 text-gray-900 font-bold cursor-pointer hover:text-blue-500"
          >
            Program
          </ScrollLink>
        </div>
      </nav>
      <ParticlesBg type="circle" config={config} bg={true} />
      {/* Register Section */}
      <section
        id="home-section"
        className="flex flex-col items-center justify-center min-h-screen p-6"
      >
        <h1 className="text-4xl font-bold text-blue-600">Registrácia</h1>
        <form
          onSubmit={handleRegister}
          className="mt-6 bg-white p-6 rounded-lg shadow-md w-80"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border p-2 rounded mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border p-2 rounded mb-4"
          />
          <input
            type="text"
            placeholder="Organization"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
            className="w-full border p-2 rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Registruj sa
          </button>
          <p className="mt-4 text-center">
            Máš účet?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/")}
            >
              Prihlás sa
            </span>
          </p>
        </form>
      </section>

      {/* Program Section */}
      <section
        id="program-section"
        className="min-h-screen flex flex-col items-center justify-center p-6 bg-white"
      >
        <h2 className="text-3xl font-bold text-blue-600">Program</h2>
        <p className="mt-4 text-center text-gray-700 max-w-2xl">
          5.5.2025 Deň PSK
        </p>
      </section>
    </div>
  );
};

export default Register;
