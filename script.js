// ows and columns 
const COLS = 26;
const ROWS = 100;

// colors

const transparent= "transparent";
const transparentBlue = "#ddddff"
const arrMatrix = 'arrMatrix';

// table components
const tHeadRow = document.getElementById("table-heading-row");
const tBody = document.getElementById("table-body");
const currentCellHeading = document.getElementById("current-cell");
const sheetNo = document.getElementById('sheet-no');
const buttonContainer = document.getElementById('button-container');

// buttons
const boldBtn = document.getElementById("bold-btn");
const italicsBtn = document.getElementById("italics-btn");
const underlineBtn = document.getElementById("underline-btn");
const leftBtn = document.getElementById("left-btn");
const centerBtn = document.getElementById("center-btn");
const rightBtn = document.getElementById("right-btn");
const cutBtn = document.getElementById('cut-btn');
const copyBtn = document.getElementById('copy-btn');
const pasteBtn = document.getElementById('paste-btn');
const uploadInput = document.getElementById('upload-input');
const addSheetBtn = document.getElementById('add-sheet-btn');
const saveSheetBtn = document.getElementById('save-sheet-btn');

// dropdowns
const fontStyleDropdown = document.getElementById("font-style-dropdown");
const fontSizeDropdown = document.getElementById("font-size-dropdown");

// input tags
const bgColorInput = document.getElementById("bgColor");
const fontColorInput = document.getElementById("fontColor");

// curr /and prev cells
let currentCell;
let previousCell;
// this cutt cell will store my cell data
let cutCell; 
let matrix = new Array(ROWS);
let numSheet  = 1;
let currentSheet = 1;
let prevSheet;

// funtion to create the matrix and store the table data

function createNewMatrix(){
    for(let row=0;row<ROWS;row++){
        matrix[row] = new Array(COLS);

        for(let col=0;col<COLS;col++){
            matrix[row][col] = {};
        }
    }
}

// creating the matrix for the first time
createNewMatrix();

// function for col and row generation
function colGen(typeOfCell,tableRow,isInnerText,rowNumber){
    for(let col = 0;col<COLS;col++){
        const cell = document.createElement(typeOfCell);

        if(isInnerText){
            cell.innerText= String.fromCharCode(col + 65);
            cell.setAttribute("id",String.fromCharCode(col+65));
        }
        else{
            cell.setAttribute("id",`${String.fromCharCode(col+65)}${rowNumber}`);
            cell.setAttribute("contenteditable",true);
            cell.addEventListener("input",updateObjectInMatrix);
            cell.addEventListener("focus", (event) => focusHandler(event.target));
        }
        tableRow.append(cell);
    }
}
colGen("th",tHeadRow,true);


// function to uupdate the cell details each time when any change happens

function updateObjectInMatrix(){
    let id = currentCell.id;
    console.log(id);

    let col = id[0].charCodeAt(0)-65;
    let row = id.substring(1)-1;
    matrix[row][col] = {
        text:currentCell.innerText,
        style: currentCell.style.cssText,
        id:id,
    }
}

// setHeaderColor function
function setHeadColor(colId,rowId,color){
    const colHead = document.getElementById(colId);
    const rowHead = document.getElementById(rowId);
    colHead.style.backgroundColor = color;
    rowHead.style.backgroundColor = color;
}

// function to download the matrix or page

function downloadMatrix(){
    const matrixString = JSON.stringify(matrix);

    const blob = new Blob([matrixString],{type: 'application/json'});
    console.log(blob);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'table.json';
    link.click();
}

// // function to upload matrix

function uploadMatrix(event){
    const file = event.target.files[0];
    // file reader helps to read the blob
    if(file){
        const reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function(event){
            const fileContent = JSON.parse(event.target.result);

            matrix = fileContent;
            renderMatrix();
        }
    }
}

uploadInput.addEventListener('input',uploadMatrix);


function buttonHighlighter(button, styleProperty, style) {
    if (currentCell.style[styleProperty] === style) {
      button.style.backgroundColor = transparentBlue;
    } 
    else {
      button.style.backgroundColor = transparent;
    }
  }


// focus handler
function focusHandler(cell){
    currentCell = cell;
   if(previousCell){
    setHeadColor(previousCell.id[0],previousCell.id.substring(1),transparent)
    transparent
   }

   buttonHighlighter(boldBtn, "fontWeight", "bold");
   buttonHighlighter(italicsBtn, "fontStyle", "italic");
   buttonHighlighter(underlineBtn, "textDecoration", "underline");

   setHeadColor(cell.id[0],cell.id.substring(1),transparentBlue);
   currentCellHeading.innerText = cell.id;
   previousCell = currentCell;
}

// function for row
function tableBodyGen(){
    tBody.innerHTML = '';
    for(let row = 1;row<ROWS;row++){
        const tr = document.createElement("tr");
        const th = document.createElement("th");
    
        th.innerText = row;
        th.setAttribute("id",row);
        tr.append(th);
    
        colGen("td",tr,false,row);
        tBody.append(tr);
    }

}
tableBodyGen();

