import React from 'react';
import { Player, Stat } from '../types';
import { Brain, Dumbbell, Footprints, Heart, Eye, PlusCircle, Shield, Loader } from './icons/StatIcons';

interface StatusWindowProps {
  player: Player;
  onAllocateStat: (stat: Stat) => void;
}

const StatDisplay: React.FC<{ icon: React.ReactNode, label: Stat, value: number, canAllocate: boolean, onAllocate: () => void }> = ({ icon, label, value, canAllocate, onAllocate }) => (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center space-x-3">
        <span className="text-system-blue text-2xl">{icon}</span>
        <span className="font-bold text-lg">{label}</span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-2xl font-display text-system-blue-light">{Math.round(value)}</span>
        {canAllocate && (
          <button onClick={onAllocate} className="w-6 h-6 bg-system-gold text-system-black rounded-full font-bold text-lg leading-none transform transition-transform hover:scale-110 hover:shadow-glow-gold" aria-label={`Increase ${label}`}>+</button>
        )}
      </div>
    </div>
);

const ResourceBar: React.FC<{ icon: React.ReactNode, value: number, max: number, label: string, barColor: string, glowColor: string }> = ({ icon, value, max, label, barColor, glowColor }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center space-x-4">
        <div className="text-system-blue text-3xl">{icon}</div>
        <div className="flex-grow">
            <div className="flex justify-between items-baseline mb-1">
                <span className="font-bold text-base">{label}</span>
                <span className="font-sans text-sm">{Math.round(value)} / {Math.round(max)}</span>
            </div>
            <div className="system-stat-bar">
                <div 
                  className="transition-all duration-500 ease-out" 
                  style={{ 
                    width: `${percentage}%`, 
                    '--bar-color': barColor,
                    '--glow-color': glowColor,
                  } as React.CSSProperties}
                ></div>
            </div>
        </div>
    </div>
  );
};

const StatusWindow: React.FC<StatusWindowProps> = ({ player, onAllocateStat }) => {
  const canAllocate = player.statPoints > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-5 system-panel">
            <div className="border-b-2 border-system-blue/30 pb-4 mb-4">
                <div className="text-center mb-4">
                    <div className="system-header-box inline-block">
                        <h2 className="text-2xl font-display goal-text-style">STATUS</h2>
                    </div>
                </div>
                <div className="flex justify-between items-end">
                    <div className="w-1/4"></div>
                    <div className="text-center w-1/2">
                        <p className="text-8xl font-display font-black text-white" style={{textShadow: '0 0 10px #fff'}}>{player.level}</p>
                        <p className="text-2xl font-display text-gray-400 -mt-2 tracking-widest">LEVEL</p>
                    </div>
                    <div className="w-1/4 text-right space-y-1">
                        {player.job !== "No Job" && (
                            <p className="text-lg goal-text-style">
                                <span className="text-sm font-sans text-gray-400">Job: </span>
                                {player.job}
                            </p>
                        )}
                        {player.title !== "No Title" && (
                            <p className="text-lg goal-text-style">
                                <span className="text-sm font-sans text-gray-400">Title: </span>
                                {player.title}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-4 mb-6 px-4">
                <ResourceBar icon={<PlusCircle />} value={player.hp} max={player.maxHp} label="HP" barColor="#4cff4c" glowColor="rgba(76, 255, 76, 0.7)" />
                <ResourceBar icon={<Shield />} value={player.mp} max={player.maxMp} label="MP" barColor="#9370db" glowColor="rgba(147, 112, 219, 0.7)" />
                <ResourceBar icon={<Loader />} value={player.fatigue} max={100} label="FATIGUE" barColor="#aaaaaa" glowColor="rgba(170, 170, 170, 0.7)" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 border-t-2 border-system-blue/30 pt-4 mt-4">
                <StatDisplay icon={<Dumbbell />} label={Stat.Strength} value={player.stats.STR} canAllocate={canAllocate} onAllocate={() => onAllocateStat(Stat.Strength)} />
                <StatDisplay icon={<Heart />} label={Stat.Vitality} value={player.stats.VIT} canAllocate={canAllocate} onAllocate={() => onAllocateStat(Stat.Vitality)} />
                <StatDisplay icon={<Footprints />} label={Stat.Agility} value={player.stats.AGI} canAllocate={canAllocate} onAllocate={() => onAllocateStat(Stat.Agility)} />
                <StatDisplay icon={<Brain />} label={Stat.Intelligence} value={player.stats.INT} canAllocate={canAllocate} onAllocate={() => onAllocateStat(Stat.Intelligence)} />
                <StatDisplay icon={<Eye />} label={Stat.Perception} value={player.stats.PER} canAllocate={canAllocate} onAllocate={() => onAllocateStat(Stat.Perception)} />
                {canAllocate && (
                    <div className="flex flex-col items-center justify-center p-2 text-center">
                        <p className="font-sans text-sm text-gray-400">Available Ability</p>
                        <p className="font-sans text-sm text-gray-400 mb-1">Points</p>
                        <p className="text-6xl font-display text-system-gold animate-pulse" style={{textShadow: '0 0 8px #00bfff'}}>{player.statPoints}</p>
                    </div>
                )}
            </div>

        </div>
    </div>
  );
};

export default StatusWindow;