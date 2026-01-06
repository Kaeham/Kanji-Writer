import { SVGPathData, type CommandC, type SVGCommand } from 'svg-pathdata'
const X_INDEX:number = 0;
const Y_INDEX:number = 1;

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

export function get_mouse_pos(canvas: HTMLCanvasElement, e:MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return {x: e.clientX - rect.left, y: e.clientY - rect.top};
}

function preprocess_svg(svg_path:string):SVGPathData {
    const sv = new SVGPathData(svg_path);
    sv.scale(3, 3)
    sv.translate(-15, -15)
    return sv
}

export function sample_svg_line(svg_path: string, path_resolution:number=10):[number, number][] {
    /**
     * Function to parse a svg command and sample points along said path
     */
    const bezierCurves:number[][] = []
    const points:[number, number][] = []

    const sv = preprocess_svg(svg_path)
    const commands = sv.commands
    let strokeCount = 0;
    
    const moveTo = commands.at(0);
    let cx = moveTo?.type === SVGPathData.MOVE_TO ? moveTo.x : 0;
    let cy = moveTo?.type === SVGPathData.MOVE_TO ? moveTo.y : 0;
    const [endX, endY] = [6, 7]; // the position for the final point of the curve

    commands.forEach((cmd:SVGCommand) => {
        if (cmd.type === SVGPathData.CURVE_TO ) {
            strokeCount++
            const currentCurve = parse_bezier(cmd, cx, cy)
            cx = currentCurve[endX]
            cy = currentCurve[endY]
            bezierCurves.push(currentCurve)}})
    path_resolution = Math.floor(path_resolution/strokeCount)
    bezierCurves.forEach((bezier:number[]) => {
        for (let i=0; i <= path_resolution; i++) {
            const [start, end, x1, y1, x2, y2, x, y] = bezier;
            const t = i / path_resolution;
            const point = cubicBezierPoint(t, start, end, x1, y1, x2, y2, x, y); // point is [x, y]
            points.push(point)
        }
    })
    return points
}
export function draw(ctx:CanvasRenderingContext2D, x1:number, x2:number, y1:number, y2:number, strokeWidth:number = 3, strokeColor:string="black") {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
        ctx.closePath();
    }
export function render_sampled_points(ctx:CanvasRenderingContext2D, coordinate_array:[number[], number[]]) {
    const strokeWidth = 5;
    for( let i=0; i < coordinate_array.length-1; i++) {
        const [x, y] = coordinate_array.at(i)
        const [x1, y1] = coordinate_array.at(i+1)
        draw(ctx, x, x1, y, y1, strokeWidth)
    }}
    
function parse_bezier(cmd:CommandC, cx:number, cy:number):number[] {
    const x1 = cmd.relative ? cmd.x1 + cx : cmd.x1;
    const y1 = cmd.relative ? cmd.y1 + cy : cmd.y1;
    const x2 = cmd.relative ? cmd.x2 + cx : cmd.x2;
    const y2 = cmd.relative ? cmd.y2 + cy : cmd.y2;
    const x = cmd.relative ? cmd.x + cx : cmd.x;
    const y = cmd.relative ? cmd.y + cy : cmd.y;
    return [cx, cy, x1, y1, x2, y2, x, y]        
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

export function render_svg_line(ctx:CanvasRenderingContext2D,
                                svg_path:string):void {
    const sv = preprocess_svg(svg_path)
    const path = new Path2D(sv.encode());
    ctx.stroke(path);
}

export function get_start_point(svg_path:string):[number, number] {
    const sv = preprocess_svg(svg_path)
    const cmds = sv.commands;
    for (let i=0; i < cmds.length; i++) { if (cmds.at(i)!.type === SVGPathData.MOVE_TO) {return [cmds.at(i)!.x, cmds.at(i)!.y]}}
    return [0, 0]
}

export function toggleCanvas(content_div:HTMLDivElement) {
        if (content_div.style.visibility === "hidden") 
        {content_div.style.visibility = "visible"} 
        else {content_div.style.visibility = "hidden"}
    }

export function clearCanvas(canvas:HTMLCanvasElement, ctx:CanvasRenderingContext2D):void {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

export function preview_stroke(svg_path:string, canvas:HTMLCanvasElement, ctx:CanvasRenderingContext2D) {
    const sv = preprocess_svg(svg_path)
    const path = new Path2D(sv.encode());
    ctx.stroke(path);
    // const coords = sv.getBounds()
    // const imageData = ctx.getImageData(coords.minX -1, coords.minY - 1, coords.maxX + 1, coords.maxY + 1)
    // console.log(imageData)
    
    
}