const config = {
    amount: 25,
    enemyHP: 2
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
        this.stateHero = { x: 10, y: 10, range: 1, currentHP: 3, tag: 'X', img: this.heroImg, maxHP: 5 };
        this.heroImg = new Image();
        this.enemyImg = new Image();
        this.wallImg = new Image();
        this.pathImg = new Image();
        this.swImg = new Image();
        this.hpImg = new Image();
        this.countsP = 0;
        this.countsW = 0;
        this.countsF = null;
        this.countsSw = 2;
        this.countsHp = 10;
        this.countsE = 10;
        this.spawnPeriodicity = null;
        this.countsSpawn = this.countsSw + this.countsHp + this.countsE;
        this.basket = [];
        this.enemyArr = [];
    }
    random(min, max) {
        return Math.floor(min + Math.random() * (max + 1 - min));
    }
    init() {
        this.createCanvas();
        this.renderRect(0, 0, this.size.w, this.size.h, 'brown');
        this.buildGrid();
        this.setPositionHero();
        this.texturing();
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
        this.cols = 61;//Math.floor(this.size.w / config.amount);
        this.rows = 32;//Math.floor(this.size.h / config.amount);
    }
    clearCanvas() {
        this.renderRect(0, 0, this.size.w, this.size.h, 'brown');
    }

    //build grid
    putBasket() {
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        let a = this.countsSw;
        let b = this.countsHp;
        let c = this.countsE
        for (let i = 0; i < this.countsSpawn; i++) {
            if (a != 0) {
                this.basket.push('SW')
                a--;
            } else if (b != 0) {
                this.basket.push('HP');
                b--;
            } else if (c != 0) {
                this.basket.push('E');
                c--;
            }
        }
        for (let i = 0; i < this.basket.length ** 2; i++) {
            shuffle(this.basket);
        }
    }
    buildGrid() {
        this.grid = new Array(this.cols).fill(null)
            .map(() => new Array(this.rows).fill(null)
                .map(() => 'P'));
        this.buildBorder();
        this.spawnWalls();

        this.countsP = this.cols * this.rows;
        console.log(this.countsP + ' <-_-> ' + this.countsW);
        this.countsF = this.countsP - this.countsW;
        console.log(this.countsF);
        this.spawnPeriodicity = Math.floor(this.countsF / this.countsSpawn);
        console.log(this.spawnPeriodicity);
        this.putBasket();
        this.spawnUnits();
        //console.table(this.grid);
    }
    spawnUnits() {
        let count = this.spawnPeriodicity;
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                if (count == 0 && this.grid[i][j] == 'P') {
                    console.log('SPAWN ');
                    this.grid[i][j] = this.basket.pop();
                    if (this.grid[i][j] == 'E') {
                        this.enemyArr.push({ x: i, y: j, currentHP: config.enemyHP, tag: 'E', maxHP: 2 });
                    }
                    count = this.spawnPeriodicity + 1;
                } else if (this.grid[i][j] == 'P') {
                    count--;
                }
            }
        }
        if ((this.grid[1][1] = this.basket.pop()) == 'E') {
            this.enemyArr.push({ x: 1, y: 1, currentHP: 1, tag: 'E', maxHP: 2 });
        }
    }
    buildBorder() {
        for (let i = 0; i < this.cols; i++) {
            this.grid[i][0] = 'W';
            this.grid[i][this.grid[i].length - 1] = 'W';
            this.countsW += 2;
        }
        for (let i = 0; i < this.rows; i++) {
            this.grid[0][i] = 'W';
            this.grid[this.grid.length - 1][i] = 'W';
            this.countsW += 2;
        }
    }
    spawnWalls() {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 3; j++) {
                this.createWall(2 + i * 10, 2 + j * 10);
            }
        }
    }
    createWall(x, y) {
        let width = this.random(3, 8);
        let height = this.random(3, 8);
        console.log(width + ' <-_-> ' + height);

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                if (this.grid[x + i][y + j] !== undefined) {
                    this.grid[x + i][y + j] = 'W';
                    this.countsW++;
                }
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
                } else if (this.grid[i][j] == 'HP') {
                    this.renderImage(this.hpImg, i, j, config.amount);
                } else if (this.grid[i][j] == 'SW') {
                    this.renderImage(this.swImg, i, j, config.amount);
                } else if (this.grid[i][j] == 'E') {
                    this.renderImage(this.enemyImg, i, j, config.amount);
                } else if (this.grid[i][j] == 'X') {
                    this.renderImage(this.heroImg, i, j, config.amount);
                }
            }
        }
        this.checkAttackEnemy();
    }
    //unit

    setPositionHero() {
        this.grid[this.stateHero.x][this.stateHero.y] = 'X';
        this.renderRect(this.stateHero.x, this.stateHero.y, config.amount / 1, -6, 'green');
        //this.renderImage(this.heroImg, this.stateHero.x, this.stateHero.y, config.amount);
    }
    updatePosition(jump) {
        switch (jump) {
            case 'KeyW':
                this.clearCanvas();
                this.upUnit(this.stateHero);
                for (let i = 0; i < this.enemyArr.length; i++) {
                    this.enemyMove(this.enemyArr[i], this.random(0, 3));
                }
                this.texturing();
                this.renderHPbarUnit(this.stateHero);
                for (let i = 0; i < this.enemyArr.length; i++) {
                    this.renderHPbarUnit(this.enemyArr[i]);
                }
                this.renderAttack();

                break;
            case 'KeyS':
                this.clearCanvas();
                this.downUnit(this.stateHero);
                for (let i = 0; i < this.enemyArr.length; i++) {
                    this.enemyMove(this.enemyArr[i], this.random(0, 3));
                }
                this.texturing();
                this.renderHPbarUnit(this.stateHero);
                for (let i = 0; i < this.enemyArr.length; i++) {
                    this.renderHPbarUnit(this.enemyArr[i]);
                }
                this.renderAttack();

                break;
            case 'KeyD':
                this.clearCanvas();
                this.rightUnit(this.stateHero);
                for (let i = 0; i < this.enemyArr.length; i++) {
                    this.enemyMove(this.enemyArr[i], this.random(0, 3));
                }
                this.texturing();
                this.renderHPbarUnit(this.stateHero);
                for (let i = 0; i < this.enemyArr.length; i++) {
                    this.renderHPbarUnit(this.enemyArr[i]);
                }
                this.renderAttack();

                break;
            case 'KeyA':
                this.clearCanvas();
                this.leftUnit(this.stateHero);
                for (let i = 0; i < this.enemyArr.length; i++) {
                    this.enemyMove(this.enemyArr[i], this.random(0, 3));
                }
                this.texturing();
                //this.renderImage(this.heroImg, this.stateHero.x, this.stateHero.y, config.amount);
                this.renderHPbarUnit(this.stateHero);
                for (let i = 0; i < this.enemyArr.length; i++) {
                    this.renderHPbarUnit(this.enemyArr[i]);
                }
                this.renderAttack();

                break;
            case 'Space':
                this.clearCanvas();
                this.attackHero();
                for (let i = 0; i < this.enemyArr.length; i++) {
                    this.enemyMove(this.enemyArr[i], this.random(0, 3));
                }
                this.texturing();
                this.renderHPbarUnit(this.stateHero);
                for (let i = 0; i < this.enemyArr.length; i++) {
                    this.renderHPbarUnit(this.enemyArr[i]);
                }
                this.renderAttack();
                break;
        }
    }
    //controls

    upUnit(unit) {
        if (this.grid[unit.x][unit.y - 1] == 'P') {
            this.grid[unit.x][unit.y] = 'P';
            unit.y--;
            this.grid[unit.x][unit.y] = unit.tag;
        } else if (this.grid[unit.x][unit.y - 1] == 'HP' &&
            unit.tag == 'X') {
            this.grid[unit.x][unit.y] = 'P';
            unit.y--;
            if (unit.currentHP != unit.maxHP) unit.currentHP++;
            this.grid[unit.x][unit.y] = unit.tag;
        } else if (this.grid[unit.x][unit.y - 1] == 'SW' &&
            unit.tag == 'X') {
            this.grid[unit.x][unit.y] = 'P';
            unit.y--;
            if (unit.range != 2) unit.range++;
            this.grid[unit.x][unit.y] = unit.tag;
        }
    }
    downUnit(unit) {
        if (this.grid[unit.x][unit.y + 1] == 'P') {
            this.grid[unit.x][unit.y] = 'P';
            unit.y++;
            this.grid[unit.x][unit.y] = unit.tag;
        } else if (this.grid[unit.x][unit.y + 1] == 'HP' &&
            unit.tag == 'X') {
            this.grid[unit.x][unit.y] = 'P';
            unit.y++;
            if (unit.currentHP != unit.maxHP) unit.currentHP++;
            this.grid[unit.x][unit.y] = unit.tag;
        } else if (this.grid[unit.x][unit.y + 1] == 'SW' &&
            unit.tag == 'X') {
            this.grid[unit.x][unit.y] = 'P';
            unit.y++;
            if (unit.range != 2) unit.range++;
            this.grid[unit.x][unit.y] = unit.tag;
        }
    }
    leftUnit(unit) {
        if (this.grid[unit.x - 1][unit.y] == 'P') {
            this.grid[unit.x][unit.y] = 'P';
            unit.x--;
            this.grid[unit.x][unit.y] = unit.tag;
        } else if (this.grid[unit.x - 1][unit.y] == 'HP' &&
            unit.tag == 'X') {
            this.grid[unit.x][unit.y] = 'P';
            unit.x--;
            if (unit.currentHP != unit.maxHP) unit.currentHP++;
            this.grid[unit.x][unit.y] = unit.tag;
        } else if (this.grid[unit.x - 1][unit.y] == 'SW' &&
            unit.tag == 'X') {
            this.grid[unit.x][unit.y] = 'P';
            unit.x--;
            if (unit.range != 2) unit.range++;
            this.grid[unit.x][unit.y] = unit.tag;
        }
    }
    rightUnit(unit) {
        if (this.grid[unit.x + 1][unit.y] == 'P') {
            this.grid[unit.x][unit.y] = 'P';
            unit.x++;
            this.grid[unit.x][unit.y] = unit.tag;
        } else if (this.grid[unit.x + 1][unit.y] == 'HP' &&
            unit.tag == 'X') {
            this.grid[unit.x][unit.y] = 'P';
            unit.x++;
            if (unit.currentHP != unit.maxHP) unit.currentHP++;
            this.grid[unit.x][unit.y] = unit.tag;
        } else if (this.grid[unit.x + 1][unit.y] == 'SW' &&
            unit.tag == 'X') {
            this.grid[unit.x][unit.y] = 'P';
            unit.x++;
            if (unit.range != 2) unit.range++;
            this.grid[unit.x][unit.y] = unit.tag;
        }
    }
    attackHero() {

        if (this.grid[this.stateHero.x + 1][this.stateHero.y] == 'E' ||
            this.grid[this.stateHero.x - 1][this.stateHero.y] == 'E' ||
            this.grid[this.stateHero.x][this.stateHero.y + 1] == 'E' ||
            this.grid[this.stateHero.x][this.stateHero.y - 1] == 'E') {
            console.table(this.enemyArr);
            console.table(this.stateHero);
            alert('meleeAttack');
            for (let i = 0; i < this.enemyArr.length; i++) {
                if ((this.enemyArr[i].x == this.stateHero.x + 1 ||
                    this.enemyArr[i].x == this.stateHero.x - 1 ||
                    this.enemyArr[i].x == this.stateHero.x) &&
                    (this.enemyArr[i].y == this.stateHero.y + 1 ||
                        this.enemyArr[i].y == this.stateHero.y - 1 ||
                        this.enemyArr[i].y == this.stateHero.y)) {
                    this.enemyArr[i].currentHP--;
                    if (this.enemyArr[i].currentHP == 0) {
                        this.grid[this.enemyArr[i].x][this.enemyArr[i].y] = 'P';
                        if (!this.enemyArr[i + 1]) {
                            this.enemyArr.pop();
                        } else {
                            this.enemyArr[i] = this.enemyArr.pop();
                        }
                    }
                }
            }
        }
        if (this.stateHero.range == 2 &&

            (this.stateHero.x == 1 ||
                this.stateHero.x == 59)) {
            alert('Мало места для размаха');
            console.table(this.stateHero);
        }
        else if (this.stateHero.range == 2 &&
            (this.grid[this.stateHero.x + 2][this.stateHero.y] == 'E' ||
                this.grid[this.stateHero.x - 2][this.stateHero.y] == 'E' ||
                this.grid[this.stateHero.x][this.stateHero.y + 2] == 'E' ||
                this.grid[this.stateHero.x][this.stateHero.y - 2] == 'E')) {
            for (let i = 0; i < this.enemyArr.length; i++) {
                if ((this.enemyArr[i].x == this.stateHero.x + 2 ||
                    this.enemyArr[i].x == this.stateHero.x - 2 ||
                    this.enemyArr[i].x == this.stateHero.x) &&
                    (this.enemyArr[i].y == this.stateHero.y + 2 ||
                        this.enemyArr[i].y == this.stateHero.y - 2 ||
                        this.enemyArr[i].y == this.stateHero.y)) {
                    this.enemyArr[i].currentHP--;
                    if (this.enemyArr[i].currentHP == 0) {
                        this.grid[this.enemyArr[i].x][this.enemyArr[i].y] = 'P';
                        if (!this.enemyArr[i + 1]) {
                            this.enemyArr.pop();
                        } else {
                            this.enemyArr[i] = this.enemyArr.pop();
                        }
                    }
                }
            }
        }
    }

    enemyMove(unit, j) {
        if (j == 0) {
            this.leftUnit(unit);
        } else if (j == 1) {
            this.rightUnit(unit);
        } else if (j == 2) {
            this.upUnit(unit);
        } else {
            this.downUnit(unit);
        }
    }
    checkAttackEnemy() {
        if (this.grid[this.stateHero.x + 1][this.stateHero.y] == 'E' ||
            this.grid[this.stateHero.x - 1][this.stateHero.y] == 'E' ||
            this.grid[this.stateHero.x][this.stateHero.y + 1] == 'E' ||
            this.grid[this.stateHero.x][this.stateHero.y - 1] == 'E') {
            alert('You were hit');
            this.stateHero.currentHP--;
            if (this.stateHero.currentHP == 0) {
                alert('YOU ARE DEAD');
            }

        }
    }

    //reder
    renderRect(x1, y1, x2, y2, color, alpha) {
        alpha = alpha || 1;
        this.ctx.beginPath();
        this.ctx.globalAlpha = alpha;
        this.ctx.rect(config.amount * x1, config.amount * y1, x2, y2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }
    renderImage(img, x1, y1, size) {
        this.ctx.drawImage(img, config.amount * x1, config.amount * y1, size, size);
    }
    renderHPbarUnit(unit) {
        this.renderRect(unit.x, unit.y,
            config.amount * (unit.currentHP / unit.maxHP), -6, 'lime');
    }
    renderAttack() {
        this.renderRect(this.stateHero.x + 1, this.stateHero.y, config.amount, config.amount, 'red', .1);
        this.renderRect(this.stateHero.x - 1, this.stateHero.y, config.amount, config.amount, 'red', .1);
        this.renderRect(this.stateHero.x, this.stateHero.y + 1, config.amount, config.amount, 'red', .1);
        this.renderRect(this.stateHero.x, this.stateHero.y - 1, config.amount, config.amount, 'red', .1);
        if (this.stateHero.range == 2) {
            this.renderRect(this.stateHero.x + this.stateHero.range, this.stateHero.y, config.amount, config.amount, 'red', .2);
            this.renderRect(this.stateHero.x - this.stateHero.range, this.stateHero.y, config.amount, config.amount, 'red', .2);
            this.renderRect(this.stateHero.x, this.stateHero.y + this.stateHero.range, config.amount, config.amount, 'red', .2);
            this.renderRect(this.stateHero.x, this.stateHero.y - this.stateHero.range, config.amount, config.amount, 'red', .2);
        }
    }

    //preInit == Load
    loadImages() {
        this.heroImg.src = 'tile-P.png';
        this.enemyImg.src = 'tile-E.png';
        this.wallImg.src = 'tile-W.png';
        this.pathImg.src = 'tile-.png';
        this.swImg.src = 'tile-SW.png';
        this.hpImg.src = 'tile-HP.png';
    }
}
let anim = new Animation();
anim.loadImages();
(anim.heroImg && anim.enemyImg && anim.pathImg && anim.wallImg && anim.swImg && anim.hpImg).onload = function () {
    anim.init();
}

document.addEventListener('keydown', function (event) {
    if ((event.code == 'KeyW' ||
        event.code == 'KeyA' ||
        event.code == 'KeyS' ||
        event.code == 'KeyD' ||
        event.code == 'Space') &&
        anim.stateHero.currentHP != 0) {
        anim.updatePosition(event.code);
    }
});