import * as THREE from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

let clock = new THREE.Clock();
let delta = 0;

var canvas = document.getElementById("model-canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const scene = new THREE.Scene();
//scene.fog = new THREE.Fog(0xc0f0ff, 0.0015);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1500);
camera.position.z = 1000;

const light = new THREE.HemisphereLight(0xd6e6ff, 0xa38c08, 1);
scene.add(light);


const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Smoke texture obtained from: https://opengameart.org/content/smoke-aura
const smokeTexture = new THREE.TextureLoader().load("../0002.png");
//smokeTexture.encoding = THREE.sRGBEncoding;
const smokeGeometry = new THREE.PlaneGeometry(300, 300);

let smokeParticles = [];
for (let i = 0; i < 90; i++) {
    let smokeMaterial = new THREE.MeshLambertMaterial({
        color: getColor(),
        map: smokeTexture,
        emissive: 0x5e5d5d,
        opacity: 0.4,
        transparent: true
    })
    smokeMaterial.map.minFilter = THREE.LinearFilter;
    let smokeElement = new THREE.Mesh(smokeGeometry, smokeMaterial);
    smokeElement.scale.set(2, 2, 2);
    smokeElement.position.set(Math.random() * 1000 - 500, Math.random() * 1000 - 500, Math.random() * 1000 - 100);
    smokeElement.rotation.z = Math.random() * 360;
    scene.add(smokeElement);
    smokeParticles.push(smokeElement);
}

window.addEventListener('resize', resizeWindow(window.innerWidth, window.innerHeight));

function resizeWindow(width, height) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function getColor() {
    return new THREE.Color(0xffffff).setHex(Math.random() * 0xffffff);
}

function render() {
    requestAnimationFrame(render);
    delta = clock.getDelta();

    for (let i = 0; i < 90; i++) {
        smokeParticles[i].rotation.z += (delta * 0.12);
    }
    renderer.render(scene, camera);
    if (document.body.scrollHeight !== window.innerHeight) {
        canvas.height = document.body.scrollHeight;
        resizeWindow(document.body.scrollWidth, document.body.scrollHeight);
    }
}

render()