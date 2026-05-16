import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Settings,
  Shield,
  Wifi
} from 'lucide-react';

interface Detection {
  id: string;
  animal: string;
  confidence: number;
  timestamp: string;
  bbox: { x: number; y: number; width: number; height: number };
}

interface ApiResponse {
  success: boolean;
  detections?: Detection[];
  message?: string;
}
export const LiveDetection: React.FC = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [alertActive, setAlertActive] = useState(false);
  const [sirenEnabled, setSirenEnabled] = useState(true);
  const [currentDetection, setCurrentDetection] = useState<Detection | null>(null);
  const [detectionHistory, setDetectionHistory] = useState<Detection[]>([]);
  const [selectedCamera, setSelectedCamera] = useState('Camera 1');
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // API call to start live detection
  const startDetectionAPI = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/live-detect/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          camera: selectedCamera,
          sirenEnabled
        })
      });
      
      const data: ApiResponse = await response.json();
      if (data.success) {
        console.log('Live detection started successfully');
      }
    } catch (error) {
      console.error('Failed to start live detection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // API call to stop live detection
  const stopDetectionAPI = async () => {
    try {
      const response = await fetch('/api/live-detect/stop', {
        method: 'POST',
      });
      
      const data: ApiResponse = await response.json();
      if (data.success) {
        console.log('Live detection stopped successfully');
      }
    } catch (error) {
      console.error('Failed to stop live detection:', error);
    }
  };

  // API call to start siren
  const startSirenAPI = async () => {
    try {
      await fetch('/api/siren/start', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to start siren:', error);
    }
  };

  // API call to stop siren
  const stopSirenAPI = async () => {
    try {
      await fetch('/api/siren/stop', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to stop siren:', error);
    }
  };

  // Simulate detection process
  useEffect(() => {
    if (!isDetecting) return;

    const interval = setInterval(() => {
      // Simulate random detection (20% chance)
      if (Math.random() < 0.2) {
        const animals = ['Tiger', 'Leopard', 'Wild Boar', 'Bear', 'Elephant', 'Wolf'];
        const animal = animals[Math.floor(Math.random() * animals.length)];
        
        const detection: Detection = {
          id: Date.now().toString(),
          animal,
          confidence: 85 + Math.random() * 14, // 85-99% confidence
          timestamp: new Date().toLocaleString(),
          bbox: {
            x: Math.random() * 300 + 50,
            y: Math.random() * 200 + 50,
            width: 120 + Math.random() * 80,
            height: 100 + Math.random() * 60
          }
        };

        setCurrentDetection(detection);
        setDetectionHistory(prev => [detection, ...prev.slice(0, 9)]);
        setAlertActive(true);

        if (sirenEnabled && audioRef.current) {
          startSirenAPI(); // Call API to start siren
          audioRef.current.play().catch(() => {
            // Fallback if audio doesn't play
            console.log('Siren activated for:', animal);
          });
        }

        // Auto-clear alert after 5 seconds
        setTimeout(() => {
          setAlertActive(false);
          setCurrentDetection(null);
        }, 5000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isDetecting, sirenEnabled]);

  const startDetection = async () => {
    try {
      await startDetectionAPI(); // Call API
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsDetecting(true);
    } catch (error) {
      console.error('Camera access denied:', error);
      // Continue with simulation for demo
      setIsDetecting(true);
    }
  };

  const stopDetection = () => {
    stopDetectionAPI(); // Call API
    setIsDetecting(false);
    setAlertActive(false);
    setCurrentDetection(null);
    
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const stopSiren = () => {
    stopSirenAPI(); // Call API
    setAlertActive(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-gray-900 to-dark-800 py-8 px-4 sm:px-6 lg:px-8">
      {/* Audio element for siren */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBi6S2fPNeSsFJnnJ8N+PRgwUXrPq7adWFAlFn+Hyu3Ieg..." />

      <div className="max-w-7xl mx-auto">
        {/* Alert Banner */}
        {alertActive && currentDetection && (
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-3xl mb-8 animate-pulse-soft shadow-soft-lg border border-red-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 animate-bounce" />
                <div>
                  <span className="font-bold text-xl">WILDLIFE DETECTED!</span>
                  <span className="ml-6 text-lg">
                    {currentDetection.animal} - {currentDetection.confidence.toFixed(1)}% confidence
                  </span>
                </div>
              </div>
              <button
                onClick={stopSiren}
                className="bg-dark-900 hover:bg-dark-800 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 shadow-soft"
              >
                Stop Siren
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Detection Area */}
          <div className="lg:col-span-2">
            <div className="bg-dark-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-soft border border-dark-700/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white flex items-center tracking-tight">
                  <Camera className="mr-4 h-7 w-7" />
                  Live Detection Feed
                </h2>
                <div className="flex items-center space-x-2">
                  {isDetecting && (
                    <div className="flex items-center text-primary-400">
                      <Wifi className="h-4 w-4 mr-1" />
                      <span className="text-sm">LIVE</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Camera Feed */}
              <div className="relative bg-black rounded-2xl overflow-hidden aspect-video mb-6 shadow-soft">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
                
                {!isDetecting && (
                  <div className="absolute inset-0 flex items-center justify-center bg-dark-900 bg-opacity-90 backdrop-blur-sm">
                    <div className="text-center">
                      <Camera className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                      <p className="text-gray-400 text-xl">Camera feed will appear here</p>
                    </div>
                  </div>
                )}

                {/* Detection Overlay */}
                {currentDetection && isDetecting && (
                  <div
                    className="absolute border-3 border-red-500 bg-red-500 bg-opacity-25 rounded-lg"
                    style={{
                      left: `${currentDetection.bbox.x}px`,
                      top: `${currentDetection.bbox.y}px`,
                      width: `${currentDetection.bbox.width}px`,
                      height: `${currentDetection.bbox.height}px`,
                    }}
                  >
                    <div className="absolute -top-10 left-0 bg-red-500 text-white px-3 py-2 text-sm rounded-xl font-semibold shadow-soft">
                      {currentDetection.animal} ({currentDetection.confidence.toFixed(1)}%)
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedCamera}
                    onChange={(e) => setSelectedCamera(e.target.value)}
                    className="bg-dark-700 text-white px-4 py-3 rounded-2xl border border-dark-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    disabled={isDetecting}
                  >
                    <option>Camera 1 - Main Gate</option>
                    <option>Camera 2 - Forest Edge</option>
                    <option>Camera 3 - Back Yard</option>
                    <option>RTSP Stream</option>
                  </select>

                  {!isDetecting ? (
                    <button
                      onClick={startDetection}
                      disabled={isLoading}
                      className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-2xl flex items-center space-x-3 font-semibold transition-all duration-200 shadow-soft"
                    >
                      <Play className="h-4 w-4" />
                      <span>{isLoading ? 'Starting...' : 'Start Detection'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopDetection}
                      className="bg-dark-900 hover:bg-dark-800 text-white px-6 py-3 rounded-2xl flex items-center space-x-3 font-semibold transition-all duration-200 shadow-soft"
                    >
                      <Square className="h-4 w-4" />
                      <span>Stop Detection</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSirenEnabled(!sirenEnabled)}
                    className={`p-3 rounded-2xl transition-all duration-200 ${
                      sirenEnabled 
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-soft' 
                        : 'bg-dark-600 hover:bg-dark-700 text-gray-300'
                    }`}
                    title={sirenEnabled ? 'Disable Siren' : 'Enable Siren'}
                  >
                    {sirenEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Status */}
            <div className="bg-dark-800/50 backdrop-blur-xl rounded-3xl p-6 shadow-soft border border-dark-700/30">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                System Status
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Detection</span>
                  <span className={isDetecting ? 'text-primary-400 font-semibold' : 'text-gray-400'}>
                    {isDetecting ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Alerts</span>
                  <span className={sirenEnabled ? 'text-primary-400 font-semibold' : 'text-yellow-400 font-semibold'}>
                    {sirenEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Camera</span>
                  <span className="text-white font-medium">{selectedCamera}</span>
                </div>
              </div>
            </div>

            {/* Recent Detections */}
            <div className="bg-dark-800/50 backdrop-blur-xl rounded-3xl p-6 shadow-soft border border-dark-700/30">
              <h3 className="text-xl font-semibold text-white mb-6">Recent Detections</h3>
              {detectionHistory.length === 0 ? (
                <p className="text-gray-400 text-sm">No detections yet</p>
              ) : (
                <div className="space-y-4">
                  {detectionHistory.slice(0, 5).map((detection) => (
                    <div key={detection.id} className="flex items-center justify-between p-4 bg-dark-700/50 rounded-2xl">
                      <div>
                        <span className="text-white font-medium">{detection.animal}</span>
                        <div className="text-xs text-gray-400">{detection.timestamp}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-primary-400 font-semibold">
                          {detection.confidence.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Settings */}
            <div className="bg-dark-800/50 backdrop-blur-xl rounded-3xl p-6 shadow-soft border border-dark-700/30">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Quick Settings
              </h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sirenEnabled}
                    onChange={(e) => setSirenEnabled(e.target.checked)}
                    className="mr-3 w-4 h-4 text-primary-600 bg-dark-700 border-dark-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-300">Enable Audio Alerts</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-3 w-4 h-4 text-primary-600 bg-dark-700 border-dark-600 rounded focus:ring-primary-500" />
                  <span className="text-gray-300">Email Notifications</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-3 w-4 h-4 text-primary-600 bg-dark-700 border-dark-600 rounded focus:ring-primary-500" />
                  <span className="text-gray-300">Log Detections</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LiveDetection;
