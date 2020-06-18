class Orbit_MAE extends Animator  {
    constructor() {
        super(); 
        this.angle = random(0, 6.28)
        this.color = randomColor()
    }
    doTick() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.beginPath(); ctx.fillStyle = this.color
        const H = 150, D = 15, P = 30
        const MX = canvas.width/2, MY = canvas.height/2
        const x = MX + (MX-P) * Math.cos(this.angle);
        const y = MY + (MY-P) * Math.sin(this.angle);
        ctx.arc(x, y, D, 0, 2 * Math.PI);
        ctx.fill(); this.angle += Math.PI/H
        // return 100
    }
    description() { return 'Elliptic orbit of a planet' }
    author() { return 'M A Eyler'}
}