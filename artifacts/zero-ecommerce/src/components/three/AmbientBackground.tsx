import { useEffect, useRef } from 'react';

export default function AmbientBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    let animationId: number;
    let cleanupFn: (() => void) | null = null;

    const init = async () => {
      try {
        const THREE = await import('three');
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        const canvas = document.createElement('canvas');
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.inset = '0';
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        mountRef.current.appendChild(renderer.domElement);

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 50;
        const posArray = new Float32Array(particlesCount * 3);
        const colorsArray = new Float32Array(particlesCount * 3);

        const color1 = new THREE.Color('#3B82F6');
        const color2 = new THREE.Color('#8B5CF6');

        for (let i = 0; i < particlesCount * 3; i += 3) {
          posArray[i] = (Math.random() - 0.5) * 15;
          posArray[i + 1] = (Math.random() - 0.5) * 15;
          posArray[i + 2] = (Math.random() - 0.5) * 15;
          const mixedColor = color1.clone().lerp(color2, Math.random());
          colorsArray[i] = mixedColor.r;
          colorsArray[i + 1] = mixedColor.g;
          colorsArray[i + 2] = mixedColor.b;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
          size: 0.08,
          vertexColors: true,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        camera.position.z = 5;

        let mouseX = 0;
        let mouseY = 0;
        let elapsed = 0;
        let lastTime = performance.now();

        const handleMouseMove = (event: MouseEvent) => {
          mouseX = (event.clientX / window.innerWidth) * 2 - 1;
          mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        const handleResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        const animate = () => {
          animationId = requestAnimationFrame(animate);
          const now = performance.now();
          elapsed += (now - lastTime) * 0.001;
          lastTime = now;

          particlesMesh.rotation.y = elapsed * 0.05;
          particlesMesh.rotation.x = elapsed * 0.02;
          particlesMesh.position.x += (mouseX * 0.5 - particlesMesh.position.x) * 0.05;
          particlesMesh.position.y += (mouseY * 0.5 - particlesMesh.position.y) * 0.05;

          renderer.render(scene, camera);
        };

        animate();

        cleanupFn = () => {
          cancelAnimationFrame(animationId);
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('resize', handleResize);
          if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
            mountRef.current.removeChild(renderer.domElement);
          }
          particlesGeometry.dispose();
          particlesMaterial.dispose();
          renderer.dispose();
        };
      } catch {
        // WebGL not available — graceful fallback (CSS aurora handles the background)
      }
    };

    init();

    return () => {
      if (cleanupFn) cleanupFn();
      else cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}
