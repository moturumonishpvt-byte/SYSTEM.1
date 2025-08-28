import { Player, Stat, DailyQuests, JobQuest } from '../types';

export const calculateLevelFromExp = (exp: number): number => {
  if (exp <= 0) return 1;
  const level = Math.round(Math.pow(exp / 100, 0.67));
  return Math.max(1, level);
};

export const calculateExpForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(level, 1.5));
};

export const getRankForLevel = (level: number): string => {
    if (level >= 200) return "SSS+-Rank (Monarch Level)";
    if (level >= 150) return "SSS-Rank (Near National Level)";
    if (level >= 120) return "SS-Rank (Above S-Rank)";
    if (level >= 100) return "S-Rank";
    if (level >= 80) return "A-Rank";
    if (level >= 60) return "B-Rank";
    if (level >= 40) return "C-Rank";
    if (level >= 20) return "D-Rank";
    return "E-Rank";
}

export const getTitleForLevel = (level: number): string => {
    if (level >= 100) return "The Omniscient Sage (Jñāna - Knowledge)";
    if (level >= 90) return "The Divine Enchanter (Shri - Beauty)";
    if (level >= 80) return "The Eternal Legend (Yasha - Fame)";
    if (level >= 70) return "King of Giants";
    if (level >= 60) return "The Infinite Treasurer (Aishvarya - Wealth)";
    if (level >= 50) return "The Invincible Titan (Vīrya - Strength)";
    if (level >= 40) return "Enemy of the Evil";
    if (level >= 30) return "One Who Overcame Adversity";
    if (level >= 20) return "Lust Slayer";
    if (level >= 10) return "Slaughterer of Laziness";
    return "No Title";
}

export const getJobForLevel = (level: number, completedJobs: string[]): string => {
    const jobs = [
        { name: "The Sorcerer Killer", level: 100 },
        { name: "The Honored One", level: 90 },
        { name: "Dragon Emperor", level: 80 },
        { name: "Hawk-Eye", level: 70 },
        { name: "Balance of God and Man", level: 60 },
        { name: "Shadow Monarch", level: 50 },
    ];
    for (const job of jobs) {
        if (completedJobs.includes(job.name)) {
            return job.name;
        }
    }
    return "No Job";
}

export const calculateMaxHp = (vitality: number): number => {
    return 1000 + (vitality * 10);
};

export const calculateMaxMp = (intelligence: number): number => {
    return 500 + (intelligence * 5);
};

const initialStats = {
    [Stat.Strength]: 0,
    [Stat.Agility]: 0,
    [Stat.Vitality]: 0,
    [Stat.Perception]: 0,
    [Stat.Intelligence]: 0,
};
const initialLevel = 1;

export const INITIAL_PLAYER: Player = {
  name: "Player",
  level: initialLevel,
  rank: getRankForLevel(initialLevel),
  job: "No Job",
  title: "No Title",
  totalExp: 0,
  expToNextLevel: calculateExpForLevel(initialLevel + 1),
  hp: calculateMaxHp(initialStats.VIT),
  maxHp: calculateMaxHp(initialStats.VIT),
  mp: calculateMaxMp(initialStats.INT),
  maxMp: calculateMaxMp(initialStats.INT),
  fatigue: 0,
  stats: initialStats,
  statPoints: 3,
  currency: 0,
};

export const getInitialDailyQuests = (): DailyQuests => ({
    strength: { name: 'Strength Routine', totalDp: 500, tasks: [
        { id: 'str-1', name: 'Push-ups', dp: 100, completed: false, note: 'Target: 100' },
        { id: 'str-2', name: 'Pull-ups', dp: 100, completed: false, note: 'Target: 100' },
        { id: 'str-3', name: 'Squats', dp: 100, completed: false, note: 'Target: 100' },
        { id: 'str-4', name: 'Crunches', dp: 100, completed: false, note: 'Target: 100' },
        { id: 'str-5', name: 'Running', dp: 100, completed: false, note: 'Target: 10KM' },
    ]},
    skincare: { name: 'Skincare', totalDp: 125, tasks: [
        { id: 'skin-1', name: 'Brush/Oil Routine', dp: 31.25, completed: false },
        { id: 'skin-2', name: 'Morning Routine', dp: 31.25, completed: false },
        { id: 'skin-3', name: 'Evening Routine', dp: 31.25, completed: false },
        { id: 'skin-4', name: 'Night Routine', dp: 31.25, completed: false },
    ]},
    diet: { name: 'Diet', totalDp: 125, tasks: [
        { id: 'diet-1', name: 'Detox & Energy Juice', dp: 20, completed: false },
        { id: 'diet-2', name: 'Milk', dp: 10, completed: false },
        { id: 'diet-3', name: 'Leafy Veggies', dp: 25, completed: false },
        { id: 'diet-4', name: 'Fruit, Oats, Carrots', dp: 30, completed: false },
        { id: 'diet-5', name: 'Water Intake', dp: 40, completed: false, note: 'Target: 6L' },
    ]},
    discipline: { name: 'Discipline', totalDp: 200, tasks: [
        { id: 'disc-1', name: 'Screen Time', dp: 100, completed: false, note: '5-8 Hours' },
        { id: 'disc-2', name: 'Sleep Time', dp: 100, completed: false, note: 'Min 7 hours (9PM-4AM)' },
    ]},
    dailyTask: { name: 'One Daily Task', totalDp: 50, tasks: [
        { id: 'task-1', name: 'Unique Daily Task', dp: 50, completed: false, note: 'Varies by day' },
    ]},
});


export const getInitialJobQuests = (): JobQuest[] => [
    { id: 'job-1', name: "Shadow Monarch", levelRequirement: 50, expReward: 500, completed: false },
    { id: 'job-2', name: "Balance of God and Man", levelRequirement: 60, expReward: 600, completed: false },
    { id: 'job-3', name: "Hawk-Eye", levelRequirement: 70, expReward: 700, completed: false },
    { id: 'job-4', name: "Dragon Emperor", levelRequirement: 80, expReward: 800, completed: false },
    { id: 'job-5', name: "The Honored One", levelRequirement: 90, expReward: 900, completed: false },
    { id: 'job-6', name: "The Sorcerer Killer", levelRequirement: 100, expReward: 1000, completed: false },
];