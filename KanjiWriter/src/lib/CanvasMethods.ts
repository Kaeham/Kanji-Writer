import { SVGPathData, type SVGCommand } from 'svg-pathdata'

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

export function parse_svg_line(unicode:string, svg_path: string):[number, number][] {
    /**
     * Function to parse a svg command and sample points along said path
     */
    let bezierCurves:number[][] = []
    let points:[number, number][] = []
    let pathResolution:number = 100;

    let sv = new SVGPathData(svg_path)
    sv.scale(3, 3)
    sv.encode();
    let commands = sv.commands
    
    const moveTo = commands.at(0);
    let cx = moveTo?.type === SVGPathData.MOVE_TO ? moveTo.x : 0;
    let cy = moveTo?.type === SVGPathData.MOVE_TO ? moveTo.y : 0;
    const [endX, endY] = [4, 5];
    commands.forEach((cmd:SVGCommand) => {
        if (cmd.type === SVGPathData.CURVE_TO ) {
            const currentCurve = parse_bezier(cmd, cx, cy)
            cx = currentCurve[endX]
            cy = currentCurve[endY]
            bezierCurves.push(currentCurve)}})
    bezierCurves.forEach((bezier:number[]) => {
        for (let i=0; i <= pathResolution; i++) {
            const [x1, y1, x2, y2, x, y] = bezier;
            const t = i / pathResolution;
            const point = cubicBezierPoint(t, cx, cy, x1, y1, x2, y2, x, y);
            points.push(point)
        }
    })
    return points
}
export function draw(ctx:CanvasRenderingContext2D, x1:number, x2:number, y1:number, y2:number) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        // ctx.strokeStyle = strokeColor;
        // ctx.lineWidth = strokeWidth;
        ctx.stroke();
        ctx.closePath();
    }
export function render_svg_line(ctx:CanvasRenderingContext2D,
                                svg_path:string, test_ctx:CanvasRenderingContext2D):void {
    let sv = new SVGPathData(svg_path)
    
    // console.log(svg_path)
    sv.scale(3, 3)
    const path = new Path2D(sv.encode());
    ctx.stroke(path);
} 

export function render_sampled_points(ctx:CanvasRenderingContext2D, points:[number, number][]) {
    console.log(points)
    for( let i=0; i< points.length - 1; i++) {
        // console.log(i)
        const [x, y] = points.at(i)
        const [x1, y1] = points.at(i+1)
        draw(ctx, x, x1, y, y1)
    }
}
// M52.47,11.75 move to
// c1.08,1.08,1.48,2.25,1.48,4.22  bezier 
// c0,1.53-0.12,4.28-0.12,5.45   bezier

function parse_bezier(cmd:SVGCommand, cx:number, cy:number):number[] {
    const x1 = cmd.relative ? cmd.x1 + cx : cmd.x1;
    const y1 = cmd.relative ? cmd.y1 + cy : cmd.y1;
    const x2 = cmd.relative ? cmd.x2 + cx : cmd.x2;
    const y2 = cmd.relative ? cmd.y2 + cy : cmd.y2;
    const x = cmd.relative ? cmd.x + cx : cmd.x;
    const y = cmd.relative ? cmd.y + cy : cmd.y;
    return [x1, y1, x2, y2, x, y]        
}

function cubicBezierPoint(t:number, cx:number, cy:number, x1:number, y1:number, x2:number, y2:number, x:number, y:number):[number, number] {
    const w0 = (1-t)**3
    const w1 = 3*(1-t)**2*t
    const w2 = 3*(1-t)*t**2
    const w3 = t**3
    const xPoint = w0*cx + w1*x1 + w2*x2 + w3*x; 
    const yPoint = w0*cy + w1*y1 + w2*y2 + w3*y;
    return [xPoint, yPoint]
}