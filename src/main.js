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


/*
	Three.js "tutorials by example"
	Author: Lee Stemkoski
	Date: July 2013 (three.js v59dev)
*/
// MAIN
// standard global variables
var container, scene, camera, renderer, controls, stats, sphereGeometry, sphere;
var clock = new THREE.Clock();
// custom global variables
var targetList = [];
var projector, mouse = { x: 0, y: 0 };
init();
animate();
// FUNCTIONS 		
function init() 
{
	scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // this material causes a mesh to use colors assigned to faces
	var faceColorMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } );
    
    sphereGeometry = new THREE.SphereGeometry( 80, 32, 16 );
    console.log('size', sphereGeometry.faces.length);
    for ( var i = 0; i < sphereGeometry.faces.length; i++ ) 
    {
        let face = sphereGeometry.faces[ i ];
        if( i > sphereGeometry.faces.length * 0.666){
            face.color.setRGB( 0, 0, 0.8 * Math.random() + 0.2 );
        }else if( i > sphereGeometry.faces.length * 0.5){
            face.color.setRGB( 0, 0.8 * Math.random() + 0.2, 0 );
        }else{
            face.color.setRGB( 0.8 * Math.random() + 0.2, 0, 0 );
        }
    }
    sphere = new THREE.Mesh( sphereGeometry, faceColorMaterial );
    sphere.position.set(0, 50, 0);
    scene.add(sphere);

    camera.position.z = 200;

	
}

function toString(v) { return "[ " + v.x + ", " + v.y + ", " + v.z + " ]"; }
function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}
function update()
{
    // let facetIdx = Math.floor(Math.random()*sphereGeometry.faces.length);
    // console.log('updating', facetIdx );
    // sphereGeometry.faces[ facetIdx ].color.setRGB(255,255,255);
    // sphere = new THREE.Mesh( sphereGeometry, faceColorMaterial );
}
function render() 
{
	renderer.render( scene, camera );
}