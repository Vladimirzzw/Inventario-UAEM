
import React from 'react';
import { AppSettings } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  settings: AppSettings;
  onNavigateHome: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, settings, onNavigateHome }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary-green text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={onNavigateHome}
          >
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo UAEM" className="h-12 w-auto object-contain bg-white rounded p-1" />
            ) : (
              <div className="h-10 w-10 bg-accent-yellow text-primary-green flex items-center justify-center rounded-md font-bold text-xl">
                <i className="fas fa-boxes-stacked"></i>
              </div>
            )}
            <h1 className="text-xl font-bold tracking-tight group-hover:text-accent-yellow transition-colors">
              {settings.companyName}
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <button onClick={onNavigateHome} className="hover:text-accent-yellow transition-colors font-medium">
              Inventarios
            </button>
            <button className="hover:text-accent-yellow transition-colors font-medium">
              Reportes
            </button>
            <div className="w-8 h-8 rounded-full bg-accent-yellow/20 flex items-center justify-center border border-accent-yellow">
              <i className="fas fa-user text-accent-yellow text-sm"></i>
            </div>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-gray-100 border-t py-6 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} {settings.companyName} - Sistema de Control de Inventarios</p>
      </footer>
    </div>
  );
};

export default Layout;
