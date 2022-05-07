//Creating custom prism class for Triangular Prism
class PrismGeometry extends THREE.ExtrudeGeometry {
	constructor(vertices, height) {
		super(new THREE.Shape(vertices), {depth: height, bevelEnabled: false});
	}
}
PrismGeometry.prototype = Object.create( THREE.ExtrudeGeometry.prototype );


let scene, camera, cloudParticles = [], composer;
var geometry;
var current_idx = 0;
var num_faces, num_edges, num_vertices;
var controls;

var a = new THREE.Vector2( 0, 0 );
var b = new THREE.Vector2( -2, 2 );
var c = new THREE.Vector2( 2, 2 );

var geometries = [ new THREE.CylinderGeometry( 5, 5, 10, 16 ),
					new THREE.ConeGeometry( 5, 10, 16 ),
					new THREE.SphereGeometry( 15, 32, 16 ),
					new THREE.BoxGeometry( 5, 10, 5 ),
					new THREE.TetrahedronGeometry( 5 ),
					new THREE.ConeGeometry( 5, 5, 4 ),
					new PrismGeometry([a, b, c], 5)];
							
var solids_group =  [];

const material = new THREE.MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true } );

for (var i = 0; i < geometries.length; i++){
	solids_group.push( new THREE.Mesh( geometries[i], material ) );	
}

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,50);
    camera.position.z = 1;
    camera.rotation.x = 1.16;
    camera.rotation.y = -0.12;
    camera.rotation.z = 0.27;
	
    let ambient = new THREE.AmbientLight(0x555555);
    scene.add(ambient);

	/*Background lights*/
    let orangeLight = new THREE.PointLight(0xcc6600,15,80,1.7);
    orangeLight.position.set(20,30,10);
    scene.add(orangeLight);
    let redLight = new THREE.PointLight(0xd8547e,15,80,1.7);
    redLight.position.set(10,30,10);
    scene.add(redLight);
    let blueLight = new THREE.PointLight(0x3677ac,15,80,1.7);
    blueLight.position.set(30,30,20);
    scene.add(blueLight);
	
	/*Object lights*/
	var spotlight = new THREE.SpotLight(0xffffff);
	spotlight.position.set(-10, -20, -10);
	scene.add(spotlight);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let loader = new THREE.TextureLoader();
    loader.load("smoke.png", function(texture){
		cloudGeo = new THREE.PlaneBufferGeometry(100,100);
        cloudMaterial = new THREE.MeshLambertMaterial({
			map:texture,
			transparent: true
		});

		for(let p = 0; p < 50; p++) {
			let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
			cloud.position.set(
				Math.random()*100 - 50,
				40,
				Math.random()*50-50
			);
			cloud.rotation.x = 1.16;
            cloud.rotation.y = -0.12;
            cloud.rotation.z = Math.random()*2*Math.PI;
            cloud.material.opacity = 0.55;
            cloudParticles.push(cloud);
            scene.add(cloud);
        }
    });
	
	const particles_geometry = new THREE.BufferGeometry;
	const particles_count = 15000;

	const positions = new Float32Array( particles_count * 3 );
	for (let i=0; i < particles_count*3; i++){
		positions[i] = (Math.random()*10 - 5)*5;
	}

	particles_geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

	const particles_material = new THREE.PointsMaterial({ 
		size: 0.6,
		map: new THREE.TextureLoader().load("star_small.png"),
		transparent: true,
		blending: THREE.AdditiveBlending
	});
	const particles_mesh = new THREE.Points(particles_geometry, particles_material);
	scene.add(particles_mesh);
		
	const bloomEffect = new POSTPROCESSING.BloomEffect({
		blendFunction: POSTPROCESSING.BlendFunction.COLOR_DODGE,
		kernelSize: POSTPROCESSING.KernelSize.SMALL,
		useLuminanceFilter: true,
		luminanceThreshold: 0.3,
		luminanceSmoothing: 0.75
	});
	bloomEffect.blendMode.opacity.value = 0.5;
		
	let effectPass = new POSTPROCESSING.EffectPass(
		camera,
        bloomEffect
	);
	effectPass.renderToScreen = true;

    composer = new POSTPROCESSING.EffectComposer(renderer);
    composer.addPass(new POSTPROCESSING.RenderPass(scene, camera));
    composer.addPass(effectPass);
        
	render();
}

function rectPrismClick(){
	solids_group[current_idx].visible = false;
	current_idx = 3;
	solids_group[current_idx].visible = true;
	scene.add(solids_group[current_idx]);
	
	solids_group[current_idx].position.x = 0.5;
    solids_group[current_idx].position.y = 2.12;
    solids_group[current_idx].position.z = 0.27;
	solids_group[current_idx].scale.setScalar(0.1);
	
	num_faces = 6;
	num_edges = 12;
	num_vertices = 8;
}

function triPrismClick(){
	solids_group[current_idx].visible = false;
	current_idx = 6;
	solids_group[current_idx].visible = true;
	scene.add(solids_group[current_idx]);
	
	solids_group[current_idx].position.x = 0.5;
    solids_group[current_idx].position.y = 2.12;
    solids_group[current_idx].position.z = 0.27;
	solids_group[current_idx].scale.setScalar(0.2);
	
	num_faces = 5;
	num_edges = 9;
	num_vertices = 6;
}

