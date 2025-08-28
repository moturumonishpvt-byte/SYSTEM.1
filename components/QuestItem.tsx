import React, { useState } from 'react';
import { EmergencyQuest, JobQuest, Player } from '../types';

interface QuestManagementWindowProps {
    eQuests: EmergencyQuest[];
    setEQuests: React.Dispatch<React.SetStateAction<EmergencyQuest[]>>;
    jQuests: JobQuest[];
    setJQuests: React.Dispatch<React.SetStateAction<JobQuest[]>>;
    player: Player;
    onCompleteEmergencyQuest: (id: string) => void;
    onCompleteJobQuest: (id: string) => void;
}

const QuestManagementWindow: React.FC<QuestManagementWindowProps> = ({ eQuests, setEQuests, jQuests, setJQuests, player, onCompleteEmergencyQuest, onCompleteJobQuest }) => {
    const [activeTab, setActiveTab] = useState<'emergency' | 'job'>('emergency');
    
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [exp, setExp] = useState(0);

    const inputStyle = "w-full bg-system-gray p-2 rounded border border-system-purple/50 focus:outline-none focus:ring-2 focus:ring-system-purple";

    const handleAddEmergencyQuest = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name.trim() || exp <= 0) return;
        const newQuest: EmergencyQuest = { id: `eq-${Date.now()}`, name, description: desc, expReward: exp, completed: false };
        setEQuests(prev => [newQuest, ...prev]);
        setName(''); setDesc(''); setExp(0);
    };

    return (
        <div className="system-panel">
            <div className="flex border-b border-system-blue/30 mb-4">
                <button onClick={() => setActiveTab('emergency')} className={`py-2 px-4 font-display ${activeTab === 'emergency' ? 'goal-text-style border-b-2 border-system-blue' : 'text-gray-500'}`}>Emergency Quests</button>
                <button onClick={() => setActiveTab('job')} className={`py-2 px-4 font-display ${activeTab === 'job' ? 'goal-text-style border-b-2 border-system-blue' : 'text-gray-500'}`}>Job Quests</button>
            </div>
            
            {activeTab === 'emergency' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-xl font-display goal-text-style mb-3">Register Emergency Quest</h3>
                         <form onSubmit={handleAddEmergencyQuest} className="space-y-3">
                            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Quest Name" className={inputStyle}/>
                            <input type="text" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" className={inputStyle}/>
                            <input type="number" min="1" value={exp} onChange={e => setExp(Number(e.target.value))} placeholder="EXP Reward" className={inputStyle}/>
                            <button type="submit" className="w-full bg-system-purple text-white py-2 rounded">Register Quest</button>
                        </form>
                    </div>
                     <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                        {eQuests.map(q => (
                            <div key={q.id} className={`p-3 rounded bg-system-gray-dark border-l-4 ${q.completed ? 'border-system-green/50 opacity-50' : 'border-system-blue/50'}`}>
                                <h4 className={`font-bold ${q.completed ? 'line-through' : ''}`}>{q.name}</h4>
                                <p className="text-sm text-gray-400">{q.description}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-system-gold font-bold" style={{textShadow: '0 0 6px #00bfff'}}>{q.expReward} EXP</span>
                                    {!q.completed && <button onClick={() => onCompleteEmergencyQuest(q.id)} className="bg-system-green text-black text-xs px-3 py-1 rounded font-bold">Complete</button>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {activeTab === 'job' && (
                 <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                    {jQuests.map(q => {
                        const canComplete = player.level >= q.levelRequirement;
                        return (
                             <div key={q.id} className={`p-3 rounded bg-system-gray-dark border-l-4 ${q.completed ? 'border-system-green' : canComplete ? 'border-system-purple' : 'border-gray-600'} ${q.completed ? 'opacity-50' : ''}`}>
                                <h4 className={`font-bold ${q.completed ? 'line-through' : ''}`}>{q.name}</h4>
                                <p className="text-sm text-gray-400">Unlock at Level {q.levelRequirement}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-system-gold font-bold" style={{textShadow: '0 0 6px #00bfff'}}>{q.expReward} EXP</span>
                                    {!q.completed && canComplete && <button onClick={() => onCompleteJobQuest(q.id)} className="bg-system-green text-black text-xs px-3 py-1 rounded font-bold">Complete</button>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default QuestManagementWindow;