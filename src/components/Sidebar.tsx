import React, { useState } from 'react';
import { AppView } from '../types';
import { StatusIcon, QuestsIcon, SkillsIcon, InventoryIcon, ShopIcon, ResetIcon, ChevronRight, ChevronLeft } from './icons/NavIcons';

interface SidebarProps {
    activeView: AppView;
    setActiveView: (view: AppView) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isExpanded: boolean;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isExpanded, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex items-center w-full h-12 px-3 rounded-lg transition-colors duration-200 ${
            isActive 
            ? 'bg-system-blue text-system-black' 
            : 'text-gray-400 hover:bg-system-gray-light hover:text-white'
        }`}
        aria-label={label}
    >
        <span className={`${isActive ? '' : 'text-system-blue-light'}`}>{icon}</span>
        {isExpanded && <span className="ml-4 font-display">{label}</span>}
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const navItems = [
        { view: AppView.Status, icon: <StatusIcon />, label: 'Status' },
        { view: AppView.Quests, icon: <QuestsIcon />, label: 'Quests' },
        { view: AppView.Skills, icon: <SkillsIcon />, label: 'Skills' },
        { view: AppView.Inventory, icon: <InventoryIcon />, label: 'Inventory' },
        { view: AppView.Shop, icon: <ShopIcon />, label: 'Shop' },
        { view: AppView.Reset, icon: <ResetIcon />, label: 'Reset' },
    ];

    return (
        <aside className={`flex flex-col bg-black/50 border-r border-system-blue/30 transition-all duration-300 ease-in-out ${isExpanded ? 'w-56' : 'w-20'}`}>
            <div className="h-20 flex items-center justify-center border-b border-system-blue/30 text-center">
                {isExpanded ? (
                    <h1 className="text-2xl font-display goal-text-style animate-pulse">S.Y.S.T.E.M</h1>
                ) : (
                    null
                )}
            </div>
            <div className="flex-grow p-2 space-y-2">
                {navItems.map(item => (
                    <NavItem 
                        key={item.view}
                        icon={item.icon}
                        label={item.label}
                        isExpanded={isExpanded}
                        isActive={activeView === item.view}
                        onClick={() => setActiveView(item.view)}
                    />
                ))}
            </div>
            <div className="p-2 border-t border-system-blue/30">
                <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center w-full h-12 px-3 text-gray-400 hover:bg-system-gray-light hover:text-white rounded-lg">
                    {isExpanded ? <ChevronLeft /> : <ChevronRight />}
                    {isExpanded && <span className="ml-4 font-display">Collapse</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;