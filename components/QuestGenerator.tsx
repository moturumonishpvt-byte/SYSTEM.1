import React, { useState } from 'react';
import { Skill, SkillLevel } from '../types';

interface SkillWindowProps {
    skills: Skill[];
    setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
}

const SkillWindow: React.FC<SkillWindowProps> = ({ skills, setSkills }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'Active' | 'Passive'>('Active');
    const [level, setLevel] = useState<SkillLevel>(SkillLevel.Beginner);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name.trim()) return;
        const newSkill: Skill = {
            id: `skill-${Date.now()}`,
            name,
            description,
            type,
            level
        };
        setSkills(prev => [...prev, newSkill]);
        setName('');
        setDescription('');
    };

    const handleLevelChange = (skillId: string, newLevel: SkillLevel) => {
        setSkills(prevSkills =>
            prevSkills.map(skill =>
                skill.id === skillId ? { ...skill, level: newLevel } : skill
            )
        );
    };
    
    const passiveSkills = skills.filter(s => s.type === 'Passive');
    const activeSkills = skills.filter(s => s.type === 'Active');
    const inputStyle = "w-full bg-system-gray p-2 rounded border border-system-purple/50 focus:outline-none focus:ring-2 focus:ring-system-purple";

    return (
        <div className="system-panel max-w-4xl mx-auto">
            <div className="text-center border-b-2 border-system-blue/30 pb-4 mb-4">
                <div className="system-header-box">
                    <h2 className="text-2xl font-display goal-text-style">SKILLS</h2>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div className="system-header-box mb-4">
                        <h3 className="font-display goal-text-style">[Passive Skill]</h3>
                    </div>
                    <div className="space-y-3">
                         {passiveSkills.length === 0 && <p className="text-gray-500">No passive skills.</p>}
                         {passiveSkills.map(skill => (
                            <div key={skill.id} className="p-3 border border-system-blue/20 rounded-md bg-black/20">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="font-bold text-lg text-gray-200">{skill.name}</h4>
                                    <select
                                        value={skill.level}
                                        onChange={(e) => handleLevelChange(skill.id, e.target.value as SkillLevel)}
                                        className="bg-system-gray-dark text-system-gold border border-system-purple/50 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-system-purple"
                                        style={{textShadow: '0 0 6px #00bfff'}}
                                    >
                                        {Object.values(SkillLevel).map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                                <p className="text-sm text-gray-400 mt-1">{skill.description}</p>
                            </div>
                         ))}
                    </div>
                </div>
                 <div>
                    <div className="system-header-box mb-4">
                        <h3 className="font-display goal-text-style">[Active Skill]</h3>
                    </div>
                    <div className="space-y-3">
                        {activeSkills.length === 0 && <p className="text-gray-500">No active skills.</p>}
                        {activeSkills.map(skill => (
                            <div key={skill.id} className="p-3 border border-system-blue/20 rounded-md bg-black/20">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="font-bold text-lg text-gray-200">{skill.name}</h4>
                                    <select
                                        value={skill.level}
                                        onChange={(e) => handleLevelChange(skill.id, e.target.value as SkillLevel)}
                                        className="bg-system-gray-dark text-system-gold border border-system-purple/50 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-system-purple"
                                        style={{textShadow: '0 0 6px #00bfff'}}
                                    >
                                        {Object.values(SkillLevel).map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                                <p className="text-sm text-gray-400 mt-1">{skill.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border-t-2 border-system-blue/30 pt-4 mt-6">
                <h3 className="text-xl font-display text-center mb-3 goal-text-style">Learn New Skill</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Skill Name" className={inputStyle} />
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className={`${inputStyle} sm:col-span-2`} rows={2}/>
                    <select value={type} onChange={e => setType(e.target.value as any)} className={inputStyle}>
                        <option value="Active">Active</option>
                        <option value="Passive">Passive</option>
                    </select>
                     <select value={level} onChange={e => setLevel(e.target.value as any)} className={inputStyle}>
                        {Object.values(SkillLevel).map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <button type="submit" className="w-full bg-system-purple text-white py-2 rounded hover:bg-opacity-80 sm:col-span-2">Add Skill</button>
                </form>
            </div>
        </div>
    );
};

export default SkillWindow;