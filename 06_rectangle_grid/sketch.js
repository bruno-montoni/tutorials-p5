// Global Variables
let side = 10;
let width = side*50.5, height = side*50.5; // '0.5': since we use 'rectMode(CENTER)'

// User-Defined Classes

// User-Defined Functions

// p5 Main
function setup() {
  createCanvas(width, height); // Creating the canvas with 'img' dimensions
  stroke(255);
  strokeWeight(2);
  rectMode(CENTER); // Rectangle's coords are at center
  noLoop(); // Static image
}

function draw() {
  // Main
  background(255); // Background color

  for (x = side; x <= width; x += side){
    for (y = side; y <= height; y += side){
      let color = random(0, 255);
      fill(color);
      rect(x, y, side, side);
      
    }
  }
}



