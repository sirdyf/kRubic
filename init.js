if (!Detector.webgl)
    Detector.addGetWebGLMessage();

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container, stats;

var camera, scene, renderer;

var num = 0;
var cub;
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
    camera.position.z=-15;

    controls = new THREE.OrbitControls( camera );
    controls.addEventListener( 'change', render );
    
    scene.add( camera );

    scene.add(new THREE.AmbientLight('rgb(15,15,20)'));

    var maxAnisotropy = renderer.getMaxAnisotropy();

    if (maxAnisotropy > 0) {

        document.getElementById("val_left").innerHTML = maxAnisotropy;

    } else {

        document.getElementById("val_left").innerHTML = "not supported";
        document.getElementById("val_right").innerHTML = "not supported";

    }
    var mat = new THREE.MeshLambertMaterial({color: 0x11ffff});//, shading: THREE.FlatShading, overdraw: true});

//THREE.CubeGeometry = function ( width, height, depth, widthSegments, heightSegments, depthSegments ) {
    cub = new THREE.Mesh(new THREE.CubeGeometry(5,5,5,3,3,3), mat);
//    cub.position.z = -15;
//    cub.position.x = 0;
    
    cub.updateMatrix();
    cub.name = "cube";
    scene.add(cub);
   
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
//    controls.enabled = true;

    var width = window.innerWidth || 2;
    var height = window.innerHeight || 2;
}

function animate() {

    requestAnimationFrame(animate);
    render();
    controls.update();


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
////        scene.fireLaser(controls.getObject());
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

