var    UTILS = UTILS || { REVISION: '0.1' };
UTILS.numericCube = function(base){
    for (var i in base.children){
        var obj=base.children[i];
        var pos=obj.position.clone();
        obj.x = this.getIndexValue(pos.x);
        obj.y = this.getIndexValue(pos.y);
        obj.z = this.getIndexValue(pos.z);
        obj.cubIndex = obj.z+1 + (obj.y+1) * 3 + (obj.x+1) * 9;
        console.log(obj.z,obj.y,obj.x,obj.cubIndex);
    }
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
UTILS.getIndexValue = function(value){
    var val=value;
    if (val > 0) val = 1;
    if (val < 0) val =-1;
    return val;
};

UTILS.cloneBox = function(base,vx2,vy2,vz2){
    var cub2=this.orignCube.clone(); // || this.createBox(3);
    var vec=new THREE.Vector3(vx2,vy2,vz2);
    cub2.position.copy(vec);
//    console.log(cub2.x,cub2.y,cub2.z);
    base.add(cub2);
};
UTILS.doubleBox = function(base,vx,vy,vz){
    this.cloneBox(base,vx,vy,vz);
    this.cloneBox(base,-vx,-vy,-vz);
};
UTILS.createPerimetr = function(tarCub,scale){
    var v=tarCub.position.clone();
    var sc=scale;//*1.1;
    this.cloneBox(tarCub,sc,0,0);
    this.cloneBox(tarCub,-sc,0,0);
    this.cloneBox(tarCub,0,sc,0);
    this.cloneBox(tarCub,0,-sc,0);
    this.cloneBox(tarCub,sc,sc,0);
    this.cloneBox(tarCub,sc,-sc,0);
    this.cloneBox(tarCub,-sc,sc,0);
    this.cloneBox(tarCub,-sc,-sc,0);
};
UTILS.findChildByIndex = function(base,num){
    for(var i in base.children){
        if (base.children[i].name === "cub"){
            if (base.children[i].cubIndex === num){
                return base.children[i];
            }
        }
    }
    return null;//undefined
};

UTILS.createCubik = function(base,scale){
    this.orignCube=base.clone();//this.createBox(scale,base);
    this.orignCube.name="cub";
    var sc=scale;//*1.1;
    this.doubleBox(base,sc,0,0);
    this.doubleBox(base,0,sc,0);
    this.doubleBox(base,0,0,sc);

    this.doubleBox(base,sc,sc,0);
    this.doubleBox(base,-sc,sc,0);

    this.createPerimetr(base.children[4+base.defaultChildren],scale);
    this.createPerimetr(base.children[5+base.defaultChildren],scale);

//    var frontCube=UTILS.findChildByIndex(base,12);// z=-1 0 0 --> 0 + 1*3 + 1*9 
//    if (frontCube !== null){
//        this.createPerimetr(frontCube,scale);
//    }
    
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
UTILS.findNearCube = function(base,children){// !!!!!!!!!!
    // нужно вызывать после normChildren, чтобы небыло вложенностей 2 и более уровней
    for( var ind=0;ind<children.length;ind++){
        if (children[ind].name === "cub"){
            break;
        }
    }
    if (ind===children.length) return 0;
    
    var vChild=children[ind].position.clone();
    var vPos=scene.mainCube.localToWorld(vChild);
    var l=base.position.distanceTo(vPos);
    var o=children[ind];
    for(var i=0;i<children.length;i++){
        vChild=children[i].position.clone();
        vChild=scene.mainCube.localToWorld(vChild);
        var len=base.position.distanceTo(vChild);
        if (len<l){
            l=len;
            o=children[i];
        }
    }
    return o;
};
UTILS.rebaseFront = function(base,target){
    // нужно вызывать после normChildren, чтобы небыло вложенностей 2 и более уровней
//    var deltaBase=scene.basePoint.position.clone().subSelf(base.position);
    var vBase=scene.mainCube.localToWorld(target.position.clone());
    for(var i=base.children.length-1; i>-1; i--){
        if (target !== base.children[i]){
            if (base.children[i].name === "cub"){
                var vChild=scene.mainCube.localToWorld(base.children[i].position.clone());
                var angl=vBase.dot(vChild);
                if (angl>9.0){ //??????
                    var child=base.children[i];
                    child.position.subSelf(target.position);
                    target.add(child);
                }
            }
        }
    }
};
UTILS.updateChildrenMatrix = function(base){
    base.updateMatrix();
    base.updateMatrixWorld();
    for(var i in base.children){
//        base.children[i].updateMatrix();
        if (base.children[i].name === "cub"){
                base.children[i].updateMatrixWorld();
        }
    }
    
};
UTILS.normChildren = function(base){
    var main=base;
    for(var i in base.children){
        if (base.children[i].name === "cub"){
            base.children[i].updateMatrix();
            this.findChildren(base.children[i],main);
        }
    }
};


UTILS.findChildren = function(base,root){
    var main=root;
    if (base.children.length===0) return;
    var vBase=base.position.clone();
    for(var i=base.children.length-1; i>-1; i--){
        UTILS.findChildren(base.children[i],main);
        if (base !== root){
            var child=base.children[i];
//            var vChild=base.children[i].position.clone();
            if (base.children[i].name === "cub"){

                child.position.addSelf(vBase);
                main.add(child);
    //            base.remove(base.children[i]);
            }
        }
    };
//    base.children.length=0;
};

//UTILS.rotateAroundWorldAxis2 = function(object, axis, radians) {
//    var rotationMatrix = new THREE.Matrix4();
//    rotationMatrix.makeRotationAxis( axis.normalize(), radians );
//    rotationMatrix.multiplySelf( object.matrix );                       // pre-multiply
//    object.matrix = rotationMatrix;
//    object.rotation.setEulerFromRotationMatrix( object.matrix );
//};
