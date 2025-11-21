import React, { useState } from 'react';
import { TripInput } from '../types';
import { MapPin, Calendar, Users, DollarSign, Heart, ArrowRight, Sparkles } from 'lucide-react';

interface PlannerFormProps {
  onSubmit: (input: TripInput) => void;
  isGenerating: boolean;
}

const INTEREST_OPTIONS = [
  "历史文化", "美食探店", "自然风光", 
  "艺术博物馆", "购物", "夜生活", "休闲放松", "户外探险"
];

export const PlannerForm: React.FC<PlannerFormProps> = ({ onSubmit, isGenerating }) => {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(3);
  const [travelers, setTravelers] = useState('情侣/夫妻');
  const [budget, setBudget] = useState('适中');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      destination,
      duration,
      travelers,
      budget,
      interests: selectedInterests
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 space-y-8 border border-gray-100">
      
      <div className="space-y-6">
        {/* Destination */}
        <div className="space-y-2">
          <label className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-wider">
            目的地
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="例如：东京, 巴黎, 巴厘岛"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-xl text-lg font-medium focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all placeholder-gray-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Duration */}
          <div className="space-y-2">
            <label className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-wider">
              天数
            </label>
            <div className="relative">
               <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input
                type="number"
                min="1"
                max="14"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Travelers */}
          <div className="space-y-2">
            <label className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-wider">
              同行
            </label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all appearance-none"
              >
                <option>独自一人</option>
                <option>情侣/夫妻</option>
                <option>家庭亲子</option>
                <option>朋友结伴</option>
              </select>
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <label className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-wider">
              预算
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all appearance-none"
              >
                <option>穷游</option>
                <option>适中</option>
                <option>豪华</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-3 pt-2">
          <label className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-wider">
            兴趣偏好
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  selectedInterests.includes(interest)
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isGenerating || !destination}
        className={`w-full py-4 rounded-xl flex items-center justify-center text-white font-bold text-lg transition-all transform active:scale-[0.99] ${
          isGenerating 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30'
        }`}
      >
        {isGenerating ? (
          <span className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2 animate-spin" /> 正在生成行程...
          </span>
        ) : (
          <>
            生成旅行计划 <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </button>
    </form>
  );
};