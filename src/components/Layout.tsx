import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Camera, 
  Image, 
  Video, 
  FileText, 
  Settings, 
  Shield,
  Menu,
  X,
  TreePine
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/live', icon: Camera, label: 'Live Detection' },
    { path: '/image', icon: Image, label: 'Image Analysis' },
    { path: '/video', icon: Video, label: 'Video Analysis' },
    { path: '/logs', icon: FileText, label: 'System Logs' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/admin', icon: Shield, label: 'Admin Panel' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-gray-900 to-dark-800 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-dark-800/90 backdrop-blur-xl border-b border-dark-700/50">
  <div className="h-full w-full flex items-center justify-between px-6">
    
    {/* Logo */}
    <div className="flex items-center space-x-3">
      <div className="bg-primary-600 p-2 rounded-2xl shadow-soft">
        <TreePine className="h-6 w-6 text-white" />
      </div>
      <h1 className="text-xl font-semibold text-white tracking-tight">
        WildGuard AI
      </h1>
    </div>

    {/* Desktop Navigation */}
    <nav className="hidden md:flex items-center space-x-2">
      {navItems.map(({ path, icon: Icon, label }) => (
        <Link
          key={path}
          to={path}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
            isActive(path)
              ? 'bg-dark-900 text-white shadow-soft'
              : 'text-gray-300 hover:bg-dark-700/50 hover:text-white'
          }`}
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>

    {/* Mobile button */}
    <button
      className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-dark-700/50"
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    >
      {isMobileMenuOpen ? <X /> : <Menu />}
    </button>

  </div>
</header>

      {/* Main Content */}
      <main className="pt-20 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-dark-800/50 backdrop-blur-xl border-t border-dark-700/30 mt-16">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 WildGuard AI - Wild Animal Detection & Alert System</p>
            <p className="text-sm mt-1">Protecting Lives Through AI Technology</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Layout;
