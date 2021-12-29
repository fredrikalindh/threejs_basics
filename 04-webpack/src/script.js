import "./style.css";

import * as THREE from "three";

const scene = new THREE.Scene();

const geometry = new THREE.SphereGeometry(1, 64, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const dimensions = {
    width: 800,
    height: 600,
};
const camera = new THREE.PerspectiveCamera(
    75,
    dimensions.width / dimensions.height
);
camera.position.z = 3;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("canvas.webgl"),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
