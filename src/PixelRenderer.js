export class PixelRenderer {
    constructor(options){

        this.srcElement = options.srcElement || false;
        this.res = options.resolution || 0;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.res;
        this.canvas.height = this.res;
        
        this.ctx = this.canvas.getContext('2d');

        document.body.appendChild( this.canvas );
    }

    // Reduce the source image to a low res canvas
    DrawMap(){
        if(this.srcElement){
            this.ctx.save(); // Save the current state
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(this.srcElement, -this.res, 0, this.res, this.res);
            this.ctx.restore();
        }
    }

    GetPixelData(){
        return this.ctx.getImageData(0, 0, this.res, this.res).data;
    }
}