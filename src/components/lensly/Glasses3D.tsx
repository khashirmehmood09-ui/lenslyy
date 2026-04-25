import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Frame } from "@/data/frames";

/**
 * Parametric 3D glasses model. Each frame "shape" tweaks lens geometry.
 * Color is fully controlled — recolors the frame material live.
 */

type ShapeKey = Frame["shape"];

function lensShape(kind: ShapeKey): THREE.Shape {
  const s = new THREE.Shape();
  switch (kind) {
    case "Round": {
      const r = 0.55;
      s.absellipse(0, 0, r, r, 0, Math.PI * 2, false, 0);
      break;
    }
    case "Square": {
      const w = 0.62, h = 0.55, r = 0.08;
      roundedRect(s, -w, -h, w * 2, h * 2, r);
      break;
    }
    case "Rectangle": {
      const w = 0.7, h = 0.42, r = 0.06;
      roundedRect(s, -w, -h, w * 2, h * 2, r);
      break;
    }
    case "Wayfarer": {
      const w = 0.65, h = 0.5, r = 0.14;
      roundedRect(s, -w, -h, w * 2, h * 2, r);
      break;
    }
    case "Aviator": {
      // Teardrop
      s.moveTo(-0.6, 0.35);
      s.bezierCurveTo(-0.7, 0.1, -0.5, -0.55, 0, -0.55);
      s.bezierCurveTo(0.5, -0.55, 0.7, 0.1, 0.6, 0.35);
      s.bezierCurveTo(0.4, 0.5, -0.4, 0.5, -0.6, 0.35);
      break;
    }
    case "Cat-eye": {
      s.moveTo(-0.65, 0.1);
      s.bezierCurveTo(-0.75, 0.55, -0.2, 0.55, 0, 0.3);
      s.bezierCurveTo(0.2, 0.55, 0.75, 0.55, 0.65, 0.1);
      s.bezierCurveTo(0.7, -0.45, -0.05, -0.55, -0.05, -0.55);
      s.bezierCurveTo(-0.05, -0.55, -0.7, -0.45, -0.65, 0.1);
      break;
    }
  }
  return s;
}

function roundedRect(s: THREE.Shape, x: number, y: number, w: number, h: number, r: number) {
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
}

function GlassesModel({ shape, color, autoRotate }: { shape: ShapeKey; color: string; autoRotate: boolean }) {
  const group = useRef<THREE.Group>(null);

  const lensGeo = useMemo(() => {
    const s = lensShape(shape);
    // Hole = same shape slightly inset → gives "rim only"
    const hole = lensShape(shape);
    const scaleHole = 0.82;
    hole.curves.forEach((c: any) => {
      // simpler: rebuild scaled by transforming points isn't trivial for bezier;
      // instead use ExtrudeGeometry of full shape and overlay glass plane.
    });
    void hole; void scaleHole;
    return new THREE.ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 3, curveSegments: 48 });
  }, [shape]);

  // Inner cavity — slightly smaller, pushed forward to "cut" the rim visually
  const innerScale = 0.82;

  useFrame((_, dt) => {
    if (autoRotate && group.current) group.current.rotation.y += dt * 0.4;
  });

  // Slight x-offset for two lenses
  const offset = 0.78;

  return (
    <group ref={group} rotation={[0.05, 0, 0]}>
      {/* Frame rims — left & right */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * offset, 0, 0]}>
          <mesh geometry={lensGeo} castShadow>
            <meshPhysicalMaterial color={color} roughness={0.25} metalness={0.35} clearcoat={0.6} clearcoatRoughness={0.2} />
          </mesh>
          {/* Lens (transparent glass) */}
          <mesh position={[0, 0, 0.04]} scale={[innerScale, innerScale, 0.05]}>
            <extrudeGeometry args={[lensShape(shape), { depth: 0.02, bevelEnabled: false, curveSegments: 48 }]} />
            <meshPhysicalMaterial color={color} transparent opacity={0.18} roughness={0.05} transmission={0.85} thickness={0.3} ior={1.4} />
          </mesh>
        </group>
      ))}

      {/* Bridge */}
      <mesh position={[0, 0.05, 0.04]}>
        <boxGeometry args={[0.45, 0.08, 0.07]} />
        <meshPhysicalMaterial color={color} roughness={0.3} metalness={0.35} clearcoat={0.5} />
      </mesh>

      {/* Top bar (aviator only) */}
      {shape === "Aviator" && (
        <mesh position={[0, 0.32, 0.04]}>
          <boxGeometry args={[1.7, 0.04, 0.05]} />
          <meshStandardMaterial color={color} roughness={0.35} metalness={0.4} />
        </mesh>
      )}

      {/* Temples (arms) */}
      {[-1, 1].map((side) => (
        <group key={`arm-${side}`} position={[side * 1.42, 0.05, 0]} rotation={[0, side * -0.25, 0]}>
          <mesh position={[side * 0.7, 0, -0.4]}>
            <boxGeometry args={[1.5, 0.08, 0.08]} />
            <meshPhysicalMaterial color={color} roughness={0.3} metalness={0.3} clearcoat={0.5} />
          </mesh>
          {/* Hinge */}
          <mesh>
            <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
            <meshStandardMaterial color="#999" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Nose pads */}
      {[-0.18, 0.18].map((x) => (
        <mesh key={x} position={[x, -0.15, 0.06]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshPhysicalMaterial color="#ffe4d6" roughness={0.5} transmission={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export const Glasses3D = ({ shape, color, autoRotate = false }: { shape: ShapeKey; color: string; autoRotate?: boolean }) => {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.2, 4.2], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#a78bfa" />
        <pointLight position={[0, -2, 3]} intensity={0.4} color="#60a5fa" />

        <GlassesModel shape={shape} color={color} autoRotate={autoRotate} />

        <ContactShadows position={[0, -0.85, 0]} opacity={0.5} scale={6} blur={2.4} far={2} />
        <Environment preset="city" />
        <OrbitControls enablePan={false} enableZoom minDistance={2.4} maxDistance={6} autoRotate={false} target={[0, 0, 0]} />
      </Suspense>
    </Canvas>
  );
};