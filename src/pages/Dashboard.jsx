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
    } else {
      setVoteCounts({
        "Projekt 1": 0,
        "Projekt 2": 0,
        "Projekt 3": 0,
        "Projekt 4": 0,
        "Projekt 5": 0,
      });
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
    if (!currentUser) return;

    const slotRef = doc(db, "timeSlots", slotId);
    const slotSnap = await getDoc(slotRef);

    if (slotSnap.exists()) {
      const slotData = slotSnap.data();

      // Check if user is already booked
      if (slotData.bookedUsers.includes(currentUser)) {
        alert("Uz ste sa prihlásili na tento termín.");
        return;
      }

      // Check if slot is full
      if (slotData.bookedUsers.length >= slotData.maxCapacity) {
        alert("Tento termín je plný");
        return;
      }

      // Update Firestore
      await updateDoc(slotRef, {
        bookedUsers: arrayUnion(currentUser),
      });

      // 🔹 Immediately update the UI
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-30 p-4 flex justify-center items-center z-50 space-x-6">
          <ScrollLink
            to="prehliadka-section"
            smooth={true}
            duration={800}
            className="text-white cursor-pointer hover:text-red-400 transition text-lg font-bold"
          >
            Prehliadka
          </ScrollLink>

          <ScrollLink
            to="hlasovanie-section"
            smooth={true}
            duration={800}
            className="text-white cursor-pointer hover:text-red-400 transition text-lg font-bold"
          >
            Hlasovanie
          </ScrollLink>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Odhlásiť
          </button>
        </nav>
        <ParticlesBg type="circle" bg={true} config={config} />
        <section id="prehliadka-section">
          <div className="flex flex-col items-center justify-center min-h-screen ">
            {isAdmin && (
              <div className="mt-6">
                <h3 className="text-xl font-bold">Admin: Pridaj Termín</h3>
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

            <h3 className="text-xl font-bold mt-6 text-white">Termíny</h3>
            {timeSlots.map((slot) => (
              <div key={slot.id} className="border p-2 m-2">
                <p className="text-white">
                  {slot.date} v čase o {slot.time} (Kapacita:{" "}
                  {slot.bookedUsers.length}/{slot.maxCapacity})
                </p>
                {!isAdmin && (
                  <button
                    onClick={() => bookTimeSlot(slot.id)}
                    className="bg-blue-500 text-white p-2 mt-2"
                    disabled={slot.bookedUsers.length >= slot.maxCapacity}
                  >
                    {slot.bookedUsers.length >= slot.maxCapacity
                      ? "Plný"
                      : "Rezervuj"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
      <section
        id="hlasovanie-section"
        className="h-screen flex flex-col items-center justify-center bg-white"
      >
        <h2 className="text-4xl font-bold text-black">Hlasovanie</h2>
        {hasVoted ? (
          <p className="text-xl text-black mt-4">Hlasoval si za: {userVote}</p>
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
        <h3 className="text-2xl font-bold mt-6 text-black">Výsledky</h3>
        <ul className="mt-4">
          {Object.entries(voteCounts).map(([option, count]) => (
            <li key={option} className="text-lg text-black">
              {option}: {count} hlasov
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Dashboard;
