import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="flex justify-around bg-blue-950 h-16 py-3 items-center">
      <Link 
        to="/" 
        className="text-white hover:text-blue-300">
        Home
      </Link>
      <Link 
        to="/pools" 
        className="text-white hover:text-blue-300">
        Find Pools
      </Link>
      <Link 
        to="/token-balances" 
        className="text-white hover:text-blue-300">
        Token Balances
      </Link>
    </nav>
  );
}

export default Header;
