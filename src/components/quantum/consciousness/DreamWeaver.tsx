/**
 * Dream Weaver Quantum Visualization System
 *
 * Theoretical Framework:
 * 1. Wave Function Dynamics: ψ(x,t) = A·sin(kx - ωt + φ)
 * 2. Entanglement Network: E(n₁,n₂) = exp(-d²/2σ²)
 * 3. Particle Field Dynamics: dp/dt = v(p,t) + η(t)
 *
 * Core Subsystems:
 * A. Dream State Manifold
 * B. Quantum Field Simulation
 * C. Temporal Evolution Engine
 */

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Pattern } from '../../../services/QuantumPatternService';

interface DreamWeaverProps {
    pattern: Pattern;
    width?: number;
    height?: number;
}

/**
 * Creates a non-linear dream strand between quantum nodes
 * @param startPoint Initial position vector
 * @param endPoint Terminal position vector
 * @param phase Quantum phase parameter
 * @returns Mesh representing quantum strand
 */
const createDreamStrand = (
    startPoint: THREE.Vector3,
    endPoint: THREE.Vector3,
    phase: number
): THREE.Mesh => {
    const points: THREE.Vector3[] = [];
    const segments = 50;

    // Wave function parameters
    const amplitude = 0.5;   // A
    const frequency = 4;     // k
    const modulation = 3;    // ω

    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const pos = new THREE.Vector3().lerpVectors(startPoint, endPoint, t);

        // Apply non-linear wave modulation
        pos.y += amplitude * Math.sin(t * Math.PI * frequency + phase);
        pos.x += (amplitude * 0.6) * Math.cos(t * Math.PI * modulation + phase);

        points.push(pos);
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 50, 0.05, 8, false);
    const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.6 + Math.sin(phase) * 0.1, 0.8, 0.5),
        transparent: true,
        opacity: 0.6,
        shininess: 100
    });

    return new THREE.Mesh(geometry, material);
};

export const DreamWeaver: React.FC<DreamWeaverProps> = ({
    pattern,
    width = 800,
    height = 600
}) => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Initialize Quantum Visualization Space
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000022);
        scene.fog = new THREE.FogExp2(0x000022, 0.02);

        // Perspective Projection Configuration
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 5, 15);

        // High-Precision Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            precision: "highp"
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current.appendChild(renderer.domElement);

        // Orbital Control System
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Quantum Field Illumination
        const ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);

        const moonLight = new THREE.DirectionalLight(0x6666ff, 0.5);
        moonLight.position.set(5, 5, -5);
        scene.add(moonLight);

        // Dream State Manifold
        const dreamGroup = new THREE.Group();
        scene.add(dreamGroup);

        // Quantum Node Generation
        const nodeGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const dreamNodes: THREE.Mesh[] = [];

        // Create 8x8 quantum node matrix
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const value = pattern.vector[i * 8 + j];
                const material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color().setHSL(0.6 + value * 0.2, 0.8, 0.5),
                    emissive: new THREE.Color().setHSL(0.6, 0.8, 0.2),
                    transparent: true,
                    opacity: 0.8
                });

                const node = new THREE.Mesh(nodeGeometry, material);
                node.position.set(
                    (i - 4) * 2,  // X-axis distribution
                    value * 4,     // Height based on quantum value
                    (j - 4) * 2    // Z-axis distribution
                );
                dreamNodes.push(node);
                dreamGroup.add(node);
            }
        }

        // Generate Quantum Entanglement Network
        dreamNodes.forEach((node, i) => {
            // Calculate nearest neighbors using entanglement radius σ = 3
            const nearestNodes = dreamNodes
                .map((other, j) => ({
                    node: other,
                    distance: node.position.distanceTo(other.position),
                    index: j
                }))
                .filter(({ distance, index }) => distance < 3 && index !== i)
                .sort((a, b) => a.distance - b.distance)
                .slice(0, 3);

            // Create quantum strands
            nearestNodes.forEach(({ node: other }, j) => {
                const strand = createDreamStrand(
                    node.position,
                    other.position,
                    i * 0.1 + j * Math.PI / 3
                );
                dreamGroup.add(strand);
            });
        });

        // Quantum Field Particle System
        const particleCount = 2000;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleVelocities: number[] = [];

        // Initialize particle field
        for (let i = 0; i < particleCount * 3; i += 3) {
            particlePositions[i] = (Math.random() - 0.5) * 20;     // x
            particlePositions[i + 1] = (Math.random() - 0.5) * 20; // y
            particlePositions[i + 2] = (Math.random() - 0.5) * 20; // z

            // Initial velocity distribution
            particleVelocities.push(
                (Math.random() - 0.5) * 0.02, // vx
                (Math.random() - 0.5) * 0.02, // vy
                (Math.random() - 0.5) * 0.02  // vz
            );
        }

        particleGeometry.setAttribute('position',
            new THREE.BufferAttribute(particlePositions, 3)
        );

        const particleMaterial = new THREE.PointsMaterial({
            color: 0x6699ff,
            size: 0.05,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particleSystem);

        // Temporal Evolution System
        let time = 0;
        const animate = () => {
            requestAnimationFrame(animate);
            time += 0.005;

            // Dream manifold evolution
            dreamGroup.rotation.y = Math.sin(time * 0.5) * 0.2;

            // Quantum node dynamics
            dreamNodes.forEach((node, i) => {
                node.position.y += Math.sin(time + i * 0.5) * 0.01;
                (node.material as THREE.MeshPhongMaterial).emissiveIntensity =
                    0.5 + Math.sin(time * 2 + i) * 0.3;
            });

            // Particle field evolution
            const positions = particleGeometry.attributes.position.array as Float32Array;
            for (let i = 0; i < particleCount * 3; i += 3) {
                // Update particle positions
                positions[i] += particleVelocities[i];
                positions[i + 1] += particleVelocities[i + 1];
                positions[i + 2] += particleVelocities[i + 2];

                // Boundary conditions (periodic)
                if (Math.abs(positions[i]) > 10) positions[i] *= -0.9;
                if (Math.abs(positions[i + 1]) > 10) positions[i + 1] *= -0.9;
                if (Math.abs(positions[i + 2]) > 10) positions[i + 2] *= -0.9;
            }
            particleGeometry.attributes.position.needsUpdate = true;

            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        // Resource Management
        return () => {
            mountRef.current?.removeChild(renderer.domElement);
            scene.clear();
        };
    }, [pattern, width, height]);

    return <div ref={mountRef} />;
};

export default DreamWeaver;
