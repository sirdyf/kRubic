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
    camera.position.z=-10;

    controlsMouse = new THREE.OrbitControls( camera );
    controlsMouse.addEventListener( 'change', render );
    controls = new THREE.PointerLockControls(camera);
    
    scene.add( camera );

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
    
    scene.basePointFront=new THREE.Mesh(new THREE.SphereGeometry(1, 10, 10));
    scene.basePointFront.position=new THREE.Vector3(0,0,-15);
    scene.add(scene.basePointFront);
    
    scene.basePointRight=new THREE.Mesh(new THREE.SphereGeometry(1, 10, 10));
    scene.basePointRight.position=new THREE.Vector3(-15,0,0);
    scene.add(scene.basePointRight);
    
    scene.workObj=0;
    scene.newObj=0;
    scene.altObj=0;
    scene.tarObj=0;
    scene.mainCube=new THREE.Object3D();
    scene.mainCube.rot=0;
    
    
//    camera.targetCube=scene.mainCube.children[0];
    // model

    var loader = new THREE.OBJMTLLoader();
    loader.addEventListener( 'load', function ( event ) {

            var object = event.content;

//            object.position.y = - 80;
//            scene.add( object );
//        var cub=new THREE.Mesh(new THREE.SphereGeometry(1, 10, 10));
        scene.mainCube=object.clone();
        scene.mainCube.defaultChildren=object.children.length;
        scene.add(scene.mainCube);       
        scene.mainCube.rot=0;
        UTILS.createCubik(scene.mainCube,1);
        UTILS.normChildren(scene.mainCube);
        UTILS.numericCube(scene.mainCube);

    });
    loader.load( 'model/props.obj', 'model/props.mtl' );

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

    document.getElementById( "val_right" ).innerHTML = scene.mainCube.children.length-scene.mainCube.defaultChildren;
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
//        var vvv=scene.workObj.rotation.clone();
//        vvv.lerpSelf(scene.workObj.rotation,scene.workObj.stp);
//        UTILS.aLerp(vvv,scene.workObj.rotation,scene.workObj.stp);
    if ((scene.mainCube.rot)&&(scene.mainCube.rot !== 0)){
        var workObj=scene.altObj.clone();
        var angle=scene.tarObj.rotAngle*scene.tarObj.step;
        UTILS.rotateAroundWorldAxis(workObj,scene.cntr,angle);// * (rotateYawСCW ? -1 : 1) );
        scene.tarObj.rotation.copy(workObj.rotation);
        scene.tarObj.step += 0.1;
        if (scene.tarObj.step >1)  {
            scene.mainCube.rot=0;
//            scene.tarObj.position.copy(scene.newObj.position);
//            scene.tarObj.rotation.copy(scene.newObj.rotation);

//            UTILS.updateChildrenMatrix(scene.tarObj);


            UTILS.normChildren(scene.mainCube);
        }
    }
//    if (scene.mainCube.rotFront !== 0){
//
//    }
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

