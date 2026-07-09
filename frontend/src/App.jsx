import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import TextbookDetail from './pages/TextbookDetail';
import CreateListingPage from './pages/CreateListing';
import MessagesPage from './pages/MessagesPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/listings/:listingId" element={<TextbookDetail />} />
              <Route path="/create" element={<CreateListingPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/chat/:partnerId" element={<ChatPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
