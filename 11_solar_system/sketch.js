// Global Variables
let width = 400, height = 400; 
let sun;
let planets = []; // Empty array

// User-Defined Classes
class Sun { 
  constructor() { 
      // Attributes
      this.position = createVector(width/2, height/2); 
      this.velocity = createVector(0, 0); // To right
      this.acceleration = createVector(0, 0); // Starts at 0
      this.mass = 15; // Sun: 1.989 × 10^30 kg
      this.radius = 15 // 696.340 km
      this.G = 1;
  }
  // Methods
  attract(planet) {
    let force = p5.Vector.sub(this.position, planet.position); // Direction of force
    let distance = force.mag(); // Distance between sun-planet
    distance = constrain(distance, 5, 20); // Limiting distance to eliminate "extreme" results (very close/far objects)
    let magnitude = (this.G * this.mass * planet.mass) / (distance * distance); // Gravitational pull
    force.setMag(magnitude); // Setting magnitude
    return force;
  }
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
    fill(255,140,0); // Color
    ellipseMode(CENTER);
    ellipse(this.position.x, this.position.y, 2*this.radius);
  }
}

class Planet { 
  constructor() { 
      // Attributes
      this.position = createVector(random(150,250), random(150,250)); 
      this.velocity = createVector(random(0,0.5), random(0,0.5)); 
      this.acceleration = createVector(0, 0); // Starts at 0
      this.mass = random(2, 8); // Comparison: Mercury: 3.30 × 10^23 kg / Earth: 5.97 × 10^24 kg / Jupiter: 1.90 × 10^27 kg
      this.radius = random(2, 6) // Comparison: Mercury: 2.440 km / Earth: 6.371 km / Jupiter: 69.911 km
      this.G = 1;
  }
  // Methods
  attract(other) {
    let force = p5.Vector.sub(this.position, other.position); // Direction of force
    let distance = force.mag(); // Distance between sun-planet
    distance = constrain(distance, 10, 20); // Limiting distance to eliminate "extreme" results (very close/far objects)
    let magnitude = (this.G * this.mass * other.mass) / (distance * distance); // Gravitational pull
    force.setMag(magnitude); // Setting magnitude
    return force;
  }
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
    strokeWeight(1); // Outline width
    fill(255); // Grayscale background
    ellipse(this.position.x, this.position.y, 2*this.radius);
  }
}

// User-Defined Functions

// p5 Main
function setup() {
  createCanvas(width, height); // Creating the canvas with 'img' dimensions
  sun = new Sun(); // Initialization
  
  for (let i = 1; i <= 5; i++){
    let _planet = new Planet(); // Initializing balls (temp object)
    planets.push(_planet) 
  }
}

function draw() {
  // Main
  background(220); // Grayscale white
  
  sun.display();
  for (let planet of planets) { // Planet-Sun interaction
    let sun_force = sun.attract(planet); // From 'sun', applied on 'planet'
    planet.apply_force(sun_force);
    planet.update();
  }

  for (let planet1 of planets) { // Planet-Planet interaction
    for (let planet2 of planets) {
      if (planet1 !== planet2) { 
        let force = planet1.attract(planet2); // From 'planet1', applied on 'planet2'
        planet2.apply_force(force);
        planet2.update();
      }
    }
    planet1.display();
  }
}