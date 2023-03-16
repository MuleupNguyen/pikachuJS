const data = [];
for (let i = 1; i <= 36; i++) {
    const obj = {
        id: i,
        image: "./images/pieces" + i + ".png"
    };
    data.push(obj);
}
let timeDefault = 600;
const ROW_COUNT = 12;
const COL_COUNT = 12;
const LENGTH_COUNT = ROW_COUNT*2
let score = 0;
let selectedTiles = [];
let index = 0;
var _pokemons = [];
let level = 1

//Lớp Point
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
    getX(){
        return this.x;
    }
    getY(){
        return this.y;
    }
}
function home() {
    location.reload()
}

function changeLocation() {
    resetArr()
    createReset()
    createBoard()
}
let timer
function setLevel(l) {
    const audio4 = document.getElementById('audio4')
    const sLevel = document.getElementById('level')
    const sScore = document.getElementById('score')
    audio4.play()
    sLevel.textContent = l
    sScore.textContent = score
    level = l;
    _pokemons = []
    const menu = document.getElementById('start-game');
    menu.style.display = 'none'
    resetArr()
    createData()
    createBoard()
    timeDefault = 600

    clearInterval(timer)
    // hẹn giờ thời gian cho game
    timer = setInterval(()=> {
        const timeEle = document.getElementById("time")
        timeEle.textContent = timeDefault;
        timeDefault--;
        if (timeDefault === 0) {
            clearInterval(timer)
            location.reload();
        }
    },1000)
}

function nextlevel(l) {
    setLevel(l)
}
//set điểm số
function setScore() {
    const sScore = document.getElementById('score')
    sScore.textContent = score
}

// hàm tạo mảng random
function createData() {
    let num=[]
    for(let i = 0; i< LENGTH_COUNT; i++) {
        num[i] = i+1;
    }
    let nums = num.flatMap(num => Array(6).fill(num));

// Trộn mảng nums
    for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    let index =0;
// Điền các giá trị vào mảng 2 chiều
    for(let k = 0; k<ROW_COUNT;k++) {
        const row = [];
        for(let n = 0; n<ROW_COUNT;n++) {
            row.push(nums[index]);
            index++;
        }
        _pokemons.push(row);
    }

}

//reset mảng
function createReset() {
    let nums=[]
    let index2 = 0
    //tạo ra mảng để biết nốt nào đã ăn
    const e = Array.from({ length: ROW_COUNT}, () => Array.from({ length: COL_COUNT}, () => 0));
    for (let i1 = 0; i1 < ROW_COUNT; ++i1) {
        for (let j1 = 0; j1 < COL_COUNT; ++j1) {
            e[i1][j1] = _pokemons[i1][j1] !== -1 ? 1 : 0;
        }
    }
    //đưa về mảng 1 chiều để trộn mảng
    for(let k1 = 0; k1<ROW_COUNT;k1++) {
        for(let n1 = 0; n1<ROW_COUNT;n1++) {
            if(_pokemons[k1][n1] != -1){
                nums[index2] = _pokemons[k1][n1];
                index2++;
            }
        }
    }
    _pokemons = []
// Trộn mảng nums
    for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    let index =0;
// Điền các giá trị vào mảng 2 chiều
    for(let k = 0; k<ROW_COUNT;k++) {
        const row = [];
        for(let n = 0; n<ROW_COUNT;n++) {
            if(e[k][n] != 0) {
                row.push(nums[index]);
                index++;
            }else {
                row.push(-1);
            }
        }
        _pokemons.push(row);
    }

}

//hàm tạo hình ảnh lên màn hình
function createBoard() {
    const boardContainer = document.querySelector("#board-container");
    for (let row = 0; row < ROW_COUNT; row++) {
        for (let col = 0; col < COL_COUNT; col++) {
                const tile = _pokemons[row][col];
                const tileElement = document.createElement("div");

                tileElement.classList.add("tile");
                tileElement.dataset.row = row;
                tileElement.dataset.col = col;
                tileElement.dataset.tile = tile;

                if(tile != -1) {
                    //lấy ra ảnh
                    const img = document.createElement("img");
                    const imgInData = data.find(function(item) {
                        return  item.id === tile;
                    });
                    img.src = imgInData.image
                    img.width = 50;
                    img.height = 50;
                    tileElement.appendChild(img)
                    tileElement.addEventListener("click", handleTileClick);
                    boardContainer.appendChild(tileElement);
                }else {
                    tileElement.classList.add("matched");
                    tileElement.classList.add("selected");
                    boardContainer.appendChild(tileElement);
                }
        }
    }
}

