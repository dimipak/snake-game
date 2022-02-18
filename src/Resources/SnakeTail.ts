import { SnakePosition } from "./Snake";

class SnakeTail {
    protected context: CanvasRenderingContext2D
    protected pos?: SnakePosition
    protected posBefore?: SnakePosition

    constructor(context: CanvasRenderingContext2D)
    {
        this.context = context;
    }

    public setPos(pos: SnakePosition)
    {
        this.posBefore = this.pos

        this.pos = pos
    }

    public getPos(): SnakePosition | undefined
    {
        return this.pos
    }

    public getPosBefore(): SnakePosition
    {
        return this.posBefore!
    }

    public draw()
    {
        if (this.pos == undefined) return
        
        this.context.fillRect(this.pos!.x, this.pos!.y, 32, 32)
        this.context.fillStyle = "green"

        this.context.strokeRect(this.pos!.x, this.pos!.y, 32, 32)
        this.context.strokeStyle = "blue"
    }
}

export { SnakeTail }