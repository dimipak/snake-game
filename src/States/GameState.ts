import {State} from "./State"
import {BattlefieldLayer} from "../Layers/BattlefieldLayer"
import { ScoreLayer } from "../Layers/ScoreLayer";


type UserStats = {
    score: number,
    life: number
}

class GameState extends State {

    protected userStats: UserStats

    protected battlefieldLayer!: BattlefieldLayer
    protected scoreLayer!: ScoreLayer
    
    constructor(app: HTMLElement)
    {
        super(app)

        this.userStats = {
            score: 0,
            life: 3
        }

        document.addEventListener("keydown", (e) => {
            this.keyPressEvent(e)
        })

        this.initBattlefieldLayer(this.createCanvas())
        this.initScoreLayer(this.createCanvas())
    }

    protected initBattlefieldLayer(canvas: HTMLCanvasElement)
    {
        this.battlefieldLayer = new BattlefieldLayer(canvas)
        this.battlefieldLayer.setUserStats(this.userStats)
    }

    protected initScoreLayer(canvas: HTMLCanvasElement)
    {
        this.scoreLayer = new ScoreLayer(canvas)
        this.scoreLayer.setUserStats(this.userStats)
    }

    protected keyPressEvent(e: KeyboardEvent)
    {
        this.battlefieldLayer.event(e)
        this.scoreLayer.event(e)
    }

    public update()
    {
        this.battlefieldLayer.update()

        this.scoreLayer.setUserStats(this.battlefieldLayer.getUserStats()).update()
    }

    public render()
    {
        this.battlefieldLayer.render()

        this.scoreLayer.render()
    }
}

export { GameState, UserStats }