export class CameraHelper{
    constructor(options){ }

    CreateCameraList(targetElement){
        navigator.mediaDevices.enumerateDevices().then((deviceInfos)=>{
            for (let i = 0; i !== deviceInfos.length; ++i) {
                const deviceInfo = deviceInfos[i];
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
                    targetElement.appendChild(tmpBtn);
                } else {
                console.log('Some other kind of source/device: ', deviceInfo);
                }
            }
        }).catch((e)=>{
            //no stream
            console.log('no camera ', e);
        });
    }

    GetCameraFeed(){

    }
}