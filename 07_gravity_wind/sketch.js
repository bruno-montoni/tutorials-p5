// Global Variables
let width = 600, height = 300; 
let balls_arr = [];

// User-Defined Classes
class Ball { 
  constructor() { 
      // Attributes
      this.position = createVector(random(100, 300), height/4); // Randomly at middle of screen
      this.velocity = createVector(0, 0); // Starts at 0
      this.acceleration = createVector(0, 0); // Starts at 0
      this.mass = random(5, 20); // Proxy for 'radius'
      this.factor = 0.95 // Velocity retained after bounce
  }
  // Methods
  apply_force(force_vec) {
    let acceleration = force_vec.div(this.mass);
    this.acceleration.add(acceleration);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  display() {
    stroke(0); // Black outlines
    strokeWeight(1.5); // Outline width
    fill(50, 100); // White interior with alpha channel (0-255)
    ellipse(this.position.x, this.position.y, this.mass*2);
  }

  check_edges() {
    if (this.position.x + this.mass > width) { // Right bound
      this.position.x = width - this.mass; 
      this.velocity.x *= -1; // Inverts velocity's 'x' component
    }
    if (this.position.x - this.mass < 0) { // Left bound
      this.position.x = this.mass;
      this.velocity.x *= -1; // Inverts velocity's 'x' component
    }
    if (this.position.y + this.mass > height) { // Bottom bound
      this.position.y = height - this.mass; 
      this.velocity.y *= -this.factor; // Inverts velocity's 'y' component
                                       // 'factor' drains velocity at bounce
    }
  }
}
// User-Defined Functions

// p5 Main
function setup() {
  createCanvas(width, height); // Creating the canvas with 'img' dimensions
  for (i = 0; i <= 5; i++){
    balls_arr[i] = new Ball(); // Instantiating 'Ball'
  }
}

function draw() {
  // Main
  background(220); // Grayscale white

  for (ball of balls_arr) {
    let gravity = createVector(0, 0.5); // Instantiating 'gravity' for each 
    gravity.mult(ball.mass); // Gravity is the same for all 
    ball.apply_force(gravity);
    
    if (mouseIsPressed) { // 'mouseIsPressed': system variable; 'mousePressed()': system function
      let wind = createVector(0.6, 0);
      ball.apply_force(wind); // More mass, less acceleration 
    }

    ball.update();
    ball.check_edges();
    ball.display();
  }
}
