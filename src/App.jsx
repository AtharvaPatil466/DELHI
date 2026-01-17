import React, { useState } from 'react';
import Sidebar from './components/Shared/Navigation';
import Header from './components/Dashboard/Header';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import SourceAnalysis from './components/Sources/SourceAnalysis';
import AQIForecast from './components/Forecast/AQIForecast';
import PolicySimulator from './components/Policy/PolicySimulator';
import HealthAdvisor from './components/Health/HealthAdvisor';
import Map3D from './components/Visualization/Map3D';
import AIAssistant from './components/Chat/AIAssistant';
import AdvancedAnalytics from './components/Analytics/AdvancedAnalytics';
import CitizenScience from './components/Community/CitizenScience';
import AdminPanel from './components/Dashboard/AdminPanel';

import { ThemeProvider } from "next-themes";

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Intelligence Dashboard';
      case 'forecast': return 'AQI Forecast Engine';
      case 'sources': return 'Source Identification';
      case 'heatmap': return 'Real-time Heatmap';
      case 'policy': return 'Policy & Impact Simulator';
      case 'health': return 'Health & Safety Advisory';
      case 'community': return 'Citizen Science Platform';
      case 'chat': return 'AI Assistant (Claude)';
      case 'settings': return 'System Settings (Admin)';
      default: return 'Delhi NCR Pollution Intel';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview />;
      case 'sources': return <SourceAnalysis />;
      case 'forecast': return <AQIForecast />;
      case 'policy': return <PolicySimulator />;
      case 'health': return <HealthAdvisor />;
      case 'heatmap': return <Map3D />;
      case 'community': return <CitizenScience />;
      case 'chat': return <AIAssistant />;
      case 'settings': return <AdminPanel />;
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

        {/* Content Layer */}
        <div className="relative z-10 flex min-h-screen">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <div className="flex-1 flex flex-col w-full max-w-[1920px] mx-auto md:pl-20 transition-all">
            <Header title={getTitle()} />

            <main className="flex-1 overflow-x-hidden pb-24 md:pb-0">
              {renderContent()}
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
