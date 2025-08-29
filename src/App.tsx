import React, { useState, useEffect } from 'react';
import { Player, Stat, AppView, DailyQuests, EmergencyQuest, JobQuest, Skill, InventoryItem, ShopItem, Notification } from './types';
import { INITIAL_PLAYER, getInitialDailyQuests, getInitialJobQuests, calculateLevelFromExp, calculateExpForLevel, getRankForLevel, getTitleForLevel, getJobForLevel, calculateMaxHp, calculateMaxMp } from './services/geminiService';

import StatusWindow from './components/PlayerStats';
import SkillWindow from './components/QuestGenerator';
import InventoryShopWindow from './components/SystemMessages';
import QuestsWindow from './components/QuestsWindow';
import Sidebar from './components/Sidebar';
import ResetWindow from './components/ResetWindow';
import Login from './components/Login';
import NotificationContainer from './components/NotificationContainer';

const LS_PREFIX = 'level-up-life-rpg:';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const saved = localStorage.getItem(`${LS_PREFIX}isAuthenticated`);
        try { return saved ? JSON.parse(saved) : false; } catch { return false; }
    });
    const [player, setPlayer] = useState<Player>(() => {
        const saved = localStorage.getItem(`${LS_PREFIX}player`);
        try { return saved ? JSON.parse(saved) : INITIAL_PLAYER; } catch { return INITIAL_PLAYER; }
    });
    const [dailyQuests, setDailyQuests] = useState<DailyQuests>(() => {
        const saved = localStorage.getItem(`${LS_PREFIX}dailyQuests`);
        try { return saved ? JSON.parse(saved) : getInitialDailyQuests(); } catch { return getInitialDailyQuests(); }
    });
    const [emergencyQuests, setEmergencyQuests] = useState<EmergencyQuest[]>(() => {
        const saved = localStorage.getItem(`${LS_PREFIX}emergencyQuests`);
        try { return saved ? JSON.parse(saved) : []; } catch { return []; }
    });
    const [jobQuests, setJobQuests] = useState<JobQuest[]>(() => {
        const saved = localStorage.getItem(`${LS_PREFIX}jobQuests`);
        try { return saved ? JSON.parse(saved) : getInitialJobQuests(); } catch { return getInitialJobQuests(); }
    });
    const [skills, setSkills] = useState<Skill[]>(() => {
        const saved = localStorage.getItem(`${LS_PREFIX}skills`);
        try { return saved ? JSON.parse(saved) : []; } catch { return []; }
    });
    const [inventory, setInventory] = useState<InventoryItem[]>(() => {
        const saved = localStorage.getItem(`${LS_PREFIX}inventory`);
        try { return saved ? JSON.parse(saved) : []; } catch { return []; }
    });
    const [shop, setShop] = useState<ShopItem[]>(() => {
        const saved = localStorage.getItem(`${LS_PREFIX}shop`);
        try { return saved ? JSON.parse(saved) : []; } catch { return []; }
    });
    const [activeView, setActiveView] = useState<AppView>(() => {
        return (localStorage.getItem(`${LS_PREFIX}activeView`) as AppView) || AppView.Status
    });
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => { localStorage.setItem(`${LS_PREFIX}isAuthenticated`, JSON.stringify(isAuthenticated)) }, [isAuthenticated]);
    useEffect(() => { localStorage.setItem(`${LS_PREFIX}player`, JSON.stringify(player)) }, [player]);
    useEffect(() => { localStorage.setItem(`${LS_PREFIX}dailyQuests`, JSON.stringify(dailyQuests)) }, [dailyQuests]);
    useEffect(() => { localStorage.setItem(`${LS_PREFIX}emergencyQuests`, JSON.stringify(emergencyQuests)) }, [emergencyQuests]);
    useEffect(() => { localStorage.setItem(`${LS_PREFIX}jobQuests`, JSON.stringify(jobQuests)) }, [jobQuests]);
    useEffect(() => { localStorage.setItem(`${LS_PREFIX}skills`, JSON.stringify(skills)) }, [skills]);
    useEffect(() => { localStorage.setItem(`${LS_PREFIX}inventory`, JSON.stringify(inventory)) }, [inventory]);
    useEffect(() => { localStorage.setItem(`${LS_PREFIX}shop`, JSON.stringify(shop)) }, [shop]);
    useEffect(() => { localStorage.setItem(`${LS_PREFIX}activeView`, activeView) }, [activeView]);

    const addNotification = (title: string, message: string, type: Notification['type'] = 'system') => {
        const id = Date.now();
        setNotifications(prev => [...prev.slice(-4), { id, title, message, type }]);
    };

    const dismissNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    useEffect(() => {
        const handleDailyReset = () => {
            const lastResetStr = localStorage.getItem(`${LS_PREFIX}lastResetDate`);
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];

            if (!lastResetStr) {
                localStorage.setItem(`${LS_PREFIX}lastResetDate`, todayStr);
                return;
            }
            if (lastResetStr >= todayStr) return;

            const allTasks = Object.values(dailyQuests).flatMap(c => c.tasks);
            const allCompleted = allTasks.every(t => t.completed);

            if (!allCompleted) {
                addNotification('PENALTY', 'Daily Quest failed. 500 EXP deducted and 2 fatigue points added.', 'penalty');
                setPlayer(p => {
                    const newTotalExp = Math.max(0, p.totalExp - 500);
                    const newLevel = calculateLevelFromExp(newTotalExp);
                    const completedJobs = jobQuests.filter(q => q.completed).map(q => q.name);
                    return {
                        ...p,
                        totalExp: newTotalExp,
                        level: newLevel,
                        rank: getRankForLevel(newLevel),
                        title: getTitleForLevel(newLevel),
                        job: getJobForLevel(newLevel, completedJobs),
                        expToNextLevel: calculateExpForLevel(newLevel + 1),
                        fatigue: Math.min(100, p.fatigue + 2),
                    };
                });
            }

            setDailyQuests(getInitialDailyQuests());
            addNotification('SYSTEM', 'Daily Quest has been reset. New day, new challenges!', 'system');
            localStorage.setItem(`${LS_PREFIX}lastResetDate`, todayStr);
        };
        handleDailyReset();
    }, []);

    const processPlayerUpdate = (oldPlayer: Player, updatedState: Partial<Player>, completedJobs: string[]) => {
        const newTotalExp = updatedState.totalExp ?? oldPlayer.totalExp;
        const newLevel = calculateLevelFromExp(newTotalExp);

        let newStatPoints = updatedState.statPoints ?? oldPlayer.statPoints;
        const leveledUp = newLevel > oldPlayer.level;
        if (leveledUp) {
            for (let i = oldPlayer.level + 1; i <= newLevel; i++) {
                newStatPoints += 3 + Math.round(i / 10);
            }
        }

        const newStats = updatedState.stats ?? oldPlayer.stats;
        const newMaxHp = calculateMaxHp(newStats.VIT);
        const newMaxMp = calculateMaxMp(newStats.INT);
        const newRank = getRankForLevel(newLevel);
        const newTitle = getTitleForLevel(newLevel);
        const newJob = getJobForLevel(newLevel, completedJobs);

        const newPlayerState: Player = {
            ...oldPlayer,
            ...updatedState,
            totalExp: newTotalExp,
            level: newLevel,
            rank: newRank,
            title: newTitle,
            job: newJob,
            expToNextLevel: calculateExpForLevel(newLevel + 1),
            statPoints: newStatPoints,
            stats: newStats,
            maxHp: newMaxHp,
            hp: leveledUp ? newMaxHp : (updatedState.hp ?? oldPlayer.hp),
            maxMp: newMaxMp,
            mp: leveledUp ? newMaxMp : (updatedState.mp ?? oldPlayer.mp),
        };

        if (newLevel > oldPlayer.level) {
            addNotification("LEVEL UP!", `You have reached level ${newLevel}.`, 'levelup');
        }
        if (newTitle !== oldPlayer.title && newTitle !== "No Title") {
            addNotification("TITLE ACQUIRED", `You have acquired the title: ${newTitle}.`, 'title');
        }
        if (newJob !== oldPlayer.job && newJob !== "No Job") {
             addNotification("JOB CHANGE", `Your job has changed to ${newJob}.`, 'system');
        }

        return newPlayerState;
    };

    const completeEmergencyQuest = (id: string) => {
        const quest = emergencyQuests.find(q => q.id === id);
        if (quest && !quest.completed) {
            addNotification("QUEST COMPLETE", `Completed: ${quest.name}. ${quest.expReward} EXP gained.`, 'quest');
            setPlayer(p => processPlayerUpdate(p, { totalExp: p.totalExp + quest.expReward }, jobQuests.filter(jq => jq.completed).map(jq => jq.name)));
            setEmergencyQuests(quests => quests.map(q => q.id === id ? {...q, completed: true} : q));
        }
    };

    const completeJobQuest = (id: string) => {
        const quest = jobQuests.find(q => q.id === id);
        if (quest && !quest.completed && player.level >= quest.levelRequirement) {
            addNotification("QUEST COMPLETE", `Completed: ${quest.name}. ${quest.expReward} EXP gained.`, 'quest');
            const updatedJobQuests = jobQuests.map(q => q.id === id ? {...q, completed: true} : q);
            const completedJobNames = updatedJobQuests.filter(q => q.completed).map(q => q.name);
            setJobQuests(updatedJobQuests);
            setPlayer(p => processPlayerUpdate(p, { totalExp: p.totalExp + quest.expReward }, completedJobNames));
        }
    };

    const endDay = () => {
        const allTasks = Object.values(dailyQuests).flatMap(c => c.tasks);
        const allCompleted = allTasks.every(t => t.completed);
        if (!allCompleted) return;

        const completedJobs = jobQuests.filter(q => q.completed).map(q => q.name);
        let totalDp = 0, strengthDp = 0, skincareDp = 0, dietDp = 0;

        Object.values(dailyQuests).forEach(cat => cat.tasks.forEach(task => {
            if(task.completed) {
                totalDp += task.dp;
                if(cat.name === 'Strength Routine') strengthDp += task.dp;
                if(cat.name === 'Skincare') skincareDp += task.dp;
                if(cat.name === 'Diet') dietDp += task.dp;
            }
        }));

        const dailyExp = totalDp * (1 + 0.05 * player.level);
        const newStats = { ...player.stats };
        newStats.STR += 2 * (strengthDp / 100);
        newStats.AGI += 2 * (strengthDp / 400);
        newStats.PER += 2 * (skincareDp / 125);
        newStats.VIT += 2 * (dietDp / 125);

        setPlayer(p => processPlayerUpdate(p, { 
            totalExp: p.totalExp + dailyExp, 
            statPoints: p.statPoints + 3 + Math.round(p.level / 10),
            stats: newStats 
        }, completedJobs));

        setDailyQuests(getInitialDailyQuests());
        localStorage.setItem(`${LS_PREFIX}lastResetDate`, new Date().toISOString().split('T')[0]);
        addNotification('SYSTEM', 'Daily rewards claimed and quests have been reset!', 'system');
    };
    
    const allocateStatPoint = (stat: Stat) => {
        if (player.statPoints > 0) {
          setPlayer(p => {
            const newStats = { ...p.stats, [stat]: p.stats[stat] + 1 };
            const newMaxHp = calculateMaxHp(newStats.VIT);
            const newMaxMp = calculateMaxMp(newStats.INT);
            return {
              ...p,
              stats: newStats,
              statPoints: p.statPoints - 1,
              maxHp: newMaxHp,
              hp: stat === Stat.Vitality ? newMaxHp : p.hp,
              maxMp: newMaxMp,
              mp: stat === Stat.Intelligence ? newMaxMp : p.mp,
            };
          });
        }
    };

    const performReset = () => {
        localStorage.removeItem(`${LS_PREFIX}lastResetDate`);
        setPlayer(INITIAL_PLAYER);
        setDailyQuests(getInitialDailyQuests());
        setEmergencyQuests([]);
        setJobQuests(getInitialJobQuests());
        setSkills([]);
        setInventory([]);
        setShop([]);
        setActiveView(AppView.Status);
        setIsAuthenticated(false);
    };


    const renderActiveView = () => {
        switch (activeView) {
            case AppView.Status:
                return <StatusWindow player={player} onAllocateStat={allocateStatPoint} />;
            case AppView.Quests:
                return <QuestsWindow 
                    dailyQuests={dailyQuests} setDailyQuests={setDailyQuests} onEndDay={endDay}
                    eQuests={emergencyQuests} setEQuests={setEmergencyQuests} 
                    jQuests={jobQuests} 
                    // FIX: Pass the correct state setter function `setJobQuests` for the `setJQuests` prop.
                    setJQuests={setJobQuests}
                    player={player} 
                    onCompleteEmergencyQuest={completeEmergencyQuest}
                    onCompleteJobQuest={completeJobQuest}
                />;
            case AppView.Skills:
                return <SkillWindow skills={skills} setSkills={setSkills}/>;
            case AppView.Inventory:
                return <InventoryShopWindow initialTab="inventory" inventory={inventory} setInventory={setInventory} shop={shop} setShop={setShop} player={player} setPlayer={setPlayer}/>;
            case AppView.Shop:
                 return <InventoryShopWindow initialTab="shop" inventory={inventory} setInventory={setInventory} shop={shop} setShop={setShop} player={player} setPlayer={setPlayer}/>;
            case AppView.Reset:
                return <ResetWindow onConfirmReset={performReset} />;
            default:
                return <StatusWindow player={player} onAllocateStat={allocateStatPoint} />;
        }
    }

    if (!isAuthenticated) {
        return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

  return (
    <div className="min-h-screen bg-system-black flex text-gray-300 font-sans">
      <NotificationContainer notifications={notifications} onDismiss={dismissNotification} />
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
      />
      <div className="flex-grow p-4 md:p-8 overflow-y-auto h-screen">
        <div className="container mx-auto max-w-7xl">
          <header className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-display font-black goal-text-style">
                {activeView.toUpperCase()}
            </h1>
          </header>
          <main>
            {renderActiveView()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;