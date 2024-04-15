// User Global Variables
let width = 600, height = 300;
let canvas; // Reference to p5 canvas object (see 'setup()')
let vehicle;


// User-Defined Classes
class Vehicle {
  constructor(x=0, y=0, side=5) {
    // Motion
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0); // Starts with no velocity/acceleration
    this.acceleration = createVector(0, 0);
    this.max_speed = 3; // Max 'this.velocity' magnitude
    this.max_force = 0.1; // Max 'apply_force()' value
    // Shape
    this.side = side; // Triangle parameter
    // Wander (check 'wander()')
    this.wander_radius = 25; // Step 2's circle radius
    this.wander_dist = 60; // Step 2's circle distance
    this.theta = 0.0; // Step 3's theta "random walk"
    this.theta_change = 0.2; // Step 3's random factor
    this.circle_position = createVector(0, 0); 
    this.offset_position = createVector(0, 0); 
    this.target_position = createVector(0, 0); // Step 4's target position
  }
  // Methods
  wander() { // Wandering: a type of random steering (aka a random walk for theta)
             //            steering direction on one frame is related to itself on next frame
             // Steps: 1) 'Vehicle' predicts its future position (as a distance based on its current velocity)
             //        2) Draws a circle (with 'wander_radius') centered on that position ('wander_dist')
             //        3) Picks an offset random point along the circumference (theta's "random walk")
             //        4) This point becomes 'Vehicle's target ('force' points to it)
    this.theta += random(-this.theta_change, this.theta_change); 

    this.circle_position = this.velocity.copy() // Vector with same direction as velocity
    this.circle_position.normalize(); // Unit vector
    this.circle_position.mult(this.wander_dist); // Scaling unit vector to 'wander_dist'
    this.circle_position.add(this.position); // Considering current position ('wander_dist' is a relative unit)

    let curr_angle = this.velocity.heading(); // Gets current velocity angle with x-axis
    this.offset_position = createVector(this.wander_radius * cos(this.theta + curr_angle), 
                                        this.wander_radius * sin(this.theta + curr_angle)); // Step 3 in polar coordinates (a position) 
                                                                                            // 'this.theta' is a relative unit (thus '+ curr_angle')
    
    this.target_position = p5.Vector.add(this.circle_position, this.offset_position); // Adding 'circle_position'/'offset_position' defines Step 4's target position
    
    let force = p5.Vector.sub(this.target_position, this.position); // Sterring force (points to 'target_position')
    force.normalize(); // Unit vector
    force.mult(this.max_speed); // Scales magnitude
    force.sub(this.velocity); // Force vector (the force needed, with current velocity, to steer into target)
    force.limit(this.max_force); // Limits magnitude
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
  check_bounds() { // Replaces 'target' position when out of bounds
    if (this.position.x > width + this.side) { // Towards right edge
      this.position.x = -this.side; // Teleports to left side
    } else if (this.position.x < -this.side) { // Towards left edge
      this.position.x = width + this.side; // Teleports to right side
    }
    if (this.position.y > height + this.side) { // Towards bottom edge
      this.position.y = -this.side; // Teleports to top side
    } else if (this.position.y < -this.side) { // Towards top edge
      this.position.y = height + this.side; // Teleports to bottom side
    }
  }
  run() {
    let steering_force = this.wander(); // Calculates steering force + draws wander assets
    this.apply_force(steering_force);
    this.update(); // Updates position/velocity/acceleration
    this.check_bounds(); // Updates position (if out of bounds)
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
  show_wander() { // Not using 'translate()'/'rotate()' (vectors are relative)
    noFill();
    stroke(50, 50); // Grayscale with alpha
    strokeWeight(1);
    line(this.position.x, this.position.y, this.circle_position.x, this.circle_position.y); // Step 1's distance to 'vehicle' ('wander_dist')
    circle(this.circle_position.x, this.circle_position.y, this.wander_radius*2); // Step 2's circle
    line(this.circle_position.x, this.circle_position.y, this.target_position.x, this.target_position.y); // Step 3's connection to offset random point
    circle(this.target_position.x, this.target_position.y, 4); // Step 4's point
  }
}

    
// User-Defined Functions


// p5 Main
function setup() {
  canvas = createCanvas(width, height); // Canvas reference
  
  vehicle = new Vehicle(width/2, height/2); // Instantiating wanderer 'Vehicle'
}

function draw() {
  // Main
  background(225); // Grayscale white
  
  vehicle.run(); // All functionality
  vehicle.show(); // Draws vehicle
  vehicle.show_wander(); // Draws wander assets
}