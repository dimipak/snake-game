type FoodObjectivePos = {
    x: number,
    y: number
}

class FoodObjective {
    protected context: CanvasRenderingContext2D
    protected imgPath: string = "./assets/img/fruit.png"
    protected img!: HTMLImageElement
    protected width: number = 32
    protected height: number = 32
    protected pos?: FoodObjectivePos

    constructor(context: CanvasRenderingContext2D)
    {
        this.context = context;

        this.loadAssets()
    }

    protected loadAssets()
    {
        this.img = new Image();
        this.img.src = this.imgPath;
    }

    public setPos(x: number, y: number)
    {
        this.pos = {
            x: x,
            y: y
        }
    }

    public getPos(): FoodObjectivePos | undefined
    {
        return this.pos
    }

    public draw()
    {
        this.context.drawImage(this.img, this.pos!.x * this.width, this.pos!.y * this.height)
    }

}

export { FoodObjective, FoodObjectivePos }