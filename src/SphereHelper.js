export class SphereHelper {

    static SpiralMap(dimension){

        let result = [];
    
        const idxRef = this.GenerateMatrix(dimension);
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

    static GenerateMatrix(dimension){
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

    static SphereMap(pixelMap, pixelData, FASCETS){

        let result = [];
    
        let spiralMark = 0;
        let spiralIteration = 1;
        let spiralLength = FASCETS;
        let spiralScale = 0;
        let scaleStep = 0;
        let currentIterationCt = 0;
        let testCt = 0;
        for ( var i = 0; i < pixelMap.length; i++ ) 
        //for ( var i = 0; i < 223; i++ ) 
        {
            if( i >= (spiralMark+spiralLength)){
                testCt = 1;
                spiralMark = i;
                currentIterationCt = 1;
                spiralIteration++;
                spiralLength = spiralIteration * FASCETS;
                spiralScale = spiralLength / (FASCETS*4);
                //spiralScale = (spiralLength - (FASCETS*4))/spiralLength;
                //spiralScale = .25;
                scaleStep = 1;
                console.log('----------------------------------------');
                console.log('spiral', spiralIteration, spiralLength, spiralScale, i);
            }
    
            currentIterationCt++;
            //console.log('spiral', currentIterationCt, spiralIteration, spiralLength, spiralScale, i);
            //console.log('getting location', (pixelMap[i]-1));
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

            // averageColor = [
            //     r1,
            //     g1,
            //     b1
            // ];
            //console.log('color', averageColor);
    
            // Double up on the color because there are 2 fascets per face
            result.push(averageColor);
            result.push(averageColor);
    
            // Leave the first 2 iterations alone for now
            if( spiralIteration < 3){
                result.push(averageColor);
                result.push(averageColor);
            }else if(spiralIteration == 3){
                if(i==24 || (i+1)%8 == 0){
                    console.log('add one to row 3', i);
                    result.push(averageColor);
                    result.push(averageColor);
                    result.push(averageColor);
                    result.push(averageColor);
                }
            }
            
            if( spiralIteration > 4 ){    
                console.log('checking ', i, testCt, scaleStep, (spiralScale % 1).toFixed(2) == 0.75, (testCt % 4) == 0);
                testCt++;
            //}else{
                //console.log('butter zone')
                if(spiralScale%1 > 0){
                    //console.log('scaleStep', scaleStep)
                    //scaleStep = scaleStep.toPrecision(2) - spiralScale;
                    //scaleStep -= Math.floor(spiralScale);
                    //scaleStep -= spiralScale-1;
                    scaleStep -= (spiralScale % 1).toFixed(2)
                    if(scaleStep <= 0){ 
                        console.log('fast forward 1');
                        scaleStep = 1;
                        i+=1;
                    }
                    if((spiralScale % 1).toFixed(2) == 0.75 && (testCt % 4) == 0){
                        console.log('fast forward 1b');
                        i+=1;
                    }
                } 
                i+=Math.floor(spiralScale-1);
                //console.log('fast forward', Math.floor(spiralScale-1));
                //i+=Math.floor(spiralScale-1);
            }
        }
        //console.log('sphereMap', result);
        return result;
    }
}