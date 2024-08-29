import * as THREE from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'


// var canvas = document.getElementById("canvas");
// canvas.width = window.innerWidth;
// window.innerHeight = window.innerHeight;

// const parentDiv = canvas.parentElement;
// // Set canvas size to match parent div
// canvas.width = parentDiv.clientWidth;
// window.innerHeight = parentDiv.clientHeight;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
scene.background = new THREE.Color(0xffffff);

const light = new THREE.HemisphereLight(0xd6e6ff, 0xa38c08, 1);
scene.add(light);


// const renderer = new THREE.WebGLRenderer({ canvas: canvas });
// renderer.setSize(canvas.width, window.innerHeight);


const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x9A6DA6 });
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );
camera.position.z = 5;

const wireframe = new THREE.WireframeGeometry(geometry);
const cube = new THREE.LineSegments(wireframe);
cube.material = material;
// scene.add(cube);


const icogeometry = new THREE.IcosahedronGeometry(0.35, 0);
const icowireframe = new THREE.WireframeGeometry(icogeometry);
const ico = new THREE.LineSegments(icowireframe);
ico.material = material;
ico.position.set(0.5, -0.1, 0);
scene.add(ico);
const ico2 = ico.clone(ico);
ico.position.set(1, 0.5, 0);
scene.add(ico2);
const ico3 = ico.clone(ico);
ico3.position.set(1, -0.5, 0);
// scene.add(ico3);

// Window listeners
window.addEventListener('resize', resizeWindow(window.innerWidth, window.innerHeight));

function resizeWindow(width, height) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}


const animationScripts = [];

function lerp(x, y, a) {
    return (1 - a) * x + a * y;
}

function scalePercent(start, end) {
    const percent = (scrollPercent - start) / (end - start);
	return Math.min(Math.max(percent, 0), 1);
}

animationScripts.push({
    start: 0,
    end: 20,
    func: () => {
		// ico2.scale.set(lerp(1, 0.9, scalePercent(0, 20)));
		// ico3.position.set()
        // camera.lookAt(cube.position)
        // camera.position.set(0, 1, 2)
		ico.position.x = lerp(1, -2, scalePercent(0, 20))
		ico.position.y = lerp(0.5, 0.75, scalePercent(0, 20))

        ico2.position.x = lerp(0.5, -2, scalePercent(0, 20))
		ico2.position.y = lerp(-0.1, 0.75, scalePercent(0, 20))
    },
})

animationScripts.push({
    start: 30,
    end: 40,
    func: () => {
		// ico3.position.set()
        // camera.lookAt(cube.position)
        // camera.position.set(0, 1, 2)
		// ico.position.x = lerp(1, -2, scalePercent(0, 20))
		ico.position.y = lerp(0.75, -0.9, scalePercent(30, 40))

        ico2.position.x = lerp(-2, 1.5, scalePercent(30, 40))
		// ico2.position.y = lerp(0.5, 0.75, scalePercent(30, 50))
		// console.log(ico2.position.x);
        //console.log(cube.position.z)
    },
})

animationScripts.push({
    start: 50,
    end: 65,
    func: () => {
		let size = lerp(1, 0.5, scalePercent(50, 65));
		ico.scale.set(size, size, size);
		ico.position.x = lerp(-2, -2.25, scalePercent(50, 65));

		ico2.scale.set(size, size, size);
        ico2.position.x = lerp(1.5, 2.25, scalePercent(50, 65));
    },
})

animationScripts.push({
    start: 90,
    end: 100,
    func: () => {
		let size = lerp(0.5, 1, scalePercent(90, 100));

		ico.scale.set(size, size, size);
		ico.position.x = lerp(-2.25, 0.75, scalePercent(90, 100));
		ico.position.y = lerp(-0.9, 0.5, scalePercent(90, 100));

		ico2.scale.set(size, size, size);
        ico2.position.x = lerp(2.25, 0.1, scalePercent(90, 100));
		ico2.position.y = lerp(0.75, -0.1, scalePercent(90, 100));
    },
})

function playScrollAnimations() {
    animationScripts.forEach((a) => {
        if (scrollPercent >= a.start && scrollPercent < a.end) {
            a.func()
        }
    })
}

let scrollPercent = 0;
document.body.onscroll = () => {
    //calculate the current scroll progress as a percentage
    scrollPercent = ((document.documentElement.scrollTop || document.body.scrollTop) / ((document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight)) * 100;
	// console.log('scroll: ', scrollPercent, "ico position: ", ico2.position.x);
}

function render() {
    requestAnimationFrame(render);
	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;

	ico.rotation.x += 0.01;
	ico.rotation.y += 0.01;

	ico2.rotation.x += 0.01;
	ico2.rotation.y += 0.01;

	ico3.rotation.x += 0.01;
	ico3.rotation.y += 0.01;

	playScrollAnimations();

    renderer.render(scene, camera);
}

render()