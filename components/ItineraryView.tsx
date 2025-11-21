import React, { useState } from 'react';
import { ItineraryData, Activity } from '../types';
import { Calendar, MapPin, Clock, Wallet, Bus, Map as MapIcon, ArrowLeft, Navigation2 } from 'lucide-react';

interface ItineraryViewProps {
  data: ItineraryData;
  onUpdate: (updatedData: ItineraryData) => void;
}

type TabMode = 'PLAN' | 'TRANSPORT';

export const ItineraryView: React.FC<ItineraryViewProps> = ({ data, onUpdate }) => {
  const [mode, setMode] = useState<TabMode>('PLAN');

  const handleMainInfoChange = (field: keyof ItineraryData, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  const handleDayThemeChange = (dayIndex: number, value: string) => {
    const newDays = [...data.days];
    newDays[dayIndex] = { ...newDays[dayIndex], theme: value };
    onUpdate({ ...data, days: newDays });
  };

  const handleActivityChange = (dayIndex: number, activityIndex: number, field: keyof Activity, value: string) => {
    const newDays = [...data.days];
    const newActivities = [...newDays[dayIndex].activities];
    newActivities[activityIndex] = { ...newActivities[activityIndex], [field]: value };
    newDays[dayIndex] = { ...newDays[dayIndex], activities: newActivities };
    onUpdate({ ...data, days: newDays });
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 animate-fade-in">
      {/* Minimal Header */}
      <div className="mb-8 text-center">
        <input
          className="w-full bg-transparent text-3xl md:text-4xl font-black text-gray-900 mb-2 text-center outline-none border-b-2 border-transparent hover:border-gray-200 focus:border-blue-600 transition-all placeholder-gray-300"
          value={data.tripTitle}
          onChange={(e) => handleMainInfoChange('tripTitle', e.target.value)}
        />
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
           <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {data.destination}</span>
           <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
           <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {data.duration} 天</span>
           <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
           <span className="flex items-center"><Wallet className="w-4 h-4 mr-1" /> {data.budgetEstimate}</span>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="sticky top-20 z-20 bg-gray-50/95 backdrop-blur-sm py-4 mb-6 flex justify-center">
        <div className="bg-white p-1 rounded-full border border-gray-200 shadow-sm inline-flex">
          <button
            onClick={() => setMode('PLAN')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              mode === 'PLAN' 
                ? 'bg-gray-900 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            行程安排
          </button>
          <button
            onClick={() => setMode('TRANSPORT')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center ${
              mode === 'TRANSPORT' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Bus className="w-4 h-4 mr-2" />
            交通路书
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {data.days.map((day, dayIndex) => (
          <div key={dayIndex} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Day Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3 w-full">
                <span className="bg-gray-900 text-white text-xs font-bold px-2.5 py-1 rounded">DAY {day.dayNumber}</span>
                <input
                  className="bg-transparent font-bold text-lg text-gray-800 w-full outline-none"
                  value={day.theme}
                  onChange={(e) => handleDayThemeChange(dayIndex, e.target.value)}
                />
              </div>
            </div>

            <div className="p-6">
              {mode === 'PLAN' ? (
                // PLAN MODE VIEW
                <div className="space-y-8">
                  {day.activities.map((act, actIndex) => (
                    <div key={actIndex} className="group relative pl-8 border-l-2 border-gray-100 last:border-l-0 pb-8 last:pb-0">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white bg-gray-300 group-hover:bg-blue-500 transition-colors shadow-sm"></div>
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex items-baseline justify-between">
                          <input 
                             className="text-sm font-bold text-blue-600 bg-transparent outline-none w-32"
                             value={act.time}
                             onChange={(e) => handleActivityChange(dayIndex, actIndex, 'time', e.target.value)}
                          />
                          <input
                            className="text-xs text-gray-400 text-right bg-transparent outline-none hover:text-gray-600"
                            value={act.costEstimate || ''}
                            onChange={(e) => handleActivityChange(dayIndex, actIndex, 'costEstimate', e.target.value)}
                            placeholder="费用"
                          />
                        </div>

                        <input 
                            className="text-xl font-bold text-gray-900 bg-transparent outline-none border-b border-transparent hover:border-gray-200 focus:border-blue-500 transition-all placeholder-gray-400"
                            value={act.activity}
                            onChange={(e) => handleActivityChange(dayIndex, actIndex, 'activity', e.target.value)}
                        />

                        <textarea
                          className="w-full text-gray-600 text-sm leading-relaxed bg-transparent outline-none resize-none focus:bg-gray-50 rounded transition-colors"
                          rows={2}
                          value={act.description}
                          onChange={(e) => handleActivityChange(dayIndex, actIndex, 'description', e.target.value)}
                        />

                        <div className="flex items-start gap-2 mt-2 bg-gray-50 p-3 rounded-lg">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="w-full">
                            <input 
                              className="bg-transparent outline-none text-sm font-medium text-gray-700 w-full mb-1"
                              value={act.location}
                              onChange={(e) => handleActivityChange(dayIndex, actIndex, 'location', e.target.value)}
                              placeholder="地点名称"
                            />
                            <input 
                              className="bg-transparent outline-none text-xs text-gray-500 w-full border-b border-dashed border-gray-200 hover:border-gray-400"
                              value={act.address || ''}
                              onChange={(e) => handleActivityChange(dayIndex, actIndex, 'address', e.target.value)}
                              placeholder="输入具体地址..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // TRANSPORT MODE VIEW
                <div className="space-y-6">
                   {day.activities.map((act, actIndex) => (
                     <div key={actIndex} className="relative">
                       {/* The Route Line */}
                       {actIndex < day.activities.length && (
                         <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-blue-100"></div>
                       )}

                       {/* Location Header */}
                       <div className="flex items-center gap-3 mb-4 relative z-10">
                         <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center shadow-sm text-gray-400 shrink-0">
                            <span className="text-xs font-bold">{act.time.split(':')[0]}时</span>
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="text-base font-bold text-gray-900 truncate">{act.location}</div>
                           <div className="text-xs text-gray-500 truncate">{act.address}</div>
                         </div>
                       </div>

                       {/* Transport Detail Card */}
                       {actIndex < day.activities.length - 1 && (
                         <div className="ml-6 pl-8 pb-8 relative">
                            {/* Connection Icon */}
                            <div className="absolute left-0 top-0 -translate-x-1/2 mt-2 bg-blue-50 p-1.5 rounded-full border border-blue-100 text-blue-600">
                              <Navigation2 className="w-4 h-4" />
                            </div>
                            
                            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 hover:border-blue-300 transition-all group cursor-text">
                              <div className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider flex items-center gap-1">
                                下一站交通方案
                              </div>
                              <textarea 
                                className="w-full bg-transparent text-sm text-gray-700 leading-relaxed outline-none resize-none"
                                rows={2}
                                value={day.activities[actIndex + 1].transport || ''}
                                onChange={(e) => handleActivityChange(dayIndex, actIndex + 1, 'transport', e.target.value)}
                                placeholder="输入具体交通路线..."
                              />
                            </div>
                         </div>
                       )}
                     </div>
                   ))}
                   
                   {/* End of Day */}
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-50 border-2 border-gray-100 flex items-center justify-center text-gray-300 shrink-0">
                         <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      </div>
                      <div className="text-sm text-gray-400 font-medium">今日行程结束</div>
                   </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info Cards - Only in Plan Mode */}
      {mode === 'PLAN' && (
        <div className="mt-8 grid grid-cols-1 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wider">备注信息</h3>
            <textarea 
              className="w-full text-sm text-gray-600 bg-transparent outline-none resize-none"
              rows={3}
              value={data.summary}
              onChange={(e) => handleMainInfoChange('summary', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};