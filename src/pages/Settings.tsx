import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Camera, 
  Bell, 
  Upload, 
  Save,
  Trash2,
  Plus,
  Mail,
  Phone,
  Volume2
} from 'lucide-react';

interface CameraConfig {
  id: string;
  name: string;
  url: string;
  type: 'webcam' | 'rtsp' | 'ip';
  active: boolean;
  location: string;
}

interface NotificationSettings {
  enableAudio: boolean;
  enableEmail: boolean;
  enableSMS: boolean;
  emailAddress: string;
  phoneNumber: string;
  emergencyContact: string;
}

interface DetectionSettings {
  confidenceThreshold: number;
  enableLogging: boolean;
  autoDeleteLogs: boolean;
  logRetentionDays: number;
}

export const Settings: React.FC = () => {
  const [cameras, setCameras] = useState<CameraConfig[]>([
    { id: '1', name: 'Main Gate Camera', url: '/dev/video0', type: 'webcam', active: true, location: 'Main Gate' },
    { id: '2', name: 'Forest Edge Camera', url: 'rtsp://192.168.1.100:554/stream', type: 'rtsp', active: true, location: 'Forest Edge' },
    { id: '3', name: 'Back Yard Camera', url: 'http://192.168.1.101:8080/video', type: 'ip', active: false, location: 'Back Yard' },
  ]);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    enableAudio: true,
    enableEmail: true,
    enableSMS: false,
    emailAddress: 'admin@wildguard.ai',
    phoneNumber: '+1234567890',
    emergencyContact: 'forest.department@gov.in'
  });

  const [detection, setDetection] = useState<DetectionSettings>({
    confidenceThreshold: 80,
    enableLogging: true,
    autoDeleteLogs: true,
    logRetentionDays: 30
  });

  const [newCamera, setNewCamera] = useState<Partial<CameraConfig>>({
    name: '',
    url: '',
    type: 'webcam',
    location: ''
  });

  const [showAddCamera, setShowAddCamera] = useState(false);
  const [modelFile, setModelFile] = useState<File | null>(null);

  const handleAddCamera = () => {
    if (newCamera.name && newCamera.url && newCamera.location) {
      const camera: CameraConfig = {
        id: Date.now().toString(),
        name: newCamera.name,
        url: newCamera.url,
        type: newCamera.type || 'webcam',
        active: true,
        location: newCamera.location
      };
      setCameras([...cameras, camera]);
      setNewCamera({ name: '', url: '', type: 'webcam', location: '' });
      setShowAddCamera(false);
    }
  };

  const handleDeleteCamera = (id: string) => {
    setCameras(cameras.filter(cam => cam.id !== id));
  };

  const handleToggleCamera = (id: string) => {
    setCameras(cameras.map(cam => 
      cam.id === id ? { ...cam, active: !cam.active } : cam
    ));
  };

  const handleModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.pt')) {
      setModelFile(file);
    }
  };

  const saveSettings = () => {
    // In a real app, this would send to your backend
    console.log('Saving settings...', { cameras, notifications, detection });
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <SettingsIcon className="mr-3 h-8 w-8" />
            System Settings
          </h1>
          <p className="text-gray-400">Configure cameras, alerts, and detection parameters</p>
        </div>

        <div className="space-y-8">
          {/* Camera Configuration */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Camera className="mr-2 h-6 w-6" />
                Camera Configuration
              </h2>
              <button
                onClick={() => setShowAddCamera(!showAddCamera)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Camera</span>
              </button>
            </div>

            {/* Add Camera Form */}
            {showAddCamera && (
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-white mb-4">Add New Camera</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Camera Name"
                    value={newCamera.name || ''}
                    onChange={(e) => setNewCamera({ ...newCamera, name: e.target.value })}
                    className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white placeholder-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={newCamera.location || ''}
                    onChange={(e) => setNewCamera({ ...newCamera, location: e.target.value })}
                    className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white placeholder-gray-400"
                  />
                  <select
                    value={newCamera.type || 'webcam'}
                    onChange={(e) => setNewCamera({ ...newCamera, type: e.target.value as CameraConfig['type'] })}
                    className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                  >
                    <option value="webcam">Webcam</option>
                    <option value="rtsp">RTSP Stream</option>
                    <option value="ip">IP Camera</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Camera URL/Path"
                    value={newCamera.url || ''}
                    onChange={(e) => setNewCamera({ ...newCamera, url: e.target.value })}
                    className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white placeholder-gray-400"
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setShowAddCamera(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCamera}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
                  >
                    Add Camera
                  </button>
                </div>
              </div>
            )}

            {/* Camera List */}
            <div className="space-y-4">
              {cameras.map((camera) => (
                <div key={camera.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${camera.active ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                      <div>
                        <h3 className="text-white font-medium">{camera.name}</h3>
                        <p className="text-gray-400 text-sm">{camera.location} • {camera.type.toUpperCase()}</p>
                        <p className="text-gray-500 text-xs font-mono">{camera.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleCamera(camera.id)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          camera.active 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                        }`}
                      >
                        {camera.active ? 'Active' : 'Inactive'}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteCamera(camera.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Bell className="mr-2 h-6 w-6" />
              Notification Settings
            </h2>

            <div className="space-y-6">
              {/* Alert Types */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Alert Types</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.enableAudio}
                      onChange={(e) => setNotifications({ ...notifications, enableAudio: e.target.checked })}
                      className="mr-3"
                    />
                    <Volume2 className="h-5 w-5 text-yellow-400 mr-2" />
                    <span className="text-gray-300">Audio Siren Alerts</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.enableEmail}
                      onChange={(e) => setNotifications({ ...notifications, enableEmail: e.target.checked })}
                      className="mr-3"
                    />
                    <Mail className="h-5 w-5 text-blue-400 mr-2" />
                    <span className="text-gray-300">Email Notifications</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.enableSMS}
                      onChange={(e) => setNotifications({ ...notifications, enableSMS: e.target.checked })}
                      className="mr-3"
                    />
                    <Phone className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-gray-300">SMS Alerts</span>
                  </label>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={notifications.emailAddress}
                      onChange={(e) => setNotifications({ ...notifications, emailAddress: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={notifications.phoneNumber}
                      onChange={(e) => setNotifications({ ...notifications, phoneNumber: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Emergency Contact</label>
                    <input
                      type="email"
                      value={notifications.emergencyContact}
                      onChange={(e) => setNotifications({ ...notifications, emergencyContact: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="forest.department@gov.in"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detection Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <SettingsIcon className="mr-2 h-6 w-6" />
              Detection Settings
            </h2>

            <div className="space-y-6">
              {/* Confidence Threshold */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Confidence Threshold: {detection.confidenceThreshold}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={detection.confidenceThreshold}
                  onChange={(e) => setDetection({ ...detection, confidenceThreshold: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>50% (More detections, less accurate)</span>
                  <span>99% (Fewer detections, more accurate)</span>
                </div>
              </div>

              {/* Logging Settings */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Logging</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={detection.enableLogging}
                      onChange={(e) => setDetection({ ...detection, enableLogging: e.target.checked })}
                      className="mr-3"
                    />
                    <span className="text-gray-300">Enable detection logging</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={detection.autoDeleteLogs}
                      onChange={(e) => setDetection({ ...detection, autoDeleteLogs: e.target.checked })}
                      className="mr-3"
                    />
                    <span className="text-gray-300">Auto-delete old logs</span>
                  </label>
                  
                  {detection.autoDeleteLogs && (
                    <div className="ml-6">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Retention Period (days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={detection.logRetentionDays}
                        onChange={(e) => setDetection({ ...detection, logRetentionDays: parseInt(e.target.value) })}
                        className="w-20 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Model Management */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Upload className="mr-2 h-6 w-6" />
              Model Management
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Current Model</label>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">yolov8_wildlife_v2.pt</p>
                      <p className="text-gray-400 text-sm">Uploaded on 2025-01-01 • 89.3% Accuracy</p>
                    </div>
                    <div className="bg-green-600 text-white px-3 py-1 rounded text-sm">Active</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Upload New Model</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept=".pt"
                    onChange={handleModelUpload}
                    className="hidden"
                    id="model-upload"
                  />
                  <label
                    htmlFor="model-upload"
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Choose .pt file</span>
                  </label>
                  {modelFile && (
                    <span className="text-gray-300">{modelFile.name}</span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Upload a trained YOLO model file (.pt format) to improve detection accuracy
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={saveSettings}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>Save All Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
