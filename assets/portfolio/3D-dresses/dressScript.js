import * as THREE from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightUniformsLib } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/lights/RectAreaLightUniformsLib.js'

let modelCanvas = document.getElementById("canvas-1");
let modelName = "short_dress.glb";
let scene, camera, renderer, controls, currentModel;

let textures = {
    background: getTexture('textures/pink-wall.jpg', true),
    floor: getTexture('textures/DD-Wood-Background-77567-Preview.jpg'),
    plainYellow: getTexture("textures/Fabric035_1K_Color.jpg"), //default
    floral: getTexture("textures/floral.jpg"),
    check: getTexture("textures/TexturesCom_FabricPatterns0015_S.jpg"),
    blue: getTexture("textures/blue_floral.jpg"),
    polkaDots: getTexture("textures/TexturesCom_FabricPatterns0090_S.jpg")
};

let normals = {
    plainFabric: getTexture("textures/Fabric035_1K_Normal.jpg"),
    plainNylon: getTexture("textures/Fabric_Nylon_001_normal.jpg"),
    knitted: getTexture('textures/1K-fabric_knitted-normal.jpg')
}

let roughness = {
    plainFabric: getTexture("textures/Fabric035_1K_Displacement.jpg"),
    plainNylon: getTexture("textures/Fabric_Nylon_001_roughness.jpg"),
    knitted: getTexture('textures/1K-fabric_knitted-displacement.jpg')
}

let materialsGroup = {
    plainYellow: new THREE.MeshStandardMaterial({
        map: textures.plainYellow,
        normalMap: normals.plainFabric,
        roughnessMap: roughness.plainFabric,
        side: THREE.DoubleSide
    }),
    floral: new THREE.MeshStandardMaterial({
        map: textures.floral,
        normalMap: normals.plainFabric,
        roughnessMap: roughness.plainFabric,
        side: THREE.DoubleSide
    }),
    check: new THREE.MeshStandardMaterial({
        map: textures.check,
        normalMap: normals.knitted,
        roughnessMap: roughness.knitted,
        side: THREE.DoubleSide
    }),
    blue: new THREE.MeshStandardMaterial({
        map: textures.blue,
        normalMap: normals.plainNylon,
        roughnessMap: roughness.plainNylon,
        side: THREE.DoubleSide
    }),
    polkaDots: new THREE.MeshStandardMaterial({
        map: textures.polkaDots,
        normalMap: normals.plainNylon,
        roughnessMap: roughness.plainNylon,
        side: THREE.DoubleSide
    })
}

const loader = document.getElementById('loading');
var manager = new THREE.LoadingManager();
manager.onLoad = function() {
    console.log('Loading complete!');
    loader.classList.add('fade-out');
    render();
};

const BACKGROUND_COLOR = 0xf1f1f1;

function init(canvas) {
    scene = new THREE.Scene();
    //scene.background = new THREE.Color(BACKGROUND_COLOR);
    //scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);

    camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 1000);
    camera.position.set(0, 0, 2);

    renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(canvas.width, canvas.height);
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    //renderer.physicallyCorrectLights = true;

    // Scene Lights
    /*var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);
    RectAreaLightUniformsLib.init();
    var light = new THREE.RectAreaLight(0xffffff, 1, 20, 20);
    light.position.set(0, 10, 0);
    light.lookAt(0, 0, 0);
    scene.add(light);*/
    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 0);
    // Add hemisphere light to scene   
    scene.add(hemiLight);

    var dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
    dirLight.position.set(-8, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    // Add directional Light to scene    
    scene.add(dirLight);
    scene.add(camera);

    // Navigation Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = Math.PI / 3;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.dampingFactor = 0.1;
    controls.maxDistance = 5;
}

