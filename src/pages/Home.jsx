import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Vitajte na registrácií pre Deň PSK</h1>
      <p className="mt-4">
        Prosím registrujte sa a potom sa prihláste na voľné časové okno
      </p>
      <div className="mt-6 flex gap-4">
        <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
          Prihlás sa
        </Link>
        <Link
          to="/register"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Registruj sa
        </Link>
      </div>
    </div>
  );
};

export default Home;
