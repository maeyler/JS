class Clock_SS extends Animator  {
    constructor() {
        super();
        this.x = randInt(10, 300)
        this.y = this.START = 40
        this.color = randomColor()
    }
    doTick() {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = this.color
        ctx.font = '35px serif';
        let x = this.x, y = this.y
        let d = new Date().toTimeString().split(' ')[0]
        ctx.fillText(d, x, y)
        const INC = 80; x += INC; y += INC
        this.x = (x+110>canvas.width? this.START : x)
        this.y = ( y>canvas.height ? this.START : y)
        return 1000
    }
    description() { return 'Simple digital clock' }
    author() { return 'Small Simple' }
}