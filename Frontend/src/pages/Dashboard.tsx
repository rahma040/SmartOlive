import { useAuth } from '../contexts/AuthContext';
import { Link } from '../components/Router';
import { Droplets, Sprout, Bug, History, Lightbulb } from 'lucide-react';

export function Dashboard() {
  const { profile } = useAuth();

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {profile?.name}!
          </h1>
          <p className="text-gray-600">
            {profile?.farm_name ? `Managing ${profile.farm_name}` : 'Your Smart Agriculture Dashboard'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Irrigation Status</h3>
              <Droplets className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-gray-600 text-sm">Monitor water needs and optimize irrigation schedules</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Soil Health</h3>
              <Sprout className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-gray-600 text-sm">Track fertility and plan fertilization cycles</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Pest Protection</h3>
              <Bug className="w-8 h-8 text-amber-500" />
            </div>
            <p className="text-gray-600 text-sm">Early detection and eco-friendly prevention</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>Quick Actions</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to="/irrigation"
              className="group bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-md"
            >
              <Droplets className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Irrigation Advisor</h3>
              <p className="text-blue-100 text-sm">Get water management recommendations</p>
            </Link>

            <Link
              to="/fertilization"
              className="group bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-md"
            >
              <Sprout className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Fertilization Plan</h3>
              <p className="text-green-100 text-sm">Optimize soil nutrients and growth</p>
            </Link>

            <Link
              to="/pest"
              className="group bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all transform hover:scale-105 shadow-md"
            >
              <Bug className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Pest Detector</h3>
              <p className="text-amber-100 text-sm">Identify and prevent pest issues</p>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Eco Tips</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-emerald-200 text-xl">•</span>
                <span>Use drip irrigation to save up to 30% water</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-200 text-xl">•</span>
                <span>Compost annually to improve soil structure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-200 text-xl">•</span>
                <span>Prune trees in late winter for better yields</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-200 text-xl">•</span>
                <span>Monitor weather patterns for irrigation timing</span>
              </li>
            </ul>
          </div>

          <Link
            to="/history"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1 group"
          >
            <div className="flex items-center gap-3 mb-4">
              <History className="w-8 h-8 text-gray-700 group-hover:text-green-600 transition-colors" />
              <h2 className="text-2xl font-bold text-gray-800">Analysis History</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Review your past irrigation plans, fertilization schedules, and pest detections
            </p>
            <div className="text-green-600 font-medium group-hover:underline">
              View All History →
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
