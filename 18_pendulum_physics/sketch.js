// User Global Variables
let width = 300, height = 300;
let pendulum; 
// Matter.js Global Variables
const {Engine, Bodies, Composite, Constraint, Body, Vector}  = Matter; // Alias for all modules
let engine; // Initialized at 'setup()'
let world; // Used as a shortcut to 'engine.world'


// User-Defined Classes
class Pendulum {
  constructor(x, y, length) {
    this.length = length;
    this.anchor_r = 5; // Radii are fixed
    this.ball_r = 15;
    this.anchor = Bodies.circle(x, y, this.anchor_r, {isStatic: true}); // Nail (static body)
    this.ball = Bodies.circle(x + this.length, y - this.length, this.ball_r, {restitution: 0.6}); // Ball (regular body)
    this.arm = Constraint.create({bodyA: this.anchor, // 1st body the constraint connects to
                                  bodyB: this.ball, // 2nd body the constraint connects to
                                  length: this.length, // Target length of constraint (it'll attempt to maintain this length during the simulation)
                                  damping: 0.1, // Amount of resistance applied to body (based on its velocities, limiting oscillation)
                                                 // Only be apparent when constraint has very low 'stiffness' (0: no damping / 0.1: heavy damping)
                                  stiffness: 0.5}); // Rigidity of the constraint (0: spring-like / 1: fully rigid)
  }
  // Methods
  display() {
    fill(127);
    stroke(0);
    strokeWeight(1.5);
    line(this.anchor.position.x, this.anchor.position.y, this.ball.position.x, this.ball.position.y); // Drawing the arm
    
    push(); // Drawing the anchor (new state)
    translate(this.anchor.position.x, this.anchor.position.y);
    rotate(this.anchor.angle);
    circle(0, 0, this.anchor_r * 2);
    pop();

    push(); // Drawing the ball (new state)
    translate(this.ball.position.x, this.ball.position.y);
    rotate(this.ball.angle);
    circle(0, 0, this.ball_r * 2);
    line(0, 0, 0, this.ball_r); // Draws a line to see rotation (since anchor is a circle)
    pop();
  }
  // Matter Methods
  add_body(){ // Adds 'this.body' to world composite
    Composite.add(world, this.anchor); // Adds objects
    Composite.add(world, this.ball);
    Composite.add(world, this.arm); // Constraint must be added too
  }
}


// User-Defined Functions


// p5 Main
function setup() {
  createCanvas(width, height); // Canvas reference
  
  engine = Engine.create(); // Creating the engine (default properties)
  world = engine.world;

  pendulum = new Pendulum(width/2, height/4, 150);
  pendulum.add_body();
  
  Matter.Runner.run(engine);
}

function draw() {
  // Main
  background(225); // Grayscale white
  
  if (mouseIsPressed) {
    Body.setPosition(pendulum.ball, Vector.create(mouseX, mouseY), updateVelocity=true); // Allows click/drag ball
                                                                                         // Constraint follows the behavior
  }
  
  pendulum.display(); // Draws pendulum
}