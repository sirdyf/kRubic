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
    camera.position.z = -15;

    controlsMouse = new THREE.OrbitControls(camera);
    controlsMouse.addEventListener('change', render);
    controls = new THREE.PointerLockControls(camera);

    scene.add(camera);

    scene.add(new THREE.AmbientLight('rgb(20,150,20)'));

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1.15);
    directionalLight.position.set(1, 5, 1);
    camera.add(directionalLight);

    var maxAnisotropy = renderer.getMaxAnisotropy();

    if (maxAnisotropy > 0) {

        document.getElementById("val_left").innerHTML = maxAnisotropy;

    } else {

        document.getElementById("val_left").innerHTML = "not supported";
        document.getElementById("val_right").innerHTML = "not supported";

    }
    scene.main = new CUBIC.init();

    scene.basePointFront = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 10));
    scene.basePointFront.position = new THREE.Vector3(0, 0, -15);
    scene.add(scene.basePointFront);

    scene.basePointRight = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 10));
    scene.basePointRight.position = new THREE.Vector3(-15, 0, 0);
    scene.add(scene.basePointRight);

    // model

    var loader = new THREE.OBJMTLLoader();
    loader.addEventListener('load', function(event) {
        var object = event.content;
        scene.main.createModel(object);
        scene.add(scene.main.getMainObj());
    });
    loader.load('model/props.obj', 'model/props.mtl');

    stats = new Stats();
    container.appendChild(stats.domElement);
    // RENDERER

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    renderer.domElement.style.position = "relative";
    container.appendChild(renderer.domElement);

    // STATS1

    stats = new Stats();
    container.appendChild(stats.domElement);

    var width = window.innerWidth || 2;
    var height = window.innerHeight || 2;
}

function animate() {

    render();
    controlsMouse.update();
    controls.update();
    if (scene.main){
        document.getElementById("val_right").innerHTML = scene.main.getMainCubeChildren();
    }
    requestAnimationFrame(animate);
}
//    document.getElementById( "val_right" ).innerHTML = vv;
function render() {

    scene.main.render();

    renderer.render(scene, camera);

    stats.update();
}


var onKeyDownMain = function(event) {
//    if (event.keyCode === 32) { // Пробел
//        if (scene.specialMode === 0) {
//            scene.specialMode = 1;
//            scene.tmpObj = scene.mainCube.clone();
//        }
//    }
};

document.addEventListener('keydown', onKeyDownMain, false);

function onWindowResize() {

    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;

    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

}

window.addEventListener('resize', onWindowResize, false);

