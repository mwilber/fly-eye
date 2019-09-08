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
import './serviceWorkerRegistration';

// Load application styles
import '../styles/main.scss';

import './getUserMedia-polyfill';

import { PixelRenderer } from './PixelRenderer';
import { SphereHelper } from './SphereHelper';
import { ThreeRenderer } from './ThreeRenderer';
import { CameraHelper } from './CameraHelper';

const FASCETS = 8;
const RESOLUTION = 33;
let elemImg = document.getElementById('refimg');
let elemVideo = document.querySelector('video');

let cameraHelper = new CameraHelper();
let threeRenderer = new ThreeRenderer({nodeId: 'ThreeJS'});
let pixelRenderer = new PixelRenderer({nodeId: 'ThreeJS', srcElement: elemImg, resolution: RESOLUTION});
let pixelMap = SphereHelper.SpiralMap(RESOLUTION);
//console.log(pixelMap);

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

function openeye(deviceInfo){
    cameraHelper.StartCameraFeed(deviceInfo);
    document.body.classList.remove('mode-list');
    document.body.classList.add('mode-eye');
}

document.getElementById('camstart').addEventListener('click', (event)=>{
    let camListing = document.querySelector('.camlist .listing');

    camListing.innerHTML = '<li>No cameras found.</li>';

    cameraHelper.CreateCameraList().then((response)=>{
        if(response.length === 1){
            openeye(response[0]);
            return;
        }else if(response.length > 0){
            while (camListing.firstChild) {
                camListing.removeChild(camListing.firstChild);
            }
            
            for (const [idx, deviceInfo] of response.entries()) {
                let tmpBtn = document.createElement('a');
                tmpBtn.classList.add('button');
                tmpBtn.innerHTML = deviceInfo.label || `camera ${idx}`;
                tmpBtn.addEventListener('click',function(deviceInfo){
                    return function(){
                        openeye(deviceInfo);
                    };
                }(deviceInfo));
                let tmpLi = document.createElement('li');
                camListing.appendChild(tmpLi);
                tmpLi.appendChild(tmpBtn);
            }
            
        }
        document.body.classList.add('mode-list');
    }).catch((err)=>{
        document.body.classList.add('mode-list');
        console.log('error getting camera', err);
    });
});

document.addEventListener("DOMContentLoaded", (event)=>{ 
    pixelRenderer.SetImageSource(elemVideo);
    animate();
});

document.querySelector('.fly-eye .close').addEventListener('click', (event)=>{
    var track = cameraHelper.stream.getTracks()[0];  // if only one media track
    track.stop();
    document.body.classList.remove('mode-eye');
});

document.querySelector('.camlist .close').addEventListener('click', (event)=>{
    document.body.classList.remove('mode-list');
});
