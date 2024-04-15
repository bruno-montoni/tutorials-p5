// User Global Variables
let width = 500, height = 500;
let canvas; // Reference to p5 canvas object (see 'setup()')
let vehicle;
let target;


// User-Defined Classes
class Vehicle {
  constructor(x=0, y=0, side=4, arrival_radius=100) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0); // Starts with no velocity/acceleration
    this.acceleration = createVector(0, 0);
    this.side = side; // Triangle parameter
    this.arrival_radius = arrival_radius; // Radius for deceleration (Arrive Behavior)
    this.maxspeed = 8; // Max 'this.velocity' magnitude
    this.maxforce = 0.2; // Max 'apply_force()' value
  }
  // Methods
  seek(target) { // Seeks target's current position (with Arrive Behavior)
                 // Arrive Behavior: 'vehicle' slows down as it approaches 'target'
    let force = p5.Vector.sub(target.position, this.position); // Direction vector (points to target)
    let distance = force.mag(); // Current 'force' magnitude
    
    if (distance < this.arrival_radius) { // Arrive Behavior influence zone
      let magnitude = map(distance, 0, this.arrival_radius, 0, this.maxspeed); // Maps 0:this.arrival_radius -> 0:this.maxspeed (when within radius)
      force.setMag(magnitude); // Slower velocity
    } else {
      force.setMag(this.maxspeed); // Max velocity
    }
    
    force.sub(this.velocity); // Force vector (the force needed, with current velocity, to steer into target)
    force.limit(this.maxforce); // Limits magnitude
    return force;
  }
  pursue(target, factor=15, has_show=true) { // Pursues 'future's predicted position (through 'seek()')
    let future = new Vehicle(); // Instantiating 'Vehicle'
    future.position = target.position.copy(); // Current target position
    future.velocity = target.velocity.copy(); // Current target velocity
    future.velocity.mult(factor); // Scales 'prediction' by 'factor' ()
    future.position.add(future.velocity); // Updates target's position
  
    if (has_show) { // Draws 'pred_position' (as an object)
      fill(150, 0, 150, 50); // Purple with alpha
      noStroke();
      circle(future.position.x, future.position.y, target.radius*2); // Draws 'future'
    }
    return this.seek(future);
  }
  flee(target) { // Flees target's current position (through 'seek()')
    return this.seek(target).mult(-1); // '-1': inverts direction
  }
  evade(target) { // Evades target's predicted position (through 'pursue()')
    return this.pursue(target).mult(-1); // '-1': inverts direction
  }
  update() {
    this.velocity.add(this.acceleration); // Updates velocity
    this.velocity.limit(this.maxspeed); // Limits velocity
    this.position.add(this.velocity); // Updates position
    this.acceleration.mult(0); // Reset acceleration
  }
  apply_force(force) { // Receives a force (mass is not considered in this example)
    this.acceleration.add(force);
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

class Target {
  constructor(radius=8) {
    this.position = createVector(width/2, height/2);
    this.velocity = createVector(random(-5,5), random(-5,5)); // Starts with no velocity/acceleration
    this.radius = radius; // Triangle
  }
  // Methods
  update() {
    this.position.add(this.velocity); // Updates position
  }
  check_bounds() { // Replaces 'target' position when out of bounds
    if (this.position.x > width + this.radius) { // Towards right edge
      this.position.x = -this.radius; // Teleports to left side
    } else if (this.position.x < -this.radius) { // Towards left edge
      this.position.x = width + this.radius; // Teleports to right side
    }
    if (this.position.y > height + this.radius) { // Towards bottom edge
      this.position.y = -this.radius; // Teleports to top side
    } else if (this.position.y < -this.radius) { // Towards top edge
      this.position.y = height + this.radius; // Teleports to bottom side
    }
  }
  show() { // Renaming from 'display' to 'show'
    fill(150, 0, 150);
    stroke(0);
    strokeWeight(1.5);
    circle(this.position.x, this.position.y, this.radius*2);
  }
}

    
// User-Defined Functions


// p5 Main
function setup() {
  canvas = createCanvas(width, height); // Canvas reference
  
  vehicle = new Vehicle(width/2, height/2); // Instantiating 'Vehicle'
  target = new Target(); // Instantiating 'Target'
}

function draw() {
  // Main
  background(225); // Grayscale white
  
  let steer_force = vehicle.pursue(target); // Calculates seek force and applies it according to goal (Available: 'seek', 'pursue', 'evade', 'flee')
  vehicle.apply_force(steer_force);
  
  target.check_bounds(); // Checks if 'target' is out of bounds

  vehicle.update(); // Updates position/velocity/acceleration
  target.update(); // Gets 'mouseX'/'mouseY'
  
  vehicle.show(); // Draws vehicle
  target.show(); // Draws target
}