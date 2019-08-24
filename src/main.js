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


var scene, camera, renderer, sphereGeometry, sphere;
const FASCETS = 8;

init();
animate();
// FUNCTIONS 		
function init() 
{

    var img = document.getElementById('refimg');
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    canvas.getContext('2d').save(); // Save the current state
    canvas.getContext('2d').scale(-1, 1);
    canvas.getContext('2d').drawImage(img, -17, 0, 17, 17);
    canvas.getContext('2d').restore();

    var pixelData = canvas.getContext('2d').getImageData(0, 0, 17, 17).data;
    //console.log(pixelData);

    var pixelMap = spiralMap(17);
    //console.log(pixelMap);
    var sphereizedData = sphereMap(pixelMap, pixelData);
    //console.log(sphereizedData);

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
    for ( var i = 0; i < sphereGeometry.faces.length; i++ ) 
    {
        let face = sphereGeometry.faces[ (i) ];
        if(sphereizedData[i]){
            face.color.setRGB( sphereizedData[i][0], sphereizedData[i][1], sphereizedData[i][2] );
        }
    }
    sphere = new THREE.Mesh( sphereGeometry, faceColorMaterial );

    var geo = new THREE.EdgesGeometry( sphere.geometry ); // or WireframeGeometry
    var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
    var wireframe = new THREE.LineSegments( geo, mat );
    sphere.add( wireframe );

    sphere.position.set(0, 0, 0);
    sphere.rotateX(-90*(Math.PI/180));
    sphere.rotateY(146.25*(Math.PI/180));
    scene.add(sphere);

    camera.position.z = 100;

	
}

function sphereMap(pixelMap, pixelData){

    let result = [];

    let spiralMark = 0;
    let spiralIteration = 1;
    let spiralLength = FASCETS;
    let spiralScale = 0;
    let scaleStep = 0;
    let currentIterationCt = 0;
    for ( var i = 0; i < pixelMap.length; i++ ) 
    {
        
        if( i >= spiralMark+spiralLength){
            spiralMark = i;
            currentIterationCt = 0;
            spiralIteration++;
            spiralLength = spiralIteration * FASCETS;
            spiralScale = spiralLength / (FASCETS*2);
            scaleStep = spiralScale;
            //console.log('spiral', spiralIteration, spiralLength, spiralScale, i);
        }

        currentIterationCt++;
        //console.log('spiral', currentIterationCt, spiralIteration, spiralLength, spiralScale, i);

        let r1 = (pixelData[(((pixelMap[i]-1)*4)+0)]/255);
        let r2 = (pixelData[(((pixelMap[i+1]-1)*4)+0)]/255);
        let g1 = (pixelData[(((pixelMap[i]-1)*4)+1)]/255);
        let g2 = (pixelData[(((pixelMap[i+1]-1)*4)+1)]/255);
        let b1 = (pixelData[(((pixelMap[i]-1)*4)+2)]/255);
        let b2 = (pixelData[(((pixelMap[i+1]-1)*4)+2)]/255);

        let averageColor = [
            (r1+r2)/2,
            (g1+g2)/2,
            (b1+b2)/2
        ];

        // Double up on the color because there are 2 fascets per face
        result.push(averageColor);
        result.push(averageColor);

        // Leave the first 2 iterations alone for now
        if( i >= (FASCETS*3) ){
            if(spiralScale%1 > 0){
                scaleStep -= Math.floor(spiralScale);
                if(scaleStep <= 0){ 
                    scaleStep = spiralScale;
                    i+=1;
                }
            }
            i+=Math.floor(spiralScale-1);
        }
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
    
}
function render() 
{
	renderer.render( scene, camera );
}