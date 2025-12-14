export function check_stroke_direction(dx:number, dy:number) {
        let tolerance = 10; // tolerance in degress
        // console.log("X:", startX, finalX, "Y: ", startY, finalY)
        // console.log("dx: ", dx, "dy: ", dy)
        
        let yFlat = Math.atan(dx/dy) * (180 / Math.PI);
        let xFlat = Math.atan(dy/dx) * (180 / Math.PI);
        console.log(xFlat, yFlat)
        
        if (-1*tolerance <= yFlat && yFlat <= tolerance) { 
            if (dy > 0) {return 90} // up
            else {return 270} // down
        }
        if (-1*tolerance <= xFlat && xFlat <= tolerance) {
            if (dx > 0) {return 0} // up
            else {return 180} // down
        }
        if (dy > 0) {
            if (dx > 0) { return 45} // diagonal up-right
            else { return 135} // diagonal up-left
        }
        else {
            if (dx > 0) { return 315} // diagonal down-right
            else { return 225} // diagonal down-left
        }
    }