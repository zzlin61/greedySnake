const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
// get getContext() method 會傳一個 canvas 的drawing context
// drawing context 可以用來在 canvas 內畫圖
const unit = 20;   
const row = canvas.height/ unit;
const column = canvas.width/ unit;

let snake = []; // 儲存蛇長度的陣列 
// 定義初始蛇座標
function createSnake(){
    snake[0]={
        x:80,
        y:0,
    };
    snake[1]={
        x:60,
        y:0,
    };
    snake[2]={
        x:40,
        y:0,
    };
    snake[3]={
        x:20,
        y:0,
    };
}

// 果實物件
class Fruit{
    constructor() { // 定義座標範圍
        this.x = Math.floor(Math.random() * column) * unit;
        this.y = Math.floor(Math.random() * row) * unit;
    }
    drawFruit() { // 畫出果實
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, unit, unit);
    }

    pickALocation() { // 給定位置
        let overlapping = false;
        let new_x;
        let new_y;

        function checkOverlap(new_x, new_y) { // 隨機位置
            for( let i = 0; i < snake.length; i++){
                if (new_x == snake[i].x && new_y == snake[i].y){
                    overlapping = true;
                    return;
                } else {
                    overlapping = false;
                }
            }
        }

        do{
            new_x = Math.floor(Math.random() * column) * unit;
            new_y = Math.floor(Math.random() * row) * unit;
            checkOverlap(new_x, new_y);
        } while(overlapping);
        this.x = new_x;
        this.y = new_y;
    }
}

// 初始設定
createSnake();
let myFruit = new Fruit();
window.addEventListener("keydown", changeDirection);
let d = "Right"; // 預設蛇向右走
function changeDirection(e){
    if (e.key == "ArrowRight" && d != "Left"){
        console.log("right");
        d = "Right";
    } else if (e.key == "ArrowDown" && d != "Up"){
        console.log("down");
        d = "Down"; 
    } else if (e.key == "ArrowLeft" && d != "Right"){
        console.log("left");
        d = "Left";
    } else if (e.key == "ArrowUp" && d != "Down"){
        console.log("up");
        d = "Up";
    }
    // 每次按下上下左右鍵之後，在下一幀被畫出來之前
    // 不接受任何 keydown 事件
    // 這樣可以防止連續按鍵導致蛇在邏輯上自殺
    window.removeEventListener("keydown", changeDirection);

}

let score = 0;
let highestScore;
loadHigestScore();
document.getElementById("myScore").innerHTML = "Score: " + score;
document.getElementById("myScore2").innerHTML = "The Highest Score: " + highestScore;

function draw(){
    // 遊戲結束設定 為何i=1 因為頭是0. 
    for(let i = 1; i < snake.length; i++){
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            clearInterval(myGame);
            alert("Game Over");
            return;
        }
    }
    
    // 重置畫布
    ctx.fillStyle ="black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    myFruit.drawFruit();
    
    for (let i = 0; i < snake.length; i++){
        if ( i == 0) {
            ctx.fillStyle = "lightgreen"; //snake head
        } else {
            ctx.fillStyle = "lightblue"; // snake body
        }   
        ctx.strokeStyle = "white"; //蛇外框顏色
        // 穿牆功能 (畫出蛇之前就要更正超出牆的座標) 
        if( snake[i].x >= canvas.width){
            snake[i].x = 0;
        }

        if( snake[i].x < 0){
            snake[i].x = canvas.width - unit;
        }

        if( snake[i].y >= canvas.height){
            snake[i].y = 0;
        }

        if( snake[i].y < 0 ){
            snake[i].y = canvas.height - unit;
        }

        // 畫出蛇
        ctx.fillRect(snake[i].x, snake[i].y, unit, unit); // x, y, height, width
        ctx.strokeRect(snake[i].x, snake[i].y, unit, unit); // x, y, height, width
    }
    //以目前的 d 變數方向，來決定蛇的下一幀數要放在哪個座標
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    if (d == "Left") {
        snakeX -= unit;
    } else if (d == "Up"){
        snakeY -= unit;
    } else if (d == "Right"){
        snakeX += unit;
    } else if (d == "Down"){
        snakeY += unit;
    }
    // 更新蛇的頭位置
    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    // 確認蛇是否吃到果實
    if (snake[0].x == myFruit.x && snake[0].y == myFruit.y){
        myFruit.pickALocation();
        score++
        setHighestScore(score);
        document.getElementById("myScore").innerHTML = "Score: " + score;
        document.getElementById("myScore2").innerHTML = "The Highest Score: " + highestScore;
        
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
    window.addEventListener("keydown", changeDirection);
    
}



// 每 0.1s 更新畫布
let myGame = setInterval(draw, 100);

function loadHigestScore(){
    if (localStorage.getItem("highestScore") == null){
        highestScore = 0;
    } else {
        highestScore =  Number(localStorage.getItem("highestScore"));
    }
}

function setHighestScore(score){
    if ( score > highestScore){
        localStorage.setItem("highestScore", score);
        highestScore = score;
    }
}