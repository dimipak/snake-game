abstract class State {
    protected appElement: HTMLElement

    constructor(app: HTMLElement)
    {
        this.appElement = app
    }

    protected createCanvas(): HTMLCanvasElement
    {
        let canvas: HTMLCanvasElement = document.createElement("canvas")! as HTMLCanvasElement;
        canvas.style.position = "absolute"

        this.appElement.appendChild(canvas)

        canvas.width = this.appElement.clientWidth;
        canvas.height = this.appElement.clientHeight;

        // return canvas.getContext("2d")!

        return canvas
    }

    public abstract update(): void;

    public abstract render(): void;
}

export {State}