/* 
 * autor: DYF
 */
var CUBIC = CUBIC || {revision: "v0.1.7"};
 
CUBIC.init = function() {
    var cSTATE = {NONE: -1, ROTATE: 0, WAIT: 1};
    var state = cSTATE.NONE;
    var mousePos = new THREE.Vector3();
    
    var originCube = new THREE.Object3D();
    var mainCube = new THREE.Object3D();
    
    var newObj = 0;
    var altObj = 0;
    var tarObj = 0;
    var cntr = 0;
    
    var baseScale = 15;
    var basePointCurrent = 0;
    var basePoints = [
        new THREE.Vector3(0, 0, -1),//basePointFront
        new THREE.Vector3(0, 0, 1),//basePointBack
        new THREE.Vector3(-1, 0, 0),//basePointRight
        new THREE.Vector3(1, 0, 0),//basePointLeft
        new THREE.Vector3(0, -1, 0),//basePointDown
        new THREE.Vector3(0, 1, 0)//basePointUp
    ];
    var materials = [];
    
    var demo = [];
    
    var mNameRight = 0;
    var mNameLeft = 0;
    var mNameDown = 0;
    var mNameFront = 0;
    var mNameUp = 0;
    var mNameBack = 0;

    var nullCube = 0;
    var nullFace = 0;
    //      _________        _________
    //     /        /|      |\        \   
    //    /   16   / |      | \   16   \  
    //   /________/  |      |  \________\
    //  |24 15  6| 4 |      | 4 | 8 17 26|
    //22|21 12  3|  /        \  | 5 14 23|22
    //  |18  9  0| /          \ | 2 11 20|  
    //   -------- /            \ --------     
    //      10                      10        
    var oneStepNeed = [0, 6, 18, 24];
    var oneStepNumbers = [3, 9, 12, 15, 21, 4, 10, 16, 22];
    var oneStepAll = [0, 3, 6, 9, 12, 15, 18, 21, 24, 4, 10, 16, 22];

    var layerCenterCubes = [4, 10, 12, 14, 16, 22];
    var layerVertex = [0, 2, 6, 8, 18, 20, 24, 26];

    var layerDown = [0, 1, 2, 9, 10, 11, 18, 19, 20];
    var layerHorisontal = [3, 4, 5, 12, 13, 14, 21, 22, 23];
    var layerUp = [6, 7, 8, 15, 16, 17, 24, 25, 26];
    var layerRight = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    var layerVertical = [9, 10, 11, 12, 13, 14, 15, 16, 17];
    var layerLeft = [18, 19, 20, 21, 22, 23, 24, 25, 26];
    var layerFront = [0, 3, 6, 9, 12, 15, 18, 21, 24];
    var layerMFB = [1, 4, 7, 10, 13, 16, 19, 22, 25];
    var layerBack = [2, 5, 8, 11, 14, 17, 20, 23, 26];
    var layerX = [
        [3, 9, 15, 21], //front
        [1, 3, 5, 7], //right
        [7, 15, 17, 25], //top
        [19, 21, 23, 25], //left
        [1, 9, 11, 19], //bottom
        [5, 11, 17, 23]//back
    ];

    //var script1 = ["U","U","D","D","F","F","B","B","L","L","R","R"];//Шахматы второго порядка
    var script1 = ["L", "L", "R'", "F", "D", "D", "L'", "F'", "D", "U'", "B", "F'", "D", "R", "F", "F", "D'", "L", "R", "R"];//шахматы третьего порядка
    //var script1 = ["D'","B","B","F","F","U","U","L","L","R","R","U'","L'","B'","F","D","U'","L'","R","F","F","D","D","U","U","F'"];//шахматы шестого порядка
    //var script1 = ["U'","L","L","U","F'","R","R","F","U'","L","L","U","F'","R","R","F"];//кубик в кубе
    //var script1 = ["U","U","F","F","R","R","U'","L","L","D","B","R'","B","R'","B","R'","D'","L","L","U'"];//куб в кубе
    //var script1 = ["F","U","U","D'","L'","U'","D","F","F","U","D'","L'","U'","D","U'","F'"];//цветок
    //var script1 = ["B","B","L","L","R","R","D","B","B","F","F","L","L","R","R","D","D","U'","F","F","L'","D","U'","B","F'","D","D","U","U","L","R'","U'"];//Глобус

    (this.creates = function() {
        demo.value = 0;
        demo.bMode = false;
        mainCube.bRotation = false;
        nullCube = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1, 1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true}));
        nullFace = nullCube.clone();
        nullFace.scale = new THREE.Vector3(3, 3, 1);
        var objectAxis = new THREE.AxisHelper(4);
        var objectArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 1, 0), new THREE.Vector3(0, 0, 0), 3);
        nullCube.arrow = objectArrow;
        nullCube.add(objectArrow);
        nullCube.add(objectAxis);
