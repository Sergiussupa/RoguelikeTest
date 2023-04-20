const config = {
    amount: 25,
};
var image = new Image();
image.src = 'tile-P.png';
class Animation {
    constructor() {
        this.cnv = null;
        this.ctx = null;
        this.size = { w: 0, h: 0 };
        this.cols = null;
        this.rows = null;
        this.grid = null;
        this.stateHero = { x: 9, y: 9 };
        this.heroImg = new Image();
        this.enemyImg = new Image();
        this.wallImg = new Image();
        this.pathImg = new Image();
    }
    random(min, max) {
        return Math.floor(min + Math.random() * (max + 1 - min));
    }
    init() {
        this.createCanvas();
        this.renderRect(0, 0, this.size.w, this.size.h, 'brown');
        //this.renderImage(this.heroImg, 0, 0, config.amount);
        //this.renderImage(this.enemyImg, 10, 10, config.amount);
        //this.renderImage(this.wallImg, 5, 9, config.amount);
        //this.renderImage(this.pathImg, 14, 9, config.amount);

        this.buildGrid();
        this.texturing();
        //this.grid = this.buildGrid();
        //console.table(this.grid);
        this.setPositionHero();
        //console.table(this.grid)
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
        this.cols = 60//Math.floor(this.size.w / config.amount);
        this.rows = 60//Math.floor(this.size.h / config.amount);
    }
    clearCanvas() {
        this.renderRect(0, 0, this.size.w, this.size.h, 'brown');
    }

    //build grid
    buildGrid() {
        this.grid = new Array(this.cols).fill(null)
            .map(() => new Array(this.rows).fill(null)
                .map(() => 'P'));
        //this.line();
        this.spawnWalls();
    }
    line() {
        for (let i = 0; i < this.grid[2].length; i++) {
            this.grid[2][i] = 'P';
        }
        this.grid[this.stateHero.x + 2][this.stateHero.y] = 'W';
    }
    spawnWalls() {

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 4; j++) {
                this.createWall(1 + i * 10, 1 + j * 10);
            }
        }
    }
    createWall(x, y) {
        let width = this.random(3, 8);
        let height = this.random(3, 8);
        console.log(width + ' <-_-> ' + height);

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                this.grid[x + i][y + j] = 'W';
            }
        }
    }

    // texture
    texturing() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                if (this.grid[i][j] == 'P') {
                    this.renderImage(this.pathImg, i, j, config.amount);
                } else if (this.grid[i][j] == 'W') {
                    this.renderImage(this.wallImg, i, j, config.amount);
                }
            }
        }
    }
    //unit

    setPositionHero() {
        this.grid[this.stateHero.x][this.stateHero.y] = 'X';
        this.renderImage(this.heroImg, this.stateHero.x, this.stateHero.y, config.amount);
    }
    updatePosition(jump) {
        switch (jump) {
            case 'KeyW':
                this.clearCanvas();
                this.upHero();
                this.texturing();
                this.renderImage(this.heroImg, this.stateHero.x, this.stateHero.y, config.amount);
                break;
            case 'KeyS':
                this.clearCanvas();
                this.downHero();
                this.texturing();
                this.renderImage(this.heroImg, this.stateHero.x, this.stateHero.y, config.amount);
                break;
            case 'KeyD':
                this.clearCanvas();
                this.rightHero();
                this.texturing();
                this.renderImage(this.heroImg, this.stateHero.x, this.stateHero.y, config.amount);
                break;
            case 'KeyA':
                this.clearCanvas();
                this.lefttHero();
                this.texturing();
                this.renderImage(this.heroImg, this.stateHero.x, this.stateHero.y, config.amount);
                break;
        }
    }
    //controls
    upHero() {
        if (this.grid[this.stateHero.x][this.stateHero.y - 1] == undefined ||
            this.grid[this.stateHero.x][this.stateHero.y - 1] == 'W') {
            alert('Сверху стена');
        } else {
            this.grid[this.stateHero.x][this.stateHero.y] = 'P';
            this.stateHero.y--;
            this.grid[this.stateHero.x][this.stateHero.y] = 'X';
        }
    }
    downHero() {
        if (this.grid[this.stateHero.x][this.stateHero.y + 1] == undefined ||
            this.grid[this.stateHero.x][this.stateHero.y + 1] == 'W') {
            alert('Снизу стена');
        } else {
            this.grid[this.stateHero.x][this.stateHero.y] = 'P';
            this.stateHero.y++;
            this.grid[this.stateHero.x][this.stateHero.y] = 'X';
        }
    }
    lefttHero() {
        if (this.grid[this.stateHero.x - 1] == undefined ||
            this.grid[this.stateHero.x - 1][this.stateHero.y] == 'W') {
            alert('Слева стена');
        } else {

            this.grid[this.stateHero.x][this.stateHero.y] = 'P';
            this.stateHero.x--;
            this.grid[this.stateHero.x][this.stateHero.y] = 'X';
        }
    }
    rightHero() {
        if (this.grid[this.stateHero.x + 1] == undefined ||
            this.grid[this.stateHero.x + 1][this.stateHero.y] == 'W') {
            alert('Справа стена');
        } else {
            this.grid[this.stateHero.x][this.stateHero.y] = 'P';
            this.stateHero.x++;
            this.grid[this.stateHero.x][this.stateHero.y] = 'X';
        }
    }

    //draw
    renderRect(x1, y1, x2, y2, color) {
        this.ctx.beginPath();
        this.ctx.rect(config.amount * x1, config.amount * y1, x2, y2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
    renderImage(img, x1, y1, size) {
        this.ctx.drawImage(img, config.amount * x1, config.amount * y1, size, size);
    }

    //preInit == Load
    loadImages() {
        this.heroImg.src = 'tile-P.png';
        this.enemyImg.src = 'tile-E.png';
        this.wallImg.src = 'tile-W.png';
        this.pathImg.src = 'tile-.png';
    }
}
let anim = new Animation();
anim.loadImages();
(anim.heroImg && anim.enemyImg && anim.pathImg && anim.wallImg).onload = function () {
    anim.init();
}

document.addEventListener('keydown', function (event) {
    if (event.code == 'KeyW' ||
        event.code == 'KeyA' ||
        event.code == 'KeyS' ||
        event.code == 'KeyD') {
        //console.table(anim.grid);
        //console.table(anim.stateHero);
        anim.updatePosition(event.code);
        //ani.state.x++;
        //ani.createUnit();
    }
});