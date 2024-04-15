// Global Variables
let width = 400, height = 400;
let origin; 
let spring; // Declaring without initializing
let ball;

// User-Defined Classes
class Spring {  
  constructor(length) {
      // Attributes
      this.anchor = origin.copy(); // Vector
      this.length = length; // Rest length
      this.min_length = 0.4 * this.length;
      this.max_length = 1.6 * this.length;
      this.k = 0.5; // Hooke's Law constant
  }
  // Methods
  connect(ball_obj) {
    let spring_force = new p5.Vector.sub(ball_obj.position, this.anchor); // Vector from anchor to Ball
    let dist = spring_force.mag(); // Magnitude
    let stretch = dist - this.length; // Displacement
    spring_force.normalize(); // Unit vector
    spring_force.mult(-1 * this.k * stretch); // Hooke's Law: 'F = k * stretch'
    ball_obj.apply_force(spring_force);
  }
  constrain_length(ball_obj) {
    let spring_dir = new p5.Vector.sub(ball_obj.position, this.anchor);
    let dist = spring_dir.mag();
    if (dist < this.min_length) {
      spring_dir.normalize(); // Unit vector
      spring_dir.mult(this.min_length); // Scale to 'min_length' magnitude
      ball_obj.position = new p5.Vector.add(this.anchor, spring_dir); // Updating ball position
                                                                      // 'position = spring_dir - anchor'
      ball_obj.mult(0); // Speed is 0 at peak
    } 
    else if (dist > this.max_length) {
      spring_dir.normalize(); // Unit vector
      spring_dir.mult(this.max_length); // Scale to 'max_length' magnitude
      ball_obj.position = new p5.Vector.add(this.anchor, spring_dir); // Updating ball position
                                                                      // 'position = spring_dir - anchor'
      ball_obj.velocity.mult(0); // Speed is 0 at peak
    }
  }
  display(ball_obj) {
    stroke(0); // All outlines
    strokeWeight(2); // Line stroke
    ellipse(this.anchor.x, this.anchor.y, 4); // Anchor
    line(this.anchor.x, this.anchor.y, ball_obj.position.x, ball_obj.position.y); // Spring
  }
}

class Ball {  
  constructor() {
      // Attributes
      this.position = createVector(width/2, 3*height/4); 
      this.velocity = createVector(0,0); 
      this.acceleration = createVector(0,0);
      this.drag_offset = createVector(0,0);
      this.is_dragging = false; // True: mouse drag / False: otherwise
      this.r = 15; // Ball radius
      this.mass = 20;
      this.factor = 0.99; // Penalty
  }
  // Methods
  apply_force(force_vec) {
    let a_vec = force_vec.div(this.mass); // 'a_vec': acceleration vector from 'force_vec'
    this.acceleration.add(a_vec);
  }
  update() {
    this.velocity.add(this.acceleration);
    this.velocity.mult(this.factor); // Penalizing velocity
    this.position.add(this.velocity);
    this.acceleration.mult(0); // Reseting acceleration
  }
  display() {
    stroke(0); // Black outlines
    strokeWeight(1.5); // Line stroke
    if (this.is_dragging) {
      fill(50); // Dark gray
    } else {
      fill(175); // Default color
    }
    ellipse(this.position.x, this.position.y, 2*this.r); // Ball
  }
  // Mouse Methods
  clicked(mouse_x, mouse_y) {
    let click_dist = dist(mouse_x, mouse_y, this.position.x, this.position.y);
    if (click_dist < this.r) {
      this.is_dragging = true;
      this.drag_offset.x = this.position.x - mouse_x; // Stores mouse values in 'drag_offset'
      this.drag_offset.y = this.position.y - mouse_y;
    }
  }
  stop_drag() {
    this.is_dragging = false;
  }
  drag(mouse_x, mouse_y) {
    if (this.is_dragging) {
      this.position.x = mouse_x + this.drag_offset.x;
      this.position.y = mouse_y + this.drag_offset.y;
    }
  }
}

// User-Defined Functions
function mousePressed() { // System function (works as trigger)
  ball.clicked(mouseX,mouseY);
}

function mouseReleased() { // System function (works as trigger)
  ball.stop_drag();
}

// p5 Main
function setup() {
  createCanvas(width, height); // Creating the canvas with 'img' dimensions
  origin = createVector(width/2, height/4); // Vector
  spring = new Spring(150); // Initialization
  ball = new Ball(); // Initialization
}

function draw() {
  // Main
  background(220); // Grayscale white
  
  let gravity = createVector(0, 0.2); 
  let weight = p5.Vector.mult(gravity, ball.mass); 
  ball.apply_force(weight);

  spring.connect(ball); // Applies spring force to 'ball'
  spring.constrain_length(ball); // Limits spring length (can't pull ball upwards)

  ball.update();
  ball.drag(mouseX,mouseY);; // If ball is being dragged (overrides 'ball.update()' related to 'position')
  
  spring.display(ball); // Draws anchor + line
  ball.display(); // Draws ball
}