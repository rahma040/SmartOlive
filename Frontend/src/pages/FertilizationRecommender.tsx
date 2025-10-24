import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Sprout, Sparkles, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export function FertilizationRecommender() {
  const { user } = useAuth();
  const [treeAge, setTreeAge] = useState('');
  const [soilFertility, setSoilFertility] = useState('balanced');
  const [lastFertilization, setLastFertilization] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateRecommendation = (age: number, fertility: string, daysSince: number) => {
    let fertilizerType = 'Organic Compost';
    let amount = '150';
    let schedule = 'Apply once in early spring';
    let status = 'balanced';

    if (fertility === 'low') {
      fertilizerType = 'NPK 10-10-10 + Organic Compost';
      amount = '200';
      schedule = 'Apply in early spring and mid-summer';
      status = 'low';
    } else if (fertility === 'high' && daysSince < 90) {
      fertilizerType = 'None (risk of over-fertilization)';
      amount = '0';
      schedule = 'Wait at least 3 months before next application';
      status = 'high';
    }

    if (age < 5) {
      amount = (parseFloat(amount) * 0.7).toFixed(0);
      schedule += ' (reduced for young trees)';
    } else if (age > 20) {
      amount = (parseFloat(amount) * 1.2).toFixed(0);
      schedule += ' (increased for mature trees)';
    }

    return {
      fertilizerType,
      amount: `${amount} kg/ha`,
      schedule,
      status,
      details: `Based on ${age}-year-old trees with ${fertility} fertility, last fertilized ${daysSince} days ago.`,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const age = parseInt(treeAge);
    const days = parseInt(lastFertilization);

    const rec = generateRecommendation(age, soilFertility, days);
    setResult(rec);

    if (user) {
      await supabase.from('fertilization_history').insert({
        user_id: user.id,
        tree_age: age,
        soil_fertility: soilFertility,
        last_fertilization_days: days,
        fertilizer_type: rec.fertilizerType,
        amount: rec.amount,
        schedule: rec.schedule,
        status: rec.status,
      });
    }

    setLoading(false);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'low':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
          icon: <AlertTriangle className="w-8 h-8 text-yellow-500" />,
          label: 'Low Fertility - Action Needed',
        };
      case 'high':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          icon: <AlertCircle className="w-8 h-8 text-red-500" />,
          label: 'Over-Fertilization Risk',
        };
      default:
        return {
          bg: 'bg-green-50 border-green-200',
          text: 'text-green-800',
          icon: <CheckCircle className="w-8 h-8 text-green-500" />,
          label: 'Balanced Soil - Maintain',
        };
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full mb-4">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Fertilization Recommender</h1>
          <p className="text-gray-600">Optimize soil nutrients for healthy olive trees</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="treeAge" className="block text-sm font-medium text-gray-700 mb-2">
                  Olive Tree Age (years)
                </label>
                <input
                  id="treeAge"
                  type="number"
                  value={treeAge}
                  onChange={(e) => setTreeAge(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="10"
                />
              </div>

              <div>
                <label htmlFor="soilFertility" className="block text-sm font-medium text-gray-700 mb-2">
                  Soil Fertility Level
                </label>
                <select
                  id="soilFertility"
                  value={soilFertility}
                  onChange={(e) => setSoilFertility(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value="low">Low</option>
                  <option value="balanced">Balanced</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label htmlFor="lastFertilization" className="block text-sm font-medium text-gray-700 mb-2">
                  Days Since Last Fertilization
                </label>
                <input
                  id="lastFertilization"
                  type="number"
                  value={lastFertilization}
                  onChange={(e) => setLastFertilization(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="120"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {loading ? 'Analyzing...' : 'Get Fertilization Plan'}
            </button>
          </form>
        </div>

        {result && (
          <>
            <div className={`rounded-2xl shadow-xl p-8 mb-6 border-2 ${getStatusConfig(result.status).bg} animate-fadeIn`}>
              <div className="flex items-center gap-4 mb-6">
                {getStatusConfig(result.status).icon}
                <div>
                  <h2 className={`text-2xl font-bold ${getStatusConfig(result.status).text}`}>
                    {getStatusConfig(result.status).label}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">{result.details}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-2">Fertilizer Type</h3>
                  <p className="text-gray-900">{result.fertilizerType}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-2">Amount</h3>
                  <p className="text-gray-900 text-xl font-bold">{result.amount}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-2">Schedule</h3>
                  <p className="text-gray-900">{result.schedule}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Application Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-teal-200">•</span>
                  <span>Apply fertilizer when soil is moist for better nutrient absorption</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-200">•</span>
                  <span>Spread evenly around the tree canopy, avoiding direct contact with the trunk</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-200">•</span>
                  <span>Water thoroughly after application to help nutrients reach root zone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-200">•</span>
                  <span>Consider soil testing annually for precise nutrient management</span>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
