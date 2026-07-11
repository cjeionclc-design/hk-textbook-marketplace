import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-dots flex flex-col">
      <Navbar />
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex-1 w-full">
        <div className="animate-[fadeIn_0.4s_ease-out]">
          <Outlet />
        </div>
      </main>
      <footer className="text-center py-6 text-xs text-gray-400 font-medium space-x-4">
        <Link to="/terms" className="hover:text-gray-600">服务条款</Link>
        <Link to="/privacy" className="hover:text-gray-600">隐私政策</Link>
        <span>© 2026 HKTextbook</span>
      </footer>
    </div>
  );
}
