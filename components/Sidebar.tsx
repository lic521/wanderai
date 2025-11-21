import React from 'react';
import { SavedTrip } from '../types';
import { Trash2, Map, ChevronRight, Clock } from 'lucide-react';

interface SidebarProps {
  savedPlans: SavedTrip[];
  onSelectPlan: (plan: SavedTrip) => void;
  onDeletePlan: (id: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ savedPlans, onSelectPlan, onDeletePlan, onClose, isOpen }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600" /> 历史记录
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedPlans.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Map className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>暂无保存的行程。</p>
              <p className="text-sm">快去创建你的第一个旅行计划吧！</p>
            </div>
          ) : (
            savedPlans.slice().reverse().map((plan) => (
              <div 
                key={plan.id} 
                className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
                onClick={() => onSelectPlan(plan)}
              >
                <div className="pr-6">
                    <h3 className="font-bold text-gray-800 truncate">{plan.data.tripTitle}</h3>
                    <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                        <span>{new Date(plan.createdAt).toLocaleDateString()}</span>
                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{plan.input.duration} 天</span>
                    </div>
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeletePlan(plan.id); }}
                  className="absolute top-4 right-3 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  title="删除行程"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div className="absolute bottom-4 right-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-center text-xs text-gray-400">
          保存在本地浏览器中
        </div>
      </div>
    </>
  );
};