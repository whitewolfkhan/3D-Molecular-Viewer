import { create } from 'zustand';
import { Atom, Bond, ExtendedMolecule, MoleculeCategory, MoleculeProperty, MOLECULES_DB, getMoleculeById } from './molecules-db';

export type VisualizationMode = 'ball-and-stick' | 'space-filling';

interface MoleculeState {
  // Current molecule
  currentMolecule: ExtendedMolecule | null;
  
  // Visualization settings
  visualizationMode: VisualizationMode;
  autoRotate: boolean;
  showLabels: boolean;
  showBonds: boolean;
  
  // Selection
  selectedAtom: Atom | null;
  selectedBond: Bond | null;
  hoveredAtom: Atom | null;
  
  // UI state
  isFullscreen: boolean;
  theme: 'light' | 'dark';
  
  // Search & Filter
  searchQuery: string;
  selectedCategory: MoleculeCategory | 'all';
  selectedProperty: MoleculeProperty | 'all';
  
  // Actions
  setMolecule: (id: string) => void;
  setVisualizationMode: (mode: VisualizationMode) => void;
  toggleAutoRotate: () => void;
  toggleLabels: () => void;
  toggleBonds: () => void;
  toggleFullscreen: () => void;
  toggleTheme: () => void;
  selectAtom: (atom: Atom | null) => void;
  selectBond: (bond: Bond | null) => void;
  hoverAtom: (atom: Atom | null) => void;
  resetView: () => void;
  setSearchQuery: (query: string) => void;
  setCategory: (category: MoleculeCategory | 'all') => void;
  setProperty: (property: MoleculeProperty | 'all') => void;
  getFilteredMolecules: () => ExtendedMolecule[];
  getAllMolecules: () => ExtendedMolecule[];
}

export const useMoleculeStore = create<MoleculeState>((set, get) => ({
  currentMolecule: MOLECULES_DB[0],
  visualizationMode: 'ball-and-stick',
  autoRotate: true,
  showLabels: true,
  showBonds: true,
  selectedAtom: null,
  selectedBond: null,
  hoveredAtom: null,
  isFullscreen: false,
  theme: 'dark',
  searchQuery: '',
  selectedCategory: 'all',
  selectedProperty: 'all',
  
  setMolecule: (id: string) => {
    const molecule = getMoleculeById(id);
    if (molecule) {
      set({ 
        currentMolecule: molecule,
        selectedAtom: null,
        selectedBond: null,
      });
    }
  },
  
  setVisualizationMode: (mode: VisualizationMode) => {
    set({ visualizationMode: mode });
  },
  
  toggleAutoRotate: () => {
    set(state => ({ autoRotate: !state.autoRotate }));
  },
  
  toggleLabels: () => {
    set(state => ({ showLabels: !state.showLabels }));
  },
  
  toggleBonds: () => {
    set(state => ({ showBonds: !state.showBonds }));
  },
  
  toggleFullscreen: () => {
    set(state => ({ isFullscreen: !state.isFullscreen }));
  },
  
  toggleTheme: () => {
    set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }));
  },
  
  selectAtom: (atom: Atom | null) => {
    set({ selectedAtom: atom, selectedBond: null });
  },
  
  selectBond: (bond: Bond | null) => {
    set({ selectedBond: bond, selectedAtom: null });
  },
  
  hoverAtom: (atom: Atom | null) => {
    set({ hoveredAtom: atom });
  },
  
  resetView: () => {
    set({ selectedAtom: null, selectedBond: null });
  },
  
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },
  
  setCategory: (category: MoleculeCategory | 'all') => {
    set({ selectedCategory: category });
  },
  
  setProperty: (property: MoleculeProperty | 'all') => {
    set({ selectedProperty: property });
  },
  
  getFilteredMolecules: () => {
    const { searchQuery, selectedCategory, selectedProperty } = get();
    let filtered = MOLECULES_DB;
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(lowerQuery) ||
        m.formula.toLowerCase().includes(lowerQuery)
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(m => m.category === selectedCategory);
    }
    
    if (selectedProperty !== 'all') {
      filtered = filtered.filter(m => m.properties.includes(selectedProperty));
    }
    
    return filtered;
  },
  
  getAllMolecules: () => MOLECULES_DB,
}));
