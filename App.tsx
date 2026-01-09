
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Spreadsheet from './components/Spreadsheet';
import InventoryCard from './components/InventoryCard';
import { Inventory, AppSettings, InventoryItem } from './types';

const STORAGE_KEY = 'uaem_inventory_data';

// Mock Initial Data en Español (solo se usa la primera vez)
const DEFAULT_INVENTORIES: Inventory[] = [
  {
    id: 'inv-1',
    title: 'Almacén Central UAEM',
    description: 'Almacenamiento central para dispositivos electrónicos y periféricos de hardware.',
    createdAt: '2023-10-15',
    items: [
      { id: 'E-001', name: 'Monitor HP 24"', category: 'Computadoras', quantity: 15, unit: 'piezas', location: 'Rack A-1', lastUpdated: '2024-03-20' },
      { id: 'S-001', name: 'Pluma Azul', category: 'Papelería', quantity: 500, unit: 'piezas', location: 'Gabinete B', lastUpdated: '2024-03-18' },
    ]
  }
];

const App: React.FC = () => {
  // Inicializar estado desde localStorage o usar datos por defecto
  const [inventories, setInventories] = useState<Inventory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error cargando datos de localStorage", e);
        return DEFAULT_INVENTORIES;
      }
    }
    return DEFAULT_INVENTORIES;
  });

  const [activeInventoryId, setActiveInventoryId] = useState<string | null>(null);
  const [settings] = useState<AppSettings>({
    companyName: 'Inventario UAEM',
    logoUrl: 'https://www.uaemex.mx/images/logo_uaemex.png'
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInventoryTitle, setNewInventoryTitle] = useState('');
  const [newInventoryDesc, setNewInventoryDesc] = useState('');

  // Guardar en localStorage cada vez que cambien los inventarios
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventories));
  }, [inventories]);

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
    
    const itemName = prompt("Nombre del nuevo artículo:");
    if (!itemName) return;
    
    const category = prompt("Categoría (ej. Computadoras, Papelería):") || "Sin Categoría";

    const newItem: InventoryItem = {
      id: `ART-${Math.floor(Math.random() * 10000)}`,
      name: itemName,
      category: category,
      quantity: 1,
      unit: 'piezas',
      location: 'Almacén',
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setInventories(prev => prev.map(inv => 
      inv.id === activeInventoryId ? { ...inv, items: [...inv.items, newItem].sort((a,b) => a.name.localeCompare(b.name)) } : inv
    ));
  };

  const handleImportExcel = () => {
    alert("Función de Importación: En una versión real, aquí subirías un archivo .xlsx y procesaríamos las filas para agregarlas al estado actual.");
  };

  const resetData = () => {
    if (confirm("¿Estás seguro de que deseas borrar todos los datos guardados? Esta acción no se puede deshacer.")) {
      setInventories(DEFAULT_INVENTORIES);
      setActiveInventoryId(null);
    }
  };

  return (
    <Layout settings={settings} onNavigateHome={() => setActiveInventoryId(null)}>
      {!activeInventoryId ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-primary-green">Panel de Control</h2>
              <p className="text-gray-500">Los datos se guardan automáticamente en este navegador.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={resetData}
                className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
                title="Restablecer datos"
              >
                <i className="fas fa-trash-alt mr-2"></i>
                Limpiar Todo
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-accent-yellow text-primary-green font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-plus"></i>
                <span>Crear Nuevo Inventario</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventories.map(inv => (
              <InventoryCard 
                key={inv.id} 
                inventory={inv} 
                onClick={() => setActiveInventoryId(inv.id)} 
              />
            ))}
            {inventories.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                <i className="fas fa-box-open text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">No hay inventarios creados. ¡Crea el primero!</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
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
