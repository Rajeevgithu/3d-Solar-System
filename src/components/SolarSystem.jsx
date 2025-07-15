import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const planetTextureUrls = {
  mercury: 'https://i.imgur.com/TJO6Te3.jpeg',
  venus: 'https://i.imgur.com/xeaPIjD.jpeg',
  earth: 'https://i.imgur.com/vflkkqF.jpeg',
  mars: 'https://i.imgur.com/U6upjrv.jpeg',
  jupiter: 'https://i.imgur.com/4APG00k.jpeg',
  saturn: 'https://i.imgur.com/YKw0m4x.jpeg',
  uranus: 'https://i.imgur.com/olpgGMo.jpeg',
  neptune: 'https://i.imgur.com/pycXdLM.jpeg',
};

const ringTextureUrls = {
  saturn: 'https://i.imgur.com/u0muMiZ.png',
  uranus: 'https://i.imgur.com/F1y9Ve4.png',
};

const Planet = ({ name, radius, distance, speed, rotationSpeed, hasRing, isPaused, onClick, ring }) => {
  const meshRef = useRef();
  const textureMap = useLoader(THREE.TextureLoader, planetTextureUrls[name]);
  const angle = useRef(0);
  const ringTexture = hasRing ? useLoader(THREE.TextureLoader, ringTextureUrls[name]) : null;
  const [hovered, setHovered] = useState(false);
  const { camera, size } = useThree();
  const [screenPos, setScreenPos] = useState({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!isPaused && typeof speed === 'number') {
      angle.current += speed * delta;
      meshRef.current.position.x = distance * Math.cos(angle.current);
      meshRef.current.position.z = distance * Math.sin(angle.current);
      meshRef.current.rotation.y += rotationSpeed * delta;
    }

    if (meshRef.current) {
      const vector = meshRef.current.getWorldPosition(new THREE.Vector3());
      vector.project(camera);
      setScreenPos({
        x: (vector.x * 0.5 + 0.5) * size.width,
        y: (-vector.y * 0.5 + 0.5) * size.height,
      });
    }
  });

  return (
    <>
      <group
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onClick && onClick(meshRef.current)}
      >
        <mesh>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshStandardMaterial map={textureMap} />
        </mesh>
        {hasRing && ringTexture && (
          <mesh rotation={name === 'uranus' ? [Math.PI / 2, 0, 0] : [-0.5, 0, 0]}>
            <ringGeometry args={[
              ring?.inner || radius * 1.1,
              ring?.outer || radius * 1.6,
              64
            ]} />
            <meshBasicMaterial
              map={ringTexture}
              side={THREE.DoubleSide}
              transparent={true}
              opacity={0.8}
            />
          </mesh>
        )}
      </group>
      {hovered && (
        <Html distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div style={{
            color: 'white',
            background: 'rgba(0,0,0,0.7)',
            padding: '2px 8px',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </div>
        </Html>
      )}
    </>
  );
};

