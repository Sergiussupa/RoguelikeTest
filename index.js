const config = {
    amount: 100,
};

class Animation {
    constructor() {
        this.cnv = null;
        this.ctx = null;
        this.size = { w: 0, h: 0 };
        this.cols = null;
        this.rows = null;
        this.grid = null;
        this.stateHero = { x: 3, y: 4 };
    }
    init() {
        this.createCanvas();
        this.renderRect(0, 0, this.size.w, this.size.h, 'brown');
        this.grid = this.buildGrid();
        console.table(this.grid);
        this.setPositionHero();
        console.table(this.grid)
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
    clearCanvas() {
        this.renderRect(0, 0, this.size.w, this.size.h, 'brown');
    }

    buildGrid() {
        return new Array(this.cols).fill(null)
            .map(() => new Array(this.rows).fill(null)
                .map(() => 'O'));
    }

    //unit

    setPositionHero() {
        this.grid[this.stateHero.x][this.stateHero.y] = 'X';
        this.renderRect(this.stateHero.x, this.stateHero.y,
            config.amount, config.amount, 'white');
    }
    updatePosition(jump) {
        switch (jump) {
            case 'KeyW':
                this.clearCanvas();
                this.upHero();
                this.renderRect(this.stateHero.x, this.stateHero.y,
                    config.amount, config.amount, 'white');
                break;
            case 'KeyS':
                this.clearCanvas();
                this.downHero();
                this.renderRect(this.stateHero.x, this.stateHero.y,
                    config.amount, config.amount, 'white');
                break;
            case 'KeyD':
                this.clearCanvas();
                this.rightHero();
                this.renderRect(this.stateHero.x, this.stateHero.y,
                    config.amount, config.amount, 'white');
                break;
            case 'KeyA':
                this.clearCanvas();
                this.lefttHero();
                this.renderRect(this.stateHero.x, this.stateHero.y,
                    config.amount, config.amount, 'white');
                break;
        }
    }
    //nabigation
    upHero() {
        if (this.stateHero.y == 0) {
            alert('Сверху стена');
        } else {
            this.grid[this.stateHero.x][this.stateHero.y] = 'O';
            this.stateHero.y--;
            this.grid[this.stateHero.x][this.stateHero.y] = 'X';
        }
    }
    downHero() {
        if (this.stateHero.y == this.rows - 1) {
            alert('Снизу стена');
        } else {
            this.grid[this.stateHero.x][this.stateHero.y] = 'O';
            this.stateHero.y++;
            this.grid[this.stateHero.x][this.stateHero.y] = 'X';
        }
    }
    lefttHero() {
        if (this.stateHero.x == 0) {
            alert('Слева стена');
        } else {
            this.grid[this.stateHero.x][this.stateHero.y] = 'O';
            this.stateHero.x--;
            this.grid[this.stateHero.x][this.stateHero.y] = 'X';
        }
    }
    rightHero() {
        if (this.stateHero.x == this.cols - 1) {
            alert('Справа стена');
        } else {
            this.grid[this.stateHero.x][this.stateHero.y] = 'O';
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


        console.log(this.cols + ' <--- cols');
        console.log(this.rows + ' <--- rows');
    }
}
let anim = new Animation();
anim.init();

document.addEventListener('keydown', function (event) {
    if (event.code == 'KeyW' || 'KeyA' || 'KeyS' || 'KeyD') {
        console.table(anim.grid);
        console.table(anim.stateHero);
        anim.updatePosition(event.code);
        //ani.state.x++;
        //ani.createUnit();
    }
});