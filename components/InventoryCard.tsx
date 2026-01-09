
import React from 'react';
import { Inventory } from '../types';

interface InventoryCardProps {
  inventory: Inventory;
  onClick: () => void;
}

const InventoryCard: React.FC<InventoryCardProps> = ({ inventory, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border-2 border-transparent hover:border-accent-yellow hover:shadow-md transition-all cursor-pointer p-6 flex flex-col justify-between group"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="h-12 w-12 bg-light-green text-primary-green rounded-lg flex items-center justify-center group-hover:bg-accent-yellow group-hover:text-primary-green transition-colors">
            <i className="fas fa-clipboard-list text-2xl"></i>
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{inventory.items.length} Artículos</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-green transition-colors">
          {inventory.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2">
          {inventory.description}
        </p>
      </div>
      
      <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
        <span className="text-xs text-gray-400">Creado {new Date(inventory.createdAt).toLocaleDateString('es-MX')}</span>
        <div className="text-primary-green font-semibold text-sm flex items-center gap-1">
          Abrir <i className="fas fa-arrow-right text-xs"></i>
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;
