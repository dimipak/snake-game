import {UserStats} from "../States/GameState"

abstract class Layer {
    protected userStats!: UserStats
    protected canvas: HTMLCanvasElement
    protected context: CanvasRenderingContext2D

    constructor(canvas: HTMLCanvasElement)
    {
        this.canvas = canvas
        this.context = canvas.getContext("2d")!
    }

    public setUserStats(userStats: UserStats): Layer
    {
        this.userStats = userStats

        return this
    }

    public getUserStats(): UserStats
    {
        return this.userStats
    }

    public clear(): void
    {
        this.context.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)
    }

    public abstract update(): void;

    public abstract render(): void;

    public abstract event(e: KeyboardEvent): void;
}

export {Layer}