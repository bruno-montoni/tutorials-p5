// User Global Variables
let width = 500, height = 300;
let cubes = []; // Placeholder for 'Cube' instances
let boundaries = []; // Placeholder for 'Boundary' instances
// Matter.js Global Variables
const {Engine, Bodies, Composite, Body, Vector} = Matter; // Alias for all modules
let engine; // Initialized at 'setup()'
let world; // Used as a shortcut to 'engine.world'


// User-Defined Classes
class Cube {
  constructor(x, y) {
    this.width = random(5,15);
    this.height = random(5,15);
    this.options = {friction: 0.01, restitution: 0.25}; // Sets 'Body' properties
    this.body = Bodies.rectangle(x, y, this.width, this.height, this.options); // Rectangle Body
                                                                          // Notice that we dont need to store its position ('x'/'y') anymore; all is handled by Matter.js
    Body.setVelocity(this.body, Vector.create(random(-4,4), random(-2,0))); // Sets the velocity using a Matter 'Vector' 
    Body.setAngularVelocity(this.body, random(0,0.5)); // Sets rotational velocity 
  }
  // Methods
  display() {
    let position = this.body.position; // 'this.body' references Matter.js Body object which can be queried for params
                                       // Vector
    let angle = this.body.angle; // Scalar (default: counter-clockwise radians)
    fill(127);
    stroke(0);
    strokeWeight(1.5);
    push(); // Saves the drawing style (setting a new state)
    rectMode(CENTER); // Matter.js uses CENTER (so 'display' must match)
    translate(position.x, position.y); // Amount to displace objects (analog to resetting the origin)
    rotate(angle); // Rotates a shape by 'angle' (in units set by 'angleMode()')
    rect(0, 0, this.width, this.height); // Draws with updated drawing style
    pop(); // Restores the drawing style (set by 'push()')
  }
  check_edge() {
    return this.body.position.y > height + this.height; // True: off canvas / False: in canvas
  }
  // Matter Methods
  add_body(){ // Adds 'this.body' to world composite
    Composite.add(world, this.body);
  }
  remove_body(){ // Removes 'this.body' from world composite
    Composite.remove(world, this.body);
  }
}

class Boundary {
  constructor(_x, _y, _width, _height, _angle) {
    this.x = _x; // Top-left 'x' value
    this.y = _y; // Top-left 'y' value
    this.width = _width;
    this.height = _height;
    this.options = {friction: 0, restitution: 0.1, angle: _angle, isStatic: true}
    this.body = Bodies.rectangle(this.x, this.y, this.width, this.height, this.options); // Rectangle static Body
    Composite.add(world, this.body); // Adds object to world 
                                     // Not using 'add_body()' since: we call it from 'constructor'
                                     //                               instantiation happens directly on 'boundaries'
  }
  // Methods
  display() {
    let position = this.body.position; 
    let angle = this.body.angle; 
    fill(180);
    noStroke();
    push();  
    rectMode(CENTER); 
    translate(position.x, position.y);
    rotate(angle); 
    rect(0, 0, this.width, this.height); // Since it never moves, we draw it without querying world
    pop();
  }
  // Matter Methods
  remove_body(){ 
    Composite.remove(world, this.body); // Removes boundary from world
  }
}


// User-Defined Functions


// p5 Main
function setup() {
  createCanvas(width, height); // Canvas reference
  
  engine = Engine.create(); // Creating the engine (default properties)
  engine.gravity.y = 0.8; // Updating gravity's 'y' parameter
  world = engine.world;
  
  boundaries.push(new Boundary(width/4, height-15, width/2 - 50, 20, 0)); // Left boundary and adds to placeholder
  boundaries.push(new Boundary(3*width/4, height-100, width/2 - 50, 20, -PI/6)); // Right boundary and adds to placeholder

  Matter.Runner.run(engine);
}

function draw() {
  // Main
  background(225); // Grayscale white
  
  if (random(0,1) < 0.2) { // 10% chance of spawning a new 'Cube'
    let _cube = new Cube(width/2, 50); 
    _cube.add_body(); // Adds object to world 
    cubes.push(_cube); // Adds it to placeholder
  }

  for (let i = cubes.length-1; i >= 0; i--) { // Looping 'cubes' backwards (better for removal)
    cubes[i].display(); // Draws cube
    if (cubes[i].check_edge()) { // If cube is out of canvas
      cubes[i].remove_body(); // Removes body from Matter.js (must come first since we need the reference below)
      cubes.splice(i, 1); // Removes body from placeholder
    }
  }

  for (let i = 0; i < boundaries.length; i++) {
    boundaries[i].display(); // Draws boundary
  }
}