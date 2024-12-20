/**
 * PatternVisualizer Component
 * 
 * A Three.js-based visualization component for quantum pattern representation in 3D space.
 * Implements an advanced visualization system with the following architecture:
 * 
 * Core Subsystems:
 * 1. Rendering Engine
 *    - WebGL-based Three.js renderer
 *    - Perspective camera system
 *    - Dynamic lighting configuration
 * 
 * 2. Pattern Representation
 *    - 8×8×8 dimensional quantum state space
 *    - Dynamic color mapping function: f(v) → RGB
 *    - Opacity scaling: α(v) = 0.3 + 0.7v
 * 
 * 3. Interaction System
 *    - Orbital controls for 3D navigation
 *    - Real-time pattern state display
 *    - Continuous render loop optimization
 * 
 * Mathematical Model:
 * Pattern Vector Mapping: V → R^(8×8×8)
 * Color Transform: C(v) = HSL(0.6 + 0.4v, 0.8, 0.3 + 0.7v)
 * 
 * @component
 */

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Pattern } from '../../services/quantumPatternService';

interface PatternVisualizerProps {
    /** Quantum pattern data structure containing vector and metadata */
    pattern: Pattern;
    /** Visualization width in pixels */
    width?: number;
    /** Visualization height in pixels */
    height?: number;
}

export const PatternVisualizer: React.FC<PatternVisualizerProps> = ({ 
    pattern, 
    width = 800, 
    height = 600 
}) => {
    // System References
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Initialize Rendering System
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.background = new THREE.Color(0x111111);

        // Camera Configuration
        const camera = new THREE.PerspectiveCamera(
            75, // Field of View
            width / height, // Aspect Ratio
            0.1, // Near Plane
            1000 // Far Plane
        );
        cameraRef.current = camera;
        camera.position.z = 15;

        // Renderer Initialization
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            precision: "highp"
        });
        rendererRef.current = renderer;
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current.appendChild(renderer.domElement);

        // Interactive Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controlsRef.current = controls;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;

        // Lighting System Configuration
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Pattern Visualization Parameters
        const cubeSize = 8;
        const spacing = 0.5;
        const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);

        // Generate Quantum State Representation
        for (let x = 0; x < cubeSize; x++) {
            for (let y = 0; y < cubeSize; y++) {
                for (let z = 0; z < cubeSize; z++) {
                    const index = (x * cubeSize * cubeSize) + (y * cubeSize) + z;
                    const value = pattern.vector[index];

                    // Material Properties
                    const material = new THREE.MeshPhongMaterial({
                        color: new THREE.Color().setHSL(
                            0.6 + value * 0.4, // Quantum state → hue mapping
                            0.8, // Fixed saturation
                            0.3 + value * 0.7 // Amplitude → brightness mapping
                        ),
                        opacity: 0.3 + value * 0.7, // Amplitude → opacity mapping
                        transparent: true,
                        shininess: 50
                    });

                    // Quantum State Cube Placement
                    const cube = new THREE.Mesh(geometry, material);
                    cube.position.set(
                        (x - cubeSize/2) * spacing,
                        (y - cubeSize/2) * spacing,
                        (z - cubeSize/2) * spacing
                    );
                    scene.add(cube);
                }
            }
        }

        // Continuous Render Loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Resource Cleanup
        return () => {
            mountRef.current?.removeChild(renderer.domElement);
            scene.clear();
            renderer.dispose();
            geometry.dispose();
        };
    }, [pattern, width, height]);

    return (
        <div className="relative">
            <div ref={mountRef} />
            <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 p-2 rounded">
                <div>Type: {pattern.type}</div>
                <div>Symbol: {pattern.symbol}</div>
            </div>
        </div>
    );
};
