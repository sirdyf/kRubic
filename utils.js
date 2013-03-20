var UTILS = UTILS || {REVISION: '0.1'};

UTILS.numericCube = function(base) {
    for (var i in base.children) {
        var obj = base.children[i];
        var pos = obj.position.clone();
        
        obj.cubIndex = this.getIndex(pos);//obj.z + 1 + (obj.y + 1) * 3 + (obj.x + 1) * 9;
        obj.x = pos.x;
        obj.y = pos.y;
        obj.z = pos.z;
        console.log(obj.z, obj.y, obj.x, obj.cubIndex);
    }
};
UTILS.getIndex = function(v){//нормирует исходный вектор!
        v.x = this.getIndexValue(v.x);
        v.y = this.getIndexValue(v.y);
        v.z = this.getIndexValue(v.z);
    return (v.z + 1 + (v.y + 1) * 3 + (v.x + 1) * 9);
};
UTILS.getIndexValue = function(value) {
    var val = value;
    if (val > 0.01)
        val = 1;
    if (val < -0.01)
        val = -1;
    return val;
};
//UTILS.createBox = function(scale,model){
////    var mat = new THREE.MeshLambertMaterial({color: 0x11ffff, shading: THREE.FlatShading, overdraw: true});
////THREE.CubeGeometry = function ( width, height, depth, widthSegments, heightSegments, depthSegments ) {
//    var cub = model.clone();//new THREE.Mesh(new THREE.CubeGeometry(scale,scale,scale,1,1,1), mat);
//    cub.matrixAutoUpdate = true;
////    cub.updateMatrix();
////    cub.name = "cube";
//    return cub;
//};
UTILS.vRotationInNull = function(v, step) {
    v.x = this.sSub(v.x, step);
    v.y = this.sSub(v.y, step);
    v.z = this.sSub(v.z, step);
};
UTILS.sSub = function(value, delta) {
    var x = Math.abs(delta), sum = value;
    if (value > 0) {
        sum -= x;
    } else {
        sum += x;
    }
    if (Math.abs(sum) <= delta) {
        sum = 0;
    }
    return sum;
};

UTILS.sAdd = function(value, delta) {
    var x = delta, sum = value;
    if (value > 0) {
        sum += x;
    } else {
        sum -= x;
    }
    return sum;
};
UTILS.aLerp = function(a, b, alpha) {
    a.x += (b.x - a.x) * alpha;
    a.y += (b.y - a.y) * alpha;
//    a.z += ( b.z - a.z ) * alpha;
    a.z = UTILS.conv(a.z, b.z, alpha);
};
UTILS.conv = function(x, y, z) {
//        var one=Math.PI/180.0;
//        if (Math.abs(y)<one) y=2*Math.PI-one;
    if (x < 0) {
        x = Math.PI - x;
    }
    if (y < 0) {
        y = Math.PI - y;

    }
    x += (y - x) * z;
    if (x > Math.PI) {
        x = -(2 * Math.PI - x);
    }
    return x;
};

UTILS.cloneBox = function(base, vx2, vy2, vz2) {
    var cub2 = this.orignCube.clone(); // || this.createBox(3);
    var vec = new THREE.Vector3(vx2, vy2, vz2);
    cub2.position.copy(vec);
//    console.log(cub2.x,cub2.y,cub2.z);
    base.add(cub2);
};
UTILS.doubleBox = function(base, vx, vy, vz) {
    this.cloneBox(base, vx, vy, vz);
    this.cloneBox(base, -vx, -vy, -vz);
};
UTILS.createPerimetr = function(tarCub, scale) {
    var v = tarCub.position.clone();
    var sc = scale;//*1.1;
    this.cloneBox(tarCub, sc, 0, 0);
    this.cloneBox(tarCub, -sc, 0, 0);
    this.cloneBox(tarCub, 0, sc, 0);
    this.cloneBox(tarCub, 0, -sc, 0);
    this.cloneBox(tarCub, sc, sc, 0);
    this.cloneBox(tarCub, sc, -sc, 0);
    this.cloneBox(tarCub, -sc, sc, 0);
    this.cloneBox(tarCub, -sc, -sc, 0);
};
UTILS.findChildByIndex = function(base, num) {
    for (var i in base.children) {
        if (base.children[i].name === "cub") {
            if (base.children[i].cubIndex === num) {
                return base.children[i];
            }
        }
    }
    return null;//undefined
};