//Need to fix
function addWalls(texture = null) {
    const geometry = new THREE.PlaneGeometry(10, 10, 1, 1);
    const material = new THREE.MeshStandardMaterial({
        map: textures.background
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;
    plane.position.set(0, 4, -5);

    const geometry2 = new THREE.PlaneGeometry(10, 10, 1, 1);
    const material2 = new THREE.MeshStandardMaterial({
        map: textures.background
    });
    const plane2 = new THREE.Mesh(geometry2, material2);
    plane2.receiveShadow = true;
    plane2.rotateY(Math.PI / 2);
    plane2.position.set(-5, 4, 0);

    const geometry3 = new THREE.PlaneGeometry(10, 10, 1, 1);
    const material3 = new THREE.MeshStandardMaterial({
        map: textures.background
    });
    const plane3 = new THREE.Mesh(geometry3, material3);
    plane3.receiveShadow = true;
    plane3.rotateY(-Math.PI / 2);
    plane3.position.set(5, 4, 0);

    const geometry4 = new THREE.PlaneGeometry(10, 10, 1, 1);
    const material4 = new THREE.MeshStandardMaterial({
        map: textures.background,
        side: THREE.DoubleSide
    });
    const plane4 = new THREE.Mesh(geometry4, material4);
    plane4.receiveShadow = true;
    plane4.position.set(0, 4, 5);

    scene.add(plane);
    scene.add(plane2);
    scene.add(plane3);
    scene.add(plane4);
}

function addFloor(texture) {
    const geometry = new THREE.PlaneGeometry(10, 10, 1, 1);
    const material = new THREE.MeshStandardMaterial({
        map: texture
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;
    plane.rotateX(-Math.PI / 2);
    plane.rotateZ(Math.PI / 2);
    plane.position.set(0, -1, 0);
    scene.add(plane);
}

function getTexture(textureName, bg = false) {
    let texture = new THREE.TextureLoader().load(textureName);
    texture.anisotropy = 16;
    if (bg) {
        return texture;
    }
    texture.encoding = THREE.sRGBEncoding;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5);
    return texture;
}

function loadModel(name, texture = null, normalTexture = null, roughnessTexture = null) {
    const gltf_loader = new GLTFLoader(manager);
    gltf_loader.load(name, (gltf) => {
        let model = gltf.scene;
        model.traverse(o => {
            if (o.isMesh) {
                if (texture) {
                    o.material = new THREE.MeshStandardMaterial({
                        map: texture,
                        normalMap: normalTexture,
                        roughnessMap: roughnessTexture,
                        side: THREE.DoubleSide
                    });
                }
                o.castShadow = true;
                o.receiveShadow = true;
            }
        });
        model.position.set(0, -1, 0);
        model.name = name.slice(0, -4);
        scene.add(model);
    });

}

function render() {
    controls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

//Handles changes in Dress model on button click
var buttonElements = document.querySelectorAll('#dresses_group button');
buttonElements.forEach(element => {
    element.addEventListener('click', function() {
        let attrib = this.getAttribute('id');
        let model = attrib + '.glb';
        let modelExists = scene.children.filter(item => item.name === attrib);
        let item = scene.children.find(f => f.name === currentModel);
        item.visible = false;
        if (modelExists.length) {
            modelExists[0].visible = true;
        } else {
            loadModel(model, textures.plainYellow, normals.plainFabric, roughness.plainFabric);
        }
        currentModel = attrib;
    });
});

//Handles texture change on button click
var textureButtons = document.querySelectorAll('#texture_group ul li a');
textureButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        let name = this.getAttribute('id');
        let targetItem = scene.children.find(f => f.name === currentModel);
        targetItem.children.forEach(item => {
            item.material = materialsGroup[name];
            item.material.needsUpdate = true;
        });
    });
});

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = modelCanvas.width / modelCanvas.height;
    camera.updateProjectionMatrix();
    renderer.setSize(modelCanvas.width, modelCanvas.height);
}

init(modelCanvas);
addFloor(textures.floor);
addWalls(textures.floor);
loadModel('mannequin.glb');
loadModel(modelName, textures.plainYellow, normals.plainFabric, roughness.plainFabric)
currentModel = 'short_dress';