if(localStorage.getItem(arrMatrix)){
    matrix=JSON.parse(localStorage.getItem(arrMatrix))[0];
    renderMatrix();
}


// eventlistener for buttons
function buttonListener(button,styleType,val){
    if(val != "underline"){
        button.addEventListener("click",() =>{
            if(currentCell.style[styleType] === val){
                currentCell.style[styleType] = "normal";
                button.style.backgroundColor = transparent;
            }
            else{
                currentCell.style[styleType] = val;
                button.style.backgroundColor = transparentBlue;
            }
            updateObjectInMatrix();
        })

    }
    else{
        button.addEventListener("click",() =>{
            if(currentCell.style[styleType] === val){
                currentCell.style[styleType] = "none";
                button.style.backgroundColor = transparent;
            }
            else{
                currentCell.style[styleType] = val;
                button.style.backgroundColor = transparentBlue;
            }
            updateObjectInMatrix();
        })
    }
}
buttonListener(boldBtn,"fontWeight","bold");
buttonListener(italicsBtn,"fontStyle","italic");
buttonListener(underlineBtn,"textDecoration","underline");

function textAlign(button,pos,b2,b3){
    button.addEventListener("click",() =>{
        currentCell.style.textAlign = pos;
        buttonHighlighter(button,"textAlign",pos)
        b2.style.backgroundColor = transparent;
        b3.style.backgroundColor = transparent;
        updateObjectInMatrix();
    })

}

textAlign(leftBtn,"left",centerBtn,rightBtn);
textAlign(centerBtn,"center",leftBtn,rightBtn);
textAlign(rightBtn,"right",centerBtn,leftBtn);



fontStyleDropdown.addEventListener("change", () => {
    currentCell.style.fontFamily = fontStyleDropdown.value;
  });
  
fontSizeDropdown.addEventListener("change", () => {
currentCell.style.fontSize = fontSizeDropdown.value;
});

// input will take your every action
bgColorInput.addEventListener("input", () => {
currentCell.style.backgroundColor = bgColorInput.value;
});

fontColorInput.addEventListener("input", () => {
currentCell.style.color = fontColorInput.value;
});


cutBtn.addEventListener('click',()=>{
    lastPressBtn='cut';
    cutCell = {
      text: currentCell.innerText,
      style: currentCell.style.cssText, // cssText is basically
    }
    currentCell.innerText='';
    currentCell.style.cssText='';
    updateObjectInMatrix();
  })
  
  copyBtn.addEventListener('click',()=>{
    lastPressBtn='copy';
    cutCell={
      text: currentCell.innerText,
      style: currentCell.style.cssText,
    }
  })
  
  pasteBtn.addEventListener('click',()=>{
    currentCell.innerText=cutCell.text;
    currentCell.style=cutCell.style;
    // currentCell.style.cssText=cutCell.style;
  
    // i need to cleanup my cutcell object after paste
    // 
    if (lastPressBtn === "cut") {
      cutCell = undefined;
    }
    updateObjectInMatrix();
  })

  function genNextSheetButton(){
    const btn = document.createElement("button");
    numSheet++;
    currentSheet = numSheet;

    btn.innerText = `Sheet ${currentSheet}`;
    btn.setAttribute('id',`sheet-${currentSheet}`);
    btn.setAttribute('onclick','viewSheet(event)');
    buttonContainer.append(btn);
  }
  //   adding evetnt listner to the addsheet button
  addSheetBtn.addEventListener('click',()=>{
    console.log(addSheetBtn)
    genNextSheetButton();
    sheetNo.innerText = `Sheet No - ${currentSheet}`;
    
    saveMatrix();
    createNewMatrix();// it's creating matrix again (sort of used as cleaner fn)
    // clean html
    tableBodyGen();
  })

  function saveMatrix() {
    if (localStorage.getItem(arrMatrix)) {
      // pressing add sheet not for the first time
      let tempArrMatrix = JSON.parse(localStorage.getItem(arrMatrix));
      tempArrMatrix.push(matrix);
      localStorage.setItem(arrMatrix, JSON.stringify(tempArrMatrix));
    } else {
      // pressing add sheet for the first time
      let tempArrMatrix = [matrix];
      localStorage.setItem(arrMatrix, JSON.stringify(tempArrMatrix));
    }
  }
  

  function renderMatrix() {
    matrix.forEach((row) => {
      row.forEach((cellObj) => {
        if (cellObj.id) {
          let currentCell = document.getElementById(cellObj.id);
          currentCell.innerText = cellObj.text;
          currentCell.style = cellObj.style;
        }
      });
    });
  }

  function viewSheet(event){
    // save prev sheet before doing anything
    prevSheet=currentSheet;
    currentSheet=event.target.id.split('-')[1];
    let matrixArr = JSON.parse(localStorage.getItem(arrMatrix));
    // save my matrix in local storage
    matrixArr[prevSheet-1] = matrix;
    localStorage.setItem(arrMatrix,JSON.stringify(matrixArr));
  
    // I have updated my virtual memory
    matrix = matrixArr[currentSheet-1];
    // clean my html table
    tableBodyGen();
    // render the matrix in html
    renderMatrix();
  }