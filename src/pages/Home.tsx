import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  Image, 
  Video, 
  FileText, 
  Settings, 
  Shield,
  AlertTriangle,
  Zap,
  TreePine,
  Users
} from 'lucide-react';

export const Home: React.FC = () => {
  const features = [
  {
    icon: Camera,
    title: "Live Detection",
    description:
      "Real-time animal detection using CCTV and webcam feeds",
    link: "/live-detection",
    color: "text-red-500",
  },
  {
    icon: Image,
    title: "Image Analysis",
    description:
      "Upload and analyze images for wildlife presence",
    link: "/image-detection",
    color: "text-blue-500",
  },
  {
    icon: Video,
    title: "Video Analysis",
    description:
      "Process recorded videos for comprehensive detection logs",
    link: "/video-detection",
    color: "text-purple-500",
  },
  {
    icon: FileText,
    title: "System Logs",
    description:
      "View detailed detection history and export reports",
    link: "/system-logs",
    color: "text-primary-500",
  },
  {
    icon: Settings,
    title: "Settings",
    description:
      "Configure cameras, alerts, and system preferences",
    link: "/settings",
    color: "text-yellow-500",
  },
  {
    icon: Shield,
    title: "Admin Panel",
    description:
      "Advanced analytics and system management tools",
    link: "/admin",
    color: "text-indigo-500",
  },
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-primary-900 to-dark-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-6 rounded-3xl shadow-soft-lg">
              <TreePine className="h-20 w-20 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
            Wild Animal Detection &
            <span className="text-primary-400"> Alert System</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Protecting lives and preventing human-wildlife conflict through AI-powered 
            real-time detection and intelligent alert systems
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <Link
              to="/live-detection"
              className="bg-dark-900 hover:bg-dark-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center space-x-3 shadow-soft-lg hover:shadow-xl"
            >
              <Camera className="h-6 w-6" />
              <span>Start Live Detection</span>
            </Link>
            <Link
              to="/image-detection"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center space-x-3 shadow-soft-lg hover:shadow-xl"
            >
              <Image className="h-6 w-6" />
              <span>Analyze Image</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="text-center">
              <div className="bg-dark-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-soft border border-dark-700/30">
                <AlertTriangle className="h-14 w-14 text-red-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-3">Real-Time Alerts</h3>
                <p className="text-gray-400">Instant notifications when wildlife is detected</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-dark-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-soft border border-dark-700/30">
                <Zap className="h-14 w-14 text-yellow-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-3">99.2% Accuracy</h3>
                <p className="text-gray-400">Advanced YOLO model for precise detection</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-dark-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-soft border border-dark-700/30">
                <Users className="h-14 w-14 text-primary-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-3">Lives Protected</h3>
                <p className="text-gray-400">Safeguarding communities in forest areas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16 tracking-tight">
            System Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="bg-dark-800/50 backdrop-blur-xl hover:bg-dark-700/50 p-8 rounded-3xl transition-all duration-300 group shadow-soft hover:shadow-soft-lg border border-dark-700/30 hover:border-dark-600/50"
              >
                <div className="flex items-center mb-6">
                  <feature.icon className={`h-10 w-10 ${feature.color} mr-4`} />
                  <h3 className="text-xl font-semibold text-white group-hover:text-primary-400 transition-colors">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-400 leading-relaxed text-base">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/30 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8 tracking-tight">Our Mission</h2>
          <p className="text-xl text-gray-300 leading-relaxed mb-12">
            To protect human lives and prevent human-wildlife conflict in forest-bordering areas 
            through cutting-edge AI technology. Our system provides 24/7 monitoring, instant alerts, 
            and comprehensive analytics to keep communities safe while preserving wildlife habitats.
          </p>
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-10 py-5 rounded-2xl shadow-soft-lg">
              <span className="text-white font-semibold text-xl">
                Saving Lives Through Technology
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
