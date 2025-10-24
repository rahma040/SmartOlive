import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Router, Route } from './components/Router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { IrrigationAdvisor } from './pages/IrrigationAdvisor';
import { FertilizationRecommender } from './pages/FertilizationRecommender';
import { PestDetector } from './pages/PestDetector';
import { Profile } from './pages/Profile';
import { History } from './pages/History';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SmartOlive AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        {user ? (
          <>
            <Route path="/">
              <Dashboard />
            </Route>
            <Route path="/irrigation">
              <IrrigationAdvisor />
            </Route>
            <Route path="/fertilization">
              <FertilizationRecommender />
            </Route>
            <Route path="/pest">
              <PestDetector />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/history">
              <History />
            </Route>
          </>
        ) : (
          <>
            <Route path="/">
              <Login />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
