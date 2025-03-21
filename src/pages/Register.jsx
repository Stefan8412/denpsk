import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import ParticlesBg from "particles-bg";
import { Link as ScrollLink } from "react-scroll";

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
    <div className="flex flex-col items-center justify-center min-h-screen  text-zinc-50">
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
      <section id="home-section">
        <ParticlesBg type="circle" bg={true} config={config} />
        <div className="flex flex-col items-center justify-center min-h-screen ">
          <h2 className="text-2xl font-bold">Registrácia</h2>
          <form
            className="flex flex-col gap-4 p-6 rounded-lg shadow-lg w-80"
            onSubmit={handleRegister}
          >
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
              placeholder="Heslo"
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
          <p className="mt-4">
            Máte účet?{" "}
            <RouterLink to="/" className="text-red-400 hover:underline">
              Prihláste sa
            </RouterLink>
          </p>
        </div>
      </section>
      <section
        id="info-section"
        className="h-screen flex flex-col items-center justify-center "
      >
        <h2 className="text-4xl font-bold text-black">Program</h2>
        <p className="text-lg mt-4 max-w-2xl text-center text-black">
          <ul>
            <li>Prehliadka úradu-nutná registrácia na webe</li>
            <li>Hlasovanie o školských projektoch-nutná registrácia na webe</li>
          </ul>
        </p>
      </section>
    </div>
  );
};

export default Register;
