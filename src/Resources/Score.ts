type ScorePosition = {
    x: number,
    y: number
}

class Score {
    protected context: CanvasRenderingContext2D
    protected score: number = 0
    protected pos?: ScorePosition

    constructor(context: CanvasRenderingContext2D)
    {
        this.context = context
        this.context.font = "40px Arial"
        this.context.fillStyle = "white"
    }

    public addScore()
    {
        this.score++
    }

    public setScore(score: number)
    {
        this.score = score
    }

    public setPos(pos: ScorePosition)
    {
        this.pos = pos
    }

    public draw()
    {
        this.context.fillText(this.score.toString(), 70, 55)
    }
}

export { Score }