// Global Variables
let width=400, height=300; // Canvas
let bubble_total = 10;
let bubble_arr = [];

// User-Defined Classes
class Bubble {
  constructor(_x, _y, _radius) {
    // Attributes
    this.x = _x;
    this.y = _y;
    this.radius = _radius;
    this.color = 0; // Grayscale color
  }
  // Methods
  contains(_x, _y) { // Checks for coords within instance
    let d = dist(_x,_y, this.x, this.y); // Calculating distance to center
    return d <= this.radius // True: contains; False: otherwise
  }

  change_color(mx, my) {
    if (this.contains(mx, my)) {
      this.color = 255;
    } else {
      this.color = 0;
    }
  }

  move() { // Random move
    this.x += random(-3, 3);
    this.y += random(-3, 3);
  }

  show() { // Draws Bubble instance
    stroke(255);
    strokeWeight(3);
    fill(this.color, 100);
    ellipse(this.x, this.y, this.radius*2);
  }
}

// User-Defined Functions
function mousePressed() {
  for (let i = bubble_arr.length-1; i >= 0; i--) { // Looping backwards since we'll delete items and we don't want to skip anybody
    if (bubble_arr[i].contains(mouseX, mouseY)) {
      bubble_arr.splice(i, 1);
    }
  }
}

// p5 Main
function setup() {
  createCanvas(width, height); // Creating the canvas
  // Populating bubbles
  for (let i=0; i < bubble_total; i++) { 
    let _x = random(width);
    let _y = random(height);
    let _r = random(10,30);
    let _bubble = new Bubble(_x, _y, _r)
    bubble_arr.push(_bubble)
  }
}

function draw() {
  background(0); // Grayscale black
  // Main
  for (let i=0; i < bubble_arr.length; i++) {
    bubble_arr[i].move(); // Move bubble
    bubble_arr[i].show(); // Drawing ball
    bubble_arr[i].change_color(mouseX, mouseY); // Change color
  }
}