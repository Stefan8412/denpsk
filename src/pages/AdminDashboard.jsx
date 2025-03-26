import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ScrollLink } from "react-scroll";
import { Menu, X } from "lucide-react";

const AdminDashboard = () => {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
      return;
    }

    const fetchResults = async () => {
      const usersCollection = await getDocs(collection(db, "hlasovanieusers"));
      const votes = usersCollection.docs
        .map((doc) => doc.data())
        .filter((user) => user.vote); // Filter users who have voted

      const voteCounts = votes.reduce((acc, user) => {
        acc[user.vote] = (acc[user.vote] || 0) + 1;
        return acc;
      }, {});

      setResults(voteCounts);
    };

    fetchResults();
  }, [navigate, role]);
  const handleLogout = async () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/"); // Redirect to registration form
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
        id="home-section"
        className="flex flex-col items-center justify-center min-h-screen p-6"
      >
        <h3 className="text-xl font-semibold">Výsledky:</h3>
        <ul className="mt-4">
          {Object.entries(results).map(([option, count]) => (
            <li key={option} className="text-lg">
              {option}: {count} hlasov
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;
