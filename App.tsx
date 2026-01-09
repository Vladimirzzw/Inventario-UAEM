
import React, { useState } from 'react';
import Layout from './components/Layout';
import Spreadsheet from './components/Spreadsheet';
import InventoryCard from './components/InventoryCard';
import { Inventory, AppSettings, InventoryItem } from './types';

// Mock Initial Data en Español
const INITIAL_INVENTORIES: Inventory[] = [
  {
    id: 'inv-1',
    title: 'Almacén Central UAEM',
    description: 'Almacenamiento central para dispositivos electrónicos y periféricos de hardware.',
    createdAt: '2023-10-15',
    items: [
      { id: 'E-001', name: 'Monitor HP 24"', category: 'Computadoras', quantity: 15, unit: 'piezas', location: 'Rack A-1', lastUpdated: '2024-03-20' },
      { id: 'S-001', name: 'Pluma Azul', category: 'Papelería', quantity: 500, unit: 'piezas', location: 'Gabinete B', lastUpdated: '2024-03-18' },
      { id: 'E-002', name: 'MacBook Air M2', category: 'Computadoras', quantity: 8, unit: 'piezas', location: 'Caja Fuerte 1', lastUpdated: '2024-03-22' },
      { id: 'S-002', name: 'Resmas de Papel A4', category: 'Papelería', quantity: 120, unit: 'resmas', location: 'Rack C-4', lastUpdated: '2024-03-21' },
      { id: 'F-001', name: 'Silla Ergonómica', category: 'Mobiliario', quantity: 24, unit: 'piezas', location: 'Piso 2', lastUpdated: '2024-03-10' },
    ]
  },
  {
    id: 'inv-2',
    title: 'Laboratorio de Ciencias',
    description: 'Inventario especializado para químicos y cristalería de laboratorio.',
    createdAt: '2023-11-02',
    items: [
      { id: 'G-001', name: 'Vaso de Precipitados 500ml', category: 'Cristalería', quantity: 45, unit: 'piezas', location: 'Estante 1', lastUpdated: '2024-03-15' },
      { id: 'C-001', name: 'Cloruro de Sodio', category: 'Químicos', quantity: 5, unit: 'kg', location: 'Bio-Seguro', lastUpdated: '2024-03-05' },
    ]
  }
];

const App: React.FC = () => {
  const [inventories, setInventories] = useState<Inventory[]>(INITIAL_INVENTORIES);
  const [activeInventoryId, setActiveInventoryId] = useState<string | null>(null);
  const [settings] = useState<AppSettings>({
    companyName: 'Inventario UAEM',
    logoUrl: 'https://www.uaemex.mx/images/logo_uaemex.png'
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInventoryTitle, setNewInventoryTitle] = useState('');
  const [newInventoryDesc, setNewInventoryDesc] = useState('');

  const activeInventory = inventories.find(inv => inv.id === activeInventoryId);

  const handleAddInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInventoryTitle) return;

    const newInv: Inventory = {
      id: `inv-${Date.now()}`,
      title: newInventoryTitle,
      description: newInventoryDesc || 'Sin descripción proporcionada.',
      createdAt: new Date().toISOString().split('T')[0],
      items: []
    };

    setInventories([...inventories, newInv]);
    setNewInventoryTitle('');
    setNewInventoryDesc('');
    setShowAddModal(false);
  };

  const handleAddItem = () => {
    if (!activeInventoryId) return;
    
    const newItem: InventoryItem = {
      id: `ART-${Math.floor(Math.random() * 1000)}`,
      name: 'Nuevo Artículo (Manual)',
      category: 'Sin Categoría',
      quantity: 1,
      unit: 'piezas',
      location: 'Recepción',
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setInventories(prev => prev.map(inv => 
      inv.id === activeInventoryId ? { ...inv, items: [...inv.items, newItem] } : inv
    ));
  };

  const handleImportExcel = () => {
    alert("En una aplicación real, esto activaría un selector de archivos Excel y un procesador (ej. usando la librería 'xlsx').");
  };

  return (
    <Layout settings={settings} onNavigateHome={() => setActiveInventoryId(null)}>
      {!activeInventoryId ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-primary-green">Panel de Control</h2>
              <p className="text-gray-500">Bienvenido. Gestione y rastree sus catálogos de inventario aquí.</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-accent-yellow text-primary-green font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <i className="fas fa-plus"></i>
              <span>Crear Nuevo Inventario</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventories.map(inv => (
              <InventoryCard 
                key={inv.id} 
                inventory={inv} 
                onClick={() => setActiveInventoryId(inv.id)} 
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4 mb-2">
            <button 
              onClick={() => setActiveInventoryId(null)}
              className="h-10 w-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <i className="fas fa-chevron-left text-gray-600"></i>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-primary-green">{activeInventory?.title}</h2>
              <p className="text-sm text-gray-500">{activeInventory?.description}</p>
            </div>
          </div>

          <Spreadsheet 
            items={activeInventory?.items || []} 
            onAddItem={handleAddItem}
            onImportExcel={handleImportExcel}
          />
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-primary-green mb-6">Crear Inventario</h3>
            <form onSubmit={handleAddInventory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título del Inventario</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  placeholder="ej. Material de Oficina 2024"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-green outline-none"
                  value={newInventoryTitle}
                  onChange={(e) => setNewInventoryTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (Opcional)</label>
                <textarea 
                  rows={3}
                  placeholder="¿Para qué es este inventario?"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-green outline-none"
                  value={newInventoryDesc}
                  onChange={(e) => setNewInventoryDesc(e.target.value)}
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary-green text-white rounded-lg font-bold hover:bg-green-800 transition-colors shadow-lg shadow-green-900/20"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
