"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";
import { useMemo, useRef, useEffect, useState } from "react";
import Earth from "./Earth";

type Quality = "mobile" | "tablet" | "laptop" | "desktop";

function useQuality(): Quality {
  const [quality, setQuality] = useState<Quality>("desktop");

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;

      if (width < 768 || isCoarse) setQuality("mobile");
      else if (width < 1024) setQuality("tablet");
      else if (width < 1440) setQuality("laptop");
      else setQuality("desktop");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return quality;
}

function SpaceDust({ count = 250 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = THREE.MathUtils.randFloatSpread(100);
      const y = THREE.MathUtils.randFloatSpread(100);
      const z = THREE.MathUtils.randFloatSpread(100);
      const size = THREE.MathUtils.randFloat(0.5, 1.2) * 0.015;
      const speed = THREE.MathUtils.randFloat(0.001, 0.003);
      temp.push({ x, y, z, size, speed });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    particles.forEach((particle, i) => {
      particle.x += particle.speed;
      particle.y -= particle.speed;

      if (particle.x > 50) particle.x = -50;
      if (particle.y < -50) particle.y = 50;

      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.scale.setScalar(particle.size);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(i, dummy.matrix);
    });
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
    </instancedMesh>
  );
}

function Constellations() {
  const linesRef = useRef<THREE.Group>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(true);
      setTimeout(() => setActive(false), 3000);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < 20; i++) {
      p.push(new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(60),
        THREE.MathUtils.randFloatSpread(60),
        THREE.MathUtils.randFloatSpread(60)
      ));
    }
    return p;
  }, []);

  return (
    <group ref={linesRef}>
      {active && points.slice(0, -1).map((p, i) => (
        <line key={i}>
          <bufferGeometry attach="geometry" setFromPoints={[p, points[i + 1]]} />
          <lineBasicMaterial attach="material" color="#ffffff" transparent opacity={0.08} />
        </line>
      ))}
    </group>
  );
}

function TwinklingStars({ count = 300 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = THREE.MathUtils.randFloatSpread(200);
      const y = THREE.MathUtils.randFloatSpread(200);
      const z = THREE.MathUtils.randFloatSpread(200);
      const size = THREE.MathUtils.randFloat(0.01, 0.03);
      const phase = ((i / count) * Math.PI * 2) % (Math.PI * 2);
      temp.push({ x, y, z, size, phase });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    particles.forEach((particle, i) => {
      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.scale.setScalar(particle.size);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(i, dummy.matrix);
    });
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" transparent />
    </instancedMesh>
  );
}

function Starfield({ quality }: { quality: Quality }) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    current.current.x += (mouse.current.x * 0.1 - current.current.x) * 0.01;
    current.current.y += (mouse.current.y * 0.1 - current.current.y) * 0.01;
    groupRef.current.position.x = current.current.x * 15.0;
    groupRef.current.position.y = -current.current.y * 10.0;
  });

  const starCount = {
    desktop: 15000,
    laptop: 12000,
    tablet: 9000,
    mobile: 5000,
  }[quality];

  return (
    <group ref={groupRef}>
      <group position={[0, 0, -100]}>
        <Stars
          radius={300}
          depth={100}
          count={starCount}
          factor={4}
          saturation={0}
          fade
          speed={0.4}
        />
      </group>
      {quality === "desktop" && (
        <>
          <SpaceDust count={300} />
          <TwinklingStars count={200} />
          <Constellations />
        </>
      )}
    </group>
  );
}

// eslint-disable-next-line react-hooks/rules-of-hooks
function CameraController({ scrollProgress, quality }: { scrollProgress: number; quality: Quality }) {
  const { camera } = useThree();
  const baseZ = quality === "mobile" ? 7.5 : 6.0;
  const targetZ = useRef(baseZ);

  // useFrame is a special hook designed for mutations in React Three Fiber
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useFrame(() => {
    targetZ.current = baseZ - scrollProgress * 3.5;
    // This mutation pattern is standard in React Three Fiber
    // eslint-disable-next-line react-hooks/immutability
    camera.position.z += (targetZ.current - camera.position.z) * 0.05;
  });

  return null;
}

function PostEffects({ quality }: { quality: Quality }) {
  if (quality === "mobile") return null;

  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom
        intensity={quality === "tablet" ? 0.25 : 0.35}
        luminanceThreshold={0.7}
        mipmapBlur
      />
      <Vignette offset={0.3} darkness={0.9} />
    </EffectComposer>
  );
}


function SceneContent({ scrollProgress, quality }: { scrollProgress: number; quality: Quality }) {
  const earthConfig = {
    desktop: { scale: 1.9, y: 0 },
    laptop: { scale: 1.9, y: 0 },
    tablet: { scale: 1.9, y: 0 },
    mobile: { scale: 2.35, y: 0 },
  }[quality];

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, quality === "mobile" ? 7.5 : 6]} fov={35} />
      <color attach="background" args={["#000000"]} />

      <directionalLight
        position={[20, 10, 10]}
        intensity={2.2}
        color="#ffffff"
      />
      <ambientLight intensity={0.04} />

      <Starfield quality={quality} />

      <group rotation={[0.1, 0, 0]} position={[0, earthConfig.y, 0]} scale={earthConfig.scale}>
        <Earth
          scrollProgress={scrollProgress}
          quality={quality}
        />
      </group>

      <CameraController scrollProgress={scrollProgress} quality={quality} />
      <PostEffects quality={quality} />
    </>
  );
}

export default function EarthCanvas({
  visible,
  scrollProgress = 0,
}: {
  visible: boolean;
  scrollProgress?: number;
}) {
  const quality = useQuality();

  return (
    <motion.div
      className="absolute inset-0 z-0 bg-black"
      initial={{ opacity: 0 }}
      animate={visible ? { opacity: 1 } : {}}
      transition={{ duration: 3, ease: [0.4, 0, 0.2, 1] }}
    >
      <Canvas
        dpr={quality === "desktop" ? [1, 2] : [1, 1.25]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: quality === "desktop" ? 1.05 : 1.0,
          powerPreference: "high-performance",
        }}
      >
        <SceneContent scrollProgress={scrollProgress} quality={quality} />
      </Canvas>
    </motion.div>
  );
}
