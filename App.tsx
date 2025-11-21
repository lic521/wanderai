import React, { useState, useEffect } from 'react';
import { PlannerForm } from './components/PlannerForm';
import { ItineraryView } from './components/ItineraryView';
import { Sidebar } from './components/Sidebar';
import { Spinner } from './components/Spinner';
import { TripInput, ItineraryData, SavedTrip, ViewState } from './types';
import { generateItinerary } from './services/geminiService';
import { Compass, Menu, PlusCircle } from 'lucide-react';

const STORAGE_KEY = 'wanderai_plans';

function App() {
  const [view, setView] = useState<ViewState>(ViewState.FORM);
  const [currentPlan, setCurrentPlan] = useState<ItineraryData | null>(null);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [currentInput, setCurrentInput] = useState<TripInput | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedTrip[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedPlans(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save to localStorage whenever savedPlans changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPlans));
  }, [savedPlans]);

  const handleFormSubmit = async (input: TripInput) => {
    setLoading(true);
    setView(ViewState.LOADING);
    setCurrentInput(input);

    try {
      const data = await generateItinerary(input);
      
      const newId = crypto.randomUUID();
      // Automatically save successful generations
      const newTrip: SavedTrip = {
        id: newId,
        createdAt: Date.now(),
        input,
        data
      };
      
      setSavedPlans(prev => [...prev, newTrip]);
      setCurrentPlan(data);
      setCurrentPlanId(newId);
      setView(ViewState.RESULT);
    } catch (error: any) {
      console.error(error);
      alert(`生成行程时出现问题: ${error.message || "请检查网络或重试"}`);
      setView(ViewState.FORM);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadPlan = (plan: SavedTrip) => {
    setCurrentPlan(plan.data);
    setCurrentPlanId(plan.id);
    setCurrentInput(plan.input);
    setView(ViewState.RESULT);
    setIsSidebarOpen(false);
  };

  const handleUpdatePlan = (updatedData: ItineraryData) => {
    setCurrentPlan(updatedData);
    
    if (currentPlanId) {
        setSavedPlans(prev => prev.map(p => 
            p.id === currentPlanId ? { ...p, data: updatedData } : p
        ));
    }
  };

  const handleDeletePlan = (id: string) => {
    if (window.confirm("确定要删除这个行程吗？")) {
      setSavedPlans(prev => prev.filter(p => p.id !== id));
      // If we deleted the currently viewed plan, go back to form
      if (view === ViewState.RESULT && currentPlanId === id) {
        setView(ViewState.FORM);
        setCurrentPlan(null);
        setCurrentPlanId(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => { setView(ViewState.FORM); setCurrentPlan(null); setCurrentPlanId(null); }}
          >
            <div className="bg-blue-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">Wander<span className="text-blue-600">AI</span></span>
          </div>

          <div className="flex items-center space-x-4">
            {view === ViewState.RESULT && (
              <button 
                onClick={() => { setView(ViewState.FORM); setCurrentPlan(null); setCurrentPlanId(null); }}
                className="hidden md:flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                <PlusCircle className="w-4 h-4 mr-1" /> 新行程
              </button>
            )}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full relative transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
              {savedPlans.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)]">
        {view === ViewState.FORM && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-10 space-y-2">
               <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight">
                 规划您的下一次 <br className="hidden md:block" />
                 <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-400">梦想之旅</span>
               </h1>
               <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                 由先进的 AI 驱动，只需几秒钟即可为您量身定制全球任何目的地的每日行程。
               </p>
            </div>
            <PlannerForm onSubmit={handleFormSubmit} isGenerating={loading} />
          </div>
        )}

        {view === ViewState.LOADING && (
          <div className="flex items-center justify-center h-[60vh]">
            <Spinner />
          </div>
        )}

        {view === ViewState.RESULT && currentPlan && (
          <ItineraryView data={currentPlan} onUpdate={handleUpdatePlan} />
        )}
      </main>

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        savedPlans={savedPlans}
        onSelectPlan={handleLoadPlan}
        onDeletePlan={handleDeletePlan}
      />
    </div>
  );
}

export default App;