export class CameraHelper{
    constructor(options){ }

    StartCameraFeed(deviceInfo){
        console.log('camming', deviceInfo);
        navigator.getUserMedia({
            video: {
                deviceId: {
                    exact: deviceInfo.deviceId
                }
            }, 
            facingMode: { 
                exact: 'environment'
            }
        },
        (stream)=>{
            //stream
            console.log('initting video stream');
            document.querySelector('video').srcObject = stream;
        },
        (e)=>{
            //no stream
            console.log('no vid stream', e);
        });
    }

    CreateCameraList(targetElement){
        return new Promise((resolve, reject)=>{
            navigator.mediaDevices.enumerateDevices().then((deviceInfos)=>{

                // deviceInfos = [
                //     { 
                //         kind: 'videoinput',
                //         label: 'FaceTime HD Camera (Built-in)',
                //         id: 'csO9c0YpAf274OuCPUA53CNE0YHlIr2yXCi+SqfBZZ8='
                //     },
                //     { 
                //         kind: 'audioinput',
                //         label: 'default (Built-in Microphone)',
                //         id: 'RKxXByjnabbADGQNNZqLVLdmXlS0YkETYCIbg+XxnvM='
                //     }
                // ]

                let camList = [];
                for (let i = 0; i !== deviceInfos.length; ++i) {
                    const deviceInfo = deviceInfos[i];
                    if (deviceInfo.kind === 'videoinput') {
                        camList.push({...deviceInfos[i]})
                    } else {
                        //console.log('Some other kind of source/device: ', deviceInfo);
                    }
                }
                resolve(camList);
            }).catch((e)=>{
                //no stream
                console.log('no camera ', e);
                reject(e);
            });
        });
    }

}