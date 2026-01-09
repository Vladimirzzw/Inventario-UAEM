
import React, { useState, useMemo } from 'react';
import { InventoryItem } from '../types';

interface SpreadsheetProps {
  items: InventoryItem[];
  onAddItem: () => void;
  onImportExcel: () => void;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ items, onAddItem, onImportExcel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map(i => i.category)));
    return ['Todas', ...cats].sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items
      .filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             item.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, searchTerm, selectedCategory]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Spreadsheet Toolbar */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              type="text"
              placeholder="Buscar por ID o Nombre..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none w-full md:w-64 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green outline-none bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onImportExcel}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            <i className="fas fa-file-excel text-green-600"></i>
            <span>Importar Excel</span>
          </button>
          <button 
            onClick={onAddItem}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-green-800 transition-colors font-medium text-sm"
          >
            <i className="fas fa-plus"></i>
            <span>Agregar Artículo</span>
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3 border-b border-gray-200">ID</th>
              <th className="px-6 py-3 border-b border-gray-200">Nombre</th>
              <th className="px-6 py-3 border-b border-gray-200">Categoría</th>
              <th className="px-6 py-3 border-b border-gray-200">Cant.</th>
              <th className="px-6 py-3 border-b border-gray-200">Unidad</th>
              <th className="px-6 py-3 border-b border-gray-200">Ubicación</th>
              <th className="px-6 py-3 border-b border-gray-200">Última Act.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-accent-yellow/5 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-green/10 text-primary-green">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{item.quantity}</td>
                  <td className="px-6 py-4 text-gray-500">{item.unit}</td>
                  <td className="px-6 py-4 text-gray-500">{item.location}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{item.lastUpdated}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500 italic">
                  No se encontraron artículos con estos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
        <span>Mostrando {filteredItems.length} de {items.length} artículos</span>
        <span className="font-medium text-primary-green">Orden Alfabético</span>
      </div>
    </div>
  );
};

export default Spreadsheet;
