// User Global Variables
let width = 600, height = 300;
let canvas; // Reference to p5 canvas object (see 'setup()')
let vehicles = [];


// User-Defined Classes
class Flock {
  constructor() {
    this.vehicles = []; // Placeholder for all vehicles
  }
  // Methods
  run() {
    for (let vehicle of this.vehicles) {
      vehicle.run(this.vehicles); // Needs 'this.vehicles' 
    }
  }
  add_vehicle(vehicle) {
    this.vehicles.push(vehicle); // Appends to 'this.vehicles'
  }
}

class Vehicle {
  constructor(x, y, side=4) {
    // Motion
    this.position = createVector(x, y);
    this.velocity = createVector(random(-2,2), random(-2,2)); 
    this.acceleration = createVector(0, 0);
    this.max_speed = random(2,4); // Max 'velocity' magnitude
    this.max_force = 0.1; // Max 'apply_force()' value
    // Align
    this.vicinity = side * 20;
    // Object
    this.side = side; // Circle parameter
  }
  // Methods
  apply_behaviors(vehicles) {
    let separate_force = this.separate(vehicles); // Proximity force
    let align_force = this.align(vehicles); // Alignment force
    let cohere_force = this.cohere(vehicles); // Coherence force
    
    separate_force.mult(1.5); // Using arbitrary weighting (by scaling the forces magnitudes)
    align_force.mult(1);
    cohere_force.mult(1);
    
    // Accumulate in acceleration
    this.apply_force(separate_force); // Applying the forces
    this.apply_force(align_force);
    this.apply_force(cohere_force);
  }
  apply_force(force) { // Receives a force (mass is not considered in this example)
    this.acceleration.add(force);
  }
  run(vehicles) {
    this.apply_behaviors(vehicles);
    this.update();
    this.out_bounds();
    this.show();
  }
  update() {
    this.velocity.add(this.acceleration); // Updates velocity
    this.velocity.limit(this.max_speed); // Limits velocity
    this.position.add(this.velocity); // Updates position
    this.acceleration.mult(0); // Reset acceleration
  }
  separate(vehicles) { // Checks for nearby vehicles and steers away
    let desired_separation = this.side * 4; // Separation based on physical property
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
  align(vehicles) { // Checks for neighbor vehicles and steers towards them (via average velocity within 'this.vicinity')
    let sum_influence = createVector(); // Vector that aggregates all influences (superposition)
    let count_influence = 0; // Influences counter
    for (let vehicle of vehicles) { // Looping all vehicles...
      let distance = p5.Vector.dist(this.position, vehicle.position); // Distance scalar
      
      if (this != vehicle && distance <= this.vicinity) { // If not the same and within influence zone...
        sum_influence.add(vehicle.velocity); // Counts vechicle's velocity (orientation)
        count_influence++; // Iterates counter
      }
    }
    
    if (count_influence > 0) { // If any vehicles considered...
      sum_influence.div(count_influence); // Averages velocities
      sum_influence.setMag(this.max_speed); // Scales magnitude to 'max_speed'
      sum_influence.sub(this.velocity); // From this point on 'sum_influence' becomes a force vector
      sum_influence.limit(this.max_force); // Limits magnitude
      return sum_influence;
    } else {
      return createVector(0, 0); // If no vehicles around, keep current velocity
    }
  }
  cohere(vehicles) { // Checks for center neighbor vehicles (within 'this.vicinity')) and steers towards it
    let sum_positions = createVector(); // Vector that aggregates all positions (superposition)
    let count_positions = 0; // Positions counter
    for (let vehicle of vehicles) { // Looping all vehicles...
      let distance = p5.Vector.dist(this.position, vehicle.position); // Distance scalar
    
      if (this != vehicle && distance <= this.vicinity) { // If not the same and within 'this.vicinity'...
        sum_positions.add(vehicle.position); // Counts vechicle's position
        count_positions++; // Iterates counter
      }
    }
    
    if (count_positions > 0) { // If any vehicles considered...
      sum_positions.div(count_positions); // Averages positions
      return this.seek(sum_positions); // Steers towards the location
    } else {
      return createVector(0, 0); // If no vehicles around, dont seek anything
    }
  } 
  seek(target) { // Seeks target's current position 
    let force = p5.Vector.sub(target, this.position); // Direction vector (points from position to target)
    force.normalize(); // Unit vector
    force.mult(this.max_speed); // Scales magnitude
    force.sub(this.velocity); // Force vector (the force needed, with current velocity, to steer into target)
    force.limit(this.max_force); // Limits magnitude
    return force;
  }
  out_bounds() {
    if (this.position.x < -this.side) this.position.x = width + this.side;
    if (this.position.y < -this.side) this.position.y = height + this.side;
    if (this.position.x > width + this.side) this.position.x = -this.side;
    if (this.position.y > height + this.side) this.position.y = -this.side;
  }
  show() { 
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
   
  flock = new Flock(); // Instantiating 'Flock'
  for (let i = 0; i < 50; i++) {
    let vehicle = new Vehicle(random(width), random(height)); // Instantiating 'Vehicle'
    flock.add_vehicle(vehicle); // Adding
  }
}

function draw() {
  // Main
  background(255); // Grayscale white
  
  flock.run();
}