UTILS.createCubik = function(base, scale) {
    this.orignCube = base.clone();//this.createBox(scale,base);
    this.orignCube.name = "cub";
    var sc = scale;//*1.1;
    this.doubleBox(base, sc, 0, 0);
    this.doubleBox(base, 0, sc, 0);
    this.doubleBox(base, 0, 0, sc);

    this.doubleBox(base, sc, sc, 0);
    this.doubleBox(base, -sc, sc, 0);

    this.createPerimetr(base.children[4 + base.defaultChildren], scale);
    this.createPerimetr(base.children[5 + base.defaultChildren], scale);

//    var frontCube=UTILS.findChildByIndex(base,12);// z=-1 0 0 --> 0 + 1*3 + 1*9 
//    if (frontCube !== null){
//        this.createPerimetr(frontCube,scale);
//    }

    this.normChildren(base);
};
UTILS.rotateAroundWorldAxis = function(object, axis, radians) {
    var rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationAxis(axis.normalize(), radians);

    rotationMatrix.multiply(object.matrix);                       // pre-multiply
    object.matrix = rotationMatrix;
    object.rotation.setEulerFromRotationMatrix(object.matrix);
//    object.matrixmultiply( rotationMatrix ); // post-multiply
//    object.rotation.setEulerFromRotationMatrix(object.matrix);//, object.order);    
};
UTILS.findNearCube = function(basePos, mainCube) {// !!!!!!!!!!
    var children = mainCube.children;
    // нужно вызывать после normChildren, чтобы небыло вложенностей 2 и более уровней
    for (var ind = 0; ind < children.length; ind++) {
        if (children[ind].name === "cub") {
            break;
        }
    }
    if (ind === children.length)
        return 0;

    var vChild = children[ind].position.clone();
    var vPos = mainCube.localToWorld(vChild);
    var l = basePos.distanceTo(vPos);
    var o = children[ind];
    for (var i = 0; i < children.length; i++) {
        if (children[ind].name !== "cub")
            continue;
        vChild = children[i].position.clone();
        vChild = mainCube.localToWorld(vChild);
        var len = basePos.distanceTo(vChild);
        if (len < l) {
            l = len;
            o = children[i];
        }
    }
    return o;
};
UTILS.rebaseFront = function(base, target) {
    // нужно вызывать после normChildren, чтобы небыло вложенностей 2 и более уровней
    var vBase = base.localToWorld(target.position.clone());
    for (var i = base.children.length - 1; i > -1; i--) {
        if (base.children[i].name !== "cub")
            continue;
        if (target !== base.children[i]) {
            var vChild = base.localToWorld(base.children[i].position.clone());
            var angl = vBase.dot(vChild);
            if (angl > 0.9) { //??????
                var child = base.children[i];
                target.updateMatrix();
                var matrixInverse = new THREE.Matrix4();
                matrixInverse.getInverse(target.matrix);
                child.updateMatrix();
                child.applyMatrix(matrixInverse);
                base.remove(child);
                target.add(child);
            }
        }
    }
};
UTILS.updateChildrenMatrix = function(base) {
    base.updateMatrix();
    base.updateMatrixWorld();
    for (var i in base.children) {
//        base.children[i].updateMatrix();
        if (base.children[i].name === "cub") {
            base.children[i].updateMatrixWorld();
        }
    }

};
UTILS.normChildren = function(base) {
//    var main=base;
    for (var i in base.children) {
        if (base.children[i].name === "cub") {
            base.children[i].updateMatrix();
            this.findChildren(base.children[i]);//,main);
        }
    }
};


UTILS.findChildren = function(base) {//,root){
    var main = base.parent;
    if (base.children.length === 0)
        return;
    var vBasePos = base.position.clone();
//    var mBaseRot=new THREE.Matrix4().extractRotation(base.matrix);//.setRotationFromEuler(base.rotation);
    for (var i = base.children.length - 1; i > -1; i--) {
        UTILS.findChildren(base.children[i]);//,main);
//        if (base !== root){
        var child = base.children[i];
//            var vChild=base.children[i].position.clone();
        if (base.children[i].name === "cub") {

//                child.position.addSelf(vBasePos);

//                var mChildRot=new THREE.Matrix4().extractRotation(child.matrix);//.setRotationFromEuler(child.rotation);
//                var mRes=mChildRotmultiply(mBaseRot);
//                child.rotation.setEulerFromRotationMatrix( mRes );
            if (main) {

                main.updateMatrix();//World();
                var matrixInverse = new THREE.Matrix4();
                matrixInverse.getInverse(base.matrix);

                child.updateMatrix();
                child.updateMatrixWorld();
                child.applyMatrix(base.matrix);
                child.updateMatrix();
                child.updateMatrixWorld();

//                    base.remove(child);
                main.add(child);
            }
        }
//        }
    };
    
//    base.children.length=0;
};
UTILS.rndint = function(min, max) {
    max = max || 1;
    min = min || 0;
    UTILS.seed = UTILS.seed || 2013;
    UTILS.seed = (UTILS.seed * 9301 + 49297) % 233280;
    var _rnd = UTILS.seed / 233280;
 
    return Math.round(min + _rnd * (max - min));
};
UTILS.generateName = function(num){
    var glSpaceName = "allexegezacebisousesarmaindirea?eratenberalavetiedorquanteisrion";
    //"al le xe ge za ce bi so us es ar ma in di re a? er at en be ra la ve ti ed or qu an te is ri on";
    var name="";
    var tmp ="";
    UTILS.seed=num || 1979;
    for(var i=0;i<3;i++){
        var rnd= UTILS.rndint(0,31)*2;//Math.round(Math.random()*31)*2;
        tmp += rnd+" ";
        name += glSpaceName.charAt(rnd);
        if (rnd === 30) continue;
        name += glSpaceName.charAt(rnd+1);
    }
    rnd= UTILS.rndint(0,31);//Math.round(Math.random()*31);
        tmp += rnd+" ";
    if (rnd<10){
            name += glSpaceName.charAt(rnd*2)+glSpaceName.charAt(rnd*2+1);
    }
    name = name.charAt(0).toUpperCase()+name.slice(1);
    console.log(tmp,name);
    return name;
};
//UTILS.saveCubicToTemp = function(base){
//    this.tmpCube = base.clone();
//    for (var i in base.children){
//        this.tmpCube
//    }
//};

//UTILS.rotateAroundWorldAxis2 = function(object, axis, radians) {
//    var rotationMatrix = new THREE.Matrix4();
//    rotationMatrix.makeRotationAxis( axis.normalize(), radians );
//    rotationMatrixmultiply( object.matrix );                       // pre-multiply
//    object.matrix = rotationMatrix;
//    object.rotation.setEulerFromRotationMatrix( object.matrix );
//};
