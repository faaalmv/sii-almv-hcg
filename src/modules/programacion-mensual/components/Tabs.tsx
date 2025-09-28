import React, { useState, useEffect, useRef } from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  const [sliderStyle, setSliderStyle] = useState<{ width?: number; transform?: string }>({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  
  useEffect(() => {
    tabsRef.current = tabsRef.current.slice(0, tabs.length);
  }, [tabs]);

  useEffect(() => {
    const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    const activeTabNode = tabsRef.current[activeTabIndex];

    if (activeTabNode) {
      setSliderStyle({
        width: activeTabNode.offsetWidth,
        transform: `translateX(${activeTabNode.offsetLeft}px)`,
      });
    }
  }, [activeTab, tabs]);

  return (
    <div className="mb-6">
      <div 
        className="relative inline-flex items-center justify-start bg-gray-100 rounded-lg p-1" 
        role="tablist" 
        aria-label="Main navigation"
      >
        <div
          className="absolute top-1 bottom-1 h-auto bg-white rounded-[7px] shadow-sm transition-transform"
          style={{
            ...sliderStyle,
            transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          role="presentation"
        />
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            ref={el => {tabsRef.current[index] = el;}}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`relative z-10 px-5 py-1.5 text-sm transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 rounded-md ${
              activeTab === tab.id
                ? 'font-semibold text-slate-800'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;