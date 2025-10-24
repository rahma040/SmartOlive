import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Droplets, Sparkles, Lightbulb } from 'lucide-react';

export function IrrigationAdvisor() {
  const { user } = useAuth();
  const [farmSize, setFarmSize] = useState('');
  const [soilType, setSoilType] = useState('loam');
  const [temperature, setTemperature] = useState('');
  const [rainfall, setRainfall] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);

  const generateRecommendation = (size: number, soil: string, temp: number, rain: number) => {
    let waterFrequency = 3;
    let duration = 2;

    if (soil === 'sandy') {
      waterFrequency = 2;
      duration = 1.5;
    } else if (soil === 'clay') {
      waterFrequency = 5;
      duration = 3;
    }

    if (temp > 30) {
      waterFrequency -= 1;
      duration += 0.5;
    }

    if (rain > 50) {
      waterFrequency += 2;
    } else if (rain < 20) {
      waterFrequency -= 1;
    }

    const totalWater = (size * duration * 1000).toFixed(0);

    return `For your ${size} hectare farm with ${soil} soil:

• Water every ${Math.max(1, waterFrequency)} days
• Duration: ${duration} hours per session
• Estimated water usage: ${totalWater} liters per session
• Best time: Early morning (6-8 AM) or evening (6-8 PM)
• Method: Drip irrigation recommended for efficiency

Consider weather conditions and adjust accordingly. In hot summer months (${temp}°C), increase frequency by 20%.`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const size = parseFloat(farmSize);
    const temp = parseFloat(temperature);
    const rain = parseFloat(rainfall);

    const rec = generateRecommendation(size, soilType, temp, rain);
    setRecommendation(rec);

    if (user) {
      await supabase.from('irrigation_history').insert({
        user_id: user.id,
        farm_size: size,
        soil_type: soilType,
        temperature: temp,
        rainfall: rain,
        recommendation: rec,
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full mb-4">
            <Droplets className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Irrigation Advisor</h1>
          <p className="text-gray-600">Get AI-powered water management recommendations</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="farmSize" className="block text-sm font-medium text-gray-700 mb-2">
                  Farm Size (hectares)
                </label>
                <input
                  id="farmSize"
                  type="number"
                  step="0.1"
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="5.0"
                />
              </div>

              <div>
                <label htmlFor="soilType" className="block text-sm font-medium text-gray-700 mb-2">
                  Soil Type
                </label>
                <select
                  id="soilType"
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="sandy">Sandy</option>
                  <option value="loam">Loam</option>
                  <option value="clay">Clay</option>
                </select>
              </div>

              <div>
                <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-2">
                  Average Temperature (°C)
                </label>
                <input
                  id="temperature"
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="28"
                />
              </div>

              <div>
                <label htmlFor="rainfall" className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Rainfall (mm)
                </label>
                <input
                  id="rainfall"
                  type="number"
                  value={rainfall}
                  onChange={(e) => setRainfall(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {loading ? 'Analyzing...' : 'Get AI Recommendation'}
            </button>
          </form>
        </div>

        {recommendation && (
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-xl p-8 mb-6 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Your Irrigation Plan
            </h2>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <pre className="whitespace-pre-wrap font-sans leading-relaxed">{recommendation}</pre>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6" />
            <h3 className="text-xl font-bold">Water-Saving Tips</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-emerald-200">•</span>
              <span>Drip irrigation can save up to 30% water compared to traditional methods</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-200">•</span>
              <span>Mulch around trees to reduce evaporation and maintain soil moisture</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-200">•</span>
              <span>Install soil moisture sensors for precise irrigation timing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-200">•</span>
              <span>Water during cooler hours to minimize evaporation losses</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
