import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">HKTextbook</Link>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-blue-600 text-sm">Login</Link>
        </div>
      </div>
    </nav>
  );
}
