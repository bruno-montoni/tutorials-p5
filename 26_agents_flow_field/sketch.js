// User Global Variables
let width = 600, height = 300;
let canvas; // Reference to p5 canvas object (see 'setup()')
let vehicles = [];


// User-Defined Classes
class Cell {
  constructor(x, y, angle_vec) {
    this.x = x;
    this.y = y;
    this.angle_vec = angle_vec;
  }
  show() {
    let arrow_size = 3;
    push();
    fill(175);
    stroke(175);
    strokeWeight(1.5);
    translate(this.x, this.y); // At center
    line(0, 0, this.angle_vec.x, this.angle_vec.y); // Draws arrow body
    rotate(this.angle_vec.heading()); // At arrow's angle
    translate(this.angle_vec.mag() - arrow_size, 0); // At arrow head center
    triangle(0, arrow_size/3, 0, -arrow_size/3, arrow_size, 0); // Draws arrow head
    pop();
  }
}

class FlowField {
  constructor(resolution=20) {
    this.resolution = resolution; // Size of each 'cell' (in pixels)
    this.cols = floor(width / this.resolution); // Total columns
    this.rows = floor(height / this.resolution); // Total rows
    this.field = []; //new Array(this.cols); 
    
    this.init();
  }
  // Methods
  init() { // Creates the 2D array
    for (let i = 0; i < this.cols; i++) { // 1st layer: columns ('j')
      this.field[i] = [];
      for (let j = 0; j < this.rows; j++) { // 2nd layer: rows ('i')
        this.field[i][j] = 0;
      }
    }
  }
  perlin_field() { // Populates 'this.field' with Perlin Noise
    noiseSeed(random(1000));
    let x_offset = 0;
    for (let i = 0; i < this.cols; i++) {
      let y_offset = 0;
      for (let j = 0; j < this.rows; j++) {
        let angle = map(noise(x_offset, y_offset), 0, 1, 0, TWO_PI); // 2D Perlin noise values mapped to 0-TWO_PI
        this.field[i][j] = new Cell(i * this.resolution, j * this.resolution, p5.Vector.fromAngle(angle, 7)); // Creates vector from 'angle' with magnitude 10
        y_offset += 0.1; // Increment (for Perlin noise)
      }
      x_offset += 0.1; // Increment (for Perlin noise)
    }
  }
  lookup(position) { // 'position': 'vehicle' position vector
    let j = constrain(floor(position.x / this.resolution), 0, this.rows - 1);
    let i = constrain(floor(position.y / this.resolution), 0, this.cols - 1);
    return this.field[j][i].angle_vec.copy();
  }
  show() {
    for (let j = 0; j < this.cols; j++) {
      for (let i = 0; i < this.rows; i++) {
        let cell = this.field[j][i];
        cell.show();
      }
    }
  }
} 

class Vehicle {
  constructor(x, y, velocity, side=5) {
    // Motion
    this.position = createVector(x, y);
    this.velocity = createVector(random(-velocity,velocity), random(-velocity,velocity)); // Starts with random velocity and no acceleration
    this.acceleration = createVector(0, 0);
    this.max_speed = velocity; // Max 'this.velocity' magnitude
    this.max_force = 4; // Max 'apply_force()' value
    // Shape
    this.side = side; // Triangle parameter
  }
  // Methods
  follow(field) {
    let force = field.lookup(this.position); // Getting the current position's field vector
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
  out_bounds() { // Checks if vehicle is out of canvas
    let is_out = false;
    if (this.position.x < -this.side) { // Left bound
      is_out = true;
    } 
    if (this.position.x > width - this.side) { // Right bound (using "- this.side" to compensate for lack of flow field)
      is_out = true;
    } 
    if (this.position.y < -this.side) { // Top bound
      is_out = true;
    } 
    if (this.position.y > height - this.side) { // Bottom bound (using "- this.side" to compensate for lack of flow field)
      is_out = true;
    } 
    return is_out; // True: out of bounds / False: otherwise
  }
  run(field) {
    let steering_force = this.follow(field); // Calculates 'steering_force'
    this.apply_force(steering_force);
    this.update(); // Updates position/velocity/acceleration
  }
  show() { // Renaming from 'display' to 'show'
    let angle = this.velocity.heading(); // 'heading()': calculates angle of 2D vector with the positive x-axis (angles increase clockwise)
    fill(127);
    stroke(0);
    strokeWeight(1.25);
    push(); // New style start
    translate(this.position.x, this.position.y);
    rotate(angle);
    triangle(this.side*2, 0, -this.side, -this.side, -this.side, this.side);
    pop(); // New style end
  }
}


// User-Defined Functions


// p5 Main
function setup() {
  canvas = createCanvas(width, height); // Canvas reference
  
  field = new FlowField(20); // Instantiating 'FlowField'
  field.perlin_field();
  
  for (let i = 0; i < 40; i++) {
    vehicles.push(new Vehicle(random(width/3,2*width/3), random(height/3,2*height/3), random(2,4)));
  }
}

function draw() {
  // Main
  background(255); // Grayscale white
  
  field.show();
  
  for (let i = vehicles.length-1; i >= 0; i--) { // looping 'vehicles' backwards (for potential deletion)
    if (vehicles[i].out_bounds()) {
      vehicles.splice(i, 1); // Deletes 'vehicle'
    } else {
      vehicles[i].run(field);
      vehicles[i].show();
    }
  }
}