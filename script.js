const activeToolEl = document.getElementById('active-tool');
const brushColorBtn = document.getElementById('brush-color');
const brushIcon = document.getElementById('brush');
const brushSize = document.getElementById('brush-size');
const brushSlider = document.getElementById('brush-slider');
const bucketColorBtn = document.getElementById('bucket-color');
const eraser = document.getElementById('eraser');
const clearCanvasBtn = document.getElementById('clear-canvas');
const saveStorageBtn = document.getElementById('save-storage');
const loadStorageBtn = document.getElementById('load-storage');
const clearStorageBtn = document.getElementById('clear-storage');
const downloadBtn = document.getElementById('download');

const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
const { body } = document;




// Global Variables

let currentSize = 10;
let bucketColor = 'FFFFFF';
let currentColor = '#A51DAB';
let isEraser = true;
let isMouseDown = false;
let drawnArray = [];


console.log(bucketColor)

// Formatting Brush Size
// function displayBrushSize() {

// }

// Setting Brush Size
brushSlider.addEventListener('change', () => {
  if(brushSlider.value < 10){
    brushSize.textContent = `0${brushSlider.value}`
  }else{
    brushSize.textContent = brushSlider.value

  }
brushIcon.style.width = brushSlider.value
});



// Setting Brush Color


function changeBrushColor(){
  // body.style.backgroundColor = `#${bucketColor}`
}

brushColorBtn.addEventListener('change', () => {
  currentColor = `#${brushColorBtn.value}`
changeBrushColor()
});


// Setting Background Color


function changeBGColor(){
  console.log(bucketColorBtn.value)
  console.log(bucketColor)
 body.style.backgroundColor = `#${bucketColor}`

}


bucketColorBtn.addEventListener('change',()=>{
bucketColor = `${bucketColorBtn.value}`
  changeBGColor();
createCanvas()
restoreCanvas()
} );

// // Eraser
eraser.addEventListener('click', () => {
isEraser = true
  brushIcon.style.color = 'white';
  eraser.style.color = 'black';
  activeToolEl.textContent = 'Eraser';
currentColor = `#${bucketColor}`
currentSize = brushSlider.value;

});

// // Switch back to Brush
function switchToBrush() {
  isEraser = false;
  activeToolEl.textContent = 'Brush';
  brushIcon.style.color = 'black';
  eraser.style.color = 'white';
  currentColor = `#${brushColorBtn.value}`;
  currentSize = brushSlider.value;
console.log(currentSize)
}

brushIcon.addEventListener('click',switchToBrush)

// Create Canvas
function createCanvas() {
  canvas.width = window.innerWidth ;
  canvas.height = window.innerHeight;
  context.fillStyle = `#${bucketColor}` ;
  context.fillRect(0,0,window.innerWidth , window.innerHeight - 50);
  body.appendChild(canvas);
console.log("AS")
}


// // Clear Canvas
clearCanvasBtn.addEventListener('click', () => {
  createCanvas();
  drawnArray = [];
  // Active Tool
  activeToolEl.textContent = 'Canvas Cleared';
  setTimeout(switchToBrush, 1500);
});

// // Draw what is stored in DrawnArray
function restoreCanvas() {
  for (let i = 1; i < drawnArray.length; i++) {
    context.beginPath();
    context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
    context.lineWidth = drawnArray[i].size;
    context.lineCap = 'round';
    if (drawnArray[i].eraser) {
      context.strokeStyle = bucketColor;
    } else {
      context.strokeStyle = drawnArray[i].color;
    }
    context.lineTo(drawnArray[i].x, drawnArray[i].y);
    context.stroke();
  }
}

// // Store Drawn Lines in DrawnArray
function storeDrawn(x, y, size, color, erase) {
  const line = {
    x,
    y,
    size,
    color,
    erase,
  };
  console.log(line);
  drawnArray.push(line);
}

// Get Mouse Position
function getMousePosition(event) {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: event.clientX - boundaries.left,
    y: event.clientY - boundaries.top,
  };
}

// Mouse Down
canvas.addEventListener('mousedown', (event) => {
  isMouseDown = true;
  const currentPosition = getMousePosition(event);
  console.log('mouse is clicked', currentPosition);
  context.moveTo(currentPosition.x, currentPosition.y);
  context.beginPath();
  context.lineWidth = currentSize;
  context.lineCap = 'round';
  context.strokeStyle = currentColor;
});

// Mouse Move
canvas.addEventListener('mousemove', (event) => {
  if (isMouseDown) {
    const currentPosition = getMousePosition(event);
    console.log('mouse is moving', currentPosition);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
    storeDrawn(
      currentPosition.x,
      currentPosition.y,
      currentSize,
      currentColor,
      isEraser,
    );
  } else {
    storeDrawn(undefined);
  }
});

// Mouse Up
canvas.addEventListener('mouseup', () => {
  isMouseDown = false;
  console.log('mouse is unclicked');
});

// // Save to Local Storage
saveStorageBtn.addEventListener('click', () => {
localStorage.setItem('Canvas',JSON.stringify(drawnArray));
  // Active Tool
  activeToolEl.textContent = 'Canvas Saved';
  setTimeout(switchToBrush, 1500);
});

// Load from Local Storage
loadStorageBtn.addEventListener('click', () => {
  if (localStorage.getItem('Canvas')) {
    drawnArray = JSON.parse(localStorage.getItem('Canvas'));
restoreCanvas()
  // Active Tool
    activeToolEl.textContent = 'Canvas Loaded';
    setTimeout(switchToBrush, 1500);
  } 

});

// // Clear Local Storage
clearStorageBtn.addEventListener('click', () => {

  localStorage.removeItem('Canvas')
  // Active Tool
  activeToolEl.textContent = 'Local Storage Cleared';
  setTimeout(switchToBrush, 1500);
});

// // Download Image
downloadBtn.addEventListener('click', () => {

  downloadBtn.href = canvas.toDataURL('image/jpeg', 1.0);
  downloadBtn.download = 'my-paint.jpeg'
  // Active Tool
  activeToolEl.textContent = 'Image File Saved';
  setTimeout(switchToBrush, 1500);
});

// // Event Listener
// brushIcon.addEventListener('click', switchToBrush);

// On Load
createCanvas();
