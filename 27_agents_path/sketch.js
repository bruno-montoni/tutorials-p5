// User Global Variables
let width = 600, height = 300;
let canvas; // Reference to p5 canvas object (see 'setup()')
let vehicles = [];


// User-Defined Classes
class Path {
  constructor(radius=16, offset=20) {
    this.radius = radius; // Path's width
    this.offset = offset;
    this.points = []; 
    this.labels = [];
  }
  // Methods
  add_point(x, y, label="") { 
    let point = createVector(x, y);
    this.points.push(point);
    this.labels.push(label);
  }
  show() {
    push(); // Draws thick line (radius)
    noFill();
    stroke(200, 150); 
    strokeWeight(this.radius * 2); // '*2': given both sides
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      vertex(this.points[i].x, this.points[i].y);
    }
    endShape();
    pop();
  
    push(); // Draws main line (path's center); last so it's on top
    noFill();
    stroke(150);
    strokeWeight(1);
    beginShape(); // Starts recording vertices for shape
    for (let i = 0; i < this.points.length; i++) {
      vertex(this.points[i].x, this.points[i].y); // Gets points' coordinates
    }
    endShape(); 
    pop();
    
    push(); // Draws the labels
    fill(75);
    noStroke();
    textFont("Helvetica",12);
    textStyle(NORMAL); 
    textAlign(CENTER, CENTER);
    for (let i = 0; i < this.labels.length; i++) {
      text(this.labels[i], this.points[i].x + this.offset, this.points[i].y + this.offset);
    }
    pop();
  }
}

class Vehicle {
  constructor(x=0, y=100, side=5) {
    // Motion
    this.position = createVector(x, y);
    this.velocity = createVector(3, 0); 
    this.acceleration = createVector(0, 0);
    this.max_speed = 3; // Max 'this.velocity' magnitude
    this.max_force = 0.2; // Max 'apply_force()' value
    // Object
    this.side = side; // Triangle parameter
    // Path
    this.future = null; // Future position vector
    this.normal = null; // Shortest normal point on the path
    this.min_dist = Infinity; // Initialized with very high value
    this.target = null; // Location we want to steer towards
  }
  // Methods
  follow(path, ahead=25) {
    this.future = this.velocity.copy(); 
    this.future.setMag(ahead); // Predicting 'ahead' frames ahead
    this.future.add(this.position);
    
    // Refreshing attributes
    this.normal = null; 
    this.min_dist = Infinity; 
    this.target = null; 
    
    // Finding the normal to path (from 'future' location) 
    for (let i = 0; i < path.points.length - 1; i++) { // Looping through all path's points
      let start = path.points[i]; // 'start'/'end' points of a line segment
      let end = path.points[i + 1];
      let normal_temp = this.get_normal(this.future, start, end); // Gets normal point on current line segment (still to be evaluated)
      if (normal_temp.x < start.x || normal_temp.x > end.x) { // If 'normal_temp' is not on line segment...
                                                              // Important: only works because path goes from left to right
        normal_temp = end.copy(); // Defaults to most distant point in line segment (with original direction)
      }
      
      let distance = p5.Vector.dist(this.future, normal_temp); // Distance (along the normal) to 'future_position'
      if (distance < this.min_dist) { // If 'distance' is smaller than shortest distance so far...
        this.min_dist = distance; // Updates 'min_dist'
        this.normal = normal_temp; // Updates 'normal_final'
        this.target = normal_temp.copy(); // Updates 'target'
        
        let segment_direction = p5.Vector.sub(end, start); // Direction of current line segment
                                                           // Important: we need it because we want to target a little ahead of 'normal'
        segment_direction.setMag(10); // An oversimplification: should be based on 'min_dist'/velocity
        this.target.add(segment_direction); // Adjusting 'target' to a little ahead
      }
    }
  }
  get_normal(future, start, end) {
    let start_position = p5.Vector.sub(future, start); // Vector pointing from 'start' to 'future'  
    let start_end = p5.Vector.sub(end, start); // Vector pointing from 'start' to 'end'  
    start_end.normalize(); // Unit vector
    start_end.mult(start_position.dot(start_end)); // Scales 'start_position' to projection on 'start_end'
    return p5.Vector.add(start, start_end);
  } 
  seek(target) { // Seeks target's current position 
    let force = p5.Vector.sub(target, this.position); // Direction vector (points from position to target)
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
  run(path) {
    if (this.min_dist > path.radius && this.target !== null) { // If distance is greater than path's radius, we steer
      let steering_force = this.seek(this.target); 
      this.apply_force(steering_force);
    }
    this.update(); // Updates position/velocity/acceleration
  }
  out_bounds() { // Checks if vehicle is out of canvas
    let is_out = false;
    if (this.position.x < -this.side) { // Left bound
      is_out = true;
    } 
    if (this.position.x > width + this.side) { // Right bound
      is_out = true;
    } 
    if (this.position.y < -this.side) { // Top bound
      is_out = true;
    } 
    if (this.position.y > height + this.side) { // Bottom bound
      is_out = true;
    }
    return is_out;
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
  show_assets() {
    push(); // Draws predicted future location
    fill(127);
    stroke(0);
    strokeWeight(1.25);
    line(this.position.x, this.position.y, this.future.x, this.future.y);
    circle(this.future.x, this.future.y, 3);
    pop();
    
    push(); // Draws normal location and target (red if steering towards it)
    fill(127);
    stroke(0);
    strokeWeight(1.25);
    circle(this.normal.x, this.normal.y, 3);
    line(this.future.x, this.future.y, this.normal.x, this.normal.y);
    circle(this.target.x, this.target.y, 5);
    pop();
  }
}


// User-Defined Functions


// p5 Main
function setup() {
  canvas = createCanvas(width, height); // Canvas reference
  
  path = new Path(); // Instantiating 'Path'
  path.add_point(-20,40, "A"); // Adding points (must be left -> right oriented)
  path.add_point(40,40);
  path.add_point(140,80, "B");
  path.add_point(240,200, "C");
  path.add_point(280,180);
  path.add_point(320,160);
  path.add_point(360,160, "D");
  path.add_point(420,40, "E"); 
  path.add_point(460,40); 
  path.add_point(620,120, "F");
  
  vehicle = new Vehicle(10,40); // Instantiating 'Vehicle'
}

function draw() {
  // Main
  background(255); // Grayscale white
  
  path.show();
  
  vehicle.follow(path); // Finds closest path segment and updates normal-related params
  if (!vehicle.out_bounds()) { // If 'vehicle' is within canvas...
  vehicle.run(path);
  vehicle.show_assets();
  vehicle.show();
  }
}