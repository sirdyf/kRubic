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
    
    scene.basePoint=new THREE.Mesh(new THREE.SphereGeometry(1, 10, 10));
    scene.basePoint.position.copy(camera.position);
    scene.add(scene.basePoint);
    
    scene.workObj=0;
    
    var cub=new THREE.Mesh(new THREE.SphereGeometry(1, 10, 10));
    scene.mainCube=cub;
    scene.mainCube.rotZ=0;
    scene.mainCube.rotX=0;
    scene.mainCube.rotFront=0;
    scene.add(cub);
    
    UTILS.createCrest(cub,3);
//    camera.targetCube=scene.mainCube.children[0];

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

    render();
    controlsMouse.update();
    controls.update();

    document.getElementById( "val_right" ).innerHTML = controlsMouse._phi;
    requestAnimationFrame(animate);
    }

//    document.getElementById( "val_right" ).innerHTML = vv;
// Rotate an object around an arbitrary axis in world space       

function render() {

//    var delta_time = clock.getDelta();
//    var vAnlSpeed=0.1;
//    var anglZ= scene.mainCube.rotZ<0 ? -vAnlSpeed : vAnlSpeed;
//    var cntr=scene.mainCube.position.clone();
//    cntr.z +=1;
    if (scene.mainCube.rotZ !== 0){
        var vvv=scene.altObj.rotation.clone();
        vvv.lerpSelf(scene.workObj.rotation,scene.workObj.stp);
        scene.mainCube.rotation.copy(vvv);
        scene.workObj.stp += 0.1;
        if (scene.workObj.stp >1)  {
            scene.mainCube.rotZ=0;
            scene.mainCube.rotation.copy(scene.workObj.rotation);
        }
//        UTILS.rotateAroundWorldAxis(scene.mainCube,cntr,scene.mainCube.rotZ);
//        scene.mainCube.rotZ += anglZ;
//        if (Math.abs(scene.mainCube.rotZ) > Math.PI/2) {
//            UTILS.rotateAroundWorldAxis2(scene.mainCube,cntr,scene.mainCube.Math.PI/2);
//            scene.mainCube.rotZ=0;
//        }
    }
    if (scene.mainCube.rotFront !== 0){
        var vvv=scene.altObj.rotation.clone();
        vvv.lerpSelf(scene.workObj.rotation,scene.workObj.stp);
        scene.targetObj.rotation.copy(vvv);
        scene.workObj.stp += 0.01;
        if (scene.workObj.stp >1)  {
            scene.mainCube.rotFront=0;
            scene.targetObj.rotation.copy(scene.workObj.rotation);
        }
    }
//    var anglX= scene.mainCube.rotX<0 ? -vAnlSpeed : vAnlSpeed;
//    if (scene.mainCube.rotX !== 0){
//        UTILS.rotateAroundWorldAxis(scene.mainCube,new THREE.Vector3(1,0,0),anglX);
//        scene.mainCube.rotX += scene.mainCube.rotX > 0 ? 1 : -1;
//        if (Math.abs(scene.mainCube.rotX) > (Math.PI/2)/vAnlSpeed+1) {
//            scene.mainCube.rotX=0;
//        }
//    }
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

