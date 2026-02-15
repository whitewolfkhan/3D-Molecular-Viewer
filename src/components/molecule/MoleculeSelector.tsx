'use client';

import { useState } from 'react';
import { Search, ChevronDown, Atom, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useMoleculeStore } from '@/lib/molecules/store';
import { MoleculeCategory, MoleculeProperty, getAllCategories, getAllProperties } from '@/lib/molecules/molecules-db';

const CATEGORY_LABELS: Record<MoleculeCategory | 'all', string> = {
  'all': 'All Molecules',
  'organic': 'Organic',
  'inorganic': 'Inorganic',
  'biochemical': 'Biochemical',
  'pharmaceutical': 'Pharmaceutical',
  'polymer': 'Polymers',
  'acid': 'Acids',
  'base': 'Bases',
  'solvent': 'Solvents',
  'fuel': 'Fuels',
  'metal-complex': 'Metal Complexes',
};

const PROPERTY_LABELS: Record<MoleculeProperty | 'all', string> = {
  'all': 'All Properties',
  'polar': 'Polar',
  'non-polar': 'Non-Polar',
  'aromatic': 'Aromatic',
  'hydrophobic': 'Hydrophobic',
  'hydrophilic': 'Hydrophilic',
  'volatile': 'Volatile',
  'toxic': 'Toxic',
  'flammable': 'Flammable',
};

export default function MoleculeSelector() {
  const { 
    currentMolecule, 
    setMolecule, 
    searchQuery, 
    setSearchQuery,
    selectedCategory,
    setCategory,
    selectedProperty,
    setProperty,
    getFilteredMolecules 
  } = useMoleculeStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredMolecules = getFilteredMolecules();
  const categories = ['all', ...getAllCategories()];
  const properties = ['all', ...getAllProperties()];
  
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search molecules..."
            className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
          />
        </div>
        
        {/* Filter Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={`bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm ${
            (selectedCategory !== 'all' || selectedProperty !== 'all') ? 'ring-2 ring-cyan-500' : ''
          }`}
        >
          <Filter className="h-4 w-4" />
        </Button>
        
        {/* Dropdown */}
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm min-w-[180px] justify-between"
            >
              <div className="flex items-center gap-2 truncate">
                <Atom className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{currentMolecule?.name || 'Select Molecule'}</span>
              </div>
              <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-[280px] bg-slate-900/95 border-white/20 backdrop-blur-xl max-h-[400px] overflow-y-auto"
            align="start"
          >
            <DropdownMenuLabel className="text-white/60 text-xs">
              {filteredMolecules.length} molecules found
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            {filteredMolecules.slice(0, 50).map((molecule) => (
              <DropdownMenuItem
                key={molecule.id}
                onClick={() => {
                  setMolecule(molecule.id);
                  setIsOpen(false);
                }}
                className={`text-white hover:bg-white/20 focus:bg-white/20 cursor-pointer ${
                  currentMolecule?.id === molecule.id ? 'bg-white/10' : ''
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{molecule.name}</div>
                    <div className="text-xs text-white/60 flex items-center gap-2">
                      <span>{molecule.formula}</span>
                      <span className="text-white/30">•</span>
                      <span className="capitalize">{molecule.category}</span>
                    </div>
                  </div>
                  {currentMolecule?.id === molecule.id && (
                    <div className="h-2 w-2 rounded-full bg-cyan-400 flex-shrink-0 ml-2" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
            {filteredMolecules.length === 0 && (
              <div className="px-2 py-4 text-center text-white/60 text-sm">
                No molecules found
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Filter Panel */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-white/60 whitespace-nowrap">Category:</span>
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  className={`cursor-pointer text-xs ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                      : 'bg-transparent border-white/20 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setCategory(cat as MoleculeCategory | 'all')}
                >
                  {CATEGORY_LABELS[cat as MoleculeCategory | 'all']}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-white/60 whitespace-nowrap">Property:</span>
            <div className="flex flex-wrap gap-1">
              {properties.map((prop) => (
                <Badge
                  key={prop}
                  variant={selectedProperty === prop ? 'default' : 'outline'}
                  className={`cursor-pointer text-xs ${
                    selectedProperty === prop
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : 'bg-transparent border-white/20 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setProperty(prop as MoleculeProperty | 'all')}
                >
                  {PROPERTY_LABELS[prop as MoleculeProperty | 'all']}
                </Badge>
              ))}
            </div>
          </div>
          
          {(selectedCategory !== 'all' || selectedProperty !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCategory('all');
                setProperty('all');
              }}
              className="text-xs text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="h-3 w-3 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
