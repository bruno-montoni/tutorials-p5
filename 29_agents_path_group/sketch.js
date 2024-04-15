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
  }
}

class Vehicle {
  constructor(x, y, radius=6) {
    // Motion
    this.position = createVector(x, y);
    this.velocity = createVector(random(-2,2), random(-2,2)); 
    this.acceleration = createVector(0, 0);
    this.max_speed = random(2,4); // Max 'velocity' magnitude
    this.max_force = 0.3; // Max 'apply_force()' value
    // Object
    this.radius = radius; // Circle parameter
    // Path
    this.future = null; // Future position vector
    this.normal = null; // Shortest normal point on the path
    this.min_dist = Infinity; // Initialized with very high value
    this.target = null; // Location we want to steer towards
  }
  // Methods
  apply_behaviors(vehicles, path) {
    let follow_force = this.follow(path); // Path follow steering force
    let separate_force = this.separate(vehicles); // Proximity force
    
    follow_force.mult(3); // Using arbitrary weighting (by scaling the forces magnitudes)
    separate_force.mult(1);
    // Accumulate in acceleration
    this.apply_force(follow_force); // Applying the forces
    this.apply_force(separate_force);
  }
  follow(path, ahead=25) {
    this.future = this.velocity.copy(); 
    this.future.normalize(); // Unit vector
    this.future.setMag(ahead); // Predicting 'ahead' frames ahead
    this.future.add(this.position); // Future position vector
    
    // Refreshing attributes
    this.normal = null; 
    this.min_dist = Infinity; 
    this.target = null; 

    // Finding the normal for each line segment (based on 'future')  anc choosing the closest
    for (let i = 0; i < path.points.length - 1; i++) { // Looping through all path's points
      let start = path.points[i]; // 'start'/'end' points of a line segment
      let end = path.points[(i + 1) % path.points.length]; // Path has to be closed (wrap around)
      let normal_temp = this.get_normal(this.future, start, end); // Gets normal point on current line segment
      let segment_direction = p5.Vector.sub(end, start); // Direction of current line segment
                                                         // Important: we need it because we want to target a little ahead of 'normal'
      
      if (normal_temp.x < min(start.x, end.x) || // 'normal_temp's 'x' coordinate is smaller than segment's minimum OR
          normal_temp.x > max(start.x, end.x) || // 'normal_temp's 'x' coordinate is greater than segment's maximum OR
          normal_temp.y < min(start.y, end.y) || // 'normal_temp's 'y' coordinate is smaller than segment's minimum OR
          normal_temp.y > max(start.y, end.y)) { // 'normal_temp's 'y' coordinate is greater than segment's maximum
        normal_temp = end.copy() // If outside current segment, consider the end of segment
        // If we're at 'end' we want the next segment for looking ahead
        start = path.points[(i + 1) % path.points.length];
        end = path.points[(i + 2) % path.points.length]; // Path wraps around
        segment_direction = p5.Vector.sub(end, start); // Using next segment (instead of current)
      }

      let distance = p5.Vector.dist(this.future, normal_temp); // Distance to 'future'
      if (distance < this.min_dist) { // If 'distance' is smaller than shortest distance so far...
        this.min_dist = distance;
        this.normal = normal_temp; // Updates 'normal'

        segment_direction.normalize(); // Looks to current segment direction so we target a little ahead of 'normal'
        segment_direction.mult(ahead); // Predicting 'ahead' frames ahead
        
        this.target = this.normal.copy();
        this.target.add(segment_direction); // Adjusting 'target' to a little ahead
      }
    }

    if (this.min_dist > path.radius) { // If 'min_dist' is greater than radius, we steer...
      return this.seek(this.target); // Returns steering force
    } else {
      return createVector(0, 0); // Returns 'empty' force
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
  run() {
    this.update();
    this.show();
    this.show_assets()
;  }
  separate(vehicles) { // Checks for nearby vehicles and steers away
    let desired_separation = this.radius * 3; // Separation based on physical property
                                              // Influence zone threshold (beyond it, there's no influence)
    let sum_influence = createVector(); // Vector that aggregates all influences (superposition)
    let count_influence = 0; // Influences counter
    for (let vehicle of vehicles) { // Looping all vehicles...
      let distance = p5.Vector.dist(this.position, vehicle.position); // Distance scalar
      
      if (this != vehicle && distance < desired_separation) { // If not the same and within influence zone...
        let difference = p5.Vector.sub(this.position, vehicle.position); // Distance vector (points from 'vehicle' to 'this')
                                                                         // We want the influence on 'this'
        difference.setMag(1/distance); // Scaling magnitude 
                                       // Inversely proportional to 'distance' (the closer, the stronger)
        sum_influence.add(difference); // Adds influence
        count_influence++; // Iterates counter
      }
    }

    if (count_influence > 0) { // If any influence...
      sum_influence.div(count_influence); // Averages influences
    }

    if (sum_influence.mag() > 0) { // If averaged influence is positive...
      sum_influence.setMag(this.max_speed); // Scales magnitude to 'max_speed'
      sum_influence.sub(this.velocity); // From this point on 'sum_influence' becomes a force vector
      sum_influence.limit(this.max_force); // Limits magnitude
    }
    return sum_influence; // Force vector
  }
  show() { 
    push(); // New style start
    fill(100);
    stroke(0);
    strokeWeight(1.25);
    translate(this.position.x, this.position.y);
    circle(0, 0, this.radius*2);
    pop(); // New style end
  }
  show_assets(){
    push(); // Draws future position
    fill(125);
    stroke(125);
    strokeWeight(1);
    line(this.position.x, this.position.y, this.future.x, this.future.y);
    circle(this.future.x, this.future.y, 4);
    pop();

    push(); 
    fill(125);
    stroke(125);
    strokeWeight(1);
    circle(this.normal.x, this.normal.y, 4);
    line(this.future.x, this.future.y, this.normal.x, this.normal.y);
  }
}


// User-Defined Functions


// p5 Main
function setup() {
  canvas = createCanvas(width, height); // Canvas reference
  
  path = new Path(); // Instantiating 'Path'
  path.add_point(40,40); // Adding points (must be left -> right oriented)
  path.add_point(140,40);
  path.add_point(180,80);
  path.add_point(260,80);
  path.add_point(320,40);
  path.add_point(480,40);
  path.add_point(560,100);
  path.add_point(560,220);
  path.add_point(520,260);
  path.add_point(460,200);
  path.add_point(320,200);
  path.add_point(200,260);
  path.add_point(160,260);
  path.add_point(120,260);
  path.add_point(60,240);
  path.add_point(40,200);
  path.add_point(40,40);
  

  // We are now making random vehicles and storing them in an ArrayList
  for (let i = 0; i < 50; i++) {
    vehicles.push(new Vehicle(random(width), random(height))); // Instantiating 'Vehicle'
  }
}

function draw() {
  // Main
  background(255); // Grayscale white

  path.show();

  for (let vehicle of vehicles) { 
    vehicle.apply_behaviors(vehicles, path); // Applies forces from both path follow/separate
    vehicle.run(); // 'update()' + 'show()'
  }
}