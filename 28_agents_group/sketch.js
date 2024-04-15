// User Global Variables
let width = 600, height = 300;
let canvas; // Reference to p5 canvas object (see 'setup()')
let vehicles = [];


// User-Defined Classes
class Vehicle {
  constructor(x, y, radius=6) {
    // Motion
    this.position = createVector(x, y);
    this.velocity = createVector(random(-1,1), random(-1,1)); 
    this.acceleration = createVector(0, 0);
    this.max_speed = 3; // Max 'this.velocity' magnitude
    this.max_force = 0.2; // Max 'apply_force()' value
    // Object
    this.radius = radius; // Circle parameter
  }
  // Methods
  update() {
    this.velocity.add(this.acceleration); // Updates velocity
    this.velocity.limit(this.max_speed); // Limits velocity
    this.position.add(this.velocity); // Updates position
    this.acceleration.mult(0); // Reset acceleration
  }
  apply_force(force) { // Receives a force (mass is not considered in this example)
    this.acceleration.add(force);
  }
  separate(vehicles) { // Checks for nearby vehicles and steers away
    let desired_separation = this.radius * 4; // Separation based on physical property
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
      sum_influence.setMag(this.max_speed); // Scales magnitude to 'max_speed'
      let force = p5.Vector.sub(sum_influence, this.velocity); // Force vector
      force.limit(this.max_force); // Limits magnitude
      this.apply_force(force);
    }
  }
  out_bounds() {
    if (this.position.x < -this.radius) this.position.x = width + this.radius;
    if (this.position.y < -this.radius) this.position.y = height + this.radius;
    if (this.position.x > width + this.radius) this.position.x = -this.radius;
    if (this.position.y > height + this.radius) this.position.y = -this.radius;
  }
  show() { 
    push(); // New style start
    fill(125);
    stroke(0);
    strokeWeight(1.5);
    translate(this.position.x, this.position.y);
    circle(0, 0, this.radius*2);
    pop(); // New style end
  }
}


// User-Defined Functions


// p5 Main
function setup() {
  canvas = createCanvas(width, height); // Canvas reference
  
  for (let i = 0; i <= 25; i++) {
    vehicles.push(new Vehicle(random(width), random(height))); // Instantiating 'Vehicle'
  }
}

function draw() {
  // Main
  background(255); // Grayscale white
  
  for (let vehicle of vehicles) {
    vehicle.separate(vehicles);
    vehicle.update();
    vehicle.out_bounds();
    vehicle.show();
  } 
}