// xử lí ăn 2 ảnh
function handleTileClick() {
    if (selectedTiles.length === 2) {
        return;
    }
    const audio2 = document.getElementById('audio2')
    audio2.play()
    // Chọn tile và thêm class selected
    const selectedTile = {
        row: this.dataset.row,
        col: this.dataset.col,
        tile: this.dataset.tile,
    };
    selectedTiles.push(selectedTile);
    $(this).addClass("selected")
    if (selectedTiles.length === 2) {
        // Lấy 2 tiles được chọn
        const tile1 = selectedTiles[0];
        const tile2 = selectedTiles[1];
        const x1 = parseInt(tile1.row);
        const y1 = parseInt(tile1.col);
        const x2 = parseInt(tile2.row);
        const y2 = parseInt(tile2.col)
        // Kiểm tra nếu tile1 và tile2 khác nhau
        if (!selectPokemon(tile1.tile, tile2.tile, x1, y1, x2, y2)) {
            // Xóa class selected của các tile và reset selectedTiles
            const audio1 = document.getElementById('audio1')
            audio1.play()
            setTimeout(() => {
                const tiles = document.querySelectorAll(".tile.selected");
                tiles.forEach((tile) => {
                    tile.classList.remove("selected");
                });
                selectedTiles = [];
            }, 500)
        }else{
            const audio5 = document.getElementById('audio5')
            audio5.play()
            document.querySelector(`.tile[data-row="${tile1.row}"][data-col="${tile1.col}"]`).classList.add("matched");
            document.querySelector(`.tile[data-row="${tile2.row}"][data-col="${tile2.col}"]`).classList.add("matched");
            score+=10;
            $('#score-display').text(score)
            _pokemons[parseInt(tile1.row)][parseInt(tile1.col)] = -1
            _pokemons[parseInt(tile2.row)][parseInt(tile2.col)] = -1
            selectedTiles = [];
            // kiểm tra xem màn nào
            uplevel(x1, y1, x2, y2)
            setScore()
            // kiểm tra xem đã ăn hết node chưa
            if(checkPokemon() === 0) nextlevel(level+1)
        }
    }
}

//kiểm tra xem ăn hết chưa để qua màn
function checkPokemon(){
    let count=0;
    for (let i = 0; i < ROW_COUNT; ++i) {
        for (let j = 0; j < COL_COUNT; ++j) {
           if(_pokemons[i][j] !== -1) {
               count++;
           }
        }
    }
    return count;
}


// kiểm tra xem đi qua bao nhiều nút
function findPath(_x, _y, x, y) {
//tạo 1 mảng e tìm xem các node nào chưa được ăn
    const e = Array.from({ length: ROW_COUNT + 2 }, () => Array.from({ length: COL_COUNT + 2 }, () => 0));
    for (let i = 0; i < ROW_COUNT; ++i) {
        for (let j = 0; j < COL_COUNT; ++j) {
            e[i + 1][j + 1] = _pokemons[i][j] !== -1 ? 1 : 0;
        }
    }
    let s = new Point(_x + 1, _y + 1);
    const t = new Point(x + 1, y + 1);
// BFS
    const dx = [-1, 0, 1, 0];
    const dy = [0, 1, 0, -1];
    const q = [];
    const trace = Array.from({ length: e.length }, () => Array.from({ length: e[0].length }, () => new Point(-1, -1)));
    q.push(t);
    trace[t.x][t.y] = new Point(-2, -2);
    e[s.x][s.y] = 0;
    e[t.x][t.y] = 0;
    while (q.length > 0) {
        const u = q.shift();
        if (u.equals(s)) break;
        for (let i = 0; i < 4; ++i) {
            let x_ = u.x + dx[i];
            let y_ = u.y + dy[i];
            while (x_ >= 0 && x_ < e.length && y_ >= 0 && y_ < e[0].length && e[x_][y_] === 0) {
                if (trace[x_][y_].x === -1) {
                    trace[x_][y_] = u;
                    q.push(new Point(x_, y_));
                }
                x_ += dx[i];
                y_ += dy[i];
            }
        }
    }

// trace back
    const res = [];
    if (trace[s.x][s.y].x !== -1) {
        while (s.x !== -2) {
            res.push(new Point(s.x - 1, s.y - 1));
            s = trace[s.x][s.y];
        }
    }
    res.reverse();
    return res;
}


function canConnect(x1, y1, x2, y2) {
    const path = findPath(x1, y1, x2, y2);
    return path.length >= 2 && path.length <= 4;
}

