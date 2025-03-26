import { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  getDoc,
  setDoc,
} from "firebase/firestore";
import ParticlesBg from "particles-bg";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { Menu, X } from "lucide-react";

const Dashboard = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [maxCapacity, setMaxCapacity] = useState(5);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [voteCounts, setVoteCounts] = useState({});
  const [hasVoted, setHasVoted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const options = [
    "Projekt 1",
    "Projekt 2",
    "Projekt 3",
    "Projekt 4",
    "Projekt 5",
  ];

  useEffect(() => {
    if (auth.currentUser) {
      checkUserVote(auth.currentUser.uid);
    }
    fetchVoteCounts();
  }, []);
  // Check if user has already voted
  const checkUserVote = async (userId) => {
    const userVoteRef = doc(db, "votes", userId);
    const userVoteSnap = await getDoc(userVoteRef);
    if (userVoteSnap.exists()) {
      setUserVote(userVoteSnap.data().option);
      setHasVoted(true);
    }
  };

  // Fetch vote counts
  const fetchVoteCounts = async () => {
    const votesRef = doc(db, "voteCounts", "results");
    const votesSnap = await getDoc(votesRef);
    if (votesSnap.exists()) {
      setVoteCounts(votesSnap.data());
      setShowResults(true);
    } else {
      setVoteCounts({
        "Projekt 1": 0,
        "Projekt 2": 0,
        "Projekt 3": 0,
        "Projekt 4": 0,
        "Projekt 5": 0,
      });
      // Show results only after clicking the button
    }
  };

  // Handle voting
  const handleVote = async () => {
    const user = auth.currentUser; // Get current user
    if (!user) {
      alert("You must be logged in to vote.");
      return;
    }
    if (!auth.currentUser) return alert("You need to be logged in to vote.");
    if (hasVoted) return alert("You have already voted.");

    const userId = auth.currentUser.uid;
    const userVoteRef = doc(db, "votes", userId);
    await setDoc(userVoteRef, { option: selectedOption, email: user.email });

    const votesRef = doc(db, "voteCounts", "results");
    const votesSnap = await getDoc(votesRef);
    let updatedCounts = votesSnap.exists() ? votesSnap.data() : {};

    updatedCounts[selectedOption] = (updatedCounts[selectedOption] || 0) + 1;

    await setDoc(votesRef, updatedCounts);
    setVoteCounts(updatedCounts);
    setUserVote(selectedOption);
    setHasVoted(true);
  };

  const fetchTimeSlots = async () => {
    const snapshot = await getDocs(collection(db, "timeSlots"));
    setTimeSlots(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setIsAdmin(userSnap.data().role === "admin");
        }
        setCurrentUser(auth.currentUser.email);
      }
    };

    const fetchTimeSlots = async () => {
      const snapshot = await getDocs(collection(db, "timeSlots"));
      setTimeSlots(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchUserRole();
    fetchTimeSlots();
  }, []);

  const addTimeSlot = async () => {
    await addDoc(collection(db, "timeSlots"), {
      date,
      time,
      maxCapacity,
      bookedUsers: [],
    });
    setDate("");
    setTime("");
    setMaxCapacity(5);
    await fetchTimeSlots(); // Refresh list
  };

  const bookTimeSlot = async (slotId) => {
    if (!currentUser) return alert("You need to be logged in to book a slot.");

    // Fetch all time slots to check if the user has already booked one
    const snapshot = await getDocs(collection(db, "timeSlots"));
    const userAlreadyBooked = snapshot.docs.some((doc) => {
      const data = doc.data();
      return (
        Array.isArray(data.bookedUsers) &&
        data.bookedUsers.includes(currentUser)
      );
    });

    if (userAlreadyBooked) {
      alert("Môžte sa prihlásiť iba na jeden termín.");
      return;
    }

    // Proceed with booking the selected slot
    const slotRef = doc(db, "timeSlots", slotId);
    const slotSnap = await getDoc(slotRef);

    if (slotSnap.exists()) {
      const slotData = slotSnap.data();

      if (
        Array.isArray(slotData.bookedUsers) &&
        slotData.bookedUsers.includes(currentUser)
      ) {
        alert("Môžte sa prihlásiť iba na jeden termín.");
        return;
      }

      if (slotData.bookedUsers.length >= slotData.maxCapacity) {
        alert("Tento slot je plný.");
        return;
      }

      await updateDoc(slotRef, {
        bookedUsers: arrayUnion(currentUser),
      });

      // Update UI
      setTimeSlots((prevSlots) =>
        prevSlots.map((slot) =>
          slot.id === slotId
            ? { ...slot, bookedUsers: [...slot.bookedUsers, currentUser] }
            : slot
        )
      );
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
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
              onClick={() => setMenuOpen(false)}
              to="prehliadka-section"
              smooth={true}
              duration={800}
              className="block md:inline-block p-4 md:p-1 text-gray-900 font-bold cursor-pointer hover:text-blue-500"
            >
              Prehliadka
            </ScrollLink>
            <ScrollLink
              onClick={() => setMenuOpen(false)}
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
        <ParticlesBg type="circle" bg={true} config={config} />
        <section
          id="prehliadka-section"
          className="flex flex-col items-center justify-center min-h-screen p-6"
        >
          <h3 className="text-2xl font-bold text-blue-600 md:mt-24 mt-20">
            Termíny
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-start min-h-screen p-3 ">
            {/* Your content */}
            <div className="flex flex-col">
              {isAdmin && (
                <div className="mt-0">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border p-2"
                  />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="border p-2"
                  />
                  <input
                    type="number"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    className="border p-2"
                  />
                  <button
                    onClick={addTimeSlot}
                    className="bg-green-500 text-white p-2"
                  >
                    Nový termín
                  </button>
                </div>
              )}

              {timeSlots.map((slot) => {
                const isBookedByUser = slot.bookedUsers.includes(currentUser);

                return (
                  <div key={slot.id} className="border p-2 m-2">
                    <p className="text-white">
                      {slot.date} v čase o {slot.time} (Kapacita:{" "}
                      {slot.bookedUsers.length}/{slot.maxCapacity})
                    </p>
                    {!isAdmin && (
                      <button
                        onClick={() => bookTimeSlot(slot.id)}
                        className={`p-2 mt-2 rounded-md ${
                          isBookedByUser
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-700"
                        } text-white`}
                        disabled={isBookedByUser}
                      >
                        {isBookedByUser ? "Rezervované" : "Rezervuj"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
      <section
        id="hlasovanie-section"
        className="min-h-screen flex flex-col items-center justify-center p-6 bg-white-500"
      >
        <div className="flex flex-col items-center justify-center min-h-screen p-3 ">
          <h2 className="text-4xl font-bold text-blue-600">Hlasovanie</h2>
          {hasVoted ? (
            <p className="text-xl text-black mt-4">
              Hlasoval si za: {userVote}
            </p>
          ) : (
            <>
              <p className="text-lg mt-4 text-black">Vyber jednu z možností:</p>
              <div className="flex flex-wrap gap-4 mt-4">
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedOption(option)}
                    className={`px-6 py-3 rounded-md ${
                      selectedOption === option
                        ? "bg-blue-600 text-white"
                        : "bg-sky-400 text-white"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button
                onClick={handleVote}
                disabled={!selectedOption}
                className="mt-4 bg-green-500 text-white px-6 py-3 rounded-md"
              >
                Hlasuj
              </button>
            </>
          )}
          {/* Show Results Button for Admin */}
          {isAdmin && !showResults && (
            <button
              onClick={fetchVoteCounts}
              className="mt-6 bg-red-500 text-white px-6 py-3 rounded-md"
            >
              Zobraziť Výsledky
            </button>
          )}

          {/* Display results only when admin clicks the button */}
          {isAdmin && showResults && (
            <>
              <h3 className="text-2xl font-bold mt-6 text-blue-600">
                Výsledky
              </h3>
              <ul className="mt-4">
                {Object.entries(voteCounts).map(([option, count]) => (
                  <li key={option} className="text-lg text-black">
                    {option}: {count} hlasov
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Dashboard;
