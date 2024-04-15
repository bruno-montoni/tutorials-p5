// Global Variables
let width = 300, height = 400; 
let liquid; // Initialized in 'setup()'
let balls = [] // Empty array

// User-Defined Classes
class Liquid {
  constructor(start_y, end_y, drag_coeff=0.5) { 
    this.start_x = 0;
    this.end_x = width;
    this.start_y = start_y;
    this.end_y = height;
    this.ro = 1 // Fluid's mass density
    this.drag_coeff = drag_coeff; // Drag coefficient
  }
  contains(ball_obj) {
    let ball_pos = ball_obj.position; // Vector
    return ball_pos.y >= this.start_y; // Boolean
  }
  calc_drag(ball_obj) { //'F_drag = -0.5 * ro * speed**2 * Area * drag_coeff * vel_unit' ('mass' is proxied by 'ro')
                        // 'ro': liquid density; 'speed': velocity's magnitude; 'Area': surface area; 'drag_coeff': drag coefficient
    let speed = ball_obj.velocity.mag();
    let drag_mag = 0.5 * this.ro * speed**2 * ball_obj.area * this.drag_coeff;
    let drag_force = ball_obj.velocity.copy();
    drag_force.mult(-1); // Inverting direction
    drag_force.normalize(); // Normalize
    drag_force.mult(drag_mag); // Apply magnitude
    return drag_force; 
  }
  display() {
    noStroke(); // No outlines
    fill(50); // Grayscale background
    rectMode(CORNERS); // 'rect(x1, y1, x2, y2)' (where '_1' is a corner; '_2' the opposite corner)
    rect(this.start_x, this.start_y, this.end_x, this.end_y);
  }
}

class Ball { 
  constructor(x, y) { 
      // Attributes
      this.position = createVector(x, y); 
      this.velocity = createVector(0, 0); // To right
      this.acceleration = createVector(0, 0); // Starts at 0
      this.mass = random(5, 25); // Proxy for 'radius'
      this.area = 1 // Sphere surface area (should be: 4 * PI * radius**2)
  }
  // Methods
  apply_force(force_vec) {
    let acceleration = force_vec.div(this.mass);
    this.acceleration.add(acceleration);
  }
  contact_floor() {
    return (this.position.y + this.mass >= height); // True: ball passed liquid / False: otherwise
  }
  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }
  display() {
    stroke(0); // Black outlines
    strokeWeight(1.5); // Outline width
    fill(255); // Grayscale background
    ellipse(this.position.x, this.position.y, this.mass*2);
  }
  check_edges() {
    if (this.position.x + this.mass > width) { // Right bound
      this.position.x = width - this.mass; 
      this.velocity.x *= -1; // Inverts velocity's 'x' component
    }
    if (this.position.x - this.mass < 0) { // Left bound
      this.position.x = this.mass;
      this.velocity.x *= -1; // Inverts velocity's 'x' component
    }
    if (this.contact_floor()) { // Bottom bound
      this.position.y = height - this.mass; 
      this.velocity.y = 0; // Stopping at bottom
    }
  }
}

// User-Defined Functions

// p5 Main
function setup() {
  createCanvas(width, height); // Creating the canvas with 'img' dimensions
  liquid = new Liquid(height/2, height); // Initialization
  
  for (let i = 1; i <= 5; i++){
    let _ball = new Ball(50*i, height/4); // Initializing balls (temp object)
    balls.push(_ball) 
  }
}

function draw() {
  // Main
  background(200); // Grayscale white
  
  liquid.display();
  
  for (let ball of balls){
    let gravity = createVector(0, 0.2); // 'gravity' acceleration
    let weight = p5.Vector.mult(gravity, ball.mass); // Returns a copy ('gravity' is not affected)
    ball.apply_force(weight);
  
    if (liquid.contains(ball)) { // Ball is in contact zone
      drag_force = liquid.calc_drag(ball);
      ball.apply_force(drag_force);
    }
   
    ball.update();
    ball.check_edges();
    ball.display();
  }

}
