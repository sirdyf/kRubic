var    UTILS = UTILS || { REVISION: '0.1' };

UTILS.createBox = function(scale){
    var mat = new THREE.MeshLambertMaterial({color: 0x11ffff, shading: THREE.FlatShading, overdraw: true});
//THREE.CubeGeometry = function ( width, height, depth, widthSegments, heightSegments, depthSegments ) {
    var cub = new THREE.Mesh(new THREE.CubeGeometry(scale,scale,scale,1,1,1), mat);
//    cub.updateMatrix();
//    cub.name = "cube";
    return cub;
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
UTILS.createCrest = function(base,scale){
    this.cube=this.createBox(scale);
    this.doubleBox(base,scale*1.1,0,0);
    this.doubleBox(base,0,scale*1.1,0);
    this.doubleBox(base,0,0,scale*1.1);
};