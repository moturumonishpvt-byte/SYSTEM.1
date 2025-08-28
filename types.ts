export enum Stat {
  Strength = 'STR',
  Agility = 'AGI',
  Vitality = 'VIT',
  Perception = 'PER',
  Intelligence = 'INT',
}

export interface PlayerStats {
  [Stat.Strength]: number;
  [Stat.Agility]: number;
  [Stat.Vitality]: number;
  [Stat.Perception]: number;
  [Stat.Intelligence]: number;
}

export interface Player {
  name: string;
  level: number;
  rank: string;
  job: string;
  title: string;
  totalExp: number;
  expToNextLevel: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  fatigue: number;
  stats: PlayerStats;
  statPoints: number;
  currency: number;
}

export interface DailyQuestTask {
  id: string;
  name: string;
  dp: number;
  completed: boolean;
  note?: string;
}

export interface DailyQuestCategory {
  name: string;
  tasks: DailyQuestTask[];
  totalDp: number;
}

export interface DailyQuests {
  [key: string]: DailyQuestCategory;
}

export enum SkillLevel {
    Beginner = 'Beginner',
    Intermediate = 'Intermediate',
    Advanced = 'Advanced',
}

export interface Skill {
    id: string;
    name: string;
    description: string;
    type: 'Active' | 'Passive';
    level: SkillLevel;
}

export interface InventoryItem {
    id: string;
    name: string;
    description: string;
    quantity: number;
}

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
}

export interface EmergencyQuest {
    id: string;
    name: string;
    description: string;
    expReward: number;
    completed: boolean;
    reward?: string;
}

export interface JobQuest {
    id: string;
    name: string;
    levelRequirement: number;
    expReward: number;
    completed: boolean;
}

export enum AppView {
    Status = 'Status',
    Quests = 'Quests',
    Skills = 'Skills',
    Inventory = 'Inventory',
    Shop = 'Shop',
    Reset = 'Reset',
}