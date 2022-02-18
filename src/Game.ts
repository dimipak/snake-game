import {GameState} from "./States/GameState"
import {State} from "./States/State"
import {app} from "./config"

class Game {
    protected width!: number;
    protected height!: number;
    protected intervalTime: number = 100;
    protected gameInterval?: number
    protected gameArea!: HTMLElement

    protected states: State[] = [];

    constructor()
    {
        this.initApp()
        this.setGameArea()
        this.setState()
    }

    protected initApp(): void
    {
        this.width = app.width
        this.height = app.height
        this.intervalTime = app.defaultTimeInt
    }

    public setGameArea(): void
    {
        this.gameArea = document.getElementById(app.app_id)!

        if (this.gameArea == null || this.gameArea == undefined)
        {
            console.log("Game area could not be defined")
            throw new Error("Game area could not be defined")
        }
    }

    public setState()
    {
        this.states.push(new GameState(this.gameArea))
    }

    public gameOver()
    {
        clearInterval(this.gameInterval);
    }

    public update()
    {
        this.states.forEach(state => {
            state.update()
        })
    }

    public render()
    {
        this.states.forEach(state => {
            state.render()
        })
    }

    public run()
    {
        setInterval(() => {
            this.update()
            this.render()
        }, 100)
        
        console.log("Game started!")
    }
}

export {Game};