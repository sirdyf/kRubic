var    UTILS = UTILS || { REVISION: '0.1' };

UTILS.createBox = function(scale){
    var mat = new THREE.MeshLambertMaterial({color: 0x11ffff, shading: THREE.FlatShading, overdraw: true});
//THREE.CubeGeometry = function ( width, height, depth, widthSegments, heightSegments, depthSegments ) {
    var cub = new THREE.Mesh(new THREE.CubeGeometry(scale,scale,scale,1,1,1), mat);
//    cub.updateMatrix();
//    cub.name = "cube";
    return cub;
};
UTILS.sAdd = function(value,delta){
    var x=delta,sum=value;
    if (value>0){
        sum+=x;
    }else{
        sum-=x;
    }
    return sum;
};
UTILS.aLerp = function(a,b,alpha){
    a.x += ( b.x - a.x ) * alpha;
    a.y += ( b.y - a.y ) * alpha;
//    a.z += ( b.z - a.z ) * alpha;
    a.z=UTILS.conv(a.z,b.z,alpha);
};
UTILS.conv = function(x,y,z){
//        var one=Math.PI/180.0;
//        if (Math.abs(y)<one) y=2*Math.PI-one;
    if (x<0) {
        x = Math.PI - x;
    }
    if (y<0) {
        y = Math.PI - y;

    }
    x += (y - x) * z;
    if (x>Math.PI) {
        x = -(2* Math.PI - x);
    }
    return x;
};

UTILS.cloneBox = function(base,vx2,vy2,vz2){
    var cub2=this.cube.clone(); // || this.createBox(3);
    var vec=new THREE.Vector3(vx2,vy2,vz2);
    cub2.position.copy(vec);
    base.add(cub2);
};
UTILS.doubleBox = function(base,vx,vy,vz){
    this.cloneBox(base,vx,vy,vz);
    this.cloneBox(base,-vx,-vy,-vz);
};
UTILS.createPerimetr = function(tarCub,scale){
    var v=tarCub.position.clone();
    var sc=scale*1.1;
    this.cloneBox(tarCub,sc,0,0);
    this.cloneBox(tarCub,-sc,0,0);
    this.cloneBox(tarCub,0,sc,0);
    this.cloneBox(tarCub,0,-sc,0);
    this.cloneBox(tarCub,sc,sc,0);
    this.cloneBox(tarCub,sc,-sc,0);
    this.cloneBox(tarCub,-sc,sc,0);
    this.cloneBox(tarCub,-sc,-sc,0);
};

UTILS.createCubik = function(base,scale){
    this.cube=this.createBox(scale);
    var sc=scale*1.1;
    this.doubleBox(base,sc,0,0);
    this.doubleBox(base,0,sc,0);
    this.doubleBox(base,0,0,sc);

    this.doubleBox(base,sc,sc,0);
    this.doubleBox(base,-sc,sc,0);

    this.createPerimetr(base.children[4],scale);
    this.createPerimetr(base.children[5],scale);
    
    this.normChildren(base);
};
UTILS.rotateAroundWorldAxis = function(object, axis, radians) {
    var rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationAxis( axis.normalize(), radians );
    
    rotationMatrix.multiplySelf( object.matrix );                       // pre-multiply
    object.matrix = rotationMatrix;
    object.rotation.setEulerFromRotationMatrix( object.matrix );
//    object.matrix.multiplySelf( rotationMatrix ); // post-multiply
//    object.rotation.setEulerFromRotationMatrix(object.matrix);//, object.order);    
};
UTILS.findNearCube = function(base,children){
    var l=base.position.distanceTo(children[0].position);
    var o=children[0];
    for(var i=0;i<children.length;i++){
        var len=base.position.distanceTo(children[i].position);
        if (len<l){
            l=len;
            o=children[i];
        }
    }
    return o;
};
UTILS.normChildren = function(base){
    var main=base;
    for(var i in base.children){
        this.findChildren(base.children[i],main);
    }
};
UTILS.findChildren = function(base,root){
    var main=root;
    if (base.children.length===0) return;
    var vBase=base.position.clone();
    for(var i in base.children){
        UTILS.findChildren(base.children[i],main);
        if (base !== root){
            var child=base.children[i].clone();
//            var vChild=base.children[i].position.clone();
            child.position.subSelf(vBase);
            main.add(child);
        }
    };
    base.children.length=0;
};

//UTILS.rotateAroundWorldAxis2 = function(object, axis, radians) {
//    var rotationMatrix = new THREE.Matrix4();
//    rotationMatrix.makeRotationAxis( axis.normalize(), radians );
//    rotationMatrix.multiplySelf( object.matrix );                       // pre-multiply
//    object.matrix = rotationMatrix;
//    object.rotation.setEulerFromRotationMatrix( object.matrix );
//};
