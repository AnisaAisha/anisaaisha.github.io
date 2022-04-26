import * as THREE from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/loaders/GLTFLoader.js'
//import { DRACOLoader } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/loaders/DRACOLoader.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene();
//scene.background = new THREE.Color( 0x77D9CF ); //0xefd1b5 );

const modelCanvas = document.getElementById("model-canvas");
const camera = new THREE.PerspectiveCamera(75, modelCanvas.width / modelCanvas.height, 0.1, 1000);
camera.position.set(0,0,2);

const renderer = new THREE.WebGLRenderer( { canvas: modelCanvas } );
renderer.setSize(modelCanvas.width, modelCanvas.height);
//document.body.appendChild(renderer.domElement);

// Scene Lights
var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
scene.add( ambientLight );
var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
camera.add( pointLight );
scene.add( camera );

// Navigation Controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

const gltf_loader = new GLTFLoader();
//const draco_loader = new DRACOLoader();
//draco_loader.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/');
//gltf_loader.setDRACOLoader(draco_loader);
gltf_loader.load('togedemaru.glb', (gltf) => {
		scene.add( gltf.scene );
	}, 
	(progress) => {
		console.log( ( progress.loaded / progress.total * 100 ) + '% loaded' );
	}, 
	(error) => {
		console.log(error);
	});
	
/*const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
	color: 0x00ff00,
	wireframe: true
})
	
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0.5, -10)
scene.add(cube)*/


function render() {
	requestAnimationFrame(render);
    renderer.render(scene, camera);	
}

render();