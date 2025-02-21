import { Link } from "react-router-dom";

const Navbar = () => {
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">Antivirus Scanner</Link>
      <button
        onClick={toggleTheme}
        className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
      >
        Toggle Theme
      </button>
    </nav>
  );
};

export default Navbar;
