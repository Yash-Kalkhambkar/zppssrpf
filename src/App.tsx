import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { Home } from './pages/Home';
import { Achievements } from './pages/Achievements';
import { Facilities } from './pages/Facilities';
import { Contact } from './pages/Contact';
import { Admission } from './pages/Admission';
import { Admin } from './pages/Admin';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('home');

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  return (
    <AuthProvider>
      <DataProvider>
        <div className="bg-surface text-on-surface font-body-md antialiased overflow-x-hidden min-h-screen flex flex-col">
          <Header currentRoute={currentRoute} navigate={navigate} />
          <main className="flex-grow flex flex-col pb-20 md:pb-0">
            {currentRoute === 'home' && <Home navigate={navigate} />}
            {currentRoute === 'achievements' && <Achievements />}
            {currentRoute === 'facilities' && <Facilities />}
            {currentRoute === 'contact' && <Contact navigate={navigate} />}
            {currentRoute === 'admission' && <Admission />}
            {currentRoute === 'admin' && <Admin navigate={navigate} />}
            {/* Render Home as fallback if route doesn't match */}
            {currentRoute !== 'home' && currentRoute !== 'achievements' && currentRoute !== 'facilities' && currentRoute !== 'contact' && currentRoute !== 'admission' && currentRoute !== 'admin' && <Home navigate={navigate} />}
          </main>
          {currentRoute !== 'admin' && <MobileNav currentRoute={currentRoute} navigate={navigate} />}
          <Footer navigate={navigate} />
        </div>
      </DataProvider>
    </AuthProvider>
  );
}
