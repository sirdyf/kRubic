if (!Detector.webgl)
    Detector.addGetWebGLMessage();

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container, stats;

var camera, scene, renderer;

var num = 0;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var controls, time = Date.now();
var clock = new THREE.Clock();

init();
animate();
 
function init() {
    this.init = true;
    container = document.createElement('div');
    document.body.appendChild(container);

    renderer = new THREE.WebGLRenderer({antialias: true});

    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(35, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 500);
    camera.position.z=-25;

    controlsMouse = new THREE.OrbitControls( camera );
    controlsMouse.addEventListener( 'change', render );
    controls = new THREE.PointerLockControls(camera);
    
    scene.add( camera );

    scene.add(new THREE.AmbientLight('rgb(20,150,20)'));

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1.15);
    directionalLight.position.set(15, 50, 0);
    camera.add(directionalLight);

    var maxAnisotropy = renderer.getMaxAnisotropy();

    if (maxAnisotropy > 0) {

        document.getElementById("val_left").innerHTML = maxAnisotropy;

    } else {

        document.getElementById("val_left").innerHTML = "not supported";
        document.getElementById("val_right").innerHTML = "not supported";

    }
    scene.tmpCube=new THREE.Mesh(new THREE.SphereGeometry(1, 10, 10));
    scene.add(scene.tmpCube);
    
    var cub=new THREE.Mesh(new THREE.SphereGeometry(20, 20, 10));
    scene.mainCube=cub;
    scene.add(cub);
    
    UTILS.createCrest(cub,3);
    camera.targetCube=scene.mainCube.children[0];

    stats = new Stats();
    container.appendChild( stats.domElement );
    // RENDERER

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    renderer.domElement.style.position = "relative";
    container.appendChild(renderer.domElement);

    // STATS1

    stats = new Stats();
    container.appendChild(stats.domElement);

//    controls = new THREE.PointerLockControls(camera);
//    controlsMouse.enabled = true;

    var width = window.innerWidth || 2;
    var height = window.innerHeight || 2;
}

function animate() {

    requestAnimationFrame(animate);
    render();
    controlsMouse.update();
    controls.update();

    document.getElementById( "val_right" ).innerHTML = controlsMouse._phi;
    }

//    document.getElementById( "val_right" ).innerHTML = vv;

function render() {

//    var delta_time = clock.getDelta();
    renderer.render(scene, camera);

//    time = Date.now();
    stats.update();
  }


//var onKeyDownMain = function(event) {
//    if (event.keyCode === 32) { // Пробел
//
////        scene.fireLaser(controlsMouse.getObject());
//
//    }
//};

//document.addEventListener( 'keydown', onKeyDownMain, false );

function onWindowResize() {
        
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;

        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();

        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

}

window.addEventListener( 'resize', onWindowResize, false );

