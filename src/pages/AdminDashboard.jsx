import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ScrollLink } from "react-scroll";
import { Menu, X } from "lucide-react";

const AdminDashboard = () => {
  const [projectResults, setProjectResults] = useState({});
  const [logoResults, setLogoResults] = useState({});

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [menuOpen, setMenuOpen] = useState(false);

  const logoImageMap = {
    "Logo A": "/logo-a.jpg",
    "Logo B": "/logo-b.jpg",
    "Logo C": "/logo-c.jpg",
    "Logo D": "/logo-d.jpgg",
    "Logo E": "/logo-e.png",
    "Logo F": "/logo-f.jpg",
  };

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
      return;
    }

    const fetchResults = async () => {
      const usersCollection = await getDocs(collection(db, "hlasovanieusers"));
      const users = usersCollection.docs.map((doc) => doc.data()); // Filter users who have voted

      const projectVotes = {};
      const logoVotes = {};

      users.forEach((user) => {
        if (user.vote) {
          projectVotes[user.vote] = (projectVotes[user.vote] || 0) + 1;
        }
        if (user.logoVote) {
          logoVotes[user.logoVote] = (logoVotes[user.logoVote] || 0) + 1;
        }
      });

      setProjectResults(projectVotes);
      setLogoResults(logoVotes);
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
        <h3 className="text-2xl font-bold text-blue-600">
          Výsledky hlasovania
        </h3>

        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-2">📊 Projekty:</h4>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(projectResults).map(([option, count]) => (
              <li key={option} className="text-lg">
                {option}: {count} hlasov
              </li>
            ))}
            {Object.keys(projectResults).length === 0 && (
              <li className="text-gray-500">Žiadne hlasy</li>
            )}
          </ul>
        </div>

        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-2">🎨 Logá:</h4>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(logoResults).map(([option, count]) => (
              <li
                key={option}
                className="flex items-center space-x-4 text-lg mb-2"
              >
                {logoImageMap[option] && (
                  <img
                    src={logoImageMap[option]}
                    alt={`Logo ${option}`}
                    className="w-16 h-16 object-contain border rounded"
                  />
                )}
                <span>
                  {option}: {count} hlasov
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
