/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var CUBIC = CUBIC || {revision: "ver 1.0"};

CUBIC.init = function() {
    var workObj = 0;
    var newObj = 0;
    var altObj = 0;
    var tarObj = 0;
    var specialMode = 0;
    var cntr = 0;
    var mainCube = new THREE.Object3D();
    var basePointFront = new THREE.Vector3(0, 0, -15);
    var basePointRight = new THREE.Vector3(-15, 0, 0);

    mainCube.rot = 0;

    this.getMainObj = function() {
        return mainCube;
    };

    this.getMainCubeChildren = function() {
        return mainCube.children.length - mainCube.defaultChildren;
    };

    this.createModel = function(obj) {
        mainCube = obj.clone();
        mainCube.defaultChildren = obj.children.length;
        mainCube.rot = 0;
        UTILS.createCubik(mainCube, 1);
        UTILS.normChildren(mainCube);
        UTILS.numericCube(mainCube);
    };

    normCubeAxis = function(obj) {
        normRotateAxis(obj.rotation.x);
        normRotateAxis(obj.rotation.y);
        normRotateAxis(obj.rotation.z);
        obj.updateMatrix();
    };
    normRotateAxis = function(axis) {
        var oneGrad = Math.PI / 180.0;
        var piHalf = Math.PI / 2.0;
        var piPoltora = 1.5 * Math.PI;

        var axisMod = Math.abs(axis);

        axis = axis % (2.0 * Math.PI);

        if (axisMod < oneGrad) {
            axis = 0;
            return;
        }
        if (Math.abs(axisMod - piHalf) < oneGrad) {
            axis = piHalf * (axis > 0 ? 1 : -1);
        }
        if (Math.abs(axisMod - Math.PI) < oneGrad) {
            axis = Math.PI * (axis > 0 ? 1 : -1);
        }
        if (Math.abs(axisMod - piPoltora) < oneGrad) {
            axis = piPoltora * (axis > 0 ? 1 : -1);
        }
        if (Math.abs(axisMod - 2.0 * Math.PI) < oneGrad) {
            axis = 0;
        }
    };
    this.render = function() {
            if ((specialMode === 0) && (mainCube.rot !== 0)) {
                var workObj = altObj.clone();
                var angle = tarObj.rotAngle * tarObj.step;
                UTILS.rotateAroundWorldAxis(workObj, cntr, angle);// * (rotateYawСCW ? -1 : 1) );
                tarObj.rotation.copy(workObj.rotation);
                tarObj.step += 0.1;
                if (tarObj.step > 1) {
                    mainCube.rot = 0;
                    UTILS.normChildren(mainCube);
                }
            }
    };

    render2 = function() {
        if (specialMode !== 0) {
            var vsPos = mainCube.position.clone();
            var bEnd = false;
            for (var i in  mainCube.children) {
                if (mainCube.children[i].name !== "cub")
                    continue;
                if (specialMode === 1) {
                    var sRad = -0.05;
                    var vsDelta = new THREE.Vector3(0, 0, 0);
                    mainCube.children[i].worldToLocal(vsDelta);
                    if (mainCube.children[i].position.lengthSq() < 4.0) {//distanceTo(vsPos)<2.0){
                        mainCube.children[i].translate(sRad, vsDelta);
                        bEnd = true;
                    }
                }
                if (specialMode === 2) {
                    var vRotChild = mainCube.children[i].rotation;
                    var lenRotChild = vRotChild.lengthSq();
                    if (lenRotChild > 0) {
                        UTILS.vRotationInNull(vRotChild, 0.09);
                        bEnd = true;
                    }
                }
                if (specialMode === 3) {
                    var sRad = 0.05;
                    var vsDelta = new THREE.Vector3(0, 0, 0);
                    mainCube.children[i].worldToLocal(vsDelta);
//                if ( mainCube.children[i].position.distanceTo(vsPos)> tmpObj.children[i].position.distanceTo(vsPos)){
                    if (mainCube.children[i].position.lengthSq() > tmpObj.children[i].position.lengthSq()) {
                        mainCube.children[i].translate(sRad, vsDelta);
                        bEnd = true;
                    }
                }
            }
            if (bEnd === false) {
                specialMode += 1;
                if (specialMode === 4) {
                    specialMode = 0;
                    tmpObj = 0;
                    //NORMALIZE CUBE!!
                }
            }
        } else {
        }
    };
    this.pressRotateLR = function(flag) {
        var angl = Math.PI / 2.0 * (flag < 0 ? -1 : 1);
        tarObj = mainCube;
        altObj = mainCube.clone();
        newObj = mainCube.clone();
        newObj.applyMatrix(new THREE.Matrix4().makeRotationZ(angl));
        normCubeAxis(newObj);
        tarObj.rotAngle = angl;
        tarObj.step = 0;
        mainCube.rot = 1;//Math.PI/2.0 * (rotateYawСCW ? -1 : 1);
        cntr = mainCube.position.clone();
        cntr.z += 1;
//                UTILS.rotateAroundWorldAxis(main.workObj,cntr,Math.PI/2);// * (rotateYawСCW ? -1 : 1) );      
    };

    this.pressRotateFB = function(flag) {
        if (mainCube.rot === 0) {
            var angl = Math.PI / 2.0 * (flag <0 ? -1 : 1);
            tarObj = mainCube;
            altObj = mainCube.clone();
            newObj = mainCube.clone();
            newObj.applyMatrix(new THREE.Matrix4().makeRotationX(angl));
            normCubeAxis(newObj);
            tarObj.rotAngle = angl;
            tarObj.step = 0;
            mainCube.rot = 1;//Math.PI/2.0 * (rotateYawСCW ? -1 : 1);
            cntr = mainCube.position.clone();
            cntr.x += 1;
        }
//                UTILS.rotateAroundWorldAxis( workObj,cntr,Math.PI/2);// * (rotateYawСCW ? -1 : 1) );
    };
    this.pressMoveLR = function(flag) {
            var angl = Math.PI / 2.0 * (flag <0 ? -1 : 1);
            var nearObj = UTILS.findNearCube(basePointFront, mainCube);

            tarObj = nearObj;
            altObj = nearObj.clone();
            newObj = nearObj.clone();
            cntr = new THREE.Vector3(0, 0, 1);
            cntr.addSelf(mainCube.position);
            mainCube.worldToLocal(cntr);
            UTILS.rotateAroundWorldAxis(newObj, cntr, angl);
            UTILS.rebaseFront(mainCube, nearObj);
//                 normCubeAxis( newObj);
            tarObj.rotAngle = angl;
            tarObj.step = 0;
            mainCube.rot = 1;
    };
    this.pressMoveFB = function(flag) {
        if (mainCube.rot === 0) {
            var angl = Math.PI / 2.0 * (flag <0 ? -1 : 1);
            var nearObj = UTILS.findNearCube(basePointRight, mainCube);

            tarObj = nearObj;
            altObj = nearObj.clone();
            newObj = nearObj.clone();
            cntr = new THREE.Vector3(1, 0, 0);
            cntr.addSelf(mainCube.position);
            mainCube.worldToLocal(cntr);
            UTILS.rotateAroundWorldAxis(newObj, cntr, angl);
            UTILS.rebaseFront(mainCube, nearObj);
//                 normCubeAxis( newObj);
            tarObj.rotAngle = angl;
            tarObj.step = 0;
            mainCube.rot = 1;
        }
    };
};