//        scene.add(nullCube);
        scene.add(nullFace);
    })();

    this.computeFrontLayer = function() {
        var frontPosition = new THREE.Vector3(0, 0, -1);
        var frontIndex = UTILS.getIndex(frontPosition);
        if (layerCenterCubes[0] !== frontIndex) {
            console.warn("front cube index error!");
        }
    };

    this.computeLayers = function() {
        this.computeFrontLayer();
    };
    
    this.findCenterCubeFor = function(secondCube) {
        var centrCube = -1;
        var num1 = selCube1.cubIndex;
        var num2 = secondCube.cubIndex;
        if (!num1 || num1 < 0)
            return -1;
        if (!num2 || num2 < 0)
            return -1;

        var fl1 = false, fl2 = false;
        fl1 = this.checkInterval(num1, layerFront);
        fl2 = this.checkInterval(num2, layerFront);
        if (fl1 && fl2)
            centrCube = 12;
        fl1 = this.checkInterval(num1, layerBack);
        fl2 = this.checkInterval(num2, layerBack);
        if (fl1 && fl2)
            centrCube = 14;
        fl1 = this.checkInterval(num1, layerLeft);
        fl2 = this.checkInterval(num2, layerLeft);
        if (fl1 && fl2)
            centrCube = 22;
        fl1 = this.checkInterval(num1, layerRight);
        fl2 = this.checkInterval(num2, layerRight);
        if (fl1 && fl2)
            centrCube = 4;
        fl1 = this.checkInterval(num1, layerUp);
        fl2 = this.checkInterval(num2, layerUp);
        if (fl1 && fl2)
            centrCube = 16;
        fl1 = this.checkInterval(num1, layerDown);
        fl2 = this.checkInterval(num2, layerDown);
        if (fl1 && fl2)
            centrCube = 10;
        return centrCube;
    };

    this.pressSpace = function() {
        if (demo.bMode === false) {
            demo.bMode = true;
            mainCube.bRotation = true;
            demo.value = 1;
            this.nextStep();
//            this.selectStepOneCubes();
        }
    };
    
    this.showAvailablePositions = function() {
        var selCubePos = selCube1.position.clone();//.sub(mainCube.position);

        var numCube = UTILS.getIndex(selCubePos);
        if (numCube !== selCube1.cubIndex) {
            console.warn("cubic.showAvailablePositions: num cube error");
            return;
        }
        //проверки на попадание индекса в группу угловых или центральных кубиков
        if (this.checkInterval(numCube, layerVertex) === true) {
            //выбран угловой
            this.markCubes(layerVertex);
        }
        var lFace = this.checkIntervalX(numCube, layerX);
        if (lFace > -1) {
            //выбран центральный
            this.markCubes(layerX[1]);
        }
    };

    this.applyForAllCubes = function(fn) {
        for (var i in mainCube.children) {
            if (mainCube.children[i].name !== "cub")
                continue;
            fn.call(this);
        }
    };
    
    this.applyForCubesList = function(fn, cubesList) {
        for (var i in mainCube.children) {
            if (mainCube.children[i].name !== "cub")
                continue;
            var numCub = mainCube.children[i].cubIndex;
            var fl = this.checkInterval(numCub, cubesList);
            if (fl === true) {
                fn.call(this, numCub);
            }
        }
    };
    
    this.getChildAtNumer = function(num) {
        if (!num)
            return null;
        //добавить проверку на то, что аргумент - число
        for (var i in mainCube.children) {
            if (mainCube.children[i].name !== "cub")
                continue;
            if (mainCube.children[i].cubIndex === num)
                return mainCube.children[i];
        }
        return null;
    };

    this.markCubes = function(listCubes) {
        this.applyForCubesList(this.markCubeNum, listCubes);
    };
    
    this.markCubeNum = function(cub) {
        var cube = cub;
        if (isNaN(cub) === true) {
            var a = 0;
        } else {
            //поиск кубика
            cube = this.getChildAtNumer(cub);
        }
        if (cube === null)
            return;
        this.setWireframeMateialToCube(cube, true);
//                    INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
//                    INTERSECTED.material.emissive.setHex( 0xff0000 );
    };
    
    this.findRotateCenter = function(dir) {
        var arr = [];
        var _dir = scene.localToWorld(dir.clone());//как по-нормальному сделать???
        for (var i = 0; i < basePoints.length; i++) {
            arr.push(basePoints[i].clone().multiplyScalar(baseScale).sub(_dir).length());
        }
        var _min = Math.min.apply(null, arr);
        var _ind = arr.indexOf(_min);
        basePointCurrent = _ind;
        var cubNum = this.findNearCenterCube();
        return cubNum;
    };
    
    this.findNearCenterCube = function() {
        var arr = [];
        var arrNum = [];

        var vPos = basePoints[basePointCurrent].clone().multiplyScalar(baseScale);
        for (var i in mainCube.children) {
            if (mainCube.children[i].name !== "cub")
                continue;
            if (this.checkInterval(mainCube.children[i].cubIndex, layerCenterCubes) === true) {
                arrNum.push(mainCube.children[i].cubIndex);
                var vCubePos = mainCube.children[i].position.clone();
                vCubePos = scene.localToWorld(vCubePos);
                arr.push(vCubePos.sub(vPos).length());
            }
        }
        var _min = Math.min.apply(null, arr);
        var _ind = arr.indexOf(_min);
        var _num = arrNum[_ind];
        return _num;
    };
    
    this.computeScaleForCube = function(cub) {
        var sc = cub.position.clone();
        UTILS.getIndexValue(sc);
        if (sc.x === 0)
            sc.x = 3;
        if (sc.y === 0)
            sc.y = 3;
        if (sc.z === 0)
            sc.z = 3;
        return sc;
    };

    this.setNullCubePosition = function(obj) {

        if (state === cSTATE.NONE) {
//            nullCube.position.copy(obj.parent.position);
//            nullCube.cubIndex = obj.parent.cubIndex;
            var dir = obj.geometry.faces[0].normal.clone();
            if (Math.abs(dir.x+dir.y+dir.z) !== 1){
                return;//пропускаем фейсы под углом
            }
            var rotMatrix = new THREE.Matrix4();
            rotMatrix.setRotationFromEuler(obj.parent.rotation);
            dir.applyMatrix4(rotMatrix);
//            nullCube.arrow.setDirection(dir);
            var centerCubeNum = this.findRotateCenter(dir);
            var cub = this.getChildAtNumer(centerCubeNum);
            if (cub) {
                nullFace.position.copy(cub.position);
                nullFace.scale = this.computeScaleForCube(cub);
            }
        }
    };
    
    this.mouseMove = function(posX, posY) {
        if (state === cSTATE.WAIT) return;

        if (state === cSTATE.ROTATE) {
            var deltaX = (mousePos.x - posX) / 100.0;
            var deltaY = (mousePos.y - posY) / 100.0;
            var angle = deltaX;
//            if (Math.abs(deltaX)>Math.abs(deltaY)){
//                angle=deltaX;//windowHalfX/deltaX;
//            }else{
//                angle=deltaY;//windowHalfY/deltaY;
//            }
            if (angle > Math.PI / 2.0)
                angle = Math.PI / 2.0;
            if (angle < -Math.PI / 2.0)
                angle = -Math.PI / 2.0;

            tarObj.rotAngle = angle;
        }
    };

    this.leftButtonUp = function() {
        if (state !== cSTATE.ROTATE) return;
        var angle = tarObj.rotAngle;
        if (angle > 0) {
            tarObj.rotAngle = Math.PI / 2.0;
        } else {
            tarObj.rotAngle = -Math.PI / 2.0;
        }
        tarObj.step = angle / tarObj.rotAngle;
        newObj = altObj.clone();
        UTILS.rotateAroundWorldAxis(newObj, cntr, tarObj.rotAngle);
        mainCube.bRotation = true;
        state = cSTATE.WAIT;
    };
    
    this.leftButtonDown = function(posX, posY) {
        if (state === cSTATE.WAIT) return;
        state = cSTATE.ROTATE;

        mousePos.set(posX, posY);
        cntr = basePoints[basePointCurrent].clone();
        var vPos = basePoints[basePointCurrent].clone().multiplyScalar(baseScale);
        this.move(vPos, true);
        tarObj.rotAngle = 0;
        mainCube.bRotation = false;
    };

    this.clearAllLayers = function() {
        var flag = false;
        for (var i in mainCube.children) {
            if (mainCube.children[i].name !== "cub")
                continue;
            var ind = mainCube.children[i].cubIndex;

            flag = this.checkInterval(ind, layerRight);
            if (flag === true)
                this.setGreyMateial(mainCube.children[i], mNameLeft);

            flag = this.checkInterval(ind, layerVertical);
            if (flag === true) {
                this.setGreyMateial(mainCube.children[i], mNameLeft);
                this.setGreyMateial(mainCube.children[i], mNameRight);
            }
            flag = this.checkInterval(ind, layerLeft);
            if (flag === true)
                this.setGreyMateial(mainCube.children[i], mNameRight);

            flag = this.checkInterval(ind, layerDown);
            if (flag === true)
                this.setGreyMateial(mainCube.children[i], mNameUp);

            flag = this.checkInterval(ind, layerHorisontal);
            if (flag === true) {
                this.setGreyMateial(mainCube.children[i], mNameUp);
                this.setGreyMateial(mainCube.children[i], mNameDown);
            }
            flag = this.checkInterval(ind, layerUp);
            if (flag === true)
                this.setGreyMateial(mainCube.children[i], mNameDown);




            flag = this.checkInterval(ind, layerFront);
            if (flag === true)
                this.setGreyMateial(mainCube.children[i], mNameBack);

            flag = this.checkInterval(ind, layerMFB);
            if (flag === true) {
                this.setGreyMateial(mainCube.children[i], mNameFront);
                this.setGreyMateial(mainCube.children[i], mNameBack);
            }
            flag = this.checkInterval(ind, layerBack);
            if (flag === true)
                this.setGreyMateial(mainCube.children[i], mNameFront);
        }
    };

    this.setGreyMateial = function(cub, mName) {
        for (var ii in cub.children) {
            if (cub.children[ii].material.name === mName) {
                cub.children[ii].material = materials.grey;
                cub.children[ii].material.needsUpdate = true;
            }
        }
    };
    
    this.getMainObj = function() {
        return mainCube;
    };

    this.getMainCubeChildrenCount = function() {
        return mainCube.children.length - mainCube.defaultChildren;
    };

    this.getMaterialName = function(num) {
        if (num > materials.name.length - 1)
            return null;
        return materials.name[num];
    };

    this.getMaterialFromObj = function(object) {
        var tmpMat = [];
        materials.grey = new THREE.MeshBasicMaterial({color: 0x111111});//new THREE.MeshLambertMaterial({color: 0x111111, shading: THREE.FlatShading, overdraw: true}); 
        materials.one = new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true, side: THREE.DoubleSide});
        if (object.children.length === 0)
            return;
        for (var i in object.children) {
            var mName = object.children[i].material.name;

            if (mName === "FrontColor") {
                object.children[i].material.side = THREE.DoubleSide;
//                materials.one=object.children[i].material.clone();
            }
            tmpMat[mName] = true;
        }
        var k = 0;
        materials.name = [];
        for (var j in tmpMat) {
            materials.name[k] = j;
            k += 1;
        }
    };
    
    this.changeOpacityCube = function(cub, matNum, val) {
        var name = this.getMaterialName(matNum);
        for (var ii in cub.children) {
//            cub.children[ii].material["opacity"] = "1.0";
            if (cub.children[ii].material.name === name) {
                cub.children[ii].material.opacity = val;//"0.3"
                cub.children[ii].material.needsUpdate = true;
                break;//материалы у всех кубиков одни, достаточно найти первый подходящий материал
            }
        }
    };
    
    this.deleteFaces = function(cub) {
        for (var i = cub.children.length - 1; i > -1; i--) {
            var child = cub.children[i];
            var mName = child.material.name;
            var mNulName = this.getMaterialName(0);
            if (mName === mNulName)
                continue;//пропускаем периметр
            cub.remove(child);
        }
    };
    
    this.setWireframeToMaterial = function(cub, matNum, flag) {//один конкретный материал в режим wireframe
        var name = this.getMaterialName(matNum);
        for (var ii in cub.children) {
            if (cub.children[ii].material.name === name) {
                cub.children[ii].material.wireframe = flag;
                cub.children[ii].material.needsUpdate = true;
                break;//материалы у всех кубиков одни, достаточно найти первый подходящий материал
            }
        }
    };

    this.setWireframeMateialToCube = function(cub) {//все материалы у кубика в wireframe
        for (var ii in cub.children) {
            cub.children[ii].material = materials.one;
            cub.children[ii].material.needsUpdate = true;
        }
    };

    this.selectStepOneCubes = function() {
        for (var i in mainCube.children) {
            if (mainCube.children[i].name !== "cub")
                continue;
            var ind = mainCube.children[i].cubIndex;
            var flag = this.checkInterval(ind, oneStepNumbers);
            if (flag === false) {
//            if (mainCube.children[i].z !== -1){
//                this.changeWireframe(mainCube.children[i],true);
//                this.changeOpacityCube(mainCube.children[i],0,"0.3");
//                break;//материалы у всех кубиков одни, поэтому берём первый попавшийся куб
//                this.deleteFaces(mainCube.children[i]);
                this.setWireframeMateialToCube(mainCube.children[i]);
            }
        }
    };
    
    this.checkInterval = function(num, interval) {
        for (var i = 0; i < interval.length; i++) {
            if (num === interval[i]) {
                return true;
            }
        }
        return false;
    };
    
    this.checkIntervalX = function(num, intervalX) {
        if (this.checkInterval(num, intervalX[0]) === true)
            return 0;
        if (this.checkInterval(num, intervalX[1]) === true)
            return 1;
        if (this.checkInterval(num, intervalX[2]) === true)
            return 2;
        if (this.checkInterval(num, intervalX[3]) === true)
            return 3;
        if (this.checkInterval(num, intervalX[4]) === true)
            return 4;
        if (this.checkInterval(num, intervalX[5]) === true)
            return 5;
        return -1;
    };
    
    this.createModel = function(obj) {
        this.getMaterialFromObj(obj);
        originCube = obj.clone();
        mainCube = obj.clone();
        mainCube.defaultChildren = obj.children.length;
        mainCube.bRotation = false;
        UTILS.createCubik(mainCube, 1);
        UTILS.normChildren(mainCube);
        UTILS.numericCube(mainCube);

        mNameRight = this.getMaterialName(1);
        mNameLeft = this.getMaterialName(2);
        mNameDown = this.getMaterialName(3);
        mNameFront = this.getMaterialName(4);
        mNameUp = this.getMaterialName(5);
        mNameBack = this.getMaterialName(6);
        this.clearAllLayers();
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
            if (state === cSTATE.ROTATE){//поворот мышкой
                var workObj = altObj.clone();
                var angle = tarObj.rotAngle;
                UTILS.rotateAroundWorldAxis(workObj, cntr, angle);
                tarObj.rotation.copy(workObj.rotation);
                return;
            }
            if (mainCube.bRotation !== false) {
                var workObj = altObj.clone();
                var angle = tarObj.rotAngle * tarObj.step;
                UTILS.rotateAroundWorldAxis(workObj, cntr, angle);
                tarObj.rotation.copy(workObj.rotation);
                tarObj.step += 0.1;
                if (tarObj.step > 1) {
                    tarObj.rotation.copy(newObj.rotation);
                    UTILS.normChildren(mainCube);
                    if (demo.bMode === true){
                        this.nextStep();
                    }else{
                        mainCube.bRotation = false;
                        state = cSTATE.NONE;
                    }
                }
            }
    };
    
    this.nextStep = function() {
        if (demo.value > script1.length) {
            demo.bMode = false;
            mainCube.bRotation = false;
        } else {
            var code = script1[demo.value - 1];
            this.processCode(code);
            demo.value += 1;
        }
    };
    
    this.processCode = function(c) {
        if (c === "U") {
            this.pressMoveUp(-1);
            return;
        }
        if (c === "U'") {
            this.pressMoveUp(1);
            return;
        }
        if (c === "D") {
            this.pressMoveDown(1);
            return;
        }
        if (c === "D'") {
            this.pressMoveDown(-1);
            return;
        }
        if (c === "F") {
            this.pressMoveFront(1);
            return;
        }
        if (c === "F'") {
            this.pressMoveFront(-1);
            return;
        }
        if (c === "B") {
            this.pressMoveBack(-1);
            return;
        }
        if (c === "B'") {
            this.pressMoveBack(1);
            return;
        }
        if (c === "R") {
            this.pressMoveRight(1);
            return;
        }
        if (c === "R'") {
            this.pressMoveRight(-1);
            return;
        }
        if (c === "L") {
            this.pressMoveLeft(-1);
            return;
        }
        if (c === "L'") {
            this.pressMoveLeft(1);
            return;
        }
        console.log("Unknown command: ", c);
    };

    this.rotate = function(flag) {
        var angl = Math.PI / 2.0 * (flag < 0 ? -1 : 1);
        tarObj = mainCube;
        altObj = mainCube.clone();
        newObj = mainCube.clone();
        tarObj.rotAngle = angl;
        tarObj.step = 0;
        mainCube.bRotation = true;//Math.PI/2.0 * (rotateYawСCW ? -1 : 1);
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
    
    this.move = function(basePoint, flag) {
        var angl = Math.PI / 2.0 * (flag < 0 ? -1 : 1);
        mainCube.bRotation = true;
        var nearObj = UTILS.findNearCube(basePoint, mainCube);
        tarObj = nearObj;
        tarObj.rotAngle = angl;
        tarObj.step = 0;
        altObj = nearObj.clone();
        newObj = nearObj.clone();
        cntr.add(mainCube.position);
        mainCube.worldToLocal(cntr);
        UTILS.rotateAroundWorldAxis(newObj, cntr, angl);
        UTILS.rebaseFront(mainCube, nearObj);
    };
    
    this.pressMoves = function(ind,flag){
        var vec=basePoints[ind].clone().multiplyScalar(baseScale);
        this.move(vec, flag);
    };
    
    this.pressMoveFront = function(flag) {
        cntr = new THREE.Vector3(0, 0, 1);
        this.pressMoves(0,flag);
    };
    this.pressMoveBack = function(flag) {
        cntr = new THREE.Vector3(0, 0, 1);
        this.pressMoves(1,flag);
    };
    this.pressMoveRight = function(flag) {
        cntr = new THREE.Vector3(1, 0, 0);
        this.pressMoves(2,flag);
    };
    this.pressMoveLeft = function(flag) {
        cntr = new THREE.Vector3(1, 0, 0);
        this.pressMoves(3,flag);
    };
    this.pressMoveUp = function(flag) {
        cntr = new THREE.Vector3(0, 1, 0);
        this.pressMoves(5,flag);
    };
    this.pressMoveDown = function(flag) {
        cntr = new THREE.Vector3(0, 1, 0);
        this.pressMoves(4,flag);
    };
    
    this.getBoundingBox = function(obj) {
        var box = new THREE.Box3();//this.geometry.boundingBox.clone();
        obj.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.geometry.computeBoundingBox();
                var childbox = child.geometry.boundingBox.clone();
                childbox.translate(child.localToWorld(new THREE.Vector3()));
                box.union(childbox);
            }
        });
        return box;
    };
