// User Global Variables
let width = 400, height = 200;
let canvas; // Reference to p5 canvas object (see 'setup()')
let vehicle;


// User-Defined Classes
class Vehicle {
  constructor(x=0, y=0, side=5) {
    // Motion
    this.position = createVector(x, y);
    this.velocity = createVector(random(-3,3), random(-3,3)); 
    this.acceleration = createVector(0, 0);
    this.max_speed = 3; // Max 'this.velocity' magnitude
    this.max_force = 0.1; // Max 'apply_force()' value
    // Shape
    this.side = side; // Triangle parameter
  }
  // Methods
  boundaries(wall) { // Applies 'force' to get back in bounds
    let force = null; // 
    
    if (this.position.x < wall.offset) { // Towards left edge
      force = createVector(this.max_speed, this.velocity.y); // Keeps 'y' velocity, pushes 'x' positively (at max)
    } else if (this.position.x > width - wall.offset) { // Towards right edge
      force = createVector(-this.max_speed, this.velocity.y); // Keeps 'y' velocity, pushes 'x' negatively (at max)
    }
    if (this.position.y < wall.offset) { // Towards top edge
      force = createVector(this.velocity.x, this.max_speed); // Keeps 'x' velocity, pushes 'y' positively (at max)
    } else if (this.position.y > height - wall.offset) { // Towards bottom edge
      force = createVector(this.velocity.x, -this.max_speed); // Keeps 'x' velocity, pushes 'y' positively (at max)
    }
    
    if (force !== null) { // If 'vehicle' is out of bounds...
      force.normalize(); // Unit vector
      force.mult(this.max_speed); // Scales magnitude
      force.sub(this.velocity); // Force vector (the force needed, with current velocity, to steer into target)
      force.limit(this.max_force); // Limits magnitude
    }
    return force;
  }
  update() {
    this.velocity.add(this.acceleration); // Updates velocity
    this.velocity.limit(this.max_speed); // Limits velocity
    this.position.add(this.velocity); // Updates position
    this.acceleration.mult(0); // Reset acceleration
  }
  apply_force(force) { // Receives a force (mass is not considered in this example)
    this.acceleration.add(force);
  }
  run(wall) {
    let boundaries_force = this.boundaries(wall); // Calculates 'boundaries_force'
    this.apply_force(boundaries_force);
    this.update(); // Updates position/velocity/acceleration
    this.show(); // Draws vehicle
  }
  show() { // Renaming from 'display' to 'show'
    let angle = this.velocity.heading(); // 'heading()': calculates angle of 2D vector with the positive x-axis (angles increase clockwise)
    fill(127);
    stroke(0);
    strokeWeight(1.5);
    push(); // New style start
    translate(this.position.x, this.position.y);
    rotate(angle);
    triangle(this.side*2, 0, -this.side/2, -this.side, -this.side/2, this.side);
    pop(); // New style end
  }
}

class Wall {
  constructor(offset=50) {
    // Motion
    this.offset = offset;
  }
  // Methods
  show() { 
    push(); // New style start
    noFill();
    stroke(150, 150);
    strokeWeight(1.5);
    rectMode(CENTER);
    rect(width/2, height/2, width - this.offset, height - this.offset);
    pop(); // New style end
  }
}


// User-Defined Functions


// p5 Main
function setup() {
  canvas = createCanvas(width, height); // Canvas reference
  
  vehicle = new Vehicle(width/2, height/2); // Instantiating 'Vehicle'
  wall = new Wall(); // Instantiating 'Wall'
}

function draw() {
  // Main
  background(225); // Grayscale white
  
  vehicle.run(wall); // All functionality
  vehicle.show(); // Draws vehicle
  
  wall.show();
}