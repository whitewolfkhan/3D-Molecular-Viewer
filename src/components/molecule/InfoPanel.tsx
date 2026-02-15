'use client';

import { Atom, Link2, Info, Thermometer, Scale, Droplet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useMoleculeStore } from '@/lib/molecules/store';
import { ELEMENTS } from '@/lib/molecules/molecules-db';

export default function InfoPanel() {
  const { currentMolecule, selectedAtom, selectedBond } = useMoleculeStore();
  
  const getBondedAtoms = () => {
    if (!selectedAtom || !currentMolecule) return [];
    
    const bondedAtoms = currentMolecule.bonds
      .filter(bond => bond.atom1Id === selectedAtom.id || bond.atom2Id === selectedAtom.id)
      .map(bond => {
        const otherAtomId = bond.atom1Id === selectedAtom.id ? bond.atom2Id : bond.atom1Id;
        const otherAtom = currentMolecule.atoms.find(a => a.id === otherAtomId);
        return {
          atom: otherAtom,
          bondType: bond.type,
        };
      });
    
    return bondedAtoms;
  };
  
  const bondedAtoms = getBondedAtoms();
  
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl">
      <div className="p-4 pb-0">
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider flex items-center gap-2">
          <Info className="h-4 w-4" />
          Molecule Info
        </h3>
      </div>
      
      {/* Current Molecule Info */}
      {currentMolecule && (
        <div className="px-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white flex items-center justify-between">
                <span>{currentMolecule.name}</span>
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                  {currentMolecule.formula}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-white/60 mb-3">{currentMolecule.description}</p>
              
              {/* Properties Badges */}
              <div className="flex flex-wrap gap-1 mb-3">
                <Badge variant="outline" className="bg-white/5 border-white/20 text-xs capitalize">
                  {currentMolecule.category}
                </Badge>
                {currentMolecule.properties.map((prop) => (
                  <Badge 
                    key={prop} 
                    variant="outline" 
                    className={`text-xs ${
                      prop === 'toxic' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                      prop === 'flammable' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                      prop === 'polar' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                      prop === 'aromatic' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                      'bg-white/5 border-white/20'
                    }`}
                  >
                    {prop}
                  </Badge>
                ))}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div className="bg-white/5 rounded-lg p-2">
                  <div className="text-white/40 text-xs">Atoms</div>
                  <div className="text-cyan-400 font-bold text-lg">{currentMolecule.atoms.length}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2">
                  <div className="text-white/40 text-xs">Bonds</div>
                  <div className="text-purple-400 font-bold text-lg">{currentMolecule.bonds.length}</div>
                </div>
              </div>
              
              {/* Physical Properties */}
              {currentMolecule.molarMass > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Scale className="h-3 w-3" />
                    <span>Molar Mass: <span className="text-white font-medium">{currentMolecule.molarMass.toFixed(2)} g/mol</span></span>
                  </div>
                  
                  {currentMolecule.meltingPoint !== undefined && (
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <Thermometer className="h-3 w-3" />
                      <span>Melting Point: <span className="text-white font-medium">{currentMolecule.meltingPoint}°C</span></span>
                    </div>
                  )}
                  
                  {currentMolecule.boilingPoint !== undefined && (
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <Droplet className="h-3 w-3" />
                      <span>Boiling Point: <span className="text-white font-medium">{currentMolecule.boilingPoint}°C</span></span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Selected Atom Info */}
      {selectedAtom && (
        <>
          <Separator className="bg-white/10 mx-4" />
          <div className="px-4">
            <Card className="bg-white/5 border-white/10 border-cyan-500/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Atom className="h-4 w-4 text-cyan-400" />
                  Selected Atom
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {(() => {
                  const element = ELEMENTS[selectedAtom.element] || ELEMENTS['C'];
                  return (
                    <>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-white/20"
                          style={{ backgroundColor: element.color }}
                        >
                          {element.symbol}
                        </div>
                        <div>
                          <div className="font-medium text-white">{element.name}</div>
                          <div className="text-xs text-white/40">Symbol: {element.symbol}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-white/5 rounded-lg p-2">
                          <div className="text-white/40 text-xs">Atomic Number</div>
                          <div className="text-white font-medium">{element.atomicNumber}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                          <div className="text-white/40 text-xs">Atomic Mass</div>
                          <div className="text-white font-medium">{element.atomicMass} u</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                          <div className="text-white/40 text-xs">Van der Waals</div>
                          <div className="text-white font-medium">{element.vanDerWaalsRadius} Å</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                          <div className="text-white/40 text-xs">Covalent Radius</div>
                          <div className="text-white font-medium">{element.covalentRadius} Å</div>
                        </div>
                      </div>
                      
                      {bondedAtoms.length > 0 && (
                        <div>
                          <div className="text-xs text-white/40 mb-2">Bonded Atoms ({bondedAtoms.length})</div>
                          <div className="flex flex-wrap gap-2">
                            {bondedAtoms.map(({ atom, bondType }) => {
                              if (!atom) return null;
                              const bondedElement = ELEMENTS[atom.element] || ELEMENTS['C'];
                              return (
                                <Badge
                                  key={atom.id}
                                  variant="outline"
                                  className="bg-white/5 border-white/20 text-white/80"
                                >
                                  <span
                                    className="w-3 h-3 rounded-full mr-1"
                                    style={{ backgroundColor: bondedElement.color }}
                                  />
                                  {atom.element}
                                  <span className="ml-1 text-white/40">
                                    ({bondType})
                                  </span>
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        </>
      )}
      
      {/* Selected Bond Info */}
      {selectedBond && currentMolecule && (
        <>
          <Separator className="bg-white/10 mx-4" />
          <div className="px-4">
            <Card className="bg-white/5 border-white/10 border-purple-500/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-purple-400" />
                  Selected Bond
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {(() => {
                  const atom1 = currentMolecule.atoms.find(a => a.id === selectedBond.atom1Id);
                  const atom2 = currentMolecule.atoms.find(a => a.id === selectedBond.atom2Id);
                  const element1 = atom1 ? ELEMENTS[atom1.element] : null;
                  const element2 = atom2 ? ELEMENTS[atom2.element] : null;
                  
                  return (
                    <>
                      <div className="flex items-center justify-center gap-3">
                        {element1 && (
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white/20"
                            style={{ backgroundColor: element1.color }}
                          >
                            {element1.symbol}
                          </div>
                        )}
                        <div className="flex flex-col items-center">
                          <div className="text-xs text-white/40">Bond Type</div>
                          <Badge
                            variant="outline"
                            className={`mt-1 ${
                              selectedBond.type === 'single'
                                ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                : selectedBond.type === 'double'
                                ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                : 'bg-red-500/20 text-red-300 border-red-500/30'
                            }`}
                          >
                            {selectedBond.type.toUpperCase()}
                          </Badge>
                        </div>
                        {element2 && (
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white/20"
                            style={{ backgroundColor: element2.color }}
                          >
                            {element2.symbol}
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-white/5 rounded-lg p-2">
                          <div className="text-white/40 text-xs">Bond Length</div>
                          <div className="text-white font-medium">
                            {selectedBond.length ? `${selectedBond.length} Å` : 'N/A'}
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                          <div className="text-white/40 text-xs">Bond Order</div>
                          <div className="text-white font-medium">
                            {selectedBond.type === 'single' ? 1 : selectedBond.type === 'double' ? 2 : 3}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-2">
                        <div className="text-white/40 text-xs">Connected Elements</div>
                        <div className="text-white font-medium">
                          {element1?.name} — {element2?.name}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        </>
      )}
      
      {/* No Selection Hint */}
      {!selectedAtom && !selectedBond && (
        <div className="px-4 pb-4 text-center py-4 text-white/40 text-sm">
          Click on an atom or bond to view details
        </div>
      )}
    </div>
  );
}