//    this.render2 = function() {
//        if (specialMode !== 0) {
//            var vsPos = mainCube.position.clone();
//            var bEnd = false;
//            for (var i in  mainCube.children) {
//                if (mainCube.children[i].name !== "cub")
//                    continue;
//                if (specialMode === 1) {
//                    var sRad = -0.05;
//                    var vsDelta = new THREE.Vector3(0, 0, 0);
//                    mainCube.children[i].worldToLocal(vsDelta);
//                    if (mainCube.children[i].position.lengthSq() < 4.0) {//distanceTo(vsPos)<2.0){
//                        mainCube.children[i].translate(sRad, vsDelta);
//                        bEnd = true;
//                    }
//                }
//                if (specialMode === 2) {
//                    var vRotChild = mainCube.children[i].rotation;
//                    var lenRotChild = vRotChild.lengthSq();
//                    if (lenRotChild > 0) {
//                        UTILS.vRotationInNull(vRotChild, 0.09);
//                        bEnd = true;
//                    }
//                }
//                if (specialMode === 3) {
//                    var sRad = 0.05;
//                    var vsDelta = new THREE.Vector3(0, 0, 0);
//                    mainCube.children[i].worldToLocal(vsDelta);
////                if ( mainCube.children[i].position.distanceTo(vsPos)> tmpObj.children[i].position.distanceTo(vsPos)){
//                    if (mainCube.children[i].position.lengthSq() > tmpObj.children[i].position.lengthSq()) {
//                        mainCube.children[i].translate(sRad, vsDelta);
//                        bEnd = true;
//                    }
//                }
//            }
//            if (bEnd === false) {
//                specialMode += 1;
//                if (specialMode === 4) {
//                    specialMode = 0;
//                    tmpObj = 0;
//                    //NORMALIZE CUBE!!
//                }
//            }
//        } else {
//        }
//    };    
};