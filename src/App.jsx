import React, { useState } from 'react';
import Sidebar from './components/Shared/Navigation';
import Header from './components/Dashboard/Header';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import SourceAnalysis from './components/Sources/SourceAnalysis';
import TrafficDashboard from './components/Sources/TrafficDashboard'; // <--- NEW IMPORT
import AQIForecast from './components/Forecast/AQIForecast';
import PolicySimulator from './components/Policy/PolicySimulator';
import HealthAdvisor from './components/Health/HealthAdvisor';
import Map3D from './components/Visualization/Map3D';
import AIAssistant from './components/Chat/AIAssistant';
import AdvancedAnalytics from './components/Analytics/AdvancedAnalytics';
import CitizenScience from './components/Community/CitizenScience';
import AdminPanel from './components/Dashboard/AdminPanel';

import { useAuth } from './context/AuthContext';
import LoginPage from './components/Auth/LoginPage';
import { ThemeProvider } from "next-themes";

import { useSystem } from './context/SystemContext';
import { AlertTriangle, X } from 'lucide-react';

function App() {
  const { user, loading } = useAuth();
  const { features, clearAlert } = useSystem();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeAreaId, setActiveAreaId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-[10px]">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const navigateToArea = (areaId) => {
    setActiveAreaId(areaId);
    setActiveTab('sources');
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Intelligence Dashboard';
      case 'forecast': return 'AQI Forecast Engine';
      case 'sources': return 'Source Identification';
      case 'heatmap': return 'Real-time Heatmap';
      case 'policy': return 'Policy & Impact Simulator';
      case 'health': return 'Health & Safety Advisory';
      case 'community': return 'Citizen Science Platform';
      case 'chat': return 'AI Assistant';
      case 'settings': return 'System Settings (Admin)';
      default: return 'Delhi NCR Pollution Intel';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview onAreaClick={navigateToArea} />;

      // --- UPDATED SECTION START ---
      case 'sources': return (
        <div className="p-6 space-y-6">
          <SourceAnalysis activeAreaId={activeAreaId} />
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8">
              <TrafficDashboard />
            </div>
          </div>
        </div>
      );
      // --- UPDATED SECTION END ---

      case 'forecast': return <AQIForecast />;
      case 'policy': return <PolicySimulator />;
      case 'health': return <HealthAdvisor />;
      case 'heatmap': return <Map3D setActiveTab={setActiveTab} activeAreaId={activeAreaId} setActiveAreaId={setActiveAreaId} />;
      case 'community': return <CitizenScience />;
      case 'chat': return <AIAssistant />;
      case 'settings':
        if (user?.role !== 'admin') {
          setActiveTab('dashboard'); // Redirect if not admin
          return <DashboardOverview onAreaClick={navigateToArea} />;
        }
        return <AdminPanel />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center">
            <div className="w-16 h-16 bg-surface border border-white/5 rounded-2xl flex items-center justify-center mb-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-bold">Initializing {getTitle()}...</h3>
            <p className="text-gray-500 mt-2 max-w-md">Developing advanced analytics and visualizations for {activeTab}. Check back in a few minutes!</p>
          </div>
        );
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <div className="relative min-h-screen text-white font-sans selection:bg-primary/30 bg-[#09090b]">

        {/* Global Emergency Alert */}
        {features.emergencyAlert && (
          <div className="fixed top-0 left-0 w-full z-[100] bg-red-600 px-6 py-3 flex items-center justify-between shadow-2xl animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{features.emergencyAlert.type}</span>
                <p className="text-sm font-bold leading-tight">{features.emergencyAlert.message}</p>
              </div>
            </div>
            <button
              onClick={clearAlert}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content Layer */}
        <div className="relative z-10 flex min-h-screen">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <div className="flex-1 flex flex-col w-full max-w-[1920px] mx-auto md:pl-20 transition-all">
            <Header title={getTitle()} />

            <main className="flex-1 overflow-x-hidden pb-24 md:pb-0 relative">
              {renderContent()}
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;