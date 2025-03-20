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
} from "firebase/firestore";

const Dashboard = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [maxCapacity, setMaxCapacity] = useState(5);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <button onClick={handleLogout} className="bg-red-500 text-white p-2 mt-4">
        Logout
      </button>

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
          <button onClick={addTimeSlot} className="bg-green-500 text-white p-2">
            Nový termín
          </button>
        </div>
      )}

      <h3 className="text-xl font-bold mt-6">Termíny</h3>
      {timeSlots.map((slot) => (
        <div key={slot.id} className="border p-2 m-2">
          <p>
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
  );
};

export default Dashboard;
