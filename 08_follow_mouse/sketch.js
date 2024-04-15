// Global Variables
let width = 300, height = 300; 
let ball // Decalring without initializing (check 'setup()')

// User-Defined Classes
class Ball { 
  constructor(start_x, start_y) { 
      // Attributes
      this.position = createVector(start_x, start_y); 
      this.velocity = createVector(0, 0); // Starts at 0
      this.acceleration = createVector(0, 0); // Starts at 0
      this.mass = 10; // Proxy for 'radius'
  }
  // Methods
  apply_force() {
    let mouse_acceleration = createVector(mouseX, mouseY); // Vector of mouse location
    mouse_acceleration.sub(this.position); // [vec1].sub([vec2]) points from [vec2] -> [vec1] (mouse location)
    mouse_acceleration.setMag(0.5); // Capping the magnitude
    this.acceleration = mouse_acceleration; // Updating 'acceleration'
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  display() {
    stroke(0); // Black outlines
    strokeWeight(1.5); // Outline width
    fill(125); 
    ellipse(this.position.x, this.position.y, this.mass*2);
  }
}

// User-Defined Functions

// p5 Main
function setup() {
  createCanvas(width, height); // Creating the canvas with 'img' dimensions
  ball = new Ball(width/2, height/2); // Initializing
}

function draw() {
  // Main
  background(200); // Grayscale white
  ball.apply_force();
  ball.update();
  ball.display();
}