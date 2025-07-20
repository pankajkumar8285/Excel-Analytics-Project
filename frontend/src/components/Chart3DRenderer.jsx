import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Chart3DRenderer = ({ data, xAxis, yAxis, zAxis, chartType, color = "#3498db", size = 500, view = "default" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data.length || !xAxis || !yAxis || !zAxis) return;

    const canvas = canvasRef.current;
    const width = size * 30 + 300;
    const height = size * 30 + 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 5000);
    camera.up.set(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(50, 50, 50);
    scene.add(ambientLight, directionalLight);

    const validPoints = [];
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    data.forEach(row => {
      const x = parseFloat(row[xAxis]);
      const y = parseFloat(row[yAxis]);
      const z = parseFloat(row[zAxis]);
      if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
        validPoints.push({ x, y, z });
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
      }
    });

    if (!validPoints.length) return;

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const centerZ = (minZ + maxZ) / 2;

    switch (view.toLowerCase()) {
      case "top": camera.position.set(centerX, centerY + 200, centerZ); break;
      case "side": camera.position.set(centerX + 200, centerY, centerZ); break;
      case "front": camera.position.set(centerX, centerY, centerZ + 200); break;
      default: camera.position.set(centerX + 150, centerY + 150, centerZ + 150);
    }
    camera.lookAt(centerX, centerY, centerZ);

    if (chartType.includes("Scatter")) {
      const geometry = new THREE.SphereGeometry(1.5, 16, 16);
      const material = new THREE.MeshStandardMaterial({ color });
      validPoints.forEach(({ x, y, z }) => {
        const point = new THREE.Mesh(geometry, material);
        point.position.set(x, y, z);
        scene.add(point);
      });
    } else if (chartType.includes("Surface") || chartType.includes("Mesh")) {
      const xValues = [...new Set(validPoints.map(p => p.x))].sort((a, b) => a - b);
      const zValues = [...new Set(validPoints.map(p => p.z))].sort((a, b) => a - b);
      const geometry = new THREE.PlaneGeometry(xValues.length, zValues.length, xValues.length - 1, zValues.length - 1);

      geometry.rotateX(-Math.PI / 2);

      geometry.vertices?.forEach((vertex, i) => {
        const xIndex = i % xValues.length;
        const zIndex = Math.floor(i / xValues.length);
        const point = validPoints.find(p => p.x === xValues[xIndex] && p.z === zValues[zIndex]);
        if (point) vertex.y = point.y;
      });

      const material = new THREE.MeshStandardMaterial({
        color,
        wireframe: chartType.includes("Mesh"),
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    } else if (chartType.includes("Cone")) {
      validPoints.forEach(({ x, y, z }) => {
        const geometry = new THREE.ConeGeometry(2, y, 8);
        const material = new THREE.MeshStandardMaterial({ color });
        const cone = new THREE.Mesh(geometry, material);
        cone.position.set(x, y / 2, z);
        scene.add(cone);
      });
    } else if (chartType.includes("Volume")) {
      validPoints.forEach(({ x, y, z }) => {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.3 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, z);
        scene.add(cube);
      });
    }

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
    };
  }, [data, xAxis, yAxis, zAxis, color, size, view, chartType]);

  return <canvas ref={canvasRef} style={{ borderRadius: "0.5rem" }} />;
};

export default Chart3DRenderer;