function selectPokemon(tile1, tile2, x1, y1, x2, y2) {
    if (_pokemons[x1][y1] != _pokemons[x2][y2] || !canConnect(x1, y1, x2, y2)) {
        return false;
    }

    drawLine(findPath(x1, y1, x2, y2))
    return true;
}


// hàm kẻ đường ăn
function drawLine(res) {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = "block"
    // đi qua 2 node
    if(res.length == 2){
        const x1Dis = res[0].getX()*51.7+19.5+20;
        const x2Dis = res[1].getX()*51.7+19.5+20;
        const y1Dis = res[0].getY()*51.7+19.5+20;
        const y2Dis = res[1].getY()*51.7+19.5+20;
        context.fillStyle = 'rgba(0,0,0,0)'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.lineWidth = 6;
        context.beginPath();
        context.moveTo(y1Dis,x1Dis);
        context.lineTo(y2Dis,x2Dis);
        //đi qua 3 node
    }else if(res.length == 3) {
        const x1Dis = res[0].getX()*51.7+19.5+20;
        const x2Dis = res[1].getX()*51.7+19.5+20;
        const x3Dis = res[2].getX()*51.7+19.5+20;
        const y1Dis = res[0].getY()*51.7+19.5+20;
        const y2Dis = res[1].getY()*51.7+19.5+20;
        const y3Dis = res[2].getY()*51.7+19.5+20;
        context.fillStyle = 'rgba(0,0,0,0)'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.lineWidth = 6;
        context.beginPath();
        context.moveTo(y1Dis,x1Dis);
        context.lineTo(y2Dis,x2Dis);

        context.moveTo(y2Dis,x2Dis);
        context.lineTo(y3Dis,x3Dis);
        //đi qua 4 node
    }else{
        const x1Dis = res[0].getX()*51.7+19.5+20;
        const x2Dis = res[1].getX()*51.7+19.5+20;
        const x3Dis = res[2].getX()*51.7+19.5+20;
        const x4Dis = res[3].getX()*51.7+19.5+20;
        const y1Dis = res[0].getY()*51.7+19.5+20;
        const y2Dis = res[1].getY()*51.7+19.5+20;
        const y3Dis = res[2].getY()*51.7+19.5+20;
        const y4Dis = res[3].getY()*51.7+19.5+20;
        context.fillStyle = 'rgba(0,0,0,0)'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.lineWidth = 6;
        context.beginPath();
        context.moveTo(y1Dis,x1Dis);
        context.lineTo(y2Dis,x2Dis);

        if(res[1].getX() == -1 && res[2].getX() == -1)  {
            context.moveTo(y2Dis,0);
            context.lineTo(y3Dis,0);

        }else if(res[1].getY() == -1 && res[2].getY() == -1) {
            context.moveTo(0,x2Dis);
            context.lineTo(0,x3Dis);
        }else {
            context.moveTo(y2Dis,x2Dis);
            context.lineTo(y3Dis,x3Dis);
        }


        context.moveTo(y3Dis,x3Dis);
        context.lineTo(y4Dis,x4Dis);
    }
    context.stroke();
    setTimeout(() => {
        canvas.style.display = "none"
    },100)

}

function uplevel(x1, y1, x2, y2) {
    switch (level){
        case 1:
            break
        case 2:
            goLeft(x1, y1, x2, y2)
            break
        case 3:
            goRight(x1, y1, x2, y2)
            break
        case 4:
            goTop(x1, y1, x2, y2)
            break
        case 5:
            goBottom(x1, y1, x2, y2)
            break
        case 6:
            goCenter(x1, y1, x2, y2)
            break
        case 7:
            goCenterCol(x1, y1, x2, y2)
            break
        case 8:
            goTopLAndBottomR(x1, y1, x2, y2)
            break
        case 9:
            goLeftDAnRightU(x1, y1, x2, y2)
            break
    }

}
//đổ sang trái
function goLeft(x1, y1, x2, y2) {
    if(x1 != x2) {
        deleteLeftOneNode(x1, y1)
        deleteLeftOneNode(x2, y2)
    }else {
        deleteLeftTwoNode(x1, y1, y2)
    }
    createBoard()
}

// xóa 2 node khác hàng
function deleteLeftOneNode(x,y) {
    if (y != 11) {
        let current1 = y;
        let index = 0;
        while (current1 != 11) {
            _pokemons[x][y+index] = _pokemons[x][y+index + 1]
            index++;
            current1++;
        }
        _pokemons[x][11] = -1
    }

    resetArr()
}
// xóa 2 node cùng khác hàng
function deleteLeftTwoNode(x, y1, y2) {
    let yMin= 0;
    let yMax = 0;
    if(y1>y2) {
        yMin = y2;
        yMax = y1;
    }else {
        yMin = y1;
        yMax = y2;
    }
    let arrGroup = []
    for (let i=0; i< 12;i++) {
        if(i<yMin || (i>yMin && i<yMax) || i>yMax) {
            arrGroup = [...arrGroup,_pokemons[x][i]]
        }
    }
    for(let i=0; i < 10; i++) {
        _pokemons[x][i] = arrGroup[i]
    }
    _pokemons[x][10] = -1
    _pokemons[x][11] = -1

    resetArr()
}

