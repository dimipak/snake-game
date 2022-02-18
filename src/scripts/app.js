define("States/State", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.State = void 0;
    class State {
        constructor(app) {
            this.appElement = app;
        }
        createCanvas() {
            let canvas = document.createElement("canvas");
            canvas.style.position = "absolute";
            this.appElement.appendChild(canvas);
            canvas.width = this.appElement.clientWidth;
            canvas.height = this.appElement.clientHeight;
            // return canvas.getContext("2d")!
            return canvas;
        }
    }
    exports.State = State;
});
define("Layers/Layer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Layer = void 0;
    class Layer {
        constructor(canvas) {
            this.canvas = canvas;
            this.context = canvas.getContext("2d");
        }
        setUserStats(userStats) {
            this.userStats = userStats;
            return this;
        }
        getUserStats() {
            return this.userStats;
        }
        clear() {
            this.context.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        }
    }
    exports.Layer = Layer;
});
define("Resources/SnakeTail", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SnakeTail = void 0;
    class SnakeTail {
        constructor(context) {
            this.context = context;
        }
        setPos(pos) {
            this.posBefore = this.pos;
            this.pos = pos;
        }
        getPos() {
            return this.pos;
        }
        getPosBefore() {
            return this.posBefore;
        }
        draw() {
            if (this.pos == undefined)
                return;
            this.context.fillRect(this.pos.x, this.pos.y, 32, 32);
            this.context.fillStyle = "green";
            this.context.strokeRect(this.pos.x, this.pos.y, 32, 32);
            this.context.strokeStyle = "blue";
        }
    }
    exports.SnakeTail = SnakeTail;
});
define("Resources/Snake", ["require", "exports", "Resources/SnakeTail"], function (require, exports, SnakeTail_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SnakeDirection = exports.Snake = void 0;
    var SnakeDirection;
    (function (SnakeDirection) {
        SnakeDirection[SnakeDirection["UP"] = 0] = "UP";
        SnakeDirection[SnakeDirection["DOWN"] = 1] = "DOWN";
        SnakeDirection[SnakeDirection["LEFT"] = 2] = "LEFT";
        SnakeDirection[SnakeDirection["RIGHT"] = 3] = "RIGHT";
    })(SnakeDirection || (SnakeDirection = {}));
    exports.SnakeDirection = SnakeDirection;
    class Snake {
        constructor(context) {
            this.tail = [];
            this.context = context;
        }
        setPos(newPos) {
            this.posBefore = this.pos;
            this.pos = newPos;
        }
        setDirection(d) {
            this.direction = d;
        }
        getDirection() {
            return this.direction;
        }
        getPos() {
            return this.pos;
        }
        addTail() {
            this.tail.push(new SnakeTail_1.SnakeTail(this.context));
        }
        getTail() {
            return this.tail;
        }
        draw() {
            this.drawHead();
            this.drawTail();
        }
        drawHead() {
            this.context.fillRect(this.pos.x, this.pos.y, 32, 32);
            this.context.fillStyle = "green";
            this.context.strokeRect(this.pos.x, this.pos.y, 32, 32);
            this.context.strokeStyle = "blue";
        }
        drawTail() {
            for (let i = 0; i < this.tail.length; i++) {
                if (this.pos != this.posBefore) {
                    let tailPos = (i == 0) ? this.posBefore : this.tail[i - 1].getPosBefore();
                    this.tail[i].setPos(tailPos);
                }
                else {
                    this.tail[i].setPos(this.tail[i].getPos());
                }
                this.tail[i].draw();
            }
        }
    }
    exports.Snake = Snake;
});
define("Resources/FoodObjective", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FoodObjective = void 0;
    class FoodObjective {
        constructor(context) {
            this.imgPath = "./assets/img/fruit.png";
            this.width = 32;
            this.height = 32;
            this.context = context;
            this.loadAssets();
        }
        loadAssets() {
            this.img = new Image();
            this.img.src = this.imgPath;
        }
        setPos(x, y) {
            this.pos = {
                x: x,
                y: y
            };
        }
        getPos() {
            return this.pos;
        }
        draw() {
            this.context.drawImage(this.img, this.pos.x * this.width, this.pos.y * this.height);
        }
    }
    exports.FoodObjective = FoodObjective;
});
define("Layers/BattlefieldLayer", ["require", "exports", "Layers/Layer", "Resources/Snake", "Resources/FoodObjective"], function (require, exports, Layer_1, Snake_1, FoodObjective_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BattlefieldLayer = void 0;
    class BattlefieldLayer extends Layer_1.Layer {
        constructor(canvas) {
            super(canvas);
            this.step = 32;
            this.initSnake();
            this.initObjective();
        }
        initSnake() {
            this.snake = new Snake_1.Snake(this.context);
            this.snake.setPos({
                x: this.setPos(9),
                y: this.setPos(10)
            });
        }
        initObjective() {
            this.foodObjective = new FoodObjective_1.FoodObjective(this.context);
            let x;
            let y;
            do {
                x = Math.floor(Math.random() * 17 + 1);
                y = Math.floor(Math.random() * 15 + 3);
            } while (x == 9 && y == 10);
            this.foodObjective.setPos(x, y);
        }
        setPos(n) {
            return n * this.step;
        }
        getPos(n) {
            return n / this.step;
        }
        update() {
            const snakePos = this.snake.getPos();
            const objPos = this.foodObjective.getPos();
            this.updateSnake(snakePos);
            if (this.getPos(snakePos.x) == objPos.x && this.getPos(snakePos.y) == objPos.y) {
                this.updateFoodObjPosition(objPos);
                this.snake.addTail();
                this.userStats.score++;
            }
        }
        render() {
            this.clear();
            this.foodObjective.draw();
            this.snake.draw();
        }
        event(e) {
            this.setSnakeDirection(e);
        }
        setSnakeDirection(e) {
            const snakeDirection = this.snake.getDirection();
            if (e.key === "ArrowUp" && snakeDirection != Snake_1.SnakeDirection.DOWN) {
                this.snake.setDirection(Snake_1.SnakeDirection.UP);
            }
            else if (e.key === "ArrowDown" && snakeDirection != Snake_1.SnakeDirection.UP) {
                this.snake.setDirection(Snake_1.SnakeDirection.DOWN);
            }
            else if (e.key === "ArrowRight" && snakeDirection != Snake_1.SnakeDirection.LEFT) {
                this.snake.setDirection(Snake_1.SnakeDirection.RIGHT);
            }
            else if (e.key === "ArrowLeft" && snakeDirection != Snake_1.SnakeDirection.RIGHT) {
                this.snake.setDirection(Snake_1.SnakeDirection.LEFT);
            }
        }
        updateSnake(snakePos) {
            this.updateSnakePosition(snakePos);
        }
        updateSnakePosition(snakePos) {
            const snakeDirection = this.snake.getDirection();
            let newPos;
            switch (snakeDirection) {
                case Snake_1.SnakeDirection.UP:
                    newPos = {
                        x: this.setPos(this.getPos(snakePos.x)),
                        y: this.setPos(this.getPos(snakePos.y) - 1)
                    };
                    break;
                case Snake_1.SnakeDirection.DOWN:
                    newPos = {
                        x: this.setPos(this.getPos(snakePos.x)),
                        y: this.setPos(this.getPos(snakePos.y) + 1)
                    };
                    break;
                case Snake_1.SnakeDirection.RIGHT:
                    newPos = {
                        x: this.setPos(this.getPos(snakePos.x) + 1),
                        y: this.setPos(this.getPos(snakePos.y))
                    };
                    break;
                case Snake_1.SnakeDirection.LEFT:
                    newPos = {
                        x: this.setPos(this.getPos(snakePos.x) - 1),
                        y: this.setPos(this.getPos(snakePos.y))
                    };
                    break;
                default:
                    newPos = snakePos;
                    break;
            }
            // Check for wall hit
            if (this.getPos(newPos.x) == 0 || this.getPos(newPos.x) == 18 || this.getPos(newPos.y) == 2 || this.getPos(newPos.y) == 18) {
                console.log("game over by hitting the wall");
                newPos = snakePos;
            }
            // Check for tail hit
            this.snake.getTail().forEach(tail => {
                const pos = tail.getPos();
                if (pos == undefined)
                    return;
                if (this.getPos(newPos.x) == this.getPos(pos.x) && this.getPos(newPos.y) == this.getPos(pos.y)) {
                    console.log("game over by hitting the tail");
                    newPos = snakePos;
                }
            });
            this.snake.setPos(newPos);
        }
        updateFoodObjPosition(objPos) {
            let snakePositions = [];
            const headpos = this.snake.getPos();
            snakePositions.push({
                x: this.getPos(headpos.x),
                y: this.getPos(headpos.y)
            });
            this.snake.getTail().forEach(tail => {
                const pos = tail.getPos();
                if (pos == undefined)
                    return;
                snakePositions.push({
                    x: this.getPos(pos.x),
                    y: this.getPos(pos.y)
                });
            });
            let foundPos;
            let x;
            let y;
            do {
                foundPos = true;
                x = Math.floor(Math.random() * 17 + 1);
                y = Math.floor(Math.random() * 15 + 3);
                snakePositions.forEach(snekpos => {
                    if (snekpos.x == x && snekpos.y == y) {
                        foundPos = false;
                    }
                });
            } while (!foundPos);
            this.foodObjective.setPos(x, y);
        }
    }
    exports.BattlefieldLayer = BattlefieldLayer;
});
define("Resources/Score", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Score = void 0;
    class Score {
        constructor(context) {
            this.score = 0;
            this.context = context;
            this.context.font = "40px Arial";
            this.context.fillStyle = "white";
        }
        addScore() {
            this.score++;
        }
        setScore(score) {
            this.score = score;
        }
        setPos(pos) {
            this.pos = pos;
        }
        draw() {
            this.context.fillText(this.score.toString(), 70, 55);
        }
    }
    exports.Score = Score;
});
define("Layers/ScoreLayer", ["require", "exports", "Layers/Layer", "Resources/Score"], function (require, exports, Layer_2, Score_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScoreLayer = void 0;
    class ScoreLayer extends Layer_2.Layer {
        constructor(canvas) {
            super(canvas);
            this.score = new Score_1.Score(this.context);
        }
        event(e) {
        }
        render() {
            this.clear();
            this.score.draw();
        }
        update() {
            this.score.setScore(this.userStats.score);
        }
    }
    exports.ScoreLayer = ScoreLayer;
});
define("States/GameState", ["require", "exports", "States/State", "Layers/BattlefieldLayer", "Layers/ScoreLayer"], function (require, exports, State_1, BattlefieldLayer_1, ScoreLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GameState = void 0;
    class GameState extends State_1.State {
        constructor(app) {
            super(app);
            this.userStats = {
                score: 0,
                life: 3
            };
            document.addEventListener("keydown", (e) => {
                this.keyPressEvent(e);
            });
            this.initBattlefieldLayer(this.createCanvas());
            this.initScoreLayer(this.createCanvas());
        }
        initBattlefieldLayer(canvas) {
            this.battlefieldLayer = new BattlefieldLayer_1.BattlefieldLayer(canvas);
            this.battlefieldLayer.setUserStats(this.userStats);
        }
        initScoreLayer(canvas) {
            this.scoreLayer = new ScoreLayer_1.ScoreLayer(canvas);
            this.scoreLayer.setUserStats(this.userStats);
        }
        keyPressEvent(e) {
            this.battlefieldLayer.event(e);
            this.scoreLayer.event(e);
        }
        update() {
            this.battlefieldLayer.update();
            this.scoreLayer.setUserStats(this.battlefieldLayer.getUserStats()).update();
        }
        render() {
            this.battlefieldLayer.render();
            this.scoreLayer.render();
        }
    }
    exports.GameState = GameState;
});
define("config", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.app = void 0;
    const app = {
        "GameTitle": "Snake Game",
        "defaultTimeInt": 100,
        "app_id": "app",
        "width": 608,
        "height": 608
    };
    exports.app = app;
});
define("Game", ["require", "exports", "States/GameState", "config"], function (require, exports, GameState_1, config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Game = void 0;
    class Game {
        constructor() {
            this.intervalTime = 100;
            this.states = [];
            this.initApp();
            this.setGameArea();
            this.setState();
        }
        initApp() {
            this.width = config_1.app.width;
            this.height = config_1.app.height;
            this.intervalTime = config_1.app.defaultTimeInt;
        }
        setGameArea() {
            this.gameArea = document.getElementById(config_1.app.app_id);
            if (this.gameArea == null || this.gameArea == undefined) {
                console.log("Game area could not be defined");
                throw new Error("Game area could not be defined");
            }
        }
        setState() {
            this.states.push(new GameState_1.GameState(this.gameArea));
        }
        gameOver() {
            clearInterval(this.gameInterval);
        }
        update() {
            this.states.forEach(state => {
                state.update();
            });
        }
        render() {
            this.states.forEach(state => {
                state.render();
            });
        }
        run() {
            setInterval(() => {
                this.update();
                this.render();
            }, 100);
            console.log("Game started!");
        }
    }
    exports.Game = Game;
});
define("app", ["require", "exports", "Game"], function (require, exports, Game_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const game = new Game_1.Game();
    game.run();
});
