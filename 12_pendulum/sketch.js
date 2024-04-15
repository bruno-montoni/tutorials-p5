// Global Variables
let width = 400, height = 400;
let origin; 
let pendulum;
let R = 150; // Arm length

// User-Defined Classes
class Pendulum {  
  constructor(start_theta) {
      // Attributes
      this.angle = start_theta; // [radians]
      this.position = createVector(origin.x + R*sin(this.angle), origin.y + R*cos(this.angle)); 
      this.a_velocity = 0.0; // Angular velocity
      this.a_acceleration = 0.0; // Angular acceleration
      this.r = 15; // 'Head' radius
      this.mass = 20;
      this.factor = 0.99; // Penalty
  }
  // Methods
  apply_force(force_vec) {
    let acceleration = force_vec.div(this.mass); // Vector
    this.a_acceleration += -acceleration.mag() * sin(this.angle);
  }
  update() {
    this.a_velocity += this.a_acceleration;
    this.a_velocity *= this.factor; // Penalizing velocity
    this.angle += this.a_velocity;
    this.position.x = origin.x + R*sin(this.angle);
    this.position.y = origin.y + R*cos(this.angle);
    this.a_acceleration = 0; // Reseting acceleration
  }
  display() {
    stroke(0); // All outlines
    strokeWeight(2); // Line stroke
    ellipse(origin.x, origin.y, 4); // Nail
    line(origin.x, origin.y, this.position.x, this.position.y); // Line
    strokeWeight(1.5); // Ball stroke
    fill(255); // Ball color
    ellipse(this.position.x, this.position.y, 2*this.r); // Ball
  }
}

// User-Defined Functions

// p5 Main
function setup() {
  createCanvas(width, height); // Creating the canvas with 'img' dimensions
  origin = createVector(width/2, height/3);
  pendulum = new Pendulum(PI/4); // Initialization
}

function draw() {
  // Main
  background(220); // Grayscale white
  
  let gravity = createVector(0, 0.02); 
  let weight = p5.Vector.mult(gravity, pendulum.mass); 
  pendulum.apply_force(weight);
  pendulum.update();
  pendulum.display();
}