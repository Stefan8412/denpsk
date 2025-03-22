import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import ParticlesBg from "particles-bg";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useState, useEffect, useRef } from "react";
import PowerModeInput from "power-mode-input";
import QRCodeGenerator from "../components/QRCodegenerator";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // Redirect after successful login
    } catch (err) {
      setError("Nesprávny email alebo heslo"); // Show error message
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
    <div className="flex flex-col items-center justify-center min-h-screen  text-white">
      {/* Top Navigation Menu */}
      <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-30 p-4 flex justify-center z-50 space-x-6">
        <ScrollLink
          to="home-section"
          smooth={true}
          duration={800}
          className="text-white cursor-pointer hover:text-red-400 transition text-lg font-bold"
        >
          Domov
        </ScrollLink>
        <ScrollLink
          to="info-section"
          smooth={true}
          duration={800}
          className="text-white cursor-pointer hover:text-red-400 transition text-lg font-bold"
        >
          Program
        </ScrollLink>
      </nav>
      <ParticlesBg type="circle" bg={true} config={config} />

      <section id="home-section">
        <div className="flex flex-col items-center justify-center min-h-screen ">
          <h1 className="text-5xl font-bold">Deň PSK</h1>
          <p className="mt-4 text-2xl">5.5.2025</p>
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-4 p-6 rounded-lg shadow-lg w-80"
          >
            {error && <p className="text-red-500">{error}</p>}

            <input
              ref={inputRef}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border p-2 rounded text-black"
              data-power-mode
            />
            <input
              type="password"
              placeholder="Heslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border p-2 rounded  text-black"
            />

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Prihlásiť sa
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-4">
            Nemáte účet?{" "}
            <RouterLink to="/register" className="text-red-400 hover:underline">
              Registrujte sa
            </RouterLink>
          </p>
        </div>
      </section>
      {/* New Section (Below Login) */}

      <section
        id="info-section"
        className="h-screen flex flex-col items-center justify-center "
      >
        <h2 className="text-4xl font-bold text-black">Program</h2>
        <p className="text-lg mt-4 max-w-2xl text-center text-black">
          <ul className="list-disc">
            <li>na webe sa pracuje, program doplníme</li>
            <li>Prehliadka úradu-nutná registrácia na webe</li>
            <li>Hlasovanie o školských projektoch-nutná registrácia na webe</li>
            <QRCodeGenerator />
          </ul>
        </p>
      </section>
    </div>
  );
};

export default Home;
