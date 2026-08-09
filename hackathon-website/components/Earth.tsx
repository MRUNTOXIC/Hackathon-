"use client";
import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import {
  TextureLoader,
  Vector3,
  Group,
  NoColorSpace,
  SRGBColorSpace,
  RepeatWrapping,
  ClampToEdgeWrapping,
  LinearMipmapLinearFilter,
  LinearFilter,
} from "three";

const SUN_DIR = new Vector3(20, 10, 10).normalize();

const surfaceVert = /* glsl */`
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vViewDir;
  void main() {
    vUv = uv;
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const surfaceFrag = /* glsl */`
  uniform sampler2D uDay;
  uniform sampler2D uNight;
  uniform sampler2D uNormal;
  uniform sampler2D uSpecular;
  uniform vec3 uSunDir;
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vViewDir;

  void main() {
    float sunDot = dot(vWorldNormal, uSunDir);
    float dayMix = smoothstep(-0.1, 0.15, sunDot);

    // Dynamic Normal mapping
    float terminator = 1.0 - smoothstep(0.0, 0.35, abs(sunDot));
    float normalStrength = 0.35 + terminator * 0.55;

    vec3 dayTexColor = texture2D(uDay, vUv).rgb;
    vec3 dayColor = pow(dayTexColor, vec3(1.2)); // Contrast boost

    vec3 nightColor = texture2D(uNight, vUv).rgb * 1.6;

    float specMask = texture2D(uSpecular, vUv).r;
    vec3 normalMap = texture2D(uNormal, vUv).xyz * 2.0 - 1.0;
    vec3 N = normalize(vWorldNormal + normalMap * normalStrength);

    // PBR Water
    float fresnel = pow(1.0 - max(dot(vViewDir, N), 0.0), 5.0);
    vec3 waterTint = mix(vec3(0.001, 0.002, 0.005), vec3(0.01, 0.02, 0.05), fresnel);
    vec3 surfaceColor = mix(dayColor, waterTint, specMask * 0.9);

    vec3 R = reflect(-uSunDir, N);
    float spec = pow(max(dot(R, vViewDir), 0.0), 180.0) * specMask * dayMix;

    // Transition
    vec3 shadowSide = mix(vec3(0.0), dayColor, 0.01);
    vec3 litSide = mix(nightColor, surfaceColor, dayMix);
    vec3 finalColor = mix(shadowSide, litSide, smoothstep(-0.3, 0.15, sunDot));

    finalColor += vec3(0.9, 0.95, 1.0) * spec * 0.55;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function configureTexture(tex: import("three").Texture, colorSpace?: typeof SRGBColorSpace) {
  tex.wrapS = RepeatWrapping;
  tex.wrapT = ClampToEdgeWrapping;
  tex.minFilter = LinearMipmapLinearFilter;
  tex.magFilter = LinearFilter;
  tex.generateMipmaps = true;
  if (colorSpace) tex.colorSpace = colorSpace;
}

type Quality = "mobile" | "tablet" | "laptop" | "desktop";

export default function Earth({
  scrollProgress = 0,
  quality = "desktop",
}: {
  scrollProgress?: number;
  quality?: Quality;
}) {
  const groupRef = useRef<Group>(null);
  const { gl } = useThree();

  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const currentRotationX = useRef(0);
  const currentRotationY = useRef(0);

  const segments = quality === "mobile" ? 64 : (quality === "tablet" ? 96 : 128);

  const [dayTex, nightTex, normalTex, specTex] = useLoader(TextureLoader, [
    "/textures/earth_day.jpg",
    "/textures/earth_night.jpg",
    "/textures/earth_normal.jpg",
    "/textures/earth_specular.jpg",
  ]);

  useEffect(() => {
    const maxAniso = gl.capabilities.getMaxAnisotropy();
    configureTexture(dayTex, SRGBColorSpace);
    configureTexture(nightTex, SRGBColorSpace);
    [normalTex, specTex].forEach((t) => {
      configureTexture(t);
      t.colorSpace = NoColorSpace;
    });

    // Anisotropic filtering only on desktop/laptop
    const isHighQuality = quality === "desktop" || quality === "laptop";
    [dayTex, nightTex, normalTex, specTex].forEach((t) => {
      t.anisotropy = isHighQuality ? maxAniso : 1;
    });
  }, [gl, dayTex, nightTex, normalTex, specTex, quality]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY.current = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const uniforms = useMemo(
    () => ({
      uDay: { value: dayTex },
      uNight: { value: nightTex },
      uNormal: { value: normalTex },
      uSpecular: { value: specTex },
      uSunDir: { value: SUN_DIR },
    }),
    [dayTex, nightTex, normalTex, specTex]
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // Premium Parallax Damping
    const targetY = mouseX.current * 0.12;
    const targetX = mouseY.current * 0.08;
    const damp = 0.02; // Slow, heavy feel

    currentRotationY.current += (targetY - currentRotationY.current) * damp;
    currentRotationX.current += (targetX - currentRotationX.current) * damp;

    if (groupRef.current) {
      const initialOffset = -1.35; // India region
      const baseRotation = t * 0.008; // Orbital feel
      const scrollRotation = scrollProgress * (Math.PI * 2); // Full 360 deg turn
      groupRef.current.rotation.y = initialOffset + baseRotation + scrollRotation + currentRotationY.current;
      groupRef.current.rotation.x = currentRotationX.current;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh renderOrder={0} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[1, segments, segments]} />
        <shaderMaterial
          vertexShader={surfaceVert}
          fragmentShader={surfaceFrag}
          uniforms={uniforms}
        />
      </mesh>

    </group>
  );
}
