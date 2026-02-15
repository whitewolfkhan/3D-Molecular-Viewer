'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useMoleculeStore } from '@/lib/molecules/store';
import { ELEMENTS, Atom, Bond } from '@/lib/molecules/molecules-db';

interface AtomMeshProps {
  atom: Atom;
  isSpaceFilling: boolean;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}

function AtomMesh({ atom, isSpaceFilling, isSelected, isHovered, onClick, onPointerOver, onPointerOut }: AtomMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const element = ELEMENTS[atom.element] || ELEMENTS['C'];
  const baseRadius = isSpaceFilling ? element.vanDerWaalsRadius : element.covalentRadius + 0.15;
  const radius = baseRadius * 0.3;
  
  const color = useMemo(() => {
    if (isSelected) return '#00FFFF';
    if (isHovered) return '#FFD700';
    return element.color;
  }, [isSelected, isHovered, element.color]);
  
  const targetScale = isSelected ? 1.3 : isHovered ? 1.15 : 1;
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      position={atom.position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        onPointerOut();
        document.body.style.cursor = 'default';
      }}
    >
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial
        color={color}
        metalness={0.3}
        roughness={0.4}
        emissive={isSelected || isHovered ? color : '#000000'}
        emissiveIntensity={isSelected ? 0.5 : isHovered ? 0.3 : 0}
      />
      {(isSelected || isHovered) && (
        <pointLight color={color} intensity={0.5} distance={2} />
      )}
    </mesh>
  );
}

interface BondMeshProps {
  bond: Bond;
  atoms: Atom[];
  isSpaceFilling: boolean;
  isSelected: boolean;
  onClick: () => void;
}

function BondMesh({ bond, atoms, isSpaceFilling, isSelected, onClick }: BondMeshProps) {
  const atom1 = atoms.find(a => a.id === bond.atom1Id);
  const atom2 = atoms.find(a => a.id === bond.atom2Id);
  
  if (!atom1 || !atom2) return null;
  if (isSpaceFilling) return null;
  
  const start = new THREE.Vector3(...atom1.position);
  const end = new THREE.Vector3(...atom2.position);
  const direction = new THREE.Vector3().subVectors(end, start);
  
  const color = isSelected ? '#00FFFF' : '#808080';
  
  const bonds: JSX.Element[] = [];
  const offsets = bond.type === 'single' ? [0] : 
                  bond.type === 'double' ? [-0.05, 0.05] : 
                  [-0.08, 0, 0.08];
  
  offsets.forEach((offset, idx) => {
    const perpendicular = new THREE.Vector3(1, 0, 0);
    const normalizedDir = direction.clone().normalize();
    if (Math.abs(normalizedDir.dot(perpendicular)) > 0.9) {
      perpendicular.set(0, 1, 0);
    }
    perpendicular.cross(direction).normalize();
    
    const offsetStart = start.clone().add(perpendicular.clone().multiplyScalar(offset));
    const offsetEnd = end.clone().add(perpendicular.clone().multiplyScalar(offset));
    const offsetMid = offsetStart.clone().add(offsetEnd).multiplyScalar(0.5);
    const offsetLength = offsetEnd.clone().sub(offsetStart).length();
    
    // Calculate rotation for cylinder
    const cylinderDir = offsetEnd.clone().sub(offsetStart).normalize();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), cylinderDir);
    
    bonds.push(
      <mesh
        key={`${bond.id}-${idx}`}
        position={offsetMid.toArray()}
        quaternion={quaternion}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <cylinderGeometry args={[0.03, 0.03, offsetLength, 8]} />
        <meshStandardMaterial
          color={color}
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>
    );
  });
  
  return <group>{bonds}</group>;
}

interface AtomLabelProps {
  atom: Atom;
  showLabels: boolean;
}

function AtomLabel({ atom, showLabels }: AtomLabelProps) {
  if (!showLabels) return null;
  
  const element = ELEMENTS[atom.element] || ELEMENTS['C'];
  const radius = (element.covalentRadius + 0.15) * 0.3;
  
  return (
    <Text
      position={[atom.position[0], atom.position[1], atom.position[2] + radius + 0.1]}
      fontSize={0.15}
      color="#FFFFFF"
      anchorX="center"
      anchorY="bottom"
      outlineWidth={0.01}
      outlineColor="#000000"
    >
      {atom.element}
    </Text>
  );
}

function MoleculeScene() {
  const {
    currentMolecule,
    visualizationMode,
    autoRotate,
    showLabels,
    showBonds,
    selectedAtom,
    selectedBond,
    hoverAtom,
    selectAtom,
    selectBond,
  } = useMoleculeStore();
  
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += 0.005;
    }
  });
  
  const isSpaceFilling = visualizationMode === 'space-filling';
  
  if (!currentMolecule) return null;
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={0.3} />
      
      <group ref={groupRef}>
        {currentMolecule.atoms.map((atom) => (
          <AtomMesh
            key={atom.id}
            atom={atom}
            isSpaceFilling={isSpaceFilling}
            isSelected={selectedAtom?.id === atom.id}
            isHovered={useMoleculeStore.getState().hoveredAtom?.id === atom.id}
            onClick={() => selectAtom(atom)}
            onPointerOver={() => hoverAtom(atom)}
            onPointerOut={() => hoverAtom(null)}
          />
        ))}
        
        {showBonds && currentMolecule.bonds.map((bond) => (
          <BondMesh
            key={bond.id}
            bond={bond}
            atoms={currentMolecule.atoms}
            isSpaceFilling={isSpaceFilling}
            isSelected={selectedBond?.id === bond.id}
            onClick={() => selectBond(bond)}
          />
        ))}
        
        {showLabels && currentMolecule.atoms.map((atom) => (
          <AtomLabel key={`label-${atom.id}`} atom={atom} showLabels={showLabels} />
        ))}
      </group>
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={20}
      />
    </>
  );
}

interface MoleculeViewerProps {
  resetTrigger?: number;
}

export default function MoleculeViewer({ resetTrigger }: MoleculeViewerProps) {
  const { theme } = useMoleculeStore();
  
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        gl={{ preserveDrawingBuffer: true }}
        style={{ background: theme === 'dark' ? '#0a0a0a' : '#f5f5f5' }}
      >
        <color attach="background" args={[theme === 'dark' ? '#0a0a0a' : '#f5f5f5']} />
        <fog attach="fog" args={[theme === 'dark' ? '#0a0a0a' : '#f5f5f5', 15, 30]} />
        <MoleculeScene />
      </Canvas>
    </div>
  );
}
