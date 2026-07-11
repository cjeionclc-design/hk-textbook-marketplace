import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen" style={{background:'#f8f7f4'}}>
      <Navbar />
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="animate-[fadeIn_0.4s_ease-out]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
