import { SnakeTail } from "./SnakeTail"

type SnakePosition = {
    x: number
    y: number
}

enum SnakeDirection {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

class Snake {
    protected context: CanvasRenderingContext2D
    protected pos?: SnakePosition
    protected posBefore?: SnakePosition
    protected direction?: SnakeDirection
    protected tail: SnakeTail[] = []

    constructor(context: CanvasRenderingContext2D)
    {
        this.context = context;
    }

    public setPos(newPos: SnakePosition)
    {
        this.posBefore = this.pos

        this.pos = newPos
    }

    public setDirection(d: SnakeDirection)
    {
        this.direction = d
    }

    public getDirection(): SnakeDirection | undefined
    {
        return this.direction
    }

    public getPos(): SnakePosition | undefined
    {
        return this.pos
    }

    public addTail()
    {
        this.tail.push(new SnakeTail(this.context))
    }

    public getTail(): SnakeTail[]
    {
        return this.tail
    }

    public draw(): void
    {
        this.drawHead()

        this.drawTail()
    }

    protected drawHead()
    {
        this.context.fillRect(this.pos!.x, this.pos!.y, 32, 32)
        this.context.fillStyle = "green"

        this.context.strokeRect(this.pos!.x, this.pos!.y, 32, 32)
        this.context.strokeStyle = "blue"
    }

    protected drawTail()
    {
        for (let i = 0; i < this.tail.length; i++)
        {
            if (this.pos != this.posBefore) {

                let tailPos = (i == 0) ? this.posBefore! : this.tail[i-1].getPosBefore()
    
                this.tail[i].setPos(tailPos)
            } else {
                this.tail[i].setPos(this.tail[i].getPos()!)
            }

            this.tail[i].draw()
        }
    }
}

export { Snake, SnakePosition, SnakeDirection }