import React from 'react';
import { DailyQuests, DailyQuestTask } from '../types';

interface DailyQuestWindowProps {
    dailyQuests: DailyQuests;
    setDailyQuests: React.Dispatch<React.SetStateAction<DailyQuests>>;
    onEndDay: () => void;
}


interface QuestTaskProps {
    task: DailyQuestTask;
    onToggle: (taskId: string) => void
}

const QuestTask: React.FC<QuestTaskProps> = ({ task, onToggle }) => {
    return (
        <div className="flex items-center justify-between py-2 border-b border-system-blue/10">
            <div className="flex-grow pr-4">
                <label htmlFor={`task-${task.id}`} className="cursor-pointer text-gray-300">
                    {task.name}
                </label>
                {task.note && <p className="text-sm text-gray-500 -mt-1">{task.note}</p>}
            </div>
            <div className="flex items-center space-x-4">
                <span className="font-sans text-system-gold font-bold" style={{textShadow: '0 0 6px #00bfff'}}>{task.dp} DP</span>
                <input
                    type="checkbox"
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onChange={() => onToggle(task.id)}
                    className="w-6 h-6 rounded-sm bg-black/50 border-2 border-system-blue/50 text-system-blue focus:ring-system-blue flex-shrink-0"
                />
            </div>
        </div>
    );
};

const DailyQuestWindow: React.FC<DailyQuestWindowProps> = ({ dailyQuests, setDailyQuests, onEndDay }) => {
    const handleToggle = (taskId: string) => {
        setDailyQuests(prev => {
            const newQuests = { ...prev };
            for (const key in newQuests) {
                const category = newQuests[key];
                const taskIndex = category.tasks.findIndex(t => t.id === taskId);
                if (taskIndex !== -1) {
                    const updatedTasks = [...category.tasks];
                    updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], completed: !updatedTasks[taskIndex].completed };
                    newQuests[key] = { ...category, tasks: updatedTasks };
                    break;
                }
            }
            return newQuests;
        });
    };

    const allTasks = Object.values(dailyQuests).flatMap(c => c.tasks);
    const allTasksCompleted = allTasks.every(t => t.completed);

    return (
        <div className="system-panel max-w-3xl mx-auto">
            <div className="flex items-center space-x-4 border-b-2 border-system-blue/30 pb-4 mb-4">
                <div className="border-2 border-system-blue rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                </div>
                <div className="system-header-box">
                    <h2 className="text-2xl font-display goal-text-style">QUEST INFO</h2>
                </div>
            </div>

            <p className="text-center text-gray-400 mb-4">[Daily Quests have arrived.]</p>
            
            <div className="mb-6">
                <h3 className="text-xl font-display text-center mb-4 goal-text-style">GOAL</h3>
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                    {Object.values(dailyQuests).map(category => (
                        <div key={category.name}>
                            <h4 className="font-display text-system-purple mb-2 text-lg border-b border-system-purple/20 pb-1">
                                {category.name} 
                                <span className="text-sm font-sans text-gray-400 ml-2">
                                    ({category.tasks.filter(t => t.completed).length} / {category.tasks.length})
                                </span>
                            </h4>
                            <div className="space-y-2 pl-2">
                                {category.tasks.map(task => (
                                    <QuestTask key={task.id} task={task} onToggle={handleToggle} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center p-4 border border-system-red/50 bg-red-900/20 rounded-lg mb-6">
                <p className="font-bold text-system-red">WARNING</p>
                <p className="text-gray-300">Failure to complete the daily quests will result in a <span className="font-bold text-system-red">500 EXP setback</span> and a <span className="font-bold text-system-red">+2 increase in Fatigue</span>.</p>
            </div>

            <div className="text-center">
                 <button
                    onClick={onEndDay}
                    disabled={!allTasksCompleted}
                    className={`w-20 h-20 border-2 rounded-md transition-all duration-300 ${
                        allTasksCompleted 
                        ? 'border-system-green text-system-green shadow-glow-blue bg-green-500/10 hover:bg-green-500/20' 
                        : 'border-gray-600 text-gray-600 cursor-not-allowed'
                    }`}
                    aria-label="Complete Daily Quest"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default DailyQuestWindow;