import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Filter, 
  Download, 
  Search, 
  Camera,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  animal: string;
  confidence: number;
  camera: string;
  location: string;
  alertTriggered: boolean;
  imageUrl?: string;
}

export const SystemLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('All');
  const [selectedCamera, setSelectedCamera] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock data - in real app, this would come from your backend
  const mockLogs: LogEntry[] = useMemo(() => {
    const animals = ['Tiger', 'Leopard', 'Wild Boar', 'Bear', 'Elephant', 'Wolf', 'Deer'];
    const cameras = ['Camera 1 - Main Gate', 'Camera 2 - Forest Edge', 'Camera 3 - Back Yard', 'Camera 4 - Perimeter'];
    const locations = ['Main Gate', 'Forest Edge', 'Back Yard', 'North Perimeter'];
    
    return Array.from({ length: 50 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      date.setHours(Math.floor(Math.random() * 24));
      date.setMinutes(Math.floor(Math.random() * 60));
      
      return {
        id: `log-${i + 1}`,
        timestamp: date.toISOString(),
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
        animal: animals[Math.floor(Math.random() * animals.length)],
        confidence: 75 + Math.random() * 24,
        camera: cameras[Math.floor(Math.random() * cameras.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        alertTriggered: Math.random() > 0.3, // 70% chance of alert
        imageUrl: `https://images.pexels.com/photos/${1000000 + i}/pexels-photo-${1000000 + i}.jpeg?auto=compress&cs=tinysrgb&w=100&h=100`
      };
    });
  }, []);

  // Filter and sort logs
  const filteredLogs = useMemo(() => {
    let filtered = mockLogs.filter(log => {
      const matchesSearch = searchTerm === '' || 
        log.animal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.camera.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAnimal = selectedAnimal === 'All' || log.animal === selectedAnimal;
      const matchesCamera = selectedCamera === 'All' || log.camera === selectedCamera;
      const matchesDate = dateFilter === '' || log.date === new Date(dateFilter).toLocaleDateString();
      
      return matchesSearch && matchesAnimal && matchesCamera && matchesDate;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'animal':
          aValue = a.animal;
          bValue = b.animal;
          break;
        case 'confidence':
          aValue = a.confidence;
          bValue = b.confidence;
          break;
        case 'camera':
          aValue = a.camera;
          bValue = b.camera;
          break;
        default:
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [mockLogs, searchTerm, selectedAnimal, selectedCamera, dateFilter, sortBy, sortOrder]);

  // Get unique animals and cameras for filters
  const uniqueAnimals = Array.from(new Set(mockLogs.map(log => log.animal))).sort();
  const uniqueCameras = Array.from(new Set(mockLogs.map(log => log.camera))).sort();

  // Statistics
  const stats = useMemo(() => {
    const totalDetections = filteredLogs.length;
    const alertsTriggered = filteredLogs.filter(log => log.alertTriggered).length;
    const mostCommonAnimal = filteredLogs.reduce((acc, log) => {
      acc[log.animal] = (acc[log.animal] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topAnimal = Object.entries(mostCommonAnimal).sort((a, b) => b[1] - a[1])[0];
    
    return {
      totalDetections,
      alertsTriggered,
      mostCommonAnimal: topAnimal ? topAnimal[0] : 'None',
      avgConfidence: filteredLogs.length > 0 ? 
        filteredLogs.reduce((sum, log) => sum + log.confidence, 0) / filteredLogs.length : 0
    };
  }, [filteredLogs]);

  const exportLogs = () => {
    const csvContent = [
      'ID,Date,Time,Animal,Confidence,Camera,Location,Alert Triggered',
      ...filteredLogs.map(log => 
        `${log.id},${log.date},${log.time},${log.animal},${log.confidence.toFixed(2)},${log.camera},${log.location},${log.alertTriggered}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wildlife-detection-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <FileText className="mr-3 h-8 w-8" />
            System Logs
          </h1>
          <p className="text-gray-400">Monitor and analyze wildlife detection events</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Detections</p>
                <p className="text-2xl font-bold text-white">{stats.totalDetections}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Alerts Triggered</p>
                <p className="text-2xl font-bold text-white">{stats.alertsTriggered}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Camera className="h-8 w-8 text-emerald-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Most Common</p>
                <p className="text-2xl font-bold text-white">{stats.mostCommonAnimal}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Avg Confidence</p>
                <p className="text-2xl font-bold text-white">{stats.avgConfidence.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Animal Filter */}
            <select
              value={selectedAnimal}
              onChange={(e) => setSelectedAnimal(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg text-white px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="All">All Animals</option>
              {uniqueAnimals.map(animal => (
                <option key={animal} value={animal}>{animal}</option>
              ))}
            </select>

            {/* Camera Filter */}
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg text-white px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="All">All Cameras</option>
              {uniqueCameras.map(camera => (
                <option key={camera} value={camera}>{camera}</option>
              ))}
            </select>

            {/* Date Filter */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg text-white px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg text-white px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="timestamp">Date/Time</option>
              <option value="animal">Animal</option>
              <option value="confidence">Confidence</option>
              <option value="camera">Camera</option>
            </select>

            {/* Sort Order & Export */}
            <div className="flex space-x-2">
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg flex items-center"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                <Filter className="h-4 w-4" />
                <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              </button>
              
              <button
                onClick={exportLogs}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg flex items-center"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Animal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Camera
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Alert
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{log.date}</div>
                      <div className="text-sm text-gray-400">{log.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-white">{log.animal}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-white">{log.confidence.toFixed(1)}%</div>
                        <div className="ml-2 w-16 bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-emerald-400 h-2 rounded-full"
                            style={{ width: `${log.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {log.camera}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {log.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        log.alertTriggered 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {log.alertTriggered ? 'Triggered' : 'Silent'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No logs match your current filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
