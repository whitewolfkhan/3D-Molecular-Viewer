'use client';

import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMoleculeStore } from '@/lib/molecules/store';

export default function ExportControls() {
  const { currentMolecule } = useMoleculeStore();
  
  const takeScreenshot = async () => {
    // Find the WebGL canvas
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }
    
    try {
      // Wait a frame to ensure canvas is fully rendered
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      // Create screenshot
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${currentMolecule?.name || 'molecule'}-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to take screenshot:', error);
    }
  };
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={takeScreenshot}
      className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
    >
      <Camera className="h-4 w-4 mr-2" />
      Screenshot
    </Button>
  );
}
