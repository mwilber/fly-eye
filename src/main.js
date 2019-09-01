/**
 * Application entry point
 */

/**
 * Import PWA helper files
 * 
 * These file are optional. app-shell.css will not be packed into the js bundle and is linked 
 * separately in index.html. Use for initial styling to be displayed as JavaScripts load. serviceWorkerRegistration 
 * contains registration code for service-worker.js For more information on service workers and Progressive Web Apps 
 * check out the GreenZeta 10 minute PWA example at https://github.com/mwilber/gz-10-minute-pwa
 */ 
import '../app-shell.css';
//import './serviceWorkerRegistration';

// Load application styles
import '../styles/main.scss';

import * as THREE from 'three';
import { PixelRenderer } from './pixelRenderer';
import { Sphereize } from './sphereize';

navigator.getUserMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

const FASCETS = 8;

let pixelRenderer = new PixelRenderer();

pixelRenderer.DrawMap();

// Reorder the pixels into a spiral to map around the sphere
let pixelMap = Sphereize.SpiralMap(17);
//console.log(pixelMap);

let pixelData = pixelRenderer.GetPixelData();
console.log(pixelData);

let sphereizedData = Sphereize.SphereMap(pixelMap, pixelData, FASCETS);
console.log(sphereizedData);


let scene, camera, renderer, sphereGeometry, sphere;

init();
animate();

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( 512, 512 );
    document.body.appendChild( renderer.domElement );

    // this material causes a mesh to use colors assigned to faces
	var faceColorMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors, side: THREE.DoubleSide } );
    
    //sphereGeometry = new THREE.SphereGeometry( 80, 16, 24 );
    sphereGeometry = new THREE.SphereGeometry( 80, 16, 8, 0, 2 * Math.PI, 0, Math.PI / 2 );
    //console.log('size', sphereGeometry.faces.length);
    
    sphere = new THREE.Mesh( sphereGeometry, faceColorMaterial );

    var geo = new THREE.EdgesGeometry( sphere.geometry ); // or WireframeGeometry
    var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 4 } );
    var wireframe = new THREE.LineSegments( geo, mat );
    sphere.add( wireframe );

    sphere.position.set(0, 0, 0);
    sphere.rotateX(-90*(Math.PI/180));
    sphere.rotateY(146.25*(Math.PI/180));
    scene.add(sphere);

    camera.position.z = 100;
}

function drawSphere(){

    for ( var i = 0; i < sphereGeometry.faces.length; i++ ) 
    {
        let face = sphereGeometry.faces[ (i) ];
        if(sphereizedData[i]){
            face.color.setRGB( sphereizedData[i][0], sphereizedData[i][1], sphereizedData[i][2] );
        }
    }
}

function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}
function update()
{
    drawSphere();
    sphere.geometry.colorsNeedUpdate = true;
}
function render() 
{
	renderer.render( scene, camera );
}
