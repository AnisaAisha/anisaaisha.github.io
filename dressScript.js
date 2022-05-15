import * as THREE from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/loaders/GLTFLoader.js'
//import { DRACOLoader } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/loaders/DRACOLoader.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/controls/OrbitControls.js'

let modelCanvas = document.getElementById("canvas-1");
let modelName = modelCanvas.getAttribute("data-name");
let scene, camera, renderer;

/**Portfolio details modified slider for canvases**/
const swiper = new Swiper('.portfolio-details-slider-modified', {
    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
    }
});

/*swiper.on('slideChange', (sw) => {
    console.log(swiper.realIndex + 1)
    let canvas2;
    if (sw.realIndex === 1) {
        canvas2 = document.getElementById("canvas-2");
    }
    modelName = modelCanvas.getAttribute("data-name");
    init(canvas2);
    loadModel(modelName);
    render();
});*/

/*** ThreeJS Code ***/

function init(canvas) {
    scene = new THREE.Scene();
    //scene.background = new THREE.Color( 0x77D9CF ); //0xefd1b5 );

    //const modelCanvas = document.getElementById("canvas-1");
    //const modelName = modelCanvas.getAttribute("data-name");
    camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    camera.position.set(0, 0, 2);

    renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(canvas.width, canvas.height);

    // Scene Lights
    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);
    var pointLight = new THREE.PointLight(0xffffff, 1);
    camera.add(pointLight);
    scene.add(camera);

    // Navigation Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
}

function getTexture() {
    let texture = new THREE.TextureLoader().load("floral.jpg");
    texture.anisotropy = 16;
    texture.encoding = THREE.sRGBEncoding;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5);

    /*this.renderer.initTexture(texture);
    this.cloned_texture = texture.clone();
    const texture_properties = this.renderer.properties.get(texture);
    const cloned_texture_properties = this.renderer.properties.get(this.cloned_texture);
    cloned_texture_properties.__webglTexture = texture_properties.__webglTexture;
    cloned_texture_properties.__webglInit = true;
    this.cloned_texture.repeat.set(1, 1);*/
    return texture;
}

function loadModel(name) {
    const gltf_loader = new GLTFLoader();
    //const draco_loader = new DRACOLoader();
    //draco_loader.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/');
    //gltf_loader.setDRACOLoader(draco_loader);
    gltf_loader.load(name, (gltf) => {
            gltf.scene.position.set(0, -1, 1);
            let model = gltf.scene;
            model.traverse(o => {
                if (o.isMesh) {
                    o.material = new THREE.MeshStandardMaterial({
                        map: getTexture(),
                        side: THREE.DoubleSide
                    });
                }
            })
            scene.add(gltf.scene);
        },
        (progress) => {
            console.log((progress.loaded / progress.total * 100) + '% loaded');
        },
        (error) => {
            console.log(error);
        });

}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

init(modelCanvas);
loadModel(modelName);
render();