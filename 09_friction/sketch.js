// Global Variables
let width = 300, height = 200; 
let ball // Declaring without initializing (check 'setup()')

let mu = 1.5 // Friction coefficient (depends on material)

// User-Defined Classes
class Ball { 
  constructor(start_x, start_y) { 
      // Attributes
      this.position = createVector(start_x, start_y); 
      this.velocity = createVector(random(5,10), 0); // To right
      this.acceleration = createVector(0, 0); // Starts at 0
      this.mass = 10; // Proxy for 'radius'
      this.bounce_factor = 0.7 // Velocity retained after bounce
  }
  // Methods
  apply_force(force_vec) {
    let acceleration = force_vec.div(this.mass);
    this.acceleration.add(acceleration);
  }
  
  contact_edge() {
    return (this.position.y + this.mass >= height - 1); // '-1': we increase the effect zone, otherwise it's too rare in beginning
                                                        // True: touches the ground / False: otherwise
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  display() {
    stroke(0); // Black outlines
    strokeWeight(1.5); // Outline width
    fill(125); 
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
    if (this.contact_edge()) { // Bottom bound
      this.position.y = height - this.mass; 
      this.velocity.y *= -this.bounce_factor; // Inverts velocity's 'y' component with penalty
    }
  }
}

// User-Defined Functions

// p5 Main
function setup() {
  createCanvas(width, height); // Creating the canvas with 'img' dimensions
  ball = new Ball(width/2, height/2); // Initializing
}

function draw() {
  // Main
  background(200); // Grayscale white
  let gravity = createVector(0, 0.5); // 'gravity' acceleration
  let weight = p5.Vector.mult(gravity, ball.mass); // Returns a copy ('gravity' is not affected)
  ball.apply_force(weight);
  
  if (ball.contact_edge()) { // Ball is in contact zone
    let friction = p5.Vector.normalize(ball.velocity) // Velocity unit vector
    friction.mult(-mu * weight.mag(), 1); // 'F_friction = -mu * abs(N) * v_unit' (only applied to 'x' coordinate)
    ball.apply_force(friction);
  }
   
  ball.update();
  ball.check_edges();
  ball.display();
}



