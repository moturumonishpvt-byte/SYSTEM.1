import React, { useState, useEffect } from 'react';
import { InventoryItem, ShopItem, Player } from '../types';

interface InventoryShopWindowProps {
    inventory: InventoryItem[];
    setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
    shop: ShopItem[];
    setShop: React.Dispatch<React.SetStateAction<ShopItem[]>>;
    player: Player;
    setPlayer: React.Dispatch<React.SetStateAction<Player>>;
    initialTab: 'inventory' | 'shop';
}

const InventoryShopWindow: React.FC<InventoryShopWindowProps> = ({ inventory, setInventory, shop, setShop, player, setPlayer, initialTab }) => {
    const [shopName, setShopName] = useState('');
    const [shopDesc, setShopDesc] = useState('');
    const [shopPrice, setShopPrice] = useState(0);

    const [currencyInput, setCurrencyInput] = useState(player.currency.toString());

    const inputStyle = "w-full bg-system-gray p-2 rounded border border-system-purple/50 focus:outline-none focus:ring-2 focus:ring-system-purple";

    useEffect(() => {
        setCurrencyInput(player.currency.toString());
    }, [player.currency]);

    const addShopItem = (e: React.FormEvent) => {
        e.preventDefault();
        if(!shopName.trim()) return;
        setShop(prev => [...prev, { id: `shop-${Date.now()}`, name: shopName, description: shopDesc, price: shopPrice }]);
        setShopName(''); setShopDesc(''); setShopPrice(0);
    };

    const buyItem = (item: ShopItem) => {
        if (player.currency >= item.price) {
            setPlayer(p => ({ ...p, currency: p.currency - item.price }));
            setInventory(prev => {
                const existing = prev.find(i => i.name === item.name);
                if (existing) {
                    return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i);
                }
                return [...prev, { id: `inv-${Date.now()}`, name: item.name, description: item.description, quantity: 1 }];
            });
            setShop(prev => prev.filter(s => s.id !== item.id));
        } else {
            alert("Not enough currency!");
        }
    };
    
    const handleSetCurrency = () => {
        const newCurrency = parseInt(currencyInput, 10);
        if (!isNaN(newCurrency)) {
            setPlayer(p => ({ ...p, currency: newCurrency }));
        }
    };

    const deleteItem = (itemId: string) => {
        setInventory(prev => prev.filter(i => i.id !== itemId));
    };

    return (
        <div className="system-panel">
            {initialTab === 'inventory' && (
                <div>
                    <h3 className="text-xl font-display goal-text-style mb-3">Player Inventory</h3>
                    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 bg-black/20 p-4 rounded-lg">
                        {inventory.length === 0 && <p className="text-gray-500 text-center py-8">Inventory is empty. Purchase items from the shop.</p>}
                        {inventory.map(item => (
                            <div key={item.id} className="bg-system-gray-dark p-3 rounded border-l-4 border-system-blue/50 flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{item.name} <span className="text-system-gold" style={{textShadow: '0 0 6px #00bfff'}}>x{item.quantity}</span></p>
                                    <p className="text-sm text-gray-400">{item.description}</p>
                                </div>
                                <button
                                    onClick={() => deleteItem(item.id)}
                                    className="ml-4 p-2 rounded-full bg-system-red/20 text-system-red hover:bg-system-red hover:text-white transition-colors flex-shrink-0"
                                    aria-label={`Delete ${item.name}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18"/>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                        <line x1="10" y1="11" x2="10" y2="17"/>
                                        <line x1="14" y1="11" x2="14" y2="17"/>
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {initialTab === 'shop' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-xl font-display goal-text-style mb-3">Add Item to Shop</h3>
                        <form onSubmit={addShopItem} className="space-y-3">
                            <input type="text" value={shopName} onChange={e => setShopName(e.target.value)} placeholder="Item Name" className={inputStyle}/>
                            <input type="text" value={shopDesc} onChange={e => setShopDesc(e.target.value)} placeholder="Description" className={inputStyle}/>
                            <input type="number" min="0" value={shopPrice} onChange={e => setShopPrice(Number(e.target.value))} placeholder="Price" className={inputStyle}/>
                            <button type="submit" className="w-full bg-system-purple text-white py-2 rounded hover:bg-opacity-80">Add Item to Shop</button>
                        </form>
                    </div>
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                         <div className="flex items-center gap-2 p-2 bg-system-gray-dark rounded-md mb-4 sticky top-0">
                            <label htmlFor="currency-input" className="font-display text-system-gold flex-shrink-0" style={{textShadow: '0 0 8px #00bfff'}}>Currency:</label>
                            <input
                                id="currency-input"
                                type="number"
                                value={currencyInput}
                                onChange={(e) => setCurrencyInput(e.target.value)}
                                onBlur={handleSetCurrency}
                                className="bg-system-gray p-1 rounded border border-system-purple/50 w-full text-right"
                                placeholder="Enter amount"
                            />
                            <button
                                onClick={handleSetCurrency}
                                className="bg-system-blue text-black px-3 py-1 rounded text-sm font-bold"
                            >
                                Set
                            </button>
                        </div>

                        {shop.length === 0 && <p className="text-gray-500">Shop is empty.</p>}
                        {shop.map(item => <div key={item.id} className="bg-system-gray-dark p-3 rounded flex justify-between items-center border-l-4 border-system-blue/50">
                           <div>
                             <p className="font-bold">{item.name}</p>
                             <p className="text-sm text-gray-400">{item.description}</p>
                           </div>
                           <button onClick={() => buyItem(item)} className="bg-system-gold text-black px-3 py-1 rounded text-sm font-bold flex-shrink-0 hover:shadow-glow-gold">Buy ({item.price})</button>
                        </div>)}
                    </div>
                </div>
            )}

        </div>
    );
};

export default InventoryShopWindow;