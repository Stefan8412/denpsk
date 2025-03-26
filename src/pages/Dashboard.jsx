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

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, "hlasovanieusers", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.name);
        setHasVoted(userData.hasVoted);
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
              Hlasovanie
            </ScrollLink>
            <button
              onClick={handleLogout}
              className="block md:inline-block p-4 md:p-1 text-gray-900 font-bold cursor-pointer hover:text-blue-500"
            >
              Odhlásiť sa
            </button>
          </div>
        </nav>

        <section
          id="hlasovanie-section"
          className="min-h-screen flex flex-col items-center justify-center p-6 mt-4 "
        >
          <h2 className="text-4xl font-bold text-blue-600">Hlasovanie</h2>
          {hasVoted ? (
            <p className="text-lg text-green-500">Už si hlasoval.</p>
          ) : (
            <>
              <p className="text-lg">Označ projekt a stlač hlasuj:</p>
              <div className="mt-4 flex flex-col gap-4">
                <button
                  onClick={() => setSelectedVote("Projekt 1")}
                  className={`p-2 w-full rounded-md ${
                    selectedVote === "Projekt 1"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  Projekt 1
                </button>
                <button
                  onClick={() => setSelectedVote("Projekt 2")}
                  className={`p-2 w-full rounded-md ${
                    selectedVote === "Projekt 2"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  Projekt 2
                </button>
                <button
                  onClick={() => setSelectedVote("Projekt 3")}
                  className={`p-2 w-full rounded-md ${
                    selectedVote === "Projekt 3"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  Projekt 3
                </button>
                <button
                  onClick={() => setSelectedVote("Projekt 4")}
                  className={`p-2 w-full rounded-md ${
                    selectedVote === "Projekt 4"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  Projekt 4
                </button>
                <button
                  onClick={() => setSelectedVote("Projekt 5")}
                  className={`p-2 w-full rounded-md ${
                    selectedVote === "Projekt 5"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  Projekt 5
                </button>
              </div>

              <button
                onClick={handleVote}
                disabled={hasVoted}
                className="w-full bg-green-500 text-white p-2 rounded-md mt-4"
              >
                Hlasuj
              </button>
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default Dashboard;
