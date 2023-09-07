import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="flex justify-center bg-blue-950 h-16 py-3 items-center">
      <Link to="/" className="text-white hover:text-slate-700">
        Home
      </Link>
    </nav>
  );
}

export default Header;
