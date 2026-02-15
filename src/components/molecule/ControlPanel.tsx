'use client';

import { 
  RotateCcw, 
  RotateCw, 
  Tag, 
  Link2, 
  Maximize2, 
  Sun, 
  Moon,
  CircleDot,
  Box
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useMoleculeStore, VisualizationMode } from '@/lib/molecules/store';

export default function ControlPanel() {
  const {
    visualizationMode,
    autoRotate,
    showLabels,
    showBonds,
    theme,
    setVisualizationMode,
    toggleAutoRotate,
    toggleLabels,
    toggleBonds,
    toggleFullscreen,
    toggleTheme,
    resetView,
  } = useMoleculeStore();
  
  const visualizationModes: { id: VisualizationMode; name: string; icon: React.ReactNode }[] = [
    { id: 'ball-and-stick', name: 'Ball & Stick', icon: <CircleDot className="h-4 w-4" /> },
    { id: 'space-filling', name: 'Space Filling', icon: <Box className="h-4 w-4" /> },
  ];
  
  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl">
      <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
        Controls
      </h3>
      
      {/* Visualization Mode */}
      <div className="space-y-2">
        <Label className="text-xs text-white/60 uppercase tracking-wide">
          Visualization Mode
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {visualizationModes.map((mode) => (
            <Button
              key={mode.id}
              variant={visualizationMode === mode.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setVisualizationMode(mode.id)}
              className={`flex items-center gap-2 ${
                visualizationMode === mode.id
                  ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                  : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
              }`}
            >
              {mode.icon}
              <span className="text-xs">{mode.name}</span>
            </Button>
          ))}
        </div>
      </div>
      
      <Separator className="bg-white/10" />
      
      {/* Toggle Options */}
      <div className="space-y-3">
        <Label className="text-xs text-white/60 uppercase tracking-wide">
          Display Options
        </Label>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCw className="h-4 w-4 text-white/60" />
            <span className="text-sm text-white/80">Auto Rotate</span>
          </div>
          <Switch
            checked={autoRotate}
            onCheckedChange={toggleAutoRotate}
            className="data-[state=checked]:bg-cyan-500"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-white/60" />
            <span className="text-sm text-white/80">Show Labels</span>
          </div>
          <Switch
            checked={showLabels}
            onCheckedChange={toggleLabels}
            className="data-[state=checked]:bg-cyan-500"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-white/60" />
            <span className="text-sm text-white/80">Show Bonds</span>
          </div>
          <Switch
            checked={showBonds}
            onCheckedChange={toggleBonds}
            className="data-[state=checked]:bg-cyan-500"
          />
        </div>
      </div>
      
      <Separator className="bg-white/10" />
      
      {/* Quick Actions */}
      <div className="space-y-2">
        <Label className="text-xs text-white/60 uppercase tracking-wide">
          Actions
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetView}
            className="bg-white/5 border-white/20 text-white hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="bg-white/5 border-white/20 text-white hover:bg-white/10"
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            Fullscreen
          </Button>
        </div>
      </div>
      
      <Separator className="bg-white/10" />
      
      {/* Theme Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {theme === 'dark' ? (
            <Moon className="h-4 w-4 text-white/60" />
          ) : (
            <Sun className="h-4 w-4 text-white/60" />
          )}
          <span className="text-sm text-white/80">Dark Theme</span>
        </div>
        <Switch
          checked={theme === 'dark'}
          onCheckedChange={toggleTheme}
          className="data-[state=checked]:bg-cyan-500"
        />
      </div>
    </div>
  );
}
