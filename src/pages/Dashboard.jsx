import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import ParticlesBg from "particles-bg";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { Menu, X } from "lucide-react";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedVote, setSelectedVote] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [hasVotedLogo, setHasVotedLogo] = useState(false);
  const [canVoteProject, setCanVoteProject] = useState(true);

  const logoOptions = [
    { label: "Logo A", src: "logo-a.jpg" },
    { label: "Logo B", src: "logo-b.jpg" },
    { label: "Logo C", src: "logo-c.jpg" },
    { label: "Logo D", src: "logo-d.jpg" },
    { label: "Logo E", src: "logo-e.png" },
    { label: "Logo F", src: "logo-f.jpg" },
  ];

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    const handleLogoVote = async () => {
      if (!selectedLogo) return alert("Prosím vyber logo.");
      if (hasVotedLogo) return alert("Už si hlasoval za logo.");

      try {
        await updateDoc(doc(db, "hlasovanieusers", userId), {
          logoVote: selectedLogo,
          hasVotedLogo: true,
        });

        alert("Hlas za logo zaznamenaný!");
        setHasVotedLogo(true);
      } catch (error) {
        console.error("Error voting logo:", error);
      }
    };

    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, "hlasovanieusers", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.name);
        setHasVoted(userData.hasVoted);
        setHasVotedLogo(userData.hasVotedLogo || false);
        setCanVoteProject(userData.canVoteProject ?? true);
      } else {
        localStorage.removeItem("userId");
        navigate("/");
      }
    };

    fetchUser();
  }, [userId, navigate]);

  const handleVote = async () => {
    if (!selectedVote) return alert("Prosím najprv hlasuj za 1 projekt.");
    if (hasVoted) return alert("Už si hlasoval.");

    try {
      await updateDoc(doc(db, "hlasovanieusers", userId), {
        vote: selectedVote,
        hasVoted: true, // Prevents multiple votes
      });

      alert("Hlas zaznamenaný!");
      setHasVoted(true);
    } catch (error) {
      console.error("Error voting:", error);
    }
  };
  const handleLogoVote = async () => {
    if (!selectedLogo) return alert("Prosím vyber logo.");
    if (hasVotedLogo) return alert("Už si hlasoval za logo.");

    try {
      await updateDoc(doc(db, "hlasovanieusers", userId), {
        logoVote: selectedLogo,
        hasVotedLogo: true,
      });

      alert("Hlas za logo zaznamenaný!");
      setHasVotedLogo(true);
    } catch (error) {
      console.error("Error voting logo:", error);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/"); // Redirect to registration form
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
    <>
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
              to="hlasovanie-section"
              smooth={true}
              duration={800}
              className="block md:inline-block p-4 md:p-1 text-gray-900 font-bold cursor-pointer hover:text-blue-500"
            >
              Projekty
            </ScrollLink>
            <ScrollLink
              to="logo-voting-section"
              smooth={true}
              duration={800}
              className="block md:inline-block p-4 md:p-1 text-gray-900 font-bold cursor-pointer hover:text-blue-500"
            >
              Logo
            </ScrollLink>
            <button
              onClick={handleLogout}
              className="block md:inline-block p-4 md:p-1 text-gray-900 font-bold cursor-pointer hover:text-blue-500"
            >
              Odhlásiť sa
            </button>
          </div>
        </nav>

        {canVoteProject ? (
          <section
            id="hlasovanie-section"
            className="min-h-screen flex flex-col items-center justify-center p-6 mt-4 "
          >
            <h2 className="text-4xl font-bold text-blue-600">Projekty</h2>

            {hasVoted ? (
              <p className="text-lg text-green-500">Už si hlasoval.</p>
            ) : (
              <>
                <p className="text-lg">Označ projekt a stlač hlasuj:</p>
                <div className="mt-4 flex flex-col gap-4">
                  <button
                    onClick={() => setSelectedVote("V škole ako doma")}
                    className={`p-2 w-full rounded-md ${
                      selectedVote === "V škole ako doma"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    V škole ako doma
                  </button>
                  <button
                    onClick={() => setSelectedVote("Olympijsky den")}
                    className={`p-2 w-full rounded-md ${
                      selectedVote === "Olympijsky den"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    Olympijský deň
                  </button>
                  <button
                    onClick={() => setSelectedVote("Tatranský tanier bezpečia")}
                    className={`p-2 w-full rounded-md ${
                      selectedVote === "Tatranský tanier bezpečia"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    Tatranský tanier bezpečia
                  </button>
                  <button
                    onClick={() => setSelectedVote("Parla Zone")}
                    className={`p-2 w-full rounded-md ${
                      selectedVote === "Parla Zone"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    Parla Zone
                  </button>
                  <button
                    onClick={() => setSelectedVote("Break Time Boost")}
                    className={`p-2 w-full rounded-md ${
                      selectedVote === "Break Time Boost"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    Break Time Boost
                  </button>
                </div>

                <button
                  onClick={handleVote}
                  disabled={hasVoted}
                  className={`w-full sm:w-auto px-4 py-2 rounded-md mt-4
              text-white font-semibold transition 
              ${
                hasVoted
                  ? "bg-gray-400 cursor-not-allowed" // Disabled state
                  : "bg-green-500 hover:bg-green-600 active:bg-green-700"
              } 
              lg:px-6 lg:py-3 lg:text-lg`}
                >
                  Hlasuj
                </button>
              </>
            )}
          </section>
        ) : (
          <section
            id="hlasovanie-section"
            className="min-h-screen flex flex-col items-center justify-center p-6 mt-4 "
          >
            <h2 className="text-4xl font-bold text-blue-600">Projekty</h2>
            <p className="text-lg text-red-500 mt-4">
              Tvoje konto nemá oprávnenie hlasovať za projekt.
            </p>
          </section>
        )}
        <section
          id="logo-voting-section"
          className="min-h-screen flex flex-col items-center justify-center p-6 mt-4"
        >
          <h2 className="text-4xl font-bold text-blue-600">Logo</h2>
          {hasVotedLogo ? (
            <p className="text-lg text-green-500">Už si hlasoval za logo.</p>
          ) : (
            <>
              <p className="text-lg">Vyber logo a stlač hlasuj:</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {logoOptions.map((option) => (
                  <div
                    key={option.label}
                    className={`cursor-pointer border-4 rounded-xl overflow-hidden transition-all duration-300 ${
                      selectedLogo === option.label
                        ? "border-blue-600 shadow-lg"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedLogo(option.label)}
                  >
                    <img
                      src={option.src}
                      alt={option.label}
                      className="w-full h-48 object-contain bg-white"
                    />
                    <div className="text-center font-semibold py-2 bg-gray-100">
                      {option.label}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleLogoVote}
                disabled={hasVotedLogo}
                className={`w-full sm:w-auto px-4 py-2 rounded-md mt-4
        text-white font-semibold transition 
        ${
          hasVotedLogo
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600 active:bg-green-700"
        } 
        lg:px-6 lg:py-3 lg:text-lg`}
              >
                Hlasuj za logo
              </button>
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default Dashboard;
