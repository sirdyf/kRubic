  /* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var CUBIC = CUBIC || {revision: "ver 1.0"};

CUBIC.init = function() {
//    var workObj = 0;
    var newObj = 0;
    var altObj = 0;
    var tarObj = 0;
    var specialMode = 0;
    var cntr = 0;
    var originCube = new THREE.Object3D();
//    var nullCube = new THREE.Mesh(new THREE.CubeGeometry(1,1,1,1,1,1), 
//        new THREE.MeshLambertMaterial({color: 0x11ffff, shading: THREE.FlatShading, overdraw: true}));
    var mainCube = new THREE.Object3D();
    var basePointFront = new THREE.Vector3(0, 0, -15);
    var basePointBack = new THREE.Vector3(0, 0, 15);
    var basePointRight = new THREE.Vector3(-15, 0, 0);
    var basePointLeft = new THREE.Vector3(15, 0, 0);
    var basePointDown = new THREE.Vector3(0, -15, 0);
    var basePointUp = new THREE.Vector3(0, 15, 0);
    var materials = [];
    var oneStepNumbers = [0,3,6,9,12,15,18,21,24,4,10,16,22];
    // U = d,up,a
    //var script1 = ["U","U","D","D","F","F","B","B","L","L","R","R"];//Шахматы второго порядка
    var script1 = ["L","L","R'","F","D","D","L'","F'","D","U'","B","F'","D","R","F","F","D'","L","R","R"];//шахматы третьего порядка
    //var script1 = ["D'","B","B","F","F","U","U","L","L","R","R","U'","L'","B'","F","D","U'","L'","R","F","F","D","D","U","U","F'"];//шахматы шестого порядка
    //var script1 = ["U'","L","L","U","F'","R","R","F","U'","L","L","U","F'","R","R","F"];//кубик в кубе
    //var script1 = ["U","U","F","F","R","R","U'","L","L","D","B","R'","B","R'","B","R'","D'","L","L","U'"];//куб в кубе
    //var script1 = ["F","U","U","D'","L'","U'","D","F","F","U","D'","L'","U'","D","U'","F'"];//цветок
    //var script1 = ["B","B","L","L","R","R","D","B","B","F","F","L","L","R","R","D","D","U'","F","F","L'","D","U'","B","F'","D","D","U","U","L","R'","U'"];//Глобус
    mainCube.rot = 0;
    var demo = [];
    demo.value =0 ;

    this.getMainObj = function() {
        return mainCube;
    };

    this.getMainCubeChildren = function() {
        return mainCube.children.length - mainCube.defaultChildren;
    };
    
    this.getMaterialName = function(num){
        if (num > materials.name.length-1) return null;
        return materials.name[num];
    };
    
//    this.changeOpacity = function(materialNum,value){
//        for(var i in mainCube.children){
//            if (mainCube.children[i].name !== "cub") continue;
//            this.changeOpacityCube(mainCube.children[i],materialNum,value);
//            break;//материалы у всех кубиков одни, поэтому берём первый попавшийся куб
//        }
//    };
    
    this.getMaterialFromObj = function(object){
        var tmpMat = [];
//        var materials_ = [
//            new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.2 } ),
//            new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, side: THREE.DoubleSide } ),
//            new THREE.MeshBasicMaterial( { color: 0xff0000, blending: THREE.AdditiveBlending, side: THREE.DoubleSide } ),
//            new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, side: THREE.DoubleSide, overdraw: true } ),
//            new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.SmoothShading, overdraw: true } ),
//            new THREE.MeshDepthMaterial( { overdraw: true } ),
//            new THREE.MeshNormalMaterial( { overdraw: true } ),
//            new THREE.MeshNormalMaterial( { shading: THREE.SmoothShading, overdraw: true } )
//            new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/land_ocean_ice_cloud_2048.jpg' ) } ),
//            new THREE.MeshBasicMaterial( { envMap: THREE.ImageUtils.loadTexture( 'textures/envmap.png', new THREE.SphericalReflectionMapping() ) } )
//    ];
        
        materials.one = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, side: THREE.DoubleSide } );
        if (object.children.length === 0) return;
        for(var i in object.children){
            var mName=object.children[i].material.name;
                    
            if (mName === "FrontColor"){
                object.children[i].material.side = THREE.DoubleSide;
//                materials.one=object.children[i].material.clone();
            }
            tmpMat[mName]=true;
        }
        var k=0;
        materials.name = [];
        for (var j in tmpMat){
            materials.name[k] = j;
            k+=1;
        }
    };
    this.changeOpacityCube = function(cub,matNum,val){
        var name = this.getMaterialName(matNum);
        for(var ii in cub.children){
//            cub.children[ii].material["opacity"] = "1.0";
            if (cub.children[ii].material.name === name){
                cub.children[ii].material.opacity = val;//"0.3"
                cub.children[ii].material.needsUpdate=true;
                break;//материалы у всех кубиков одни, достаточно найти первый подходящий материал
            }
        }
    };   
    this.changeWireframe = function(cub,flag){
        for(var ii in cub.children){
            cub.children[ii].material.wireframe = flag;
            cub.children[ii].material.needsUpdate=true;
        }
    };
    this.deleteFaces = function(cub){
        for(var i=cub.children.length-1;i>-1;i--){
            var child=cub.children[i];
            var mName=child.material.name;
            var mNulName=this.getMaterialName(0);
            if (mName === mNulName) continue;//пропускаем периметр
            cub.remove(child);
        }
    };
    
    this.setSpecialMateial = function(cub){
        for(var ii in cub.children){
            cub.children[ii].material = materials.one;
            cub.children[ii].material.needsUpdate=true;
        }
    };
    
    this.selectStepOneCubes = function(){
        for(var i in mainCube.children){
            if (mainCube.children[i].name !== "cub") continue;
            var ind=mainCube.children[i].cubIndex;
            var flag=this.checkInterval(ind,oneStepNumbers);
            if (flag === false){
//            if (mainCube.children[i].z !== -1){
//                this.changeWireframe(mainCube.children[i],true);
//                this.changeOpacityCube(mainCube.children[i],0,"0.3");
//                break;//материалы у всех кубиков одни, поэтому берём первый попавшийся куб
//                this.deleteFaces(mainCube.children[i]);
                this.setSpecialMateial(mainCube.children[i]);
            }
        }
    };
    this.checkInterval = function(num,interval){
        for (var i=0;i<interval.length;i++){
            if (num === interval[i]){
                return true;
            }
        }
        return false;
    };
    
    this.pressSpace = function(){
        if (demo.value === 0) {
            demo.value = 1;
            this.selectStepOneCubes();
        }
    };    
    this.createModel = function(obj) {
        this.getMaterialFromObj(obj);
        originCube=obj.clone();
//        nullCube = new THREE.
        mainCube = obj.clone();
//        this.materials1 = mainCube.children[0].material;
//        this.materials1.opacity = 0.1;
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
            this.pressMoveUp(-1);return;
        }
        if (c === "U'"){
            this.pressMoveUp(1);return;
        }
        if (c === "D"){
            this.pressMoveDown(1);return;
        }
        if (c === "D'"){
            this.pressMoveDown(-1);return;
        }
        if (c === "F"){
            this.pressMoveFront(1);return;
        }
        if (c === "F'"){
            this.pressMoveFront(-1);return;
        }
        if (c === "B"){
            this.pressMoveBack(-1);return;
        }
        if (c === "B'"){
            this.pressMoveBack(1);return;
        }
        if (c === "R"){
            this.pressMoveRight(1);return;
        }
        if (c === "R'"){
            this.pressMoveRight(-1);return;
        }
        if (c === "L"){
            this.pressMoveLeft(-1);return;
        }
        if (c === "L'"){
            this.pressMoveLeft(1);return;
        }
        console.log("Unknown command: ",c);
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
