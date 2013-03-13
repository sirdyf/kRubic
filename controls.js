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

    this.normCubeAxis = function(obj){
            this.normRotateAxis(obj.rotation.x);
            this.normRotateAxis(obj.rotation.y);
            this.normRotateAxis(obj.rotation.z);
            obj.updateMatrix();
    };
    this.normRotateAxis = function(axis){
            var oneGrad=Math.PI/180.0;
            var piHalf = Math.PI/2.0;
            var piPoltora = 1.5*Math.PI;
            
            var axisMod=Math.abs(axis);
            
            axis = axis % (2.0*Math.PI);
            
            if (axisMod<oneGrad){
                axis=0;return;
            }
            if (Math.abs(axisMod-piHalf)<oneGrad){
                axis=piHalf*(axis>0 ? 1 : -1);
            }
            if (Math.abs(axisMod-Math.PI)<oneGrad){
                axis=Math.PI*(axis>0 ? 1 : -1);
            }
            if (Math.abs(axisMod-piPoltora)<oneGrad){
                axis=piPoltora*(axis>0 ? 1 : -1);
            }
            if (Math.abs(axisMod-2.0*Math.PI)<oneGrad){
                axis=0;
            }
    };
    
    this.update = function(delta) {//delta is "delta time"
        if (scope.enabled === false)
            return;
        if (rotateYawCW || rotateYawСCW){
            if (scene.mainCube.rot === 0){
                var angl=Math.PI/2.0 * (rotateYawСCW ? -1 : 1);
                scene.altObj =  scene.mainCube.clone();
                scene.tarObj =  scene.mainCube.clone();
                scene.tarObj.applyMatrix( new THREE.Matrix4().makeRotationZ( angl) );
                this.normCubeAxis(scene.tarObj);
                scene.tarObj.rotAngle=angl;
                scene.tarObj.step=0;
                scene.mainCube.rot=1;//Math.PI/2.0 * (rotateYawСCW ? -1 : 1);
                scene.cntr=scene.mainCube.position.clone();
                scene.cntr.z +=1;
//                UTILS.rotateAroundWorldAxis(scene.workObj,cntr,Math.PI/2);// * (rotateYawСCW ? -1 : 1) );
            rotateYawCW=false;
            rotateYawСCW=false;
            }
        }
        if (rotateYawForw || rotateYawBack) {
            if (scene.mainCube.rot === 0){
                var angl=Math.PI/2.0 * (rotateYawBack ? -1 : 1);
                scene.altObj =  scene.mainCube.clone();
                scene.tarObj =  scene.mainCube.clone();
                scene.tarObj.applyMatrix( new THREE.Matrix4().makeRotationX( angl) );
                this.normCubeAxis(scene.tarObj);
                scene.tarObj.rotAngle=angl;
                scene.tarObj.step=0;
                scene.mainCube.rot=1;//Math.PI/2.0 * (rotateYawСCW ? -1 : 1);
                scene.cntr=scene.mainCube.position.clone();
                scene.cntr.x +=1;
//                UTILS.rotateAroundWorldAxis(scene.workObj,cntr,Math.PI/2);// * (rotateYawСCW ? -1 : 1) );
            rotateYawForw=false;
            rotateYawBack=false;
            }
        }
  
        if (moveRight){
            if (scene.mainCube.rot === 0){
                var angl=Math.PI/2.0 * (rotateYawBack ? -1 : 1);
                var nearObj=UTILS.findNearCube(scene.basePoint,scene.mainCube.children);
                scene.altObj =  nearObj.clone();
                scene.tarObj =  nearObj.clone();
                scene.tarObj.applyMatrix( new THREE.Matrix4().makeRotationZ( angl) );
                this.normCubeAxis(scene.tarObj);
                scene.tarObj.rotAngle=angl;
                scene.tarObj.step=0;
                scene.mainCube.rot=1;//Math.PI/2.0 * (rotateYawСCW ? -1 : 1);
                scene.cntr=scene.mainCube.position.clone();
                scene.cntr.z +=1;    
                moveRight=false;
            }
        };
    };
//document.getElementById( "val_right" ).innerHTML = vv;

};
