import React, { useState } from 'react';

interface ResetWindowProps {
    onConfirmReset: () => void;
}

const ResetWindow: React.FC<ResetWindowProps> = ({ onConfirmReset }) => {
    const [confirmationText, setConfirmationText] = useState('');
    const confirmationPhrase = 'RESET PROGRESS';
    const isConfirmed = confirmationText === confirmationPhrase;

    return (
        <div className="system-panel max-w-2xl mx-auto">
            <div className="text-center border-b-2 border-system-red/50 pb-4 mb-4">
                <div className="system-header-box border-system-red/80">
                    <h2 className="text-2xl font-display goal-text-style">SYSTEM RESET</h2>
                </div>
            </div>

            <div className="text-center p-4 border-2 border-system-red/50 bg-red-900/30 rounded-lg mb-6 space-y-3">
                <p className="font-bold text-system-red text-xl">!! WARNING !!</p>
                <p className="text-gray-200">
                    Proceeding will <span className="font-bold text-white">permanently erase all progress</span>, including levels, stats, quests, and items.
                </p>
                <p className="text-gray-300 font-bold underline">This action cannot be undone.</p>
            </div>

            <div className="space-y-4">
                <p className="text-center text-gray-300">
                    To confirm this action, please type the following phrase into the box below:
                </p>
                <p className="text-center font-display text-2xl text-system-gold tracking-widest" style={{textShadow: '0 0 8px #00bfff'}}>
                    {confirmationPhrase}
                </p>
                <input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="Type to confirm..."
                    className="w-full text-center bg-system-gray p-3 rounded border border-system-purple/50 focus:outline-none focus:ring-2 focus:ring-system-purple font-display tracking-wider"
                    aria-label="Reset confirmation input"
                />
                <button
                    onClick={onConfirmReset}
                    disabled={!isConfirmed}
                    className={`w-full py-3 rounded-lg font-display text-xl transition-all duration-300 ${
                        isConfirmed
                        ? 'bg-system-red text-white shadow-lg shadow-red-500/30 hover:bg-red-500'
                        : 'bg-system-gray-dark text-gray-600 cursor-not-allowed'
                    }`}
                    aria-disabled={!isConfirmed}
                >
                    CONFIRM PERMANENT RESET
                </button>
            </div>
        </div>
    );
};

export default ResetWindow;