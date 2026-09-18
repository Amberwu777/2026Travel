import React from 'react';
import { Calendar, Info, Wallet, PenLine } from 'lucide-react';

export type MainTabType = 'itinerary' | 'notes' | 'travelInfo' | 'budget';

interface BottomNavProps {
  activeTab: MainTabType;
  onChangeTab: (tab: MainTabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'itinerary' as MainTabType, label: '行程攻略', icon: Calendar },
    { id: 'notes' as MainTabType, label: '筆記', icon: PenLine },
    { id: 'travelInfo' as MainTabType, label: '手冊', icon: Info },
    { id: 'budget' as MainTabType, label: '記帳', icon: Wallet },
  ];

  return (
    <nav 
      id="bottom-app-nav" 
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E8E2D6] py-1.5 px-2 shadow-lg safe-area-bottom"
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all duration-150 flex-1 ${
                isActive ? 'text-[#2C2A29] scale-[1.03]' : 'text-[#877E74] hover:text-[#4A443B]'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-[#EFE9DF]' : 'bg-transparent'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#2C2A29]' : 'text-[#877E74]'}`} />
              </div>
              <span className={`text-xs mt-0.5 font-medium whitespace-nowrap ${isActive ? 'text-[#2C2A29] font-bold' : 'text-[#877E74]'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
