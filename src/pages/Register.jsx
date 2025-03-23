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

      <section id="info-section">
        <div className="bg-neutral-900">
          <div className="max-w-8xl px-4 xl:px-0 py-10 lg:pt-20 lg:pb-20 mx-auto">
            <div className="max-w-3xl mb-10 lg:mb-14">
              <h2 className="text-white font-semibold text-2xl md:text-4xl md:leading-tight">
                Program
              </h2>
              <p className="mt-1 text-neutral-400">
                Bohatý program pre verejnosť na Námestí mieru 2 v Prešove. Lorem
                impsum lorem ipsum lorem ipsum lorem ipsum Lorem impsum lorem
                ipsum lorem ipsum lorem ipsum
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-center">
              <div className="aspect-w-16 aspect-h-9 lg:aspect-none">
                <img
                  className="w-full object-cover rounded-xl"
                  src="https://images.unsplash.com/photo-1550850395-c17a8e90ad0a?q=80&w=480&h=350&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Features Image"
                />
              </div>

              <div>
                <div className="mb-4">
                  <h3 className="text-[#ff0] text-xs font-medium uppercase">
                    Aktivity
                  </h3>
                </div>

                <div className="flex gap-x-5 ms-1">
                  <div className="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800">
                    <div className="relative z-10 size-8 flex justify-center items-center">
                      <span className="flex shrink-0 justify-center items-center size-8 border border-neutral-800 text-[#ff0] font-semibold text-xs uppercase rounded-full">
                        1
                      </span>
                    </div>
                  </div>

                  <div className="grow pt-0.5 pb-8 sm:pb-12">
                    <p className="text-sm lg:text-base text-neutral-400">
                      <span className="text-white">Diskusie:</span>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Praesent non dolor interdum, scelerisque tortor in
                    </p>
                  </div>
                </div>

                <div className="flex gap-x-5 ms-1">
                  <div className="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800">
                    <div className="relative z-10 size-8 flex justify-center items-center">
                      <span className="flex shrink-0 justify-center items-center size-8 border border-neutral-800 text-[#ff0] font-semibold text-xs uppercase rounded-full">
                        2
                      </span>
                    </div>
                  </div>

                  <div className="grow pt-0.5 pb-8 sm:pb-12">
                    <p className="text-sm lg:text-base text-neutral-400">
                      <span className="text-white">Prehliadka:</span>
                      Registrácia na webe podujatia https://den.psk.sk
                    </p>
                  </div>
                </div>

                <div className="flex gap-x-5 ms-1">
                  <div className="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800">
                    <div className="relative z-10 size-8 flex justify-center items-center">
                      <span className="flex shrink-0 justify-center items-center size-8 border border-neutral-800 text-[#ff0] font-semibold text-xs uppercase rounded-full">
                        3
                      </span>
                    </div>
                  </div>

                  <div className="grow pt-0.5 pb-8 sm:pb-12">
                    <p className="text-sm md:text-base text-neutral-400">
                      <span className="text-white">Hlasovanie:</span>
                      Registrácia na webe podujatia https://den.psk.sk
                    </p>
                  </div>
                </div>

                <div className="flex gap-x-5 ms-1">
                  <div className="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800">
                    <div className="relative z-10 size-8 flex justify-center items-center">
                      <span className="flex shrink-0 justify-center items-center size-8 border border-neutral-800 text-[#ff0] font-semibold text-xs uppercase rounded-full">
                        4
                      </span>
                    </div>
                  </div>

                  <div className="grow pt-0.5 pb-8 sm:pb-12">
                    <p className="text-sm md:text-base text-neutral-400">
                      <span className="text-white">Bufety:</span>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Praesent non dolor interdum, scelerisque tortor in,.
                    </p>
                  </div>
                </div>

                <a
                  className="group inline-flex items-center gap-x-2 py-2 px-3 bg-[#ff0] font-medium text-sm text-neutral-800 rounded-full focus:outline-hidden"
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

export default Register;
