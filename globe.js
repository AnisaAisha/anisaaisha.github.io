import * as THREE from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/controls/OrbitControls.js'
//<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

let container, stats, modelCanvas;
let camera, scene, renderer, inner_sphere, outer_sphere, globe, points, time, clock, controls;
var MAX_POINTS = 50;
let line, drawCount = 1,
    arc, arc_geom, positions, vertices;

init();
render();

function init() {

    //const modelCanvas = document.getElementById("model-canvas");
    modelCanvas = document.getElementById('model-canvas');
    //document.body.appendChild( container );

    //Creating scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0C2E4E);

    //Adding camera to the scene
    camera = new THREE.PerspectiveCamera(70, modelCanvas.width / modelCanvas.height, 1, 1000);
    camera.position.set(1.25, 7, 7);
    camera.lookAt(scene.position);

    //Adding lights
    scene.add(new THREE.AmbientLight(0x666666));

    const light = new THREE.DirectionalLight(0xdfebff, 1);
    light.position.set(100, 100, 50);
    light.position.multiplyScalar(1.3);
    scene.add(light);

    // renderer
    renderer = new THREE.WebGLRenderer({ canvas: modelCanvas });
    //console.log(window.innerWidth, window.innerHeight);
    renderer.setSize(modelCanvas.width, modelCanvas.height);
    //container.appendChild( renderer.domElement );

    controls = new OrbitControls(camera, renderer.domElement);
    controls.zoomSpeed = 0.4;
    controls.panSpeed = 0.4;

    var globe_geometry = new THREE.SphereBufferGeometry(4, 300, 200);
    var colors = [];
    var color = new THREE.Color();
    for (let i = 0; i < globe_geometry.attributes.position.count; i++) {
        color.set(0x4369b5);
        color.toArray(colors, i * 3);
    }
    globe_geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

    var loader = new THREE.TextureLoader();
    loader.setCrossOrigin('');
    var texture = loader.load('earthspec1k.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    var disk = loader.load('https://threejs.org/examples/textures/sprites/circle.png');

    points = new THREE.Points(globe_geometry, new THREE.ShaderMaterial({
        vertexColors: THREE.VertexColors,
        uniforms: {
            visibility: {
                value: texture
            },
            shift: {
                value: 0
            },
            shape: {
                value: disk
            },
            size: {
                value: 0.08
            },
            scale: {
                value: window.innerHeight / 2
            }
        },
        vertexShader: `
					
		  uniform float scale;
		  uniform float size;
		  
		  varying vec2 vUv;
		  varying vec3 vColor;
		  
		  void main() {
		  
			vUv = uv;
			vColor = color;
			vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
			gl_PointSize = size * ( scale / length( mvPosition.xyz ) );
			gl_Position = projectionMatrix * mvPosition;

		  }
	  `,
        fragmentShader: `
		  uniform sampler2D visibility;
		  uniform float shift;
		  uniform sampler2D shape;
		  
		  varying vec2 vUv;
		  varying vec3 vColor;
		  

		  void main() {
			
			vec2 uv = vUv;
			uv.x += shift;
			vec4 v = texture2D(visibility, uv);
			if (length(v.rgb) > 1.0) discard;

			gl_FragColor = vec4( vColor, 1.0 );
			vec4 shapeData = texture2D( shape, gl_PointCoord );
			if (shapeData.a < 0.5) discard;
			gl_FragColor = gl_FragColor * shapeData;
			
		  }
	  `,
        transparent: true
    }));
    scene.add(points);

    var outer_geometry = new THREE.SphereGeometry(4.05, 120, 60);
    outer_sphere = new THREE.Mesh(outer_geometry, new THREE.MeshLambertMaterial({ color: 0x0C2E4E, transparent: true, opacity: 0 }));
    scene.add(outer_sphere);

    globe = new THREE.Mesh(globe_geometry, new THREE.MeshLambertMaterial({ color: 0x0C2E4E }));
    globe.scale.setScalar(0.99);
    points.add(globe);

    vertices = points.geometry.attributes.position.array;

    for (var i = 0; i < vertices.length; i++) {
        vertices[i] += 0.1;
    }

    var start_ind = Math.floor(Math.random() * vertices.length) * 3;
    var end_ind = Math.floor(Math.random() * vertices.length) * 3;

    var start = new THREE.Vector3(vertices[start_ind], vertices[start_ind + 1], vertices[start_ind + 2]);
    var end = new THREE.Vector3(vertices[end_ind], vertices[end_ind + 1], vertices[end_ind + 2]);

    //Arcs
    var smoothness = 50;
    var cb = new THREE.Vector3(),
        ab = new THREE.Vector3(),
        normal = new THREE.Vector3();
    cb.subVectors(new THREE.Vector3(), end);
    ab.subVectors(start, end);
    cb.cross(ab);
    normal.copy(cb).normalize();

    var angle = start.angleTo(end);
    var angleDelta = angle / (smoothness - 1);
    arc_geom = new THREE.BufferGeometry();
    var temp = [];
    for (var i = 0; i < smoothness; i++) {
        var a = start.clone().applyAxisAngle(normal, angleDelta * i);
        temp.push(a.x, a.y, a.z);
    }
    var pos2 = new Float32Array(temp);

    arc_geom.setAttribute('position', new THREE.BufferAttribute(pos2, 3));

    arc = new THREE.Line(arc_geom, new THREE.LineBasicMaterial({
        color: color
    }));
    //globe.add(arc);
    arc_geom.setDrawRange(0, 1);

    //clock to update animation
    clock = new THREE.Clock();
    time = 0;
}

function updateGeom() {

    var smoothness = 50;
    var p = Math.floor(Math.random() * 100) + 30;
    var start_ind = Math.floor(Math.random() * vertices.length);
    var end_ind = Math.floor(Math.random() * vertices.length);
    var start = new THREE.Vector3(vertices[start_ind], vertices[start_ind + 1], vertices[start_ind + 2]);
    var end = new THREE.Vector3(vertices[end_ind], vertices[end_ind + 1], vertices[end_ind + 2]);


    var cb = new THREE.Vector3(),
        ab = new THREE.Vector3(),
        normal = new THREE.Vector3();
    cb.subVectors(new THREE.Vector3(), end);
    ab.subVectors(start, end);
    cb.cross(ab);
    normal.copy(cb).normalize();

    var angle = start.angleTo(end);
    var angleDelta = angle / (smoothness - 1);
    var temp = [];
    for (var i = 0; i < smoothness; i++) {
        var a = start.clone().applyAxisAngle(normal, angleDelta * i);
        temp.push(a.x, a.y, a.z);
    }
    var pos2 = new Float32Array(temp);

    arc_geom.attributes.position.array = pos2;
    arc.geometry = arc_geom;

    positions = arc_geom.attributes.position.array;
    MAX_POINTS = arc_geom.attributes.position.array.length;
    arc_geom.setDrawRange(0, 1);

    const pos = arc_geom.attributes.position.array;
    let x, y, z, index;
    x = y = z = index = 0;

    for (let i = 0, l = MAX_POINTS; i < l; i++) {
        pos[index++] = positions[index];
        pos[index++] = positions[index];
        pos[index++] = positions[index];
    }
}

function render() {
    arc.rotation.y -= 0.005;

    time += clock.getDelta();
    points.material.uniforms.shift.value = time * 0.05;
    drawCount = (drawCount + 1) % MAX_POINTS;
    arc_geom.setDrawRange(0, drawCount);

    if (drawCount === 1) {
        updateGeom();
        arc_geom.attributes.position.needsUpdate = true; // required after the first render
        arc.material.color.setHSL(Math.random(), 1, 0.5);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();