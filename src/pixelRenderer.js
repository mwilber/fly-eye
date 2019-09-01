export class PixelRenderer {
    constructor(){
        this.canvas = document.createElement('canvas');
        this.canvas.width = 17;
        this.canvas.height = 17;
        
        this.ctx = this.canvas.getContext('2d');

        document.body.appendChild( this.canvas );
    }

    // Reduce the source image to a low res canvas
    DrawMap(){
        let img = document.getElementById('refimg');
        //canvas.getContext('2d').drawImage(img, -17, 0, 17, 17);
        let video = document.querySelector('video');
        this.ctx.save(); // Save the current state
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(video, -17, 0, 17, 17);
        this.ctx.restore();
    }

    GetPixelData(){
        return this.ctx.getImageData(0, 0, 17, 17).data;
    }
}