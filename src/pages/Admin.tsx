import React, { useState } from 'react';
import { 
  Shield, 
  BarChart3, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  Camera,
  Clock,
  MapPin
} from 'lucide-react';

interface SystemStats {
  totalDetections: number;
  activeAlerts: number;
  camerasOnline: number;
  systemUptime: string;
  avgResponseTime: number;
}

interface DetectionData {
  animal: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

interface TimelineData {
  time: string;
  detections: number;
  alerts: number;
}

export const Admin: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('detections');

  // Mock system statistics
  const systemStats: SystemStats = {
    totalDetections: 1247,
    activeAlerts: 3,
    camerasOnline: 4,
    systemUptime: '12d 8h 23m',
    avgResponseTime: 0.85
  };

  // Mock detection data by animal type
  const detectionData: DetectionData[] = [
    { animal: 'Wild Boar', count: 456, percentage: 36.6, trend: 'up' },
    { animal: 'Deer', count: 298, percentage: 23.9, trend: 'stable' },
    { animal: 'Tiger', count: 187, percentage: 15.0, trend: 'up' },
    { animal: 'Leopard', count: 156, percentage: 12.5, trend: 'down' },
    { animal: 'Bear', count: 89, percentage: 7.1, trend: 'stable' },
    { animal: 'Elephant', count: 43, percentage: 3.4, trend: 'up' },
    { animal: 'Wolf', count: 18, percentage: 1.4, trend: 'down' },
  ];

  // Mock timeline data
  const timelineData: TimelineData[] = Array.from({ length: 24 }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    detections: Math.floor(Math.random() * 50) + 5,
    alerts: Math.floor(Math.random() * 10) + 1,
  }));

  // Recent activities
  const recentActivities = [
    { time: '2 min ago', type: 'detection', message: 'Tiger detected at Forest Edge Camera', severity: 'high' },
    { time: '15 min ago', type: 'alert', message: 'Motion detected at Back Yard Camera', severity: 'medium' },
    { time: '1 hour ago', type: 'system', message: 'Camera 3 came back online', severity: 'low' },
    { time: '2 hours ago', type: 'detection', message: 'Wild Boar detected at Main Gate Camera', severity: 'high' },
    { time: '3 hours ago', type: 'system', message: 'Daily backup completed successfully', severity: 'low' },
  ];

  const maxDetections = Math.max(...timelineData.map(d => d.detections));
  const maxAlerts = Math.max(...timelineData.map(d => d.alerts));

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Shield className="mr-3 h-8 w-8 text-emerald-400" />
            Admin Dashboard
          </h1>
          <p className="text-gray-400">System overview and analytics</p>
        </div>

        {/* System Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Detections</p>
                <p className="text-2xl font-bold text-white">{systemStats.totalDetections.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Active Alerts</p>
                <p className="text-2xl font-bold text-white">{systemStats.activeAlerts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Camera className="h-8 w-8 text-emerald-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Cameras Online</p>
                <p className="text-2xl font-bold text-white">{systemStats.camerasOnline}/4</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">System Uptime</p>
                <p className="text-2xl font-bold text-white">{systemStats.systemUptime}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-yellow-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Response Time</p>
                <p className="text-2xl font-bold text-white">{systemStats.avgResponseTime}s</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detection Analytics */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Detection Analytics</h2>
              <div className="flex space-x-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
                >
                  <option value="detections">Detections</option>
                  <option value="alerts">Alerts</option>
                </select>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-64 relative">
              <div className="absolute inset-0 flex items-end justify-between space-x-1">
                {timelineData.map((data, index) => {
                  const value = selectedMetric === 'detections' ? data.detections : data.alerts;
                  const maxValue = selectedMetric === 'detections' ? maxDetections : maxAlerts;
                  const height = (value / maxValue) * 100;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          selectedMetric === 'detections' ? 'bg-blue-500' : 'bg-red-500'
                        }`}
                        style={{ height: `${height}%` }}
                        title={`${data.time}: ${value} ${selectedMetric}`}
                      ></div>
                      <span className="text-xs text-gray-400 mt-2 transform rotate-45">
                        {data.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-blue-400">
                  {timelineData.reduce((sum, d) => sum + d.detections, 0)}
                </p>
                <p className="text-sm text-gray-400">Total Detections</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-red-400">
                  {timelineData.reduce((sum, d) => sum + d.alerts, 0)}
                </p>
                <p className="text-sm text-gray-400">Total Alerts</p>
              </div>
            </div>
          </div>

          {/* Animal Detection Breakdown */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Detection Breakdown</h2>
            <div className="space-y-4">
              {detectionData.map((animal, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{animal.animal}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-sm">{animal.count}</span>
                      <TrendingUp className={`h-4 w-4 ${
                        animal.trend === 'up' ? 'text-green-400' : 
                        animal.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${animal.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">{animal.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Activity className="mr-2 h-6 w-6" />
              Recent Activities
            </h2>
            <button className="text-emerald-400 hover:text-emerald-300 text-sm">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  activity.severity === 'high' ? 'bg-red-500' :
                  activity.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                
                <div className="flex-1">
                  <p className="text-white">{activity.message}</p>
                  <p className="text-gray-400 text-sm">{activity.time}</p>
                </div>
                
                <div className={`px-2 py-1 rounded text-xs font-semibold ${
                  activity.type === 'detection' ? 'bg-blue-100 text-blue-800' :
                  activity.type === 'alert' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {activity.type}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Camera className="mr-2 h-5 w-5" />
              Camera Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Main Gate</span>
                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Forest Edge</span>
                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Back Yard</span>
                <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">Offline</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Perimeter</span>
                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">Online</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Detection Zones
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">North Sector</span>
                <span className="text-emerald-400 text-sm">23 detections</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">South Sector</span>
                <span className="text-emerald-400 text-sm">45 detections</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">East Sector</span>
                <span className="text-emerald-400 text-sm">12 detections</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">West Sector</span>
                <span className="text-emerald-400 text-sm">31 detections</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              System Health
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">CPU Usage</span>
                <span className="text-green-400 text-sm">23%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Memory</span>
                <span className="text-yellow-400 text-sm">67%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Storage</span>
                <span className="text-green-400 text-sm">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Network</span>
                <span className="text-green-400 text-sm">Stable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
