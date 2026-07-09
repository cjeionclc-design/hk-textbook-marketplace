import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

function HomePage() {
  return <div className="text-center py-20 text-2xl">HK Textbook Marketplace</div>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
