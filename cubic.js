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
    var basePointBack = new THREE.Vector3(0, 0, 15);
    var basePointRight = new THREE.Vector3(-15, 0, 0);
    var basePointLeft = new THREE.Vector3(15, 0, 0);
    var basePointDown = new THREE.Vector3(0, -15, 0);
    var basePointUp = new THREE.Vector3(0, 15, 0);
    // U = d,up,a
    var script1 = ["U","U","D","D","F","F","B","B","L","L","R","R"];//"U2","D2","F2","B2","L2","R2"];

    mainCube.rot = 0;
    var demo = [];
    demo.value =0 ;

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

    this.normCubeAxis = function(obj) {
        this.normRotateAxis(obj.rotation.x);
        this.normRotateAxis(obj.rotation.y);
        this.normRotateAxis(obj.rotation.z);
        obj.updateMatrix();
    };
    this.normRotateAxis = function(axis) {
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
        if (demo.value === 0){
            if (mainCube.rot !== 0) {
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
        }else{
                if (mainCube.rot !== 0) {
                    var workObj = altObj.clone();
                    var angle = tarObj.rotAngle * tarObj.step;
                    UTILS.rotateAroundWorldAxis(workObj, cntr, angle);// * (rotateYawСCW ? -1 : 1) );
                    tarObj.rotation.copy(workObj.rotation);
                    tarObj.step += 0.1;
                    if (tarObj.step > 1) {
                        mainCube.rot = 0;
                        UTILS.normChildren(mainCube);
                    }
                }else{
                    this.nextStep();
                }
        }
    };
    this.nextStep = function(){
        if (demo.value > script1.length){
            demo.value=0;
            mainCube.rot=0;
        }else{
            var code=script1[demo.value-1];
            this.processCode(code);
            demo.value+=1;
        }
    };
    this.processCode = function(c){
        if (c === "U"){
            this.pressMoveUp(-1);
        }
        if (c === "D"){
            this.pressMoveDown(1);
        }
        if (c === "F"){
            this.pressMoveFront(1);
        }
        if (c === "B"){
            this.pressMoveBack(-1);
        }
        if (c === "R"){
            this.pressMoveRight(1);
        }
        if (c === "L"){
            this.pressMoveLeft(-1);
        }
    };
    
    this.render2 = function() {
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
    this.pressSpace = function(){
        if (demo.value === 0) {
            demo.value = 1;
        }
    };
    
    this.rotate = function(flag){
        var angl = Math.PI / 2.0 * (flag <0 ? -1 : 1);
        tarObj = mainCube;
        altObj = mainCube.clone();
        newObj = mainCube.clone();
        tarObj.rotAngle = angl;
        tarObj.step = 0;
        mainCube.rot = 1;//Math.PI/2.0 * (rotateYawСCW ? -1 : 1);
        cntr = mainCube.position.clone();
    };
    this.pressRotateLR = function(flag) {
        this.rotate(flag);
        newObj.applyMatrix(new THREE.Matrix4().makeRotationZ(tarObj.rotAngle));
//        this.normCubeAxis(newObj);
        cntr.z += 1;
    };

    this.pressRotateFB = function(flag) {
        this.rotate(flag);
        newObj.applyMatrix(new THREE.Matrix4().makeRotationX(tarObj.rotAngle));
//        this.normCubeAxis(newObj);
        cntr.x += 1;
    };
    this.move = function(basePoint,flag){
        var angl = Math.PI / 2.0 * (flag <0 ? -1 : 1);
        mainCube.rot = 1;
        var nearObj = UTILS.findNearCube(basePoint, mainCube);
        tarObj = nearObj;
        tarObj.rotAngle = angl;
        tarObj.step = 0;
        altObj = nearObj.clone();
        newObj = nearObj.clone();
        cntr.addSelf(mainCube.position);
        mainCube.worldToLocal(cntr);
        UTILS.rotateAroundWorldAxis(newObj, cntr, angl);
        UTILS.rebaseFront(mainCube, nearObj);
    };
    
    this.pressMoveFront = function(flag) {
            cntr = new THREE.Vector3(0, 0, 1);
            this.move(basePointFront,flag);
    };
    this.pressMoveBack = function(flag) {
            cntr = new THREE.Vector3(0, 0, 1);
            this.move(basePointBack,flag);
    };
    this.pressMoveRight = function(flag) {
            cntr = new THREE.Vector3(1, 0, 0);
            this.move(basePointRight,flag);
    };
    this.pressMoveLeft = function(flag) {
            cntr = new THREE.Vector3(1, 0, 0);
            this.move(basePointLeft,flag);
    };
    this.pressMoveUp = function(flag) {
            cntr = new THREE.Vector3(0, 1, 0);
            this.move(basePointUp,flag);
    };
    this.pressMoveDown = function(flag) {
            cntr = new THREE.Vector3(0, 1, 0);
            this.move(basePointDown,flag);
    };
};
//                UTILS.rotateAroundWorldAxis(main.workObj,cntr,Math.PI/2);// * (rotateYawСCW ? -1 : 1) );      
