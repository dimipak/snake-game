import { Layer } from "./Layer"
import { Score } from "../Resources/Score"


class ScoreLayer extends Layer 
{
    protected score: Score

    constructor(canvas: HTMLCanvasElement)
    {
        super(canvas)

        this.score = new Score(this.context)
    }

    public event(e: KeyboardEvent): void {
        
    }

    public render()
    {
        this.clear()

        this.score.draw()
    }

    public update()
    {
        this.score.setScore(this.userStats.score)
    }
}

export {ScoreLayer}