import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Bug, Sparkles, Upload, CheckCircle, AlertTriangle, Camera } from 'lucide-react';

export function PestDetector() {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // --- Start Camera ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStreaming(true);
    } catch (err) {
      console.error(err);
      alert('Unable to access camera.');
    }
  };

  // --- Capture Image ---
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(dataUrl);
    setImagePreview(dataUrl);

    // Stop camera
    const tracks = video.srcObject as MediaStream;
    tracks.getTracks().forEach(track => track.stop());
    setStreaming(false);
  };

  // --- Detect Pest / Disease ---
  const detectPest = (symptoms: string) => {
    const symptomsLower = symptoms.toLowerCase();
    let healthStatus = 'Healthy';
    let tips =
      'Your olive trees appear healthy! Continue regular monitoring.';

    if (symptomsLower.includes('spot') || symptomsLower.includes('black') || symptomsLower.includes('brown')) {
      healthStatus = 'Pest Risk Detected - Olive Leaf Spot';
      tips = `Eco-friendly Prevention: • Remove and destroy affected leaves immediately • Improve air circulation by pruning dense branches • Apply copper-based organic fungicide in early spring • Avoid overhead watering to reduce leaf wetness • Maintain good sanitation around trees`;
    } else if (symptomsLower.includes('curl') || symptomsLower.includes('yellow')) {
      healthStatus = 'Pest Risk Detected - Olive Fly';
      tips = `Eco-friendly Prevention: • Use yellow sticky traps to monitor and catch flies • Apply kaolin clay spray as a protective barrier • Remove fallen olives promptly to break pest cycle • Encourage natural predators like wasps • Consider pheromone traps during peak season`;
    } else if (symptomsLower.includes('scale') || symptomsLower.includes('sticky')) {
      healthStatus = 'Pest Risk Detected - Scale Insects';
      tips = `Eco-friendly Prevention: • Spray with neem oil solution (2-3 applications) • Release ladybugs as natural predators • Prune heavily infested branches • Apply horticultural oil during dormant season • Monitor regularly for early detection`;
    } else if (symptomsLower.includes('wilt') || symptomsLower.includes('dry')) {
      healthStatus = 'Possible Disease - Verticillium Wilt';
      tips = `Management Strategies: • Remove severely affected trees to prevent spread • Avoid planting in infected soil • Improve soil drainage • Use resistant olive varieties for new plantings • Maintain tree health through proper care`;
    }

    return { healthStatus, tips };
  };

  // --- Handle Image Upload ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // --- Submit Analysis ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1️⃣ Prepare image file
    let imageFile: File | null = null;
    if (capturedImage) {
      const res = await fetch(capturedImage);
      const blob = await res.blob();
      imageFile = new File([blob], 'leaf.jpg', { type: 'image/jpeg' });
    }

    // 2️⃣ Simulate symptom analysis (replace with API call if using AI)
    const detection = detectPest(symptoms);
    setResult(detection);

    // 3️⃣ Save to Supabase history
    if (user) {
      await supabase.from('pest_history').insert({
        user_id: user.id,
        symptoms,
        health_status: detection.healthStatus,
        prevention_tips: detection.tips,
      });
    }

    setLoading(false);
  };

  const isHealthy = result?.healthStatus === 'Healthy';

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 text-white rounded-full mb-4">
            <Bug className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Pest Detector</h1>
          <p className="text-gray-600">AI-powered pest identification and prevention</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Camera Capture */}
            {!streaming && (
              <button
                type="button"
                onClick={startCamera}
                className="w-full mb-4 flex items-center justify-center gap-2 bg-amber-500 text-white py-3 rounded-lg hover:bg-amber-600 transition"
              >
                <Camera className="w-5 h-5" /> Open Camera
              </button>
            )}

            {streaming && (
              <div className="mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg border mb-2"
                />
                <button
                  type="button"
                  onClick={captureImage}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Capture Photo
                </button>
              </div>
            )}

            {/* Image Preview / Upload */}
            <div>
              <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Leaf Image (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-amber-400 transition-colors cursor-pointer">
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="imageUpload" className="cursor-pointer">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-gray-600">Click to upload an image</span>
                      <span className="text-gray-400 text-sm mt-1">PNG, JPG up to 10MB</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Symptoms Input */}
            <div>
              <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
                Describe Symptoms or Observations
              </label>
              <textarea
                id="symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                placeholder="E.g., Brown spots on leaves, yellowing edges, curled leaves, sticky residue..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" /> {loading ? 'Analyzing...' : 'Analyze Plant Health'}
            </button>
          </form>
        </div>

        {/* Canvas to hold captured image for preview (hidden) */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {/* Result */}
        {result && (
          <div className={`rounded-2xl shadow-xl p-8 mb-6 border-2 animate-fadeIn ${isHealthy ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-4 mb-6">
              {isHealthy ? <CheckCircle className="w-12 h-12 text-green-500" /> : <AlertTriangle className="w-12 h-12 text-red-500" />}
              <div>
                <h2 className={`text-2xl font-bold ${isHealthy ? 'text-green-800' : 'text-red-800'}`}>{result.healthStatus}</h2>
                <p className="text-gray-600 text-sm mt-1">{isHealthy ? 'No immediate action required' : 'Immediate attention recommended'}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">{isHealthy ? 'Maintenance Tips' : 'Prevention & Treatment'}</h3>
              <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">{result.tips}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
