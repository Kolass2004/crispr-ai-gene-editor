import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import { Expand, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as THREE from 'three';

interface GRNACandidate {
  id: number;
  sequence: string;
  position: number;
  onTargetScore: number;
  offTargetRisk: number;
  pamSequence: string;
  gcContent: number;
}

interface Gene3DViewerProps {
  gene: string;
  grnaResults: GRNACandidate[];
}

const DNAHelix = ({ length = 100, grnaPositions = [] }: { length?: number; grnaPositions?: number[] }) => {
  const helixRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (helixRef.current) {
      helixRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const { strand1Points, strand2Points, baseConnections, bases } = useMemo(() => {
    const strand1: THREE.Vector3[] = [];
    const strand2: THREE.Vector3[] = [];
    const connections: [THREE.Vector3, THREE.Vector3][] = [];
    const basePairs: { pos1: THREE.Vector3; pos2: THREE.Vector3; type: string }[] = [];
    
    const radius = 2.5;
    const pitch = 0.3;
    const baseTypes = ['A', 'T', 'G', 'C'];
    
    for (let i = 0; i < length; i++) {
      const angle1 = (i / length) * Math.PI * 10;
      const angle2 = angle1 + Math.PI;
      const y = i * pitch - (length * pitch) / 2;
      
      const point1 = new THREE.Vector3(
        Math.cos(angle1) * radius,
        y,
        Math.sin(angle1) * radius
      );
      
      const point2 = new THREE.Vector3(
        Math.cos(angle2) * radius,
        y,
        Math.sin(angle2) * radius
      );
      
      strand1.push(point1);
      strand2.push(point2);
      
      if (i % 2 === 0) {
        connections.push([point1, point2]);
        
        const basePos1 = new THREE.Vector3(
          Math.cos(angle1) * (radius - 0.3),
          y,
          Math.sin(angle1) * (radius - 0.3)
        );
        const basePos2 = new THREE.Vector3(
          Math.cos(angle2) * (radius - 0.3),
          y,
          Math.sin(angle2) * (radius - 0.3)
        );
        
        basePairs.push({
          pos1: basePos1,
          pos2: basePos2,
          type: baseTypes[Math.floor(Math.random() * baseTypes.length)]
        });
      }
    }
    
    return {
      strand1Points: strand1,
      strand2Points: strand2,
      baseConnections: connections,
      bases: basePairs
    };
  }, [length]);

  return (
    <group ref={helixRef}>
      <Line
        points={strand1Points}
        color="#1E40AF"
        lineWidth={4}
      />
      
      <Line
        points={strand2Points}
        color="#1E40AF"
        lineWidth={4}
      />
      
      {baseConnections.map((connection, index) => (
        <Line
          key={index}
          points={connection}
          color="#64748B"
          lineWidth={2}
        />
      ))}
      
      {bases.map((base, index) => (
        <group key={index}>
          <mesh position={base.pos1}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshStandardMaterial 
              color={
                base.type === 'A' ? '#EF4444' : 
                base.type === 'T' ? '#F59E0B' :
                base.type === 'G' ? '#10B981' : '#3B82F6'
              }
              metalness={0.1}
              roughness={0.3}
            />
          </mesh>
          <mesh position={base.pos2}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshStandardMaterial 
              color={
                base.type === 'A' ? '#F59E0B' : 
                base.type === 'T' ? '#EF4444' :
                base.type === 'G' ? '#3B82F6' : '#10B981'
              }
              metalness={0.1}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
      
      {strand1Points.map((point, index) => (
        <group key={`backbone-${index}`}>
          <mesh position={point}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial 
              color="#1E293B"
              metalness={0.2}
              roughness={0.4}
            />
          </mesh>
          <mesh position={strand2Points[index]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial 
              color="#1E293B"
              metalness={0.2}
              roughness={0.4}
            />
          </mesh>
        </group>
      ))}
      
      {grnaPositions.map((position, index) => {
        const normalizedPos = (position / 3000) * length;
        const angle = (normalizedPos / length) * Math.PI * 10;
        const y = normalizedPos * 0.3 - (length * 0.3) / 2;
        
        return (
          <group key={index}>
            <mesh
              position={[
                Math.cos(angle) * 3.2,
                y,
                Math.sin(angle) * 3.2
              ]}
            >
              <sphereGeometry args={[0.4, 20, 20]} />
              <meshStandardMaterial 
                color="#10B981"
                emissive="#065F46"
                emissiveIntensity={0.3}
                metalness={0.3}
                roughness={0.2}
              />
            </mesh>
            
            <mesh
              position={[
                Math.cos(angle) * 3.2,
                y,
                Math.sin(angle) * 3.2
              ]}
            >
              <ringGeometry args={[0.5, 0.7, 16]} />
              <meshBasicMaterial 
                color="#10B981"
                transparent
                opacity={0.4}
                side={THREE.DoubleSide}
              />
            </mesh>
            
            <Text
              position={[
                Math.cos(angle) * 4.5,
                y + 0.3,
                Math.sin(angle) * 4.5
              ]}
              fontSize={0.25}
              color="#10B981"
              anchorX="center"
              anchorY="middle"
            >
              gRNA {index + 1}
            </Text>
          </group>
        );
      })}
    </group>
  );
};

const Scene = ({ gene, grnaResults }: { gene: string; grnaResults: GRNACandidate[] }) => {
  const grnaPositions = grnaResults.map(grna => grna.position);
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      <DNAHelix length={120} grnaPositions={grnaPositions} />
      
      <Text
        position={[0, 20, 0]}
        fontSize={1.5}
        color="#1E40AF"
        anchorX="center"
        anchorY="middle"
      >
        {gene} Gene
      </Text>
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={50}
        autoRotate={false}
      />
    </>
  );
};

export const Gene3DViewer: React.FC<Gene3DViewerProps> = ({ gene, grnaResults }) => {
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (error) {
    return (
      <div className="w-full h-96 bg-slate-900 rounded-lg flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-red-400 mb-2">3D Visualization Error</div>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    );
  }

  const handleCloseFullscreen = () => {
    console.log('Closing fullscreen...');
    setIsFullscreen(false);
  };

  const handleExpandFullscreen = () => {
    console.log('Opening fullscreen...');
    setIsFullscreen(true);
  };

  const FullscreenModal = () => (
    <div className="fixed inset-0 z-[9999] bg-black">
      <div className="absolute top-4 right-4 z-[10000]">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCloseFullscreen}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Canvas
        camera={{ position: [15, 10, 15], fov: 60 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <Scene gene={gene} grnaResults={grnaResults} />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-4 left-4 text-white text-xs bg-black/60 p-3 rounded-lg space-y-1">
        <div>• <span className="text-blue-400">Blue strands:</span> DNA double helix</div>
        <div>• <span className="text-red-400">A</span>/<span className="text-yellow-400">T</span> <span className="text-green-400">G</span>/<span className="text-blue-400">C:</span> Base pairs</div>
        <div>• <span className="text-green-400">Green markers:</span> gRNA target sites</div>
        <div>• Drag to rotate, scroll to zoom</div>
      </div>
    </div>
  );

  return (
    <>
      <div className="w-full h-96 bg-slate-900 rounded-lg overflow-hidden relative">
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExpandFullscreen}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Expand className="h-4 w-4" />
          </Button>
        </div>
        
        <Canvas
          camera={{ position: [15, 10, 15], fov: 60 }}
          onCreated={() => setError(null)}
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <Scene gene={gene} grnaResults={grnaResults} />
          </Suspense>
        </Canvas>
        
        <div className="absolute bottom-4 left-4 text-white text-xs bg-black/60 p-3 rounded-lg space-y-1">
          <div>• <span className="text-blue-400">Blue strands:</span> DNA double helix</div>
          <div>• <span className="text-red-400">A</span>/<span className="text-yellow-400">T</span> <span className="text-green-400">G</span>/<span className="text-blue-400">C:</span> Base pairs</div>
          <div>• <span className="text-green-400">Green markers:</span> gRNA target sites</div>
          <div>• Drag to rotate, scroll to zoom</div>
        </div>
      </div>
      
      {isFullscreen && <FullscreenModal />}
    </>
  );
};
