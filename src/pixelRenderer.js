export class PixelRenderer {
    constructor(){
        this.canvas = document.createElement('canvas');
        this.canvas.width = 17;
        this.canvas.height = 17;

        document.body.appendChild( this.canvas );
    }

    // Reduce the source image to a low res canvas
    DrawMap(){
        let img = document.getElementById('refimg');
        //canvas.getContext('2d').drawImage(img, -17, 0, 17, 17);
        //let video = document.querySelector('video');
    
        this.canvas.getContext('2d').save(); // Save the current state
        this.canvas.getContext('2d').scale(-1, 1);
        this.canvas.getContext('2d').drawImage(img, -17, 0, 17, 17);
        this.canvas.getContext('2d').restore();
    }

    GetPixelData(){
        return this.canvas.getContext('2d').getImageData(0, 0, 17, 17).data;
    }
}