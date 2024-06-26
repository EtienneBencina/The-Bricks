var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.beginPath();
//ctx.arc(75, 75, 10, 0, Math.PI * 2, true);
ctx.closePath();
ctx.fill();
var countBricks=30;

const mariobrick = document.getElementById("mariobrick");
const question = document.getElementById("question");
const paddle = document.getElementById("paddle");
const ball = document.getElementById("ball");



function drawIt() {
    document.getElementById("start").disabled=true;
    document.getElementById("canvas").style.visibility="visible";
    document.getElementById("start").style.visibility="hidden";
    document.getElementById("title").style.visibility="hidden";
    document.getElementById("info").style.visibility="visible";
    var x = canvas.width / 2;
    var y = 350;
    var dx = 0;
    var dy = 4;
    var WIDTH;
    var HEIGHT;
    var r = 10;
    var ctx;
    var tocke;
    var sekunde;
    var sekundeI;
    var minuteI;
    var intTimer;
    var izpisTimer;
    var start = true;
    
    function timer() {
        if (start == true) {
            sekunde++;
            sekundeI = ((sekundeI = (sekunde % 60)) > 9) ? sekundeI : "0" + sekundeI;
            minuteI = ((minuteI = Math.floor(sekunde / 60)) > 9) ? minuteI : "0" + minuteI;
            izpisTimer = minuteI + ":" + sekundeI;
            $("#cas").html(izpisTimer);
        }
        else {
            sekunde = 0;
            //izpisTimer = "00:00";
            $("#cas").html(izpisTimer);
        }
    }
    function init() {
        sekunde = 0;
        izpisTimer = "00:00";
        intTimer = setInterval(timer, 1000);
        tocke = 0;
        $("#tocke").html(tocke);
        ctx = $('#canvas')[0].getContext("2d");
        WIDTH = $("#canvas").width();
        HEIGHT = $("#canvas").height();
        return intervalId = setInterval(draw, 10);

    }

    

    

    

    function clear() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }
    //END LIBRARY CODE
    function draw() {
        
        clear();
        ctx.drawImage(ball, x, y, 16, 16);
        //premik ploščice levo in desno
        if (rightDown) {
            if ((paddlex + paddlew) < WIDTH) {
                paddlex += 5;
            } else {
                paddlex = WIDTH - paddlew;
            }
        }
        else if (leftDown) {
            if (paddlex > 0) {
                paddlex -= 5;
            } else {
                paddlex = 0;
            }
        }
        ctx.drawImage(paddle, paddlex, HEIGHT - paddleh, paddlew, paddleh);

        //riši opeke
        for (i = 0; i < NROWS; i++) {
            for (j = 0; j < NCOLS; j++) {
                if (bricks[i][j] == 1) {
                    ctx.drawImage(
                        mariobrick,
                        j * (BRICKHEIGHT + PADDING) + PADDING,
                        i * (BRICKHEIGHT + PADDING) + PADDING,
                        BRICKWIDTH,
                        BRICKHEIGHT

                    );

                }
                else if (bricks[i][j] == 2) {
                    ctx.drawImage(
                        question,
                        j * (BRICKHEIGHT + PADDING) + PADDING,
                        i * (BRICKHEIGHT + PADDING) + PADDING,
                        BRICKWIDTH,
                        BRICKHEIGHT

                    );
                }
            }
        }

        rowheight = BRICKHEIGHT + PADDING; //Smo zadeli opeko?
        colwidth = BRICKWIDTH + PADDING;
        row = Math.floor(y / rowheight);
        col = Math.floor(x / colwidth);
        //Če smo zadeli opeko, vrni povratno kroglo in označi v tabeli, da opeke ni več
        if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
            dy = -dy; bricks[row][col] = 0;
            tocke += 100; //v primeru, da imajo opeko večjo utež lahko prištevate tudi npr. 2 ali 3; pred tem bi bilo smiselno dodati še kakšen pogoj, ki bi signaliziral mesta opek, ki imajo višjo vrednost
            countBricks--;
            $("#tocke").html(tocke);
        }
        else if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 2) {
            dy = -dy; bricks[row][col] = 0;
            tocke += 200; //v primeru, da imajo opeko večjo utež lahko prištevate tudi npr. 2 ali 3; pred tem bi bilo smiselno dodati še kakšen pogoj, ki bi signaliziral mesta opek, ki imajo višjo vrednost
            countBricks--;
            $("#tocke").html(tocke);
        }
        if(countBricks==0){
            win();
        }
        if (x + dx > WIDTH -10 || x + dx < 0 - 5)
            dx = -dx;
        if (y + dy < 0 )
            dy = -dy;
        else if (y + dy > HEIGHT - 30) {
            start = false;
            if (x > paddlex && x < paddlex + paddlew) {
                dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
                dy = -dy;
                start = true;
            }
            else if (y + dy > HEIGHT - r){
                lose();
                clearInterval(intervalId);
            }
        }
        x += dx;
        y += dy;
    }


    init();
    var paddlex;
    var paddleh;
    var paddlew;



    function init_paddle() {
        paddlex = WIDTH / 2;
        paddleh = 20;
        paddlew = 90;

    }


    init_paddle();
    var rightDown = false;
    var leftDown = false;

    //nastavljanje leve in desne tipke
    function onKeyDown(evt) {
        if (evt.keyCode == 39)
            rightDown = true;
        else if (evt.keyCode == 37) leftDown = true;
    }

    function onKeyUp(evt) {
        if (evt.keyCode == 39)
            rightDown = false;
        else if (evt.keyCode == 37) leftDown = false;
    }
    $(document).keydown(onKeyDown);
    $(document).keyup(onKeyUp);


    var canvasMinX;
    var canvasMaxX;

    function init_mouse() {
        //canvasMinX = $("#canvas").offset().left;
        canvasMinX = $("canvas").offset().left;
        canvasMaxX = canvasMinX + WIDTH;
    }

    function onMouseMove(evt) {
        if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
            paddlex = evt.pageX - canvasMinX - paddlew / 2;
        }
    }
    $(document).mousemove(onMouseMove);

    function win() {
        clearInterval(intervalId);
        Swal.fire({
            
          icon: "success",
          title: "You win!",
          text: "Your score was: " + tocke,
          
          confirmButtonText: "Try again?",
          confirmButtonColor: "#505050",
        }).then(function (isConfirm) {
          if (isConfirm) {
            location.reload();
          }
        });
      }
      function lose() {
        clearInterval(intervalId);
        Swal.fire({
            
          icon: "error",
          title: "You lose!",
          text: "Your score was: " + tocke,
          confirmButtonText: "Try again?",
          confirmButtonColor: "#505050",
        }).then(function (isConfirm) {
          if (isConfirm) {
            location.reload();
          }
        });
      }

    init_mouse();
    var bricks;
    var NROWS;
    var NCOLS;
    var BRICKWIDTH;
    var BRICKHEIGHT;
    var PADDING;

    function initbricks() { //inicializacija opek - polnjenje v tabelo
        NROWS = 5;
        NCOLS = 6;
        BRICKWIDTH = 50;
        BRICKHEIGHT = 50;
        PADDING = 1.6;
        
        bricksArray = [
            [
                [1, 1, 1, 1, 1, 1],
                [1, 1, 2, 2, 1, 1],
                [1, 2, 1, 1, 2, 1],
                [1, 1, 2, 2, 1, 1],
                [1, 1, 1, 1, 1, 1],
            ],
            [
                [2, 1, 1, 1, 1, 2],
                [1, 2, 1, 1, 2, 1],
                [1, 1, 2, 2, 1, 1],
                [1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1],
            ],
            [
                [1, 1, 2, 2, 1, 1],
                [1, 2, 1, 1, 2, 1],
                [2, 1, 1, 1, 1, 2],
                [1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1],
            ],
            [
                [1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1],
                [2, 2, 2, 2, 2, 2],
                [1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1],
            ],
            
        ];
        let brickSelect = Math.floor(Math.random() * 4);
        bricks = bricksArray[brickSelect];


    }
    initbricks();
}