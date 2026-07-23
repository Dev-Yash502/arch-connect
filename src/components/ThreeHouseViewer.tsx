import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, Sun, Moon, Sparkles, Layers, RotateCw, Eye } from 'lucide-react';

interface ThreeHouseViewerProps {
  onViewDetails?: () => void;
}

export const ThreeHouseViewer: React.FC<ThreeHouseViewerProps> = ({ onViewDetails }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Customization state
  const [isRotating, setIsRotating] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('day');
  const [colorScheme, setColorScheme] = useState<'estate' | 'teak' | 'minimal' | 'emerald'>('estate');
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);

  // References to keep Three.js object pointers
  const sceneRef = useRef<THREE.Scene | null>(null);
  const houseGroupRef = useRef<THREE.Group | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambLightRef = useRef<THREE.AmbientLight | null>(null);
  const windowLightsRef = useRef<THREE.PointLight[]>([]);
  const materialsRef = useRef<{ [key: string]: THREE.MeshStandardMaterial }>({});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(6.5, 4.5, 7.5);
    camera.lookAt(0, 1.2, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clear previous children if any
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    ambLightRef.current = ambientLight;

    const directionalLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
    directionalLight.position.set(8, 12, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 25;
    scene.add(directionalLight);
    dirLightRef.current = directionalLight;

    // Fill light
    const fillLight = new THREE.DirectionalLight(0xb0d8ff, 0.4);
    fillLight.position.set(-6, 8, -6);
    scene.add(fillLight);

    // House Group
    const house = new THREE.Group();
    scene.add(house);
    houseGroupRef.current = house;

    // --- MATERIALS REPOSITORY ---
    const whiteWallMat = new THREE.MeshStandardMaterial({ color: 0xf4f4f2, roughness: 0.3 });
    const stoneWallMat = new THREE.MeshStandardMaterial({ color: 0x4a5568, roughness: 0.8 }); // Slate
    const goldAccentMat = new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.5, roughness: 0.2 });
    const woodPergolaMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.5 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.5,
      roughness: 0.1,
      metalness: 0.8
    });
    const darkFrameMat = new THREE.MeshStandardMaterial({ color: 0x1a202c, roughness: 0.4 });
    const windowGlowMat = new THREE.MeshStandardMaterial({
      color: 0xffd166,
      emissive: 0xffa400,
      emissiveIntensity: 0.0
    });

    materialsRef.current = {
      whiteWall: whiteWallMat,
      stoneWall: stoneWallMat,
      goldAccent: goldAccentMat,
      woodPergola: woodPergolaMat,
      glass: glassMat,
      darkFrame: darkFrameMat,
      windowGlow: windowGlowMat
    };

    // --- BUILD 3-STORY MODERN VILLA GEOMETRY ---

    // Level 1: Ground Structure
    const groundBodyGeo = new THREE.BoxGeometry(3.2, 1.2, 3.2);
    const groundBody = new THREE.Mesh(groundBodyGeo, whiteWallMat);
    groundBody.position.set(0, 0.6, 0);
    groundBody.castShadow = true;
    groundBody.receiveShadow = true;
    house.add(groundBody);

    // Ground Floor Garage / Gate Wall (Dark Wood/Steel)
    const garageGeo = new THREE.BoxGeometry(1.6, 1.0, 0.1);
    const garageMesh = new THREE.Mesh(garageGeo, woodPergolaMat);
    garageMesh.position.set(0.6, 0.5, 1.61);
    house.add(garageMesh);

    // Main Entrance Door (Glass & Dark Frame)
    const doorGeo = new THREE.BoxGeometry(0.7, 1.0, 0.1);
    const doorMesh = new THREE.Mesh(doorGeo, darkFrameMat);
    doorMesh.position.set(-0.7, 0.5, 1.61);
    house.add(doorMesh);

    // Level 2: Middle Structure with Stone & Black Louver
    const level2Geo = new THREE.BoxGeometry(3.0, 1.2, 3.0);
    const level2Mesh = new THREE.Mesh(level2Geo, whiteWallMat);
    level2Mesh.position.set(0, 1.8, 0);
    level2Mesh.castShadow = true;
    level2Mesh.receiveShadow = true;
    house.add(level2Mesh);

    // Level 2 Stone Feature Wall
    const featureStoneGeo = new THREE.BoxGeometry(1.4, 1.25, 3.05);
    const featureStoneMesh = new THREE.Mesh(featureStoneGeo, stoneWallMat);
    featureStoneMesh.position.set(-0.8, 1.8, 0);
    featureStoneMesh.castShadow = true;
    house.add(featureStoneMesh);

    // Level 2 Geometric Louver Screen (Laser cut facade)
    const louverGeo = new THREE.BoxGeometry(0.8, 1.0, 0.12);
    const louverMesh = new THREE.Mesh(louverGeo, darkFrameMat);
    louverMesh.position.set(-0.2, 1.8, 1.55);
    house.add(louverMesh);

    // Level 2 Glass Windows
    const windowGeo = new THREE.BoxGeometry(1.2, 0.8, 0.1);
    const windowMesh = new THREE.Mesh(windowGeo, glassMat);
    windowMesh.position.set(0.8, 1.8, 1.52);
    house.add(windowMesh);

    // Window Interior Glow Box
    const glowGeo = new THREE.BoxGeometry(1.18, 0.78, 0.08);
    const glowMesh = new THREE.Mesh(glowGeo, windowGlowMat);
    glowMesh.position.set(0.8, 1.8, 1.48);
    house.add(glowMesh);

    // Level 3: Top Master Suite & Yellow/Gold Box Accent
    const level3Geo = new THREE.BoxGeometry(2.4, 1.1, 2.4);
    const level3Mesh = new THREE.Mesh(level3Geo, whiteWallMat);
    level3Mesh.position.set(-0.3, 2.95, -0.2);
    level3Mesh.castShadow = true;
    house.add(level3Mesh);

    // Gold / Wood Accent Box on Top Floor
    const accentBoxGeo = new THREE.BoxGeometry(1.8, 0.9, 2.45);
    const accentBoxMesh = new THREE.Mesh(accentBoxGeo, goldAccentMat);
    accentBoxMesh.position.set(-0.6, 2.95, -0.2);
    accentBoxMesh.castShadow = true;
    house.add(accentBoxMesh);

    // Rooftop Wooden Pergola (Rafters)
    const pergolaGroup = new THREE.Group();
    for (let i = 0; i < 7; i++) {
      const rafterGeo = new THREE.BoxGeometry(2.2, 0.1, 0.12);
      const rafter = new THREE.Mesh(rafterGeo, woodPergolaMat);
      rafter.position.set(0.8, 3.6, -1.0 + i * 0.35);
      rafter.castShadow = true;
      pergolaGroup.add(rafter);
    }
    // Pergola support pillars
    const pillar1Geo = new THREE.BoxGeometry(0.12, 1.1, 0.12);
    const p1 = new THREE.Mesh(pillar1Geo, darkFrameMat);
    p1.position.set(-0.2, 3.0, 1.1);
    const p2 = new THREE.Mesh(pillar1Geo, darkFrameMat);
    p2.position.set(1.8, 3.0, 1.1);
    pergolaGroup.add(p1);
    pergolaGroup.add(p2);
    house.add(pergolaGroup);

    // Glass Balcony Railings
    const railingGeo = new THREE.BoxGeometry(1.8, 0.45, 0.05);
    const railingMesh = new THREE.Mesh(railingGeo, glassMat);
    railingMesh.position.set(0.8, 2.55, 1.3);
    house.add(railingMesh);

    // Interior Warm Point Lights for Night Mode
    const windowLights: THREE.PointLight[] = [];
    const windowLight1 = new THREE.PointLight(0xffb703, 0, 4);
    windowLight1.position.set(0.8, 1.8, 1.0);
    scene.add(windowLight1);
    windowLights.push(windowLight1);

    const windowLight2 = new THREE.PointLight(0xffb703, 0, 4);
    windowLight2.position.set(-0.6, 2.95, 0.5);
    scene.add(windowLight2);
    windowLights.push(windowLight2);

    windowLightsRef.current = windowLights;

    // Ground Plane with Shadow
    const groundGeo = new THREE.PlaneGeometry(16, 16);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xdedede,
      roughness: 0.9,
      metalness: 0.1
    });
    const groundPlane = new THREE.Mesh(groundGeo, groundMat);
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.position.y = 0;
    groundPlane.receiveShadow = true;
    scene.add(groundPlane);

    // Palm Tree Silhouettes (Decorative background elements)
    const createPalmTree = (x: number, z: number) => {
      const trunkGeo = new THREE.CylinderGeometry(0.08, 0.12, 2.5, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.set(x, 1.25, z);
      trunk.castShadow = true;

      const crownGroup = new THREE.Group();
      crownGroup.position.set(x, 2.4, z);
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x2d5a27, roughness: 0.6 });
      for (let k = 0; k < 6; k++) {
        const leafGeo = new THREE.ConeGeometry(0.4, 1.2, 4);
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.rotation.z = Math.PI / 3;
        leaf.rotation.y = (k * Math.PI) / 3;
        leaf.position.y = 0.2;
        crownGroup.add(leaf);
      }
      house.add(trunk);
      house.add(crownGroup);
    };

    createPalmTree(2.8, -2.0);
    createPalmTree(-2.8, -2.2);

    // 5. Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (houseGroupRef.current && isRotating) {
        houseGroupRef.current.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Sync Rotation state
  useEffect(() => {
    // Rotation state is handled in animation loop
  }, [isRotating]);

  // Sync Time of Day Lighting
  useEffect(() => {
    if (!dirLightRef.current || !ambLightRef.current || !sceneRef.current) return;

    const dirLight = dirLightRef.current;
    const ambLight = ambLightRef.current;
    const glows = windowLightsRef.current;
    const glowMat = materialsRef.current.windowGlow;

    if (timeOfDay === 'day') {
      dirLight.color.setHex(0xfff5e6);
      dirLight.intensity = 1.2;
      dirLight.position.set(8, 12, 10);
      ambLight.intensity = 0.8;
      ambLight.color.setHex(0xffffff);
      glows.forEach((l) => (l.intensity = 0));
      if (glowMat) glowMat.emissiveIntensity = 0;
    } else if (timeOfDay === 'sunset') {
      dirLight.color.setHex(0xffaa55);
      dirLight.intensity = 1.5;
      dirLight.position.set(10, 5, 8);
      ambLight.intensity = 0.5;
      ambLight.color.setHex(0xffd1b3);
      glows.forEach((l) => (l.intensity = 1.0));
      if (glowMat) glowMat.emissiveIntensity = 0.4;
    } else if (timeOfDay === 'night') {
      dirLight.color.setHex(0x334466);
      dirLight.intensity = 0.3;
      dirLight.position.set(5, 10, -5);
      ambLight.intensity = 0.25;
      ambLight.color.setHex(0x1a2636);
      glows.forEach((l) => (l.intensity = 2.5));
      if (glowMat) glowMat.emissiveIntensity = 1.0;
    }
  }, [timeOfDay]);

  // Sync Color Scheme
  useEffect(() => {
    const mats = materialsRef.current;
    if (!mats.stoneWall || !mats.goldAccent || !mats.whiteWall) return;

    if (colorScheme === 'estate') {
      mats.stoneWall.color.setHex(0x4a5568); // Dark Slate
      mats.goldAccent.color.setHex(0xc9a227); // Rich Gold
      mats.whiteWall.color.setHex(0xf4f4f2); // Off white
    } else if (colorScheme === 'teak') {
      mats.stoneWall.color.setHex(0x3e2723); // Deep Mahogany
      mats.goldAccent.color.setHex(0xd7ccc8); // Soft Warm Sand
      mats.whiteWall.color.setHex(0xefebe9);
    } else if (colorScheme === 'minimal') {
      mats.stoneWall.color.setHex(0x212121); // Charcoal
      mats.goldAccent.color.setHex(0x9e9e9e); // Silver Titanium
      mats.whiteWall.color.setHex(0xffffff);
    } else if (colorScheme === 'emerald') {
      mats.stoneWall.color.setHex(0x003629); // Deep Emerald
      mats.goldAccent.color.setHex(0xdfb12e); // Bright Gold
      mats.whiteWall.color.setHex(0xf0f7f4);
    }
  }, [colorScheme]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-[2rem] overflow-hidden bg-gradient-to-b from-emerald-900/5 via-slate-900/5 to-amber-900/5 border border-slate-200/60 shadow-xl">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 3D Customization Controls Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-20 pointer-events-auto">
        <div className="flex items-center space-x-1.5 bg-white/80 backdrop-blur-md p-1.5 rounded-full border border-white/60 shadow-md">
          <button
            onClick={() => setTimeOfDay('day')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center space-x-1 ${
              timeOfDay === 'day' ? 'bg-[#4A3728] text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Sun Daylight Mode"
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Day</span>
          </button>
          <button
            onClick={() => setTimeOfDay('sunset')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center space-x-1 ${
              timeOfDay === 'sunset' ? 'bg-[#9B7B5A] text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Golden Hour Sunset Mode"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sunset</span>
          </button>
          <button
            onClick={() => setTimeOfDay('night')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center space-x-1 ${
              timeOfDay === 'night' ? 'bg-slate-900 text-amber-300 shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Evening Architectural Lighting"
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Night</span>
          </button>
        </div>

        {/* Rotate & Material Toggles */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="p-2 bg-white/80 backdrop-blur-md hover:bg-white text-slate-700 rounded-full border border-white/60 shadow-md transition-all"
            title={isRotating ? 'Pause 3D Orbit' : 'Play 3D Orbit'}
          >
            {isRotating ? <Pause className="w-4 h-4 text-[#4A3728]" /> : <Play className="w-4 h-4 text-[#4A3728]" />}
          </button>

          {/* Color Palettes Dropdown / Buttons */}
          <div className="flex items-center bg-white/80 backdrop-blur-md p-1 rounded-full border border-white/60 shadow-md space-x-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2 hidden md:inline">Finish</span>
            <button
              onClick={() => setColorScheme('estate')}
              className={`w-5 h-5 rounded-full border-2 transition-transform ${
                colorScheme === 'estate' ? 'scale-110 border-[#4A3728] shadow-sm' : 'border-transparent'
              }`}
              style={{ background: 'linear-gradient(135deg, #c9a227 50%, #4a5568 50%)' }}
              title="Estate Slate & Gold"
            />
            <button
              onClick={() => setColorScheme('emerald')}
              className={`w-5 h-5 rounded-full border-2 transition-transform ${
                colorScheme === 'emerald' ? 'scale-110 border-[#4A3728] shadow-sm' : 'border-transparent'
              }`}
              style={{ background: 'linear-gradient(135deg, #4A3728 50%, #dfb12e 50%)' }}
              title="Emerald & Brass"
            />
            <button
              onClick={() => setColorScheme('teak')}
              className={`w-5 h-5 rounded-full border-2 transition-transform ${
                colorScheme === 'teak' ? 'scale-110 border-[#4A3728] shadow-sm' : 'border-transparent'
              }`}
              style={{ background: 'linear-gradient(135deg, #3e2723 50%, #d7ccc8 50%)' }}
              title="Deep Teak & Sand"
            />
            <button
              onClick={() => setColorScheme('minimal')}
              className={`w-5 h-5 rounded-full border-2 transition-transform ${
                colorScheme === 'minimal' ? 'scale-110 border-[#4A3728] shadow-sm' : 'border-transparent'
              }`}
              style={{ background: 'linear-gradient(135deg, #212121 50%, #ffffff 50%)' }}
              title="Monochrome Minimal"
            />
          </div>
        </div>
      </div>

      {/* Floating Glass Overlay Card matching original specification */}
      <div className="absolute bottom-6 left-6 right-6 glass-panel rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 soft-shadow z-20">
        <div className="flex items-center space-x-3.5">
          <div className="bg-[#4A3728]/10 p-3 rounded-xl text-[#4A3728] flex-shrink-0">
            <Layers className="w-5 h-5 text-[#4A3728]" />
          </div>
          <div>
            <p className="font-bold text-sm text-[#4A3728] m-0 tracking-tight">Modern Villa Residence</p>
            <div className="flex items-center space-x-2 text-xs text-slate-600 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>3-Story Superstructure • 75% Complete</span>
            </div>
          </div>
        </div>

        <button
          onClick={onViewDetails}
          className="text-[#9B7B5A] font-semibold text-xs sm:text-sm hover:text-[#7A5C45] hover:underline flex items-center space-x-1 group self-end sm:self-center transition-colors"
        >
          <span>View Details</span>
          <Eye className="w-4 h-4 text-[#9B7B5A] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Subtle Hint */}
      <div className="absolute top-16 right-4 text-[10px] text-slate-400 font-medium bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-full pointer-events-none hidden sm:block">
        3D Interactive Model • Drag to Orbit
      </div>
    </div>
  );
};
