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
      <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-10 p-4 flex justify-center z-50 space-x-6">
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
          <QRCodeGenerator />
        </div>
      </section>
      {/* New Section (Below Login) */}

      <section
        id="info-section"
        className="h-screen flex flex-col items-center justify-center bg-white"
      >
        <div className="bg-white">
          <div className="max-w-8xl px-4 xl:px-0 py-10 lg:pt-20 lg:pb-20 mx-auto">
            <div className="max-w-3xl mb-10 lg:mb-14">
              <h2 className="text-[#2629ab] px-10 font-semibold text-2xl md:text-4xl md:leading-tight">
                Program
              </h2>
              <p className="mt-1 px-10 text-neutral-800">
                Bohatý program pre verejnosť 5.5.2025 na Námestí mieru 2, v
                Prešove. Lorem impsum lorem ipsum lorem ipsum lorem ipsum Lorem
                impsum lorem ipsum lorem ipsum lorem ipsum
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-center">
              <div className="aspect-w-16 aspect-h-9 lg:aspect-none">
                <img
                  className="w-full object-cover rounded-xl"
                  src="erbbiely.jpg"
                  alt="Features Image"
                />
              </div>

              <div>
                <div className="mb-4">
                  <h3 className="text-[#2629ab] text-xs font-medium uppercase">
                    Aktivity
                  </h3>
                </div>

                <div className="flex gap-x-5 ms-1">
                  <div className="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800">
                    <div className="relative z-10 size-8 flex justify-center items-center">
                      <span className="flex shrink-0 justify-center items-center size-8 border border-neutral-800 text-[#2629ab] font-semibold text-xs uppercase rounded-full">
                        1
                      </span>
                    </div>
                  </div>

                  <div className="grow pt-0.5 pb-8 sm:pb-12">
                    <p className="text-sm lg:text-base text-neutral-800">
                      <span className="text-[#2629ab]">Diskusie:</span>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Praesent non dolor interdum, scelerisque tortor in
                    </p>
                  </div>
                </div>

                <div className="flex gap-x-5 ms-1">
                  <div className="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800">
                    <div className="relative z-10 size-8 flex justify-center items-center">
                      <span className="flex shrink-0 justify-center items-center size-8 border border-neutral-800 text-[#2629ab] font-semibold text-xs uppercase rounded-full">
                        2
                      </span>
                    </div>
                  </div>

                  <div className="grow pt-0.5 pb-8 sm:pb-12">
                    <p className="text-sm lg:text-base text-neutral-800">
                      <span className="text-[#2629ab]">Prehliadka:</span>
                      Registrácia na webe podujatia https://den.psk.sk
                    </p>
                  </div>
                </div>

                <div className="flex gap-x-5 ms-1">
                  <div className="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800">
                    <div className="relative z-10 size-8 flex justify-center items-center">
                      <span className="flex shrink-0 justify-center items-center size-8 border border-neutral-800 text-[#2629ab] font-semibold text-xs uppercase rounded-full">
                        3
                      </span>
                    </div>
                  </div>

                  <div className="grow pt-0.5 pb-8 sm:pb-12">
                    <p className="text-sm md:text-base text-neutral-800">
                      <span className="text-[#2629ab]">Hlasovanie:</span>
                      Registrácia na webe podujatia https://den.psk.sk
                    </p>
                  </div>
                </div>

                <div className="flex gap-x-5 ms-1">
                  <div className="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800">
                    <div className="relative z-10 size-8 flex justify-center items-center">
                      <span className="flex shrink-0 justify-center items-center size-8 border border-neutral-800 text-[#2629ab] font-semibold text-xs uppercase rounded-full">
                        4
                      </span>
                    </div>
                  </div>

                  <div className="grow pt-0.5 pb-8 sm:pb-12">
                    <p className="text-sm md:text-base text-neutral-800">
                      <span className="text-[#2629ab]">Bufety:</span>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Praesent non dolor interdum, scelerisque tortor in,.
                    </p>
                  </div>
                </div>

                <a
                  className="group inline-flex items-center gap-x-2 py-2 px-3 text-[#2629ab] font-medium text-sm text-[#2629ab] rounded-full focus:outline-hidden"
                  href="#"
                >
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    <path
                      className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-hover:delay-100 transition"
                      d="M14.05 2a9 9 0 0 1 8 7.94"
                    ></path>
                    <path
                      className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition"
                      d="M14.05 6A5 5 0 0 1 18 10"
                    ></path>
                  </svg>
                  090909009
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