//đổ sang phải
function goRight(x1, y1, x2, y2) {
    if(x1 != x2) {
        deleteRightOneNode(x1, y1)
        deleteRightOneNode(x2, y2)
    }else {
        deleteRightTwoNode(x1, y1, y2)
    }
    createBoard()
}

function deleteRightOneNode(x, y) {
    if (y != 0) {
        let current1 = y;
        let index = 0;
        while (current1 != 0) {
            _pokemons[x][y-index] = _pokemons[x][y-index - 1]
            index++;
            current1--;
        }
        _pokemons[x][0] = -1
    }
    resetArr()
}

// xóa 2 node cùng khác hàng
function deleteRightTwoNode(x, y1, y2) {
    let yMin= 0;
    let yMax = 0;
    if(y1>y2) {
        yMin = y2;
        yMax = y1;
    }else {
        yMin = y1;
        yMax = y2;
    }
    let arrGroup = []
    for (let i=0; i< 12;i++) {
        if(i<yMin || (i>yMin && i<yMax) || i>yMax) {
            arrGroup = [...arrGroup,_pokemons[x][i]]
        }
    }
    for(let i=2; i < 12; i++) {
        _pokemons[x][i] = arrGroup[i-2]
    }
    _pokemons[x][0] = -1
    _pokemons[x][1] = -1
    resetArr()
}

// đổ lên trên
function goTop(x1, y1, x2, y2) {
    if(y1 != y2) {
        deleteTopOneNode(x1, y1)
        deleteTopOneNode(x2, y2)
    }else {
        deleteTopTwoNode(x1, x2, y1)
    }
    createBoard()
}

function deleteTopOneNode(x, y) {
    if (x != 11) {
        let current1 = x;
        let index = 0;
        while (current1 != 11) {
            _pokemons[x+index][y] = _pokemons[x+index+1][y]
            index++;
            current1++;
        }
        _pokemons[11][y] = -1
    }
    resetArr()
}

function deleteTopTwoNode(x1, x2, y) {
    let xMin= 0;
    let xMax = 0;
    if(x1>x2) {
        xMin = x2;
        xMax = x1;
    }else {
        xMin = x1;
        xMax = x2;
    }
    let arrGroup = []
    for (let i=0; i< 12;i++) {
        if(i<xMin || (i>xMin && i<xMax) || i>xMax) {
            arrGroup = [...arrGroup,_pokemons[i][y]]
        }
    }
    for(let i=0; i < 10; i++) {
        _pokemons[i][y] = arrGroup[i]
    }
    _pokemons[10][y] = -1
    _pokemons[11][y] = -1
    resetArr()
}
//đổ xuống dưới
function goBottom(x1, y1, x2, y2) {
    if(y1 != y2) {
        deleteBottomOneNode(x1, y1)
        deleteBottomOneNode(x2, y2)
    }else {
        deleteBottomTwoNode(x1, x2, y1)
    }
    createBoard()
}

function deleteBottomOneNode(x, y) {
    if (x != 0) {
        let current1 = x;
        let index = 0;
        while (current1 != 0) {
            _pokemons[x-index][y] = _pokemons[x-index-1][y]
            index++;
            current1--;
        }
        _pokemons[0][y] = -1
    }
    resetArr()
}
function deleteBottomTwoNode(x1, x2, y) {
    let xMin= 0;
    let xMax = 0;
    if(x1>x2) {
        xMin = x2;
        xMax = x1;
    }else {
        xMin = x1;
        xMax = x2;
    }
    let arrGroup = []
    for (let i=0; i< 12;i++) {
        if(i<xMin || (i>xMin && i<xMax) || i>xMax) {
            arrGroup = [...arrGroup,_pokemons[i][y]]
        }
    }
    for(let i=2; i < 12; i++) {
        _pokemons[i][y] = arrGroup[i-2]
    }
    _pokemons[0][y] = -1
    _pokemons[1][y] = -1
    resetArr()
}

//vào trung tâm theo hàng ngang
function goCenter(x1, y1, x2, y2) {
    if(x1 != x2) {
        deleteCenterOneNode(x1, y1)
        deleteCenterOneNode(x2, y2)
    }else {
        deleteCenterTwoNode(x1, y1, y2)
    }
    createBoard()
}

