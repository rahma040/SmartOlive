import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { History as HistoryIcon, Droplets, Sprout, Bug, Calendar } from 'lucide-react';

export function History() {
  const { user } = useAuth();
  const [irrigationHistory, setIrrigationHistory] = useState<any[]>([]);
  const [fertilizationHistory, setFertilizationHistory] = useState<any[]>([]);
  const [pestHistory, setPestHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;

    const [irrigation, fertilization, pest] = await Promise.all([
      supabase
        .from('irrigation_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('fertilization_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('pest_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    setIrrigationHistory(irrigation.data || []);
    setFertilizationHistory(fertilization.data || []);
    setPestHistory(pest.data || []);
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 text-white rounded-full mb-4">
            <HistoryIcon className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Analysis History</h1>
          <p className="text-gray-600">Review your past agricultural insights</p>
        </div>

        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Droplets className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-800">Irrigation History</h2>
            </div>
            {irrigationHistory.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
                No irrigation records yet
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {irrigationHistory.map((record) => (
                  <div
                    key={record.id}
                    className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(record.created_at)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Farm Size:</span>
                        <span className="font-semibold ml-2">{record.farm_size} ha</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Soil:</span>
                        <span className="font-semibold ml-2 capitalize">{record.soil_type}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Temp:</span>
                        <span className="font-semibold ml-2">{record.temperature}°C</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Rainfall:</span>
                        <span className="font-semibold ml-2">{record.rainfall} mm</span>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-sm text-gray-700">
                      {record.recommendation.split('\n')[0]}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Sprout className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-800">Fertilization History</h2>
            </div>
            {fertilizationHistory.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
                No fertilization records yet
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {fertilizationHistory.map((record) => (
                  <div
                    key={record.id}
                    className={`bg-white rounded-xl shadow-md p-6 border-l-4 hover:shadow-lg transition-all ${
                      record.status === 'low'
                        ? 'border-yellow-500'
                        : record.status === 'high'
                        ? 'border-red-500'
                        : 'border-green-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(record.created_at)}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          record.status === 'low'
                            ? 'bg-yellow-100 text-yellow-800'
                            : record.status === 'high'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {record.status === 'low'
                          ? 'Low Fertility'
                          : record.status === 'high'
                          ? 'High Risk'
                          : 'Balanced'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Tree Age:</span>
                        <span className="font-semibold ml-2">{record.tree_age} years</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-semibold ml-2">{record.amount}</span>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-sm text-gray-700">
                      <div className="font-semibold mb-1">{record.fertilizer_type}</div>
                      <div className="text-xs text-gray-600">{record.schedule}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Bug className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-gray-800">Pest Detection History</h2>
            </div>
            {pestHistory.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
                No pest detection records yet
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {pestHistory.map((record) => (
                  <div
                    key={record.id}
                    className={`bg-white rounded-xl shadow-md p-6 border-l-4 hover:shadow-lg transition-all ${
                      record.health_status === 'Healthy' ? 'border-green-500' : 'border-red-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(record.created_at)}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          record.health_status === 'Healthy'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {record.health_status === 'Healthy' ? 'Healthy' : 'Risk Detected'}
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="text-sm font-semibold text-gray-700 mb-1">
                        {record.health_status}
                      </div>
                      <div className="text-xs text-gray-600 italic">
                        Symptoms: {record.symptoms.substring(0, 80)}...
                      </div>
                    </div>
                    <div
                      className={`rounded-lg p-3 text-sm ${
                        record.health_status === 'Healthy'
                          ? 'bg-green-50 text-gray-700'
                          : 'bg-amber-50 text-gray-700'
                      }`}
                    >
                      {record.prevention_tips.split('\n')[0]}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
