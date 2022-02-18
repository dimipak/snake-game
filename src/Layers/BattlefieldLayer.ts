import { Layer } from "./Layer";
import {Snake, SnakeDirection, SnakePosition} from "../Resources/Snake"
import {FoodObjective, FoodObjectivePos} from "../Resources/FoodObjective"
import {UserStats} from "../States/GameState"

class BattlefieldLayer extends Layer
{
    protected step: number = 32

    // Objects
    protected snake!: Snake
    protected foodObjective!: FoodObjective

    constructor(canvas: HTMLCanvasElement)
    {
        super(canvas)

        this.initSnake()
        this.initObjective()
    }

    protected initSnake()
    {
        this.snake = new Snake(this.context)

        this.snake.setPos({
            x: this.setPos(9),
            y: this.setPos(10)
        })
    }

    protected initObjective()
    {
        this.foodObjective = new FoodObjective(this.context)

        let x;
        let y;
        do {
            x =  Math.floor(Math.random() * 17 + 1)
            y = Math.floor(Math.random() * 15 + 3)
        } while(x == 9 && y == 10)

        this.foodObjective.setPos(x, y)
    }

    protected setPos(n: number): number
    {
        return n * this.step
    }

    protected getPos(n: number): number
    {
        return n / this.step
    }

    public update()
    {
        const snakePos: SnakePosition = this.snake.getPos()!
        const objPos: FoodObjectivePos = this.foodObjective.getPos()!

        this.updateSnake(snakePos)

        if (this.getPos(snakePos.x) == objPos.x && this.getPos(snakePos.y) == objPos.y) {
            this.updateFoodObjPosition(objPos)
            this.snake.addTail()
            this.userStats.score++
        }
    }

    public render()
    {
        this.clear()

        this.foodObjective.draw()

        this.snake.draw()
    }

    public event(e: KeyboardEvent)
    {
        this.setSnakeDirection(e);
    }

    protected setSnakeDirection(e: KeyboardEvent)
    {
        const snakeDirection = this.snake.getDirection()

        if (e.key === "ArrowUp" && snakeDirection != SnakeDirection.DOWN) {

            this.snake.setDirection(SnakeDirection.UP)

        } else if (e.key === "ArrowDown" && snakeDirection != SnakeDirection.UP) {

            this.snake.setDirection(SnakeDirection.DOWN)
        } else if (e.key === "ArrowRight" && snakeDirection != SnakeDirection.LEFT) {

            this.snake.setDirection(SnakeDirection.RIGHT)
        } else if (e.key === "ArrowLeft" && snakeDirection != SnakeDirection.RIGHT) {
            
            this.snake.setDirection(SnakeDirection.LEFT)
        }
    }

    protected updateSnake(snakePos: SnakePosition)
    {
        this.updateSnakePosition(snakePos)
    }

    protected updateSnakePosition(snakePos: SnakePosition): void
    {
        const snakeDirection: SnakeDirection = this.snake.getDirection()!

        let newPos: SnakePosition

        switch (snakeDirection) {
            case SnakeDirection.UP:
                newPos = {
                    x: this.setPos(this.getPos(snakePos.x)),
                    y: this.setPos(this.getPos(snakePos.y) - 1)
                }
                break;
            case SnakeDirection.DOWN:

                newPos = {
                    x: this.setPos(this.getPos(snakePos.x)),
                    y: this.setPos(this.getPos(snakePos.y) + 1)
                }
                break;
            case SnakeDirection.RIGHT:
                newPos = {
                    x: this.setPos(this.getPos(snakePos.x) + 1),
                    y: this.setPos(this.getPos(snakePos.y))
                }
                break;
            case SnakeDirection.LEFT:
                newPos = {
                    x: this.setPos(this.getPos(snakePos.x) - 1),
                    y: this.setPos(this.getPos(snakePos.y))
                }
                break;
            default:
                newPos = snakePos
                break;
        }

        // Check for wall hit
        if (this.getPos(newPos.x) == 0 || this.getPos(newPos.x) == 18 || this.getPos(newPos.y) == 2 || this.getPos(newPos.y) == 18)
        {
            console.log("game over by hitting the wall")
            newPos = snakePos
        } 
        
        // Check for tail hit
        this.snake.getTail().forEach(tail => {
            const pos: SnakePosition | undefined = tail.getPos()

            if (pos == undefined) return

            if (this.getPos(newPos.x) == this.getPos(pos.x) && this.getPos(newPos.y) == this.getPos(pos.y)) {
                console.log("game over by hitting the tail")
                newPos = snakePos
            }
        })


        this.snake.setPos(newPos)
    }

    protected updateFoodObjPosition(objPos: FoodObjectivePos)
    {        
        let snakePositions: SnakePosition[] = []

        const headpos: SnakePosition = this.snake.getPos()!

        snakePositions.push({
            x: this.getPos(headpos.x),
            y: this.getPos(headpos.y)
        })

        this.snake.getTail().forEach(tail => {
            const pos: SnakePosition | undefined = tail.getPos()

            if (pos == undefined) return

            snakePositions.push({
                x: this.getPos(pos.x),
                y: this.getPos(pos.y)
            })
        })

        let foundPos: Boolean
        let x: number
        let y: number
        do {
            foundPos = true
            x = Math.floor(Math.random() * 17 + 1)
            y = Math.floor(Math.random() * 15 + 3)

            snakePositions.forEach(snekpos => {
                if (snekpos.x == x && snekpos.y == y) {
                    foundPos = false
                }
            })
        } while(!foundPos)

        this.foodObjective.setPos(x,y)
    }
}

export {BattlefieldLayer}