function deleteCenterOneNode(x,y) {
    if(y<=6) {
        deleteRightOneNode(x,y)
    }else {
        deleteLeftOneNode(x,y)
    }
}

function deleteCenterTwoNode(x, y1, y2) {
    let yMin= 0;
    let yMax = 0;
    if(y1>y2) {
        yMin = y2;
        yMax = y1;
    }else {
        yMin = y1;
        yMax = y2;
    }
    let arrLeft = []
    let arrRight = []
    for (let i=0; i< 12;i++) {
        if(i<yMin) {
            arrLeft = [...arrLeft,_pokemons[x][i]]
        }
        if(i>yMax) {
            arrRight = [...arrRight,_pokemons[x][i]]
        }
    }
    for(let i=1; i <= yMin; i++) {
        _pokemons[x][i] = arrLeft[i-1]
    }
    let index1 = 0;
    for(let i=yMax; i< 11;i++) {
        _pokemons[x][i] = arrRight[index1]
        index1++;
    }
    _pokemons[x][yMin-arrLeft.length] = -1
    _pokemons[x][yMax+arrRight.length] = -1
    resetArr()
}
//vào trung tâm theo hàng dọc
function goCenterCol(x1,y1,x2,y2) {
    if(y1 != y2) {
        deleteCenterOneNodeCol(x1, y1)
        deleteCenterOneNodeCol(x2, y2)
    }else {
        deleteCenterTwoNodeCol(x1, x2, y1)
    }
    createBoard()
}

function deleteCenterTwoNodeCol(x1, x2, y) {
    let xMin= 0;
    let xMax = 0;
    if(x1>x2) {
        xMin = x2;
        xMax = x1;
    }else {
        xMin = x1;
        xMax = x2;
    }
    let arrLeft = []
    let arrRight = []
    for (let i=0; i< 12;i++) {
        if(i<xMin) {
            arrLeft = [...arrLeft,_pokemons[i][y]]
        }
        if(i>xMax) {
            arrRight = [...arrRight,_pokemons[i][y]]
        }
    }
    for(let i=1; i <= xMin; i++) {
        _pokemons[i][y] = arrLeft[i-1]
    }
    let index1 = 0;
    for(let i=xMax; i< 11;i++) {
        _pokemons[i][y] = arrRight[index1]
        index1++;
    }
    _pokemons[xMin-arrLeft.length][y] = -1
    _pokemons[xMax+arrRight.length][y] = -1
    resetArr()
}

function deleteCenterOneNodeCol(x,y){
    if(x<=5) {
        deleteBottomOneNode(x,y)
    }else {
        deleteTopOneNode(x,y)
    }
    resetArr()
}
//top sang bên trái, bot sang bên phải
function goTopLAndBottomR(x1, y1, x2, y2) {
    if(x1 != x2) {
        deleteTopLAndBottomROneNode(x1, y1)
        deleteTopLAndBottomROneNode(x2, y2)
    }else {
        deleteTopLAndBottomRTwoNode(x1, y1, y2)
    }
    createBoard()
}

function deleteTopLAndBottomROneNode(x, y) {
    if(x<=5) {
        deleteLeftOneNode(x,y)
    }else {
        deleteRightOneNode(x,y)
    }
}
function deleteTopLAndBottomRTwoNode(x, y1, y2){
    if(x <= 5){
        deleteLeftTwoNode(x, y1, y2)
    } else {
        deleteRightTwoNode(x,y1, y2)
    }
}

//bên trái xuống dưới, bên trái lên trên
function goLeftDAnRightU(x1, y1, x2, y2) {
    if(y1 != y2) {
        deleteTopLAndBottomROneNode(x1,y1)
        deleteTopLAndBottomROneNode(x2,y2)
    }else {
        deleteLeftDAnRightUTwoNode(x1, x2, y1)
    }
    createBoard()
}

function deleteTopLAndBottomROneNode(x, y) {
    if(y <= 5){
        deleteTopOneNode(x,y)
    } else {
        deleteBottomOneNode(x,y)
    }
}

function deleteLeftDAnRightUTwoNode(x1, x2, y){
    if(y <= 5){
        deleteTopTwoNode(x1,x2,y)
    } else {
        deleteBottomTwoNode(x1,x2,y)
    }
}
//xóa các thành phần con trong board
function resetArr() {
    const boardContainer = document.getElementById('board-container');
    while (boardContainer.firstChild) {
        boardContainer.removeChild(boardContainer.firstChild);
    }
}



