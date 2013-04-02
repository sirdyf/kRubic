if (!Detector.webgl)
    Detector.addGetWebGLMessage();

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container, stats;

var camera, scene, renderer,projector;

var num = 0;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var controls, time = Date.now();
var clock = new THREE.Clock();

var mouseRay = { x: 0, y: 0 }, INTERSECTED;

init();
animate();

function init() {
    this.init = true;
    
    projector = new THREE.Projector();
    
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


    
    // model

    var loader = new THREE.OBJMTLLoader();
    loader.addEventListener('load', function(event) {
        var object = event.content;
        scene.main.createModel(object);
        scene.add(scene.main.getMainObj());
        scene.tstBox=scene.main.getBoundingBox(object);
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

    controlsMouse.update();
    controls.update();
    if (scene.main){
        document.getElementById("val_right").innerHTML = scene.main.getMainCubeChildrenCount();
    }
    render();
    requestAnimationFrame(animate);
}
//    document.getElementById( "val_right" ).innerHTML = vv;
function render() {

    scene.main.render();

    ray();

    renderer.render(scene, camera);

    stats.update();
}
function onDocumentMouseMove( event ) {

        event.preventDefault();

        mouseRay.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouseRay.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        scene.main.mouseMove(event.clientX,event.clientY);
}
//function onMouseUp( event ) {
//        event.preventDefault();
//}
//document.addEventListener( 'mouseup', onMouseUp, false );
document.addEventListener( 'mousemove', onDocumentMouseMove, false );

function ray(){
    // find intersections

    var vector = new THREE.Vector3( mouseRay.x, mouseRay.y, 1 );
    projector.unprojectVector( vector, camera );

    var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
    var child = scene.main.getMainObj();
    var intersects = raycaster.intersectObjects( scene.children,true);//child.children,true);

    if ( intersects.length > 0 ) {
            if ( INTERSECTED != intersects[ 0 ].object ) {
                    INTERSECTED = intersects[ 0 ].object;
                    if (scene.main){
                        if (INTERSECTED.parent.name === "cub"){
                            scene.main.setNullCubePosition(intersects[ 0 ].object);
                        }
                        if (INTERSECTED.name === "controlPoint"){
//                            INTERSECTED.scale.set(2,2,2);
                            scene.main.setNullCubePosBack(INTERSECTED);
                        }
                        
                    }
            }
    } else {
        scene.main.clearSelection();
        INTERSECTED = null;
    }
//    scene.traverse(function(child){
//        if (child.name === "controlPoint") {
//            intersects = raycaster.intersectObjects( child,false );
//            if ( intersects.length > 0 ) {
//                child.scale.set(2,2,2);
//            }
//        }
//     });
};

//var onKeyDownMain = function(event) {
//    if (event.keyCode === 32) { // Пробел
//        if (scene.specialMode === 0) {
//            scene.specialMode = 1;
//            scene.tmpObj = scene.mainCube.clone();
//        }
//    }
//};

//document.addEventListener('keydown', onKeyDownMain, false);

function onWindowResize() {

    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;

    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

}

window.addEventListener('resize', onWindowResize, false);

