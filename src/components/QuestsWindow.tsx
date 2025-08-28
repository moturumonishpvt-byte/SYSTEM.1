import React, { useState } from 'react';
import { DailyQuests, EmergencyQuest, JobQuest, Player } from '../types';
import DailyQuestWindow from './QuestLog';
import QuestManagementWindow from './QuestItem';

interface QuestsWindowProps {
    dailyQuests: DailyQuests;
    setDailyQuests: React.Dispatch<React.SetStateAction<DailyQuests>>;
    onEndDay: () => void;
    eQuests: EmergencyQuest[];
    setEQuests: React.Dispatch<React.SetStateAction<EmergencyQuest[]>>;
    jQuests: JobQuest[];
    setJQuests: React.Dispatch<React.SetStateAction<JobQuest[]>>;
    player: Player;
    onCompleteEmergencyQuest: (id: string) => void;
    onCompleteJobQuest: (id: string) => void;
}

const QuestsWindow: React.FC<QuestsWindowProps> = (props) => {
    const [activeTab, setActiveTab] = useState<'daily' | 'other'>('daily');

    return (
        <div>
            <div className="flex border-b border-system-blue/30 mb-4 justify-center">
                <button onClick={() => setActiveTab('daily')} className={`py-2 px-4 font-display text-lg ${activeTab === 'daily' ? 'goal-text-style border-b-2 border-system-blue' : 'text-gray-500'}`}>Daily Quests</button>
                <button onClick={() => setActiveTab('other')} className={`py-2 px-4 font-display text-lg ${activeTab === 'other' ? 'goal-text-style border-b-2 border-system-blue' : 'text-gray-500'}`}>Other Quests</button>
            </div>
            
            {activeTab === 'daily' && (
                <DailyQuestWindow
                    dailyQuests={props.dailyQuests}
                    setDailyQuests={props.setDailyQuests}
                    onEndDay={props.onEndDay}
                />
            )}
            
            {activeTab === 'other' && (
                <QuestManagementWindow
                    eQuests={props.eQuests}
                    setEQuests={props.setEQuests}
                    jQuests={props.jQuests}
                    setJQuests={props.setJQuests}
                    player={props.player}
                    onCompleteEmergencyQuest={props.onCompleteEmergencyQuest}
                    onCompleteJobQuest={props.onCompleteJobQuest}
                />
            )}
        </div>
    );
};

export default QuestsWindow;