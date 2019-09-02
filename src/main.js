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

import { PixelRenderer } from './PixelRenderer';
import { SphereHelper } from './SphereHelper';
import { ThreeRenderer } from './ThreeRenderer';
import { CameraHelper } from './CameraHelper';

navigator.getUserMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

const FASCETS = 8;
let elemImg = document.getElementById('refimg');
let elemVideo = document.querySelector('video');

let cameraHelper = new CameraHelper({initButton: document.getElementById('camstart')});
let threeRenderer = new ThreeRenderer();
let pixelRenderer = new PixelRenderer({srcElement: elemImg, resolution: 17});
let pixelMap = SphereHelper.SpiralMap(17);
//console.log(pixelMap);
animate();

function animate(){
    requestAnimationFrame( animate );
	threeRenderer.render();
    pixelRenderer.DrawMap();
    let pixelData = pixelRenderer.GetPixelData();
    //console.log(pixelData);
    let sphereColorData = SphereHelper.SphereMap(pixelMap, pixelData, FASCETS);
    //console.log(SphereHelperdData);
    threeRenderer.update(sphereColorData);
}
