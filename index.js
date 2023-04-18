const config = {
    amount: 100,
};

class Animation {
    constructor() {
        this.cnv = null;
        this.ctx = null;
        this.size = { w: 0, h: 0 };
        this.cols = null;
    }
    init() {
        this.createCanvas();
        this.renderRect(0, 0, this.size.w, this.size.h, 'brown');
    }
    createCanvas() {
        this.cnv = document.createElement("canvas");
        this.ctx = this.cnv.getContext('2d');
        this.setCanvasSize();
        document.body.appendChild(this.cnv);
    }
    setCanvasSize() {
        this.size.w = this.cnv.width = window.innerWidth;
        this.size.h = this.cnv.height = window.innerHeight;
        this.cols = Math.floor(this.size.w / config.amount);
        this.rows = Math.floor(this.size.h / config.amount);
    }
    //draw
    renderRect(x1, y1, x2, y2, color) {
        this.ctx.beginPath();
        this.ctx.rect(x1, y1, x2, y2);
        this.ctx.fillStyle = color;
        this.ctx.fill();


        console.log(this.cols + ' <--- cols');
        console.log(this.rows + ' <--- rows');
    }
}
let anim = new Animation();
anim.init();