function triPyramidClick(){
	solids_group[current_idx].visible = false;
	current_idx = 4;
	solids_group[current_idx].visible = true;
	scene.add(solids_group[current_idx]);
	
	solids_group[current_idx].position.x = 0.5;
    solids_group[current_idx].position.y = 2.12;
    solids_group[current_idx].position.z = 0.27;
	solids_group[current_idx].scale.setScalar(0.1);
	
	num_faces = 4;
	num_edges = 6;
	num_vertices = 4;
}

function sqPyramidClick(){
	solids_group[current_idx].visible = false;
	current_idx = 5;
	solids_group[current_idx].visible = true;
	scene.add(solids_group[current_idx]);
	
	solids_group[current_idx].position.x = 0.5;
    solids_group[current_idx].position.y = 2.12;
    solids_group[current_idx].position.z = 0.27;
	solids_group[current_idx].scale.setScalar(0.1);
	
	num_faces = 5;
	num_edges = 8;
	num_vertices = 5;
}

function coneClick(){
	solids_group[current_idx].visible = false;
	current_idx = 1;
	solids_group[current_idx].visible = true;
	scene.add(solids_group[current_idx]);
	
	solids_group[current_idx].position.x = 0.5;
    solids_group[current_idx].position.y = 2.12;
    solids_group[current_idx].position.z = 0.27;
	solids_group[current_idx].scale.setScalar(0.1);
	
	if (window.orientation === 90){
		solids_group[current_idx].position.x = -1.0;
		solids_group[current_idx].position.y = 3.5;
		solids_group[current_idx].position.z = 0.27;
		solids_group[current_idx].scale.setScalar(0.1);
	}
		
	num_faces = 2;
	num_edges = 1;
	num_vertices = 1;
}

function cylinderClick(){
	solids_group[current_idx].visible = false;
	current_idx = 0;
	solids_group[current_idx].visible = true;
	scene.add(solids_group[current_idx]);
	
	solids_group[current_idx].position.x = 0.5;
    solids_group[current_idx].position.y = 2.12;
    solids_group[current_idx].position.z = 0.27;
	solids_group[current_idx].scale.setScalar(0.1);
	
	if (window.orientation === 90){
		solids_group[current_idx].position.x = 1.5;
		solids_group[current_idx].position.y = 3.5;
		solids_group[current_idx].position.z = 0.27;
		solids_group[current_idx].scale.setScalar(0.2);
	}
	
	console.log(solids_group[current_idx].position)
	num_faces = 3;
	num_edges = 2;
	num_vertices = 0;
};

function sphereClick(){
	solids_group[current_idx].visible = false;
	current_idx = 2;
	solids_group[current_idx].visible = true;
	scene.add(solids_group[current_idx]);
	
    solids_group[current_idx].position.x = 0.5;
    solids_group[current_idx].position.y = 2.12;
    solids_group[current_idx].position.z = 0.27;
	solids_group[current_idx].scale.setScalar(0.05);
	
	num_faces = 1;
	num_edges = 0;
	num_vertices = 0;
}

function checkStats(){
	var faces = parseInt(document.getElementById("faces").value);
	var edges = parseInt(document.getElementById("edges").value);
	var corners = parseInt(document.getElementById("corners").value);
	
	if ((num_faces === faces) && (num_edges === edges) && (num_vertices === corners)){
		console.log("inside condition");
		$('#successModal').modal('show');
	}
	else{
		console.log("try again condition");
		$('#failModal').modal('show');
	}
}
	  
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
      
function render() {
    composer.render(0.1);
	requestAnimationFrame(render);
}

init();


/*Zoom, rotation and window resize options*/
window.addEventListener( 'resize', onWindowResize, false);

document.addEventListener( 'wheel', (event) => {
	var fovMAX = 75;
	var fovMIN = 40;
	camera.fov += event.deltaY * 0.01;
	camera.fov = Math.max( Math.min( camera.fov, fovMAX ), fovMIN );
	camera.updateProjectionMatrix();
});

var isDragging = false;
var previousMousePosition = {
    x: 0,
    y: 0
};

$(renderer.domElement).on('mousedown', function(e) {
    isDragging = true;
}).on('mousemove', function(event) {
    var deltaMove = {
        x: event.offsetX-previousMousePosition.x,
        y: event.offsetY-previousMousePosition.y
    };

    if(isDragging) {
        var deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y * 1),
                toRadians(deltaMove.x * 1),
                0,
                'XYZ'
            ));
        solids_group[current_idx].quaternion.multiplyQuaternions(deltaRotationQuaternion, solids_group[current_idx].quaternion);
    }
   
    previousMousePosition = {
        x: event.offsetX,
        y: event.offsetY
    };
});

$(document).on('mouseup', function(e) {
    isDragging = false;
});

$(renderer.domElement).on('touchstart', function(e) {
    isDragging = true;
}).on('touchmove', function(event) {
    var deltaMove = {
        x: event.offsetX-previousMousePosition.x,
        y: event.offsetY-previousMousePosition.y
    };

    if(isDragging) {
        var deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y * 1),
                toRadians(deltaMove.x * 1),
                0,
                'XYZ'
            ));
        solids_group[current_idx].quaternion.multiplyQuaternions(deltaRotationQuaternion, solids_group[current_idx].quaternion);
    }
   
    previousMousePosition = {
        x: event.offsetX,
        y: event.offsetY
    };
});

$(document).on('touchend', function(e) {
    isDragging = false;
});


function toRadians(angle) {
	return angle * (Math.PI / 180);
}