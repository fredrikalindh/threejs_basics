import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as lil from "lil-gui";

// Debug
const gui = new lil.GUI({
    width: 400,
});

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

// door
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
    "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");

const enviromentMapTexture = cubeTextureLoader.load([
    "/textures/environmentMaps/3/px.jpg",
    "/textures/environmentMaps/3/nx.jpg",
    "/textures/environmentMaps/3/py.jpg",
    "/textures/environmentMaps/3/ny.jpg",
    "/textures/environmentMaps/3/pz.jpg",
    "/textures/environmentMaps/3/nz.jpg",
]); // ! Order is important

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Materials
 */

// const material = new THREE.MeshBasicMaterial({
//     // color: "red",
//     map: doorColorTexture,
// });
// material.map = doorColorTexture;
// material.color.set('red')
// material.color = new THREE.Color("green");
// material.wireframe = true;
// material.transparent = true; // necessary for opacity & alpha map
// material.opacity = 0.5;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide; // THREE.FrontSide // THREE.BackSide // THREE.DoubleSide

// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// const material = new THREE.MeshDepthMaterial();

// const material = new THREE.MeshLambertMaterial();

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color("blue");

// const material = new THREE.MeshToonMaterial();
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// material.gradientMap = gradientTexture;

// * MeshStandardMaterial
// const material = new THREE.MeshStandardMaterial();
// // material.metalness = 0.45;
// // material.roughness = 0.65;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 3;

// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.05;
// // material.wireframe = true;

// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;

// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);

// material.transparent = true; // necessary for opacity & alpha map
// material.alphaMap = doorAlphaTexture;

// * MeshPhysicsMaterial same as MeshStandardMaterial but w clear coat effect support
// * PointsMaterial for particles
// * ShaderMaterial for custom shaders

// * Environment Maps
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.1;
// three.js only supports cube env maps, use CubeTextureLoader
material.envMap = enviromentMapTexture;

gui.add(material, "metalness", 0, 1).step(0.0001);
gui.add(material, "roughness", 0, 1).step(0.0001);
// gui.add(material, "aoMapIntensity", 0, 5).step(0.0001);
// gui.add(material.normalScale, "x", 0, 1).step(0.0001);
// gui.add(material.normalScale, "y", 0, 1).step(0.0001);

/**
 * Objects
 */

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);

sphere.geometry.setAttribute(
    "uv2",
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

console.log(plane.geometry.attributes.uv.array);
plane.geometry.setAttribute(
    "uv2",
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
);

torus.geometry.setAttribute(
    "uv2",
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);

sphere.position.set(-1.5, 0, 0);
torus.position.set(1.5, 0, 0);
scene.add(sphere, plane, torus);

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime;
    plane.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    plane.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
