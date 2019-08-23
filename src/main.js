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

    var img = document.getElementById('refimg');
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

    var pixelData = canvas.getContext('2d').getImageData(0, 0, img.width, img.height).data;
    //console.log(pixelData);

    var pixelMap = spiralMap(7);
    console.log(pixelMap);
    var sphereizedData = sphereMap(pixelMap, pixelData);

	scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // this material causes a mesh to use colors assigned to faces
	var faceColorMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } );
    
    sphereGeometry = new THREE.SphereGeometry( 80, 8, 8 );
    //console.log('size', sphereGeometry.faces.length);
    for ( var i = 0; i < sphereizedData.length; i++ ) 
    {
        let face = sphereGeometry.faces[ i ];
        face.color.setRGB( sphereizedData[i][0], sphereizedData[i][1], sphereizedData[i][2] );
        //console.log('setting color',(pixelData[((i*4)+0)]/255),(pixelData[((i*4)+1)]/255),(pixelData[((i*4)+2)]/255))
        //face.color.setRGB( pixelData[((i*4)+0)], pixelData[((i*4)+1)], pixelData[((i*4)+2)] );
        //face.color.setRGB( (pixelData[(((pixelMap[i]-1)*4)+0)]/255),(pixelData[(((pixelMap[i]-1)*4)+1)]/255),(pixelData[(((pixelMap[i]-1)*4)+2)]/255) );
        // if( i > sphereGeometry.faces.length * 0.666){
        //     face.color.setRGB( 0, 0, 0.8 * Math.random() + 0.2 );
        // }else if( i > sphereGeometry.faces.length * 0.5){
        //     face.color.setRGB( 0, 0.8 * Math.random() + 0.2, 0 );
        // }else{
        //     face.color.setRGB( 0.8 * Math.random() + 0.2, 0, 0 );
        // }
    }
    sphere = new THREE.Mesh( sphereGeometry, faceColorMaterial );
    sphere.position.set(0, 50, 0);
    sphere.rotateX(100*(Math.PI/180));
    scene.add(sphere);

    camera.position.z = 200;

	
}

function sphereMap(pixelMap, pixelData){

    let result = [];
    for ( var i = 0; i < pixelMap.length; i++ ) 
    {
        result.push([(pixelData[(((pixelMap[i]-1)*4)+0)]/255),(pixelData[(((pixelMap[i]-1)*4)+1)]/255),(pixelData[(((pixelMap[i]-1)*4)+2)]/255)])

    }
    return result;
}

function spiralMap(dimension){

    let result = [];

    const idxRef = generateMatrix(dimension);
    let top = 0;
    let bottom = idxRef.length - 1;
    let left = 0;
    let right = idxRef[0].length - 1;
    let dir = 1;

    while (top <= bottom && left <= right) {
        if (dir == 1) {    // left-right
            for (let i = left; i <= right; ++i) {
                //console.log(idxRef[top][i] + " ");
                result.unshift(idxRef[top][i]);
            }
 
            ++top;
            dir = 2;
        } else if (dir == 2) {     // top-bottom
            for (let i = top; i <= bottom; ++i) {
                //console.log(idxRef[i][right] + " ");
                result.unshift(idxRef[i][right]);
            }
 
            --right;
            dir = 3;
        } else if (dir == 3) {     // right-left
            for (let i = right; i >= left; --i) {
                //console.log(idxRef[bottom][i] + " ");
                result.unshift(idxRef[bottom][i]);
            }
 
            --bottom;
            dir = 4;
        } else if (dir == 4) {     // bottom-up
            for (let i = bottom; i >= top; --i) {
                //console.log(idxRef[i][left] + " ");
                result.unshift(idxRef[i][left]);
            }
 
            ++left;
            dir = 1;
        }
    }

    //TODO: This only works for a 7x7 grid. Need a way to handle removing the center of a bigger grid
    if(result%2 !== 0) result = result.splice(1);

    return result;
}

function generateMatrix(dimension){
    let result = [];

    // Create the matrix
    for(let idx=0; idx<dimension; idx++){
        let row = [];
        for(let jdx=0; jdx<dimension; jdx++){
            row.push((jdx+1)+(idx*dimension));
        }
        result.push(row);
    }
    return result;
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
    // // console.log('updating', facetIdx );
    // sphereGeometry.faces[ facetIdx ].color.setRGB(255,255,255);
    // sphere.geometry.colorsNeedUpdate = true;
}
function render() 
{
	renderer.render( scene, camera );
}