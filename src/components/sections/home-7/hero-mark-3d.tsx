"use client";

import { BrandMark } from "@/components/sections/landing/icons";
import navigation from "@/content/site-navigation.json";
import { useEffect, useRef, useState } from "react";
import type { WebGLRenderer } from "three";

type HeroMark3DProps = {
  className?: string;
};

export function HeroMark3D({ className }: HeroMark3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let alive = true;
    let dispose = () => {};

    const start = async () => {
      const THREE = await import("three");
      const { SVGLoader } = await import("three/addons/loaders/SVGLoader.js");
      const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
      if (!alive || !hostRef.current) return;

      let renderer: WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        if (alive) setFailed(true);
        return;
      }

      const width = host.clientWidth || 460;
      const height = host.clientHeight || 460;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, width / height, 1, 2000);
      camera.position.set(36, 4, 268);
      camera.lookAt(0, 0, 0);

      const pmrem = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      const envMap = pmrem.fromScene(room, 0.04).texture;
      scene.environment = envMap;
      room.dispose();

      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 145 145"><path d="${navigation.markPath}"/></svg>`;
      const shapes = new SVGLoader().parse(svg).paths.flatMap((path) => path.toShapes());
      const geometry = new THREE.ExtrudeGeometry(shapes, {
        depth: 26,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 1.4,
        bevelOffset: 0,
        bevelSegments: 5,
        curveSegments: 28,
      });
      geometry.rotateX(Math.PI);
      geometry.center();
      geometry.computeVertexNormals();

      const material = new THREE.MeshPhysicalMaterial({
        color: 0x001a34,
        metalness: 0.42,
        roughness: 0.22,
        clearcoat: 0.62,
        clearcoatRoughness: 0.18,
        envMapIntensity: 0.85,
      });
      const mesh = new THREE.Mesh(geometry, material);
      geometry.computeBoundingBox();
      const size = new THREE.Vector3();
      geometry.boundingBox?.getSize(size);
      mesh.scale.setScalar(138 / Math.max(size.x, size.y, 1));
      scene.add(mesh);

      scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      const key = new THREE.DirectionalLight(0xffffff, 1.2);
      key.position.set(90, 140, 80);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xc5d4ea, 0.42);
      fill.position.set(-110, 40, 70);
      scene.add(fill);
      const rim = new THREE.DirectionalLight(0xffffff, 0.38);
      rim.position.set(20, -30, -110);
      scene.add(rim);

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      mesh.rotation.x = 0;
      mesh.rotation.y = -0.42;
      mesh.rotation.z = 0;

      let frame = 0;
      const tick = (time: number) => {
        frame = requestAnimationFrame(tick);
        if (!reduceMotion) {
          const t = time * 0.00032;
          mesh.rotation.x = Math.sin(t * 0.55) * 0.03;
          mesh.rotation.y = -0.18 + Math.sin(t) * 0.72;
          mesh.rotation.z = Math.sin(t * 0.4) * 0.03;
        }
        renderer.render(scene, camera);
      };
      frame = requestAnimationFrame(tick);

      const onResize = () => {
        const nextWidth = host.clientWidth || 460;
        const nextHeight = host.clientHeight || 460;
        camera.aspect = nextWidth / nextHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(nextWidth, nextHeight);
      };
      window.addEventListener("resize", onResize);

      dispose = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", onResize);
        geometry.dispose();
        material.dispose();
        envMap.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    start().catch(() => {
      if (alive) setFailed(true);
    });

    return () => {
      alive = false;
      dispose();
    };
  }, []);

  if (failed) {
    return <BrandMark className={className} />;
  }

  return <div ref={hostRef} className={className} />;
}
