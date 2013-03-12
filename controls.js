/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function(camera) {

    var scope = this;

//    var yawObject = new THREE.Object3D();
//    yawObject.position.y = 3;
//    yawObject.add(camera);

    

    var enableContols = true;
    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    var rotateYawCW = false; // По часовой
    var rotateYawСCW = false; // Против часовой
    var rotateYawForw = false;
    var rotateYawBack = false;

    var velocity = new THREE.Vector3();

    var rotateYaw = new THREE.Vector3();

    var velocityYaw = 0;

    var PI_2 = Math.PI / 2;

    var onKeyDown = function(event) {

        switch (event.keyCode) {

            case 38: // up
                moveForward = true;
                break;
            case 87: // w
                rotateYawForw = true;
                break;

            case 37: // left
                moveLeft = true;
                break;

            case 65: // a
                rotateYawСCW = true;
                break;

            case 40: // down
                moveBackward = true;
                break;
            case 83: // s
                rotateYawBack = true;
                break;

            case 39: // right
                moveRight = true;
                break;

            case 68: // d
                rotateYawCW = true;
                break;

//			case 32: // space
//				if ( canJump === true ) velocity.y += 10;
//				canJump = false;
//				break;

            case 81: // Q 
                break;

            case 69: // E 
                break;

        }

    };

    var onKeyUp = function(event) {

         switch (event.keyCode) {

            case 38: // up
                moveForward = false;
                break;
            case 87: // w
                rotateYawForw = false;
                break;

            case 37: // left
                moveLeft = false;
                break;

            case 65: // a
                rotateYawСCW = false;
                break;

            case 40: // down
                moveBackward = false;
                break;
            case 83: // s
                rotateYawBack = false;
                break;

            case 39: // right
                moveRight = false;
                break;

            case 68: // d
                rotateYawCW = false;
                break;

//			case 32: // space
//				if ( canJump === true ) velocity.y += 10;
//				canJump = false;
//				break;

            case 81: // Q 
                break;

            case 69: // E 
                break;

        }

    };

    //document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    
    this.update = function(delta) {//delta is "delta time"
        if (scope.enabled === false)
            return;
        if (rotateYawCW){
            rotateYawCW=false;
            if (scene.mainCube.rotZ === 0){
                scene.workObj = scene.mainCube.clone();
                scene.altObj =  scene.mainCube.clone();
                scene.workObj.stp=0;
                scene.mainCube.rotZ=Math.PI/2.0;
                var cntr=scene.mainCube.position.clone();
                cntr.z +=1;
                UTILS.rotateAroundWorldAxis(scene.workObj,cntr,Math.PI/2);
            }
        }
        if (rotateYawСCW){
            rotateYawСCW=false;
            if (scene.mainCube.rotZ === 0){
                scene.mainCube.rotZ=-0.001;
            }
        }
        if (rotateYawForw){
            rotateYawForw=false;
            if (scene.mainCube.rotX === 0){
                scene.mainCube.rotX=1;
            }
        }
        if (rotateYawBack){
            rotateYawBack=false;
            if (scene.mainCube.rotX === 0){
                scene.mainCube.rotX=-1;
            }
        }
    };
//document.getElementById( "val_right" ).innerHTML = vv;

};
