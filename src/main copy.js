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

navigator.getUserMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);


var scene, camera, renderer, sphereGeometry, sphere, pixelMap, canvas;
const FASCETS = 8;

init();
animate();
// FUNCTIONS 		
function init() 
{
    document.getElementById('camstart').addEventListener('click', (evt)=>{
        
        navigator.mediaDevices.enumerateDevices().then((deviceInfos)=>{
            for (let i = 0; i !== deviceInfos.length; ++i) {
                const deviceInfo = deviceInfos[i];
                const option = document.createElement('option');
                option.value = deviceInfo.deviceId;
                if (deviceInfo.kind === 'videoinput') {
                    let tmpBtn = document.createElement('button');
                    tmpBtn.innerHTML = deviceInfo.label || `camera ${videoSelect.length + 1}`;
                    tmpBtn.addEventListener('click',function(dinfo){
                        return function(e){
                        console.log('camming', dinfo);
                        navigator.getUserMedia(
                            {
                                video: {
                                    deviceId: {
                                        exact: dinfo.deviceId
                                    }
                                }, 
                                facingMode: { 
                                    exact: 'environment'
                                }
                            },
                            (stream)=>{
                                //stream
                                console.log('initting video stream');
                                //document.querySelector('video').src = window.URL.createObjectURL(stream);
                                document.querySelector('video').srcObject = stream;
                            },
                            (e)=>{
                                //no stream
                                console.log('no vid stream', e);
                            });
                        }
                    }(deviceInfo));
                    document.getElementById('cambuttons').appendChild(tmpBtn);
                  //option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
                  //videoSelect.appendChild(option);
                } else {
                  console.log('Some other kind of source/device: ', deviceInfo);
                }
            }
        }).catch((e)=>{
            //no stream
            console.log('no camera ', e);
        });
    });

    //document.querySelector('video').src = '/assets/images/1_intro_anim.mp4';
    

	

	
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
    // sphereGeometry.faces[ facetIdx ].color.setRGB(255,255,255);
    drawSphere();
    sphere.geometry.colorsNeedUpdate = true;
}
function render() 
{
	renderer.render( scene, camera );
}