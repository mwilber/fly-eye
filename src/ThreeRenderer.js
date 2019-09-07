import * as THREE from 'three';

export class ThreeRenderer{
    constructor(options){
        let canvasSize = document.documentElement.clientWidth;
        if( document.documentElement.clientWidth > document.documentElement.clientHeight ) canvasSize = document.documentElement.clientHeight;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 45, 1, 0.1, 1000 );
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.domElement.id = 'threeref';
        this.renderer.setSize(canvasSize, canvasSize);
        document.getElementById(options.nodeId).appendChild( this.renderer.domElement );

        // this material causes a mesh to use colors assigned to faces
        let faceColorMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors, side: THREE.DoubleSide } );
        this.sphereGeometry = new THREE.SphereGeometry( 80, 32, 15, 0, 2 * Math.PI, 0, Math.PI / 2 );
        this.sphere = new THREE.Mesh( this.sphereGeometry, faceColorMaterial );
        
        let geo = new THREE.EdgesGeometry( this.sphere.geometry ); // or WireframeGeometry
        let mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 4 } );
        let wireframe = new THREE.LineSegments( geo, mat );
        this.sphere.add( wireframe );

        this.sphere.position.set(0, 0, 0);
        this.sphere.rotateX(-90*(Math.PI/180));
        this.sphere.rotateY(138*(Math.PI/180));
        this.scene.add(this.sphere);

        this.camera.position.z = 200;

        //document.querySelector('video').src = '/assets/images/1_intro_anim.mp4';
    }

    update(sphereizedData){
        for ( var i = 0; i < this.sphereGeometry.faces.length; i++ ) 
        {
            let face = this.sphereGeometry.faces[ (i) ];
            if(sphereizedData[i]){
                face.color.setRGB( sphereizedData[i][0], sphereizedData[i][1], sphereizedData[i][2] );
            }
        }
        this.sphere.geometry.colorsNeedUpdate = true;
    }

    render(){
        this.renderer.render( this.scene, this.camera );
    }
}