const Sun = () => {
  const texture = useLoader(THREE.TextureLoader, 'https://i.imgur.com/zU5oOjt.jpeg');
  const sunRef = useRef();
  useFrame((state, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.01 * delta; 
    }
  });
  return (
    <mesh ref={sunRef}>
      <sphereGeometry args={[16, 30, 30]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

const CameraController = ({ target, resetCameraFlag, focus, setFocus, focusTarget }) => {
  const { camera } = useThree();
  const controlsRef = useRef();
  const defaultCamera = { position: new THREE.Vector3(0, 40, 100), lookAt: new THREE.Vector3(0, 0, 0) };
  const [animating, setAnimating] = useState(false);

  useFrame(() => {
    if (focus && focusTarget) {
      setAnimating(true);
      camera.position.lerp(focusTarget.position, 0.08);
      camera.lookAt(focusTarget.lookAt);
      if (camera.position.distanceTo(focusTarget.position) < 0.2) {
        setFocus(false);
        setAnimating(false);
        if (controlsRef.current) {
          controlsRef.current.target.copy(focusTarget.lookAt);
        }
      }
    } else if (resetCameraFlag) {
      setAnimating(true);
      camera.position.lerp(defaultCamera.position, 0.08);
      camera.lookAt(defaultCamera.lookAt);
      if (camera.position.distanceTo(defaultCamera.position) < 0.2) {
        setAnimating(false);
        if (controlsRef.current) {
          controlsRef.current.target.copy(defaultCamera.lookAt);
        }
      }
    }
  });

  useEffect(() => {
    setFocus(false);
    if (controlsRef.current) {
      controlsRef.current.target.copy(defaultCamera.lookAt);
    }
  }, [resetCameraFlag]);

  return <OrbitControls ref={controlsRef} enablePan={false} minDistance={10} maxDistance={400} />;
};

// ✅ NEW COMPONENT FOR BACKGROUND COLOR CONTROL
const BackgroundColor = ({ darkMode }) => {
  const { gl } = useThree();

  useEffect(() => {
    gl.setClearColor(darkMode ? '#000000' : '#ffffff', 1);
  }, [darkMode, gl]);

  return null;
};

// Add real planet data
const planetData = [
  { name: 'mercury', radius: 3.2, distance: 28, au: 0.39, km: 57.9, rotationSpeed: 8.83 },
  { name: 'venus', radius: 5.8, distance: 46, au: 0.72, km: 108.2, rotationSpeed: 5.52 },
  { name: 'earth', radius: 6, distance: 64, au: 1.00, km: 149.6, rotationSpeed: 1374 },
  { name: 'mars', radius: 4, distance: 82, au: 1.52, km: 227.9, rotationSpeed: 666 },
  { name: 'jupiter', radius: 12, distance: 100, au: 5.20, km: 778.3, rotationSpeed: 15583 },
  { name: 'saturn', radius: 10, distance: 118, au: 9.54, km: 1427.0, rotationSpeed: 16840, hasRing: true, ring: { inner: 10, outer: 20 } },
  { name: 'uranus', radius: 7, distance: 136, au: 19.2, km: 2871, rotationSpeed: 5794, hasRing: true, ring: { inner: 7, outer: 12 } },
  { name: 'neptune', radius: 7, distance: 154, au: 30.06, km: 4497.1, rotationSpeed: 4719 },
];

const SolarSystem = ({ speeds, setSpeeds, isPaused, resetCameraFlag, darkMode }) => {
  // Use planetData for planets array
  const planets = planetData.map((p) => ({
    ...p,
    speed: speeds[p.name], // orbital speed from slider
    rotationSpeed: 0.02,   // fixed axial rotation for all planets
  }));

  // Helper to draw an arc between two orbits and show the distance in km
  const OrbitArc = ({ p1, p2 }) => {
    const r1 = p1.distance;
    const r2 = p2.distance;
    // Draw an arc from angle -0.2 to +0.2 radians (about 23 degrees)
    const angleStart = -0.2;
    const angleEnd = 0.2;
    const arcPoints = [];
    const steps = 32;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = angleStart + (angleEnd - angleStart) * t;
      // Interpolate radius between r1 and r2
      const radius = r1 + (r2 - r1) * t;
      arcPoints.push(new THREE.Vector3(
        radius * Math.cos(angle),
        0,
        radius * Math.sin(angle)
      ));
    }
    const arcGeometry = new THREE.BufferGeometry().setFromPoints(arcPoints);
    // Label position: midpoint of arc, slightly above
    const midIdx = Math.floor(arcPoints.length / 2);
    const labelPos = arcPoints[midIdx].clone();
    labelPos.y += 3;
    const kmDistance = Math.abs(p2.km - p1.km);
    return (
      <>
        <line geometry={arcGeometry}>
          <lineBasicMaterial attach="material" color="#7f5af0" linewidth={2} />
        </line>
        <Html position={[labelPos.x, labelPos.y, labelPos.z]} center style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(30,30,60,0.85)',
            color: '#fff',
            padding: '2px 8px',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            border: '1px solid #7f5af0',
            marginBottom: '2px',
          }}>
            {kmDistance.toLocaleString()} million km
          </div>
        </Html>
      </>
    );
  };

  const [focus, setFocus] = useState(false);
  const [focusTarget, setFocusTarget] = useState(null);
  const [target, setTarget] = useState(null);

  const handlePlanetClick = (planetGroup) => {
    if (planetGroup) {
      const pos = planetGroup.position.clone();
      const camPos = pos.clone().add(new THREE.Vector3(0, 5, 10));
      setFocusTarget({ position: camPos, lookAt: pos });
      setFocus(true);
    }
  };

  return (
    <Canvas camera={{ position: [0, 40, 100], fov: 60 }} style={{ width: '100vw', height: '100vh' }}>
      <BackgroundColor darkMode={darkMode} />
      <CameraController target={target} resetCameraFlag={resetCameraFlag} focus={focus} setFocus={setFocus} focusTarget={focusTarget} />
      <ambientLight intensity={0.4} color={0x8888ff} />
      {darkMode ? (
        <Stars radius={120} depth={80} count={500} factor={6} saturation={0.5} fade speed={1} />
      ) : (
        <Stars radius={120} depth={80} count={500} factor={3} saturation={0.2} fade speed={0.5} color="#e0e7ef" />
      )}
      {/* Draw orbit rings */}
      {planets.map((planet) => (
        <mesh key={planet.name + '-orbit'} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planet.distance - 0.05, planet.distance + 0.05, 128]} />
          <meshBasicMaterial color="#aaa" transparent opacity={0.18} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* Draw arcs between adjacent planets with km labels */}
      {planets.slice(0, -1).map((planet, i) => (
        <OrbitArc key={planet.name + '-to-' + planets[i + 1].name} p1={planet} p2={planets[i + 1]} />
      ))}
      <Sun />
      {planets.map((planet) => (
        <Planet key={planet.name} {...planet} isPaused={isPaused} onClick={handlePlanetClick} ring={planet.ring} />
      ))}
      <EffectComposer>
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} intensity={1.5} />
      </EffectComposer>
    </Canvas>
  );
};

export default SolarSystem;
