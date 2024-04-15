// User Global Variables
let width = 300, height = 300;
let canvas; // Reference to p5 canvas object (see 'setup()')
let pendulum; 
// Matter.js Global Variables
const {Engine, World, Bodies, Composite, Constraint, Body, Vector, Mouse, MouseConstraint}  = Matter; // Alias for all modules
let engine; // Initialized at 'setup()'
let world; // Used as a shortcut to 'engine.world'
let mouse_constr; // Mouse constraint for moving objects


// User-Defined Classes
class Ball {
  constructor(x, y, radius, options={}) {
    this.radius = radius;
    this.body = Bodies.circle(x, y, this.radius, options);
  
    Composite.add(world, this.body); // Adds 'Ball' to world
  }
  // Methods
  display() {
    push();
    fill(125);
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    circle(0, 0, this.radius * 2);
    line(0, 0, this.radius, 0); // Allows rotation viz
    pop();
  }
}

class Chain {
  constructor(x, y, radius, num_links, length) { 
    this.x = x; // Anchor 'Ball' coordinates
    this.y = y;
    this.radius = radius; // 'Ball' radius
    this.num_links = num_links; // Total 'Ball' instances in chain
    this.length = length // Link length
    this.balls = []; // Stores all 'Ball' instances (placeholder)
    this.links = []; // Stores all constraints (placeholder)
  }
  // Methods
  create_chain() {
    let previous = null; // Stores previous 'Ball'
    let _ball;
    let _constraint;

    for (let i = 0; i < this.num_links; i++) {
      if (!previous) { // Anchor (no 'previous' stored)
        _ball = new Ball(this.x, this.y, this.radius, {isStatic: true}); // Anchor 'Ball' is static body
      } else {
        _ball = new Ball(this.x + (i * 40), this.y + (i * this.length), this.radius); // Other 'Ball' are not-static bodies
        _constraint = Constraint.create({bodyA: previous.body, // Creates constraint ('previous'<>'_ball')
                                         bodyB: _ball.body,
                                         length: this.length,
                                         stiffness: 0.25});
        Composite.add(world, _constraint); // Adds to engine
        this.links.push(_constraint); // Adds to constraints placeholder                         
      }
      this.balls.push(_ball); // Adds to balls placeholder
                              // 'Ball' is added to world on creation
      previous = _ball; // Update 'previous'    
    }
  }
  display() {
    for (let i = 1; i < this.num_links; i++) { // Drawing the links
      line(this.balls[i-1].body.position.x, this.balls[i-1].body.position.y, // Previous ball
           this.balls[i].body.position.x, this.balls[i].body.position.y); // Next ball
    }
    for (let ball of this.balls) {
      ball.display(); // Handled by 'Ball' class
    }
  }
}


// User-Defined Functions


// p5 Main
function setup() {
  canvas = createCanvas(width, height); // Canvas reference
  
  engine = Engine.create(); // Creating the engine (default properties)
  world = engine.world;
  
  chain = new Chain(width/2, height/5, 15, 5, 40); // Instantiating 'Chain' first (then building mouse constraint)
  chain.create_chain();
  
  let mouse = Mouse.create(canvas.elt); // Listener object for mouse inputs on 'canvas'
                                        // 'canvas.elt': HTML5 canvas associated with p5 canvas (which is a wrapper for HTML5 canvas)
  mouse.pixelRatio = pixelDensity(); // Matching pixel density between p5 and Matter.js
                                     // 'pixelDensity()': sets pixel scaling for high density displays
  mouse_constr = MouseConstraint.create(engine, {mouse: mouse}); // Creates a new mouse constraint ('mouse_constr') with 'Mouse' object in use
  Composite.add(world, mouse_constr); // Adding 'mouse_constr' to world (no need to attach objects to it; any body becomes attached on click)
  
  Matter.Runner.run(engine);
}

function draw() {
  // Main
  background(225); // Grayscale white
  
  if (mouse_constr.body) { // 'Body' currently being moved/dragged (only triggers when an object is associated with the mouse constraint)
    push(); // Drawing the red line (drag)
    stroke(255, 0, 0);
    line(mouse_constr.body.position.x, mouse_constr.body.position.y, mouseX, mouseY); // 'mouse_constr.constraint': 'Constraint' object used to move the body during interaction
                                                                                      // Draws line between object's center and mouse coords
    pop();
  }
  
  chain.display(); // Draws pendulum
}