import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import ParticlesBg from "particles-bg";

import { useState, useEffect, useRef } from "react";
import PowerModeInput from "power-mode-input";
import QRCodeGenerator from "../components/QRCodegenerator";
import { Menu, X } from "lucide-react";
import CountdownTimer from "../components/CountdownTimer";
import { db } from "../firebaseConfig";

import { collection, query, where, getDocs } from "firebase/firestore";
import { addDoc } from "firebase/firestore";

const Home = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!name) {
      alert("Please enter your name.");
      return;
    }
    // Check if name exists in Firestore
    const q = query(
      collection(db, "hlasovanieusers"),
      where("name", "==", name)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      setError("Hlasovanie bude spustené 5.5.2025");
    } else {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      localStorage.setItem("userId", userDoc.id);
      localStorage.setItem("role", userData.role || "user");
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  };

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      PowerModeInput.make(inputRef.current, {
        height: 2.5,
        tha: [0, 360],
        g: 0.5,
        num: 5,
        radius: 6,
        circle: true,
        alpha: [0.75, 0.1],
        color: "blue",
      });
    }
    return () => {
      if (inputRef.current) {
        PowerModeInput.destroy();
      }
    };
  }, []);
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
        <img
          src="/erbbiely.jpg"
          alt="PSK Logo"
          className="h-16 cursor-pointer"
          onClick={() => navigate("/")}
        />
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
            Školy
          </ScrollLink>
          <ScrollLink
            onClick={() => setMenuOpen(false)}
            to="qr-section"
            smooth={true}
            duration={800}
            className="block md:inline-block p-4 md:p-1 text-gray-900 font-bold cursor-pointer hover:text-blue-500"
          >
            Aktuality
          </ScrollLink>
        </div>
      </nav>

      {/* Login Section */}
      <ParticlesBg type="circle" config={config} bg={true} />
      <section
        id="home-section"
        className="flex flex-col items-center justify-center min-h-screen p-6"
      >
        <h1 className="text-4xl font-bold text-white">
          Tu bude web pre mladez
        </h1>
        {/*  <form
          onSubmit={handleLogin}
          className="mt-6 bg-white p-6 rounded-lg shadow-md w-80"
        >
          <input
            type="text"
            placeholder="napíšte meno"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 mt-2 rounded hover:bg-blue-900"
          >
            Prihlásiť sa
          </button>
        </form> */}
      </section>

      {/* Program Section */}
      <section
        id="program-section"
        className="min-h-screen flex flex-col items-center justify-center p-6 bg-white"
      >
        {/* Event Cover Image */}
        <img
          src="/kniznica.jpg" // Update with your actual image path
          alt="Event Cover"
          className="w-full max-w-4xl h-auto object-cover rounded-lg shadow-lg
               sm:max-w-3xl md:max-w-2xl lg:max-w-full"
        />
      </section>
      <section
        id="qr-section"
        className="min-h-screen flex flex-col items-center justify-center p-6 bg-white"
      >
        <h2 className="text-3xl font-bold text-blue-600">aktuality</h2>
        <p className="mt-4 text-center text-gray-700 max-w-2xl">
          <CountdownTimer />
        </p>
      </section>
    </div>
  );
};

export default Home;
