// User Global Variables
let width = 400, height = 600;
let canvas; // Reference to p5 canvas object (see 'setup()')
let dividers = 12;
let pegs_map;
let walls = [];
let balls = [];
// Matter.js Global Variables
const {Engine, World, Bodies, Composite, Constraint, Body, Vector, Mouse, MouseConstraint}  = Matter; // Alias for all modules
let engine; // Initialized at 'setup()'
let world; // Used as a shortcut to 'engine.world'


// User-Defined Classes
class Ball {
  constructor(x, y) {
    this.radius = 5;
    this.color = "green";
    this.body = Bodies.circle(x, y, this.radius, {friction: 0, restitution: 0.5}); 
  
    Composite.add(world, this.body); // Adds 'Ball' to world
  }
  // Methods
  display() {
    push();
    fill(this.color);
    noStroke();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    circle(0, 0, this.radius * 2);
    pop();
  }
}

class Peg {
  constructor(x, y) {
    this.radius = 10;
    this.color = "gray";
    this.body = Bodies.circle(x, y, this.radius, {isStatic: true, friction: 0, restitution: 0.5}); 
  
    Composite.add(world, this.body); // Adds 'Ball' to world
  }
  // Methods
  display() {
    push();
    fill(this.color);
    noStroke();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    circle(0, 0, this.radius * 2);
    pop();
  }
}

class PegsMap {
  constructor(rows=10, cols=11, offset=80) { 
    this.rows = rows; 
    this.cols = cols; 
    this.offset = offset; // Vertical offset (for first row)
    this.pegs = []; // 'Ball's placeholder (populated in 'create_map()')
  }
  // Methods
  create_map() {
    let h_offset = 20; // Similar to padding (for 'Wall')
    let space = (width - h_offset*2)/this.cols;
    let rows;
    let peg;
    
    // Nested loop fills columns on each row (stepping over rows)
    for (let j = 0; j < this.cols; j++) { // Looping over 'y' axis ('cols')
      if (j % 2 == 0) { // Even rows get '+1' peg (for symmetry)
        rows = this.rows + 1;
      } else {
        rows = this.rows;
      };
      for (let i = 0; i < rows; i++) { // Looping over 'x' axis ('rows')
        let x = (i + 0.5) * space + h_offset; // Sets 'x' position
        if (j % 2 == 1) { // If row is odd, shifts 'space/2' to the right
          x += space / 2;
        }
        let y = (j + 1) * space + this.offset; // Sets 'y' position
        
        peg = new Peg(x, y)
        this.pegs.push(peg); // Instantiates 'Ball' and appends
      } 
    }
  }
  display() {
    for (let peg of this.pegs) {
      peg.display(); // Handled by 'Ball' class
    }
  }  
}
class Wall {
  constructor(x, y, _width, _height, _angle) {
    this.width = _width;
    this.heigth = _height;
    this.color = "black";
    this.body = Bodies.rectangle(x, y, _width, _height, {isStatic: true, friction: 0, restitution: 0.5, angle: _angle}); 
  
    Composite.add(world, this.body); // Adds 'Wall' to world
  }
  // Methods
  display() {
    push();
    rectMode(CENTER); // Both p5/Matter.js use this mode
    fill(this.color);
    noStroke();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    rect(0, 0, this.width, this.heigth);
    pop();
  }
}         
    
 
// User-Defined Functions


// p5 Main
function setup() {
  canvas = createCanvas(width, height); // Canvas reference
  
  engine = Engine.create(); // Creating the engine (default properties)
  world = engine.world;
  
  pegs_map = new PegsMap(); // Instantiating 'Chain' first
  pegs_map.create_map();
  
  // Instatiating 'Wall' boundaries
  walls.push(new Wall(width/2, height, width, 60, 0)); // Bottom
  walls.push(new Wall (0, height/2, 30, height, 0)); // Left
  walls.push(new Wall (width, height/2, 30, height, 0)); // Right
  
  // Instatiating buckets
  let bucket_width = (width - 30 - (dividers * 4))/(dividers + 1); // '-30': used by left/right boundaries / '*4': dividers width / 'dividers + 1': total buckets
  for (let i = 0; i <= dividers; i++){ // 'x = 13': starting point (considering divider's width) / '12.5': equals to '15 - 5/2' (from dividers' width)
    walls.push(new Wall(13 + (bucket_width + 4) * i, height - 30 - 40, 4, 80, 0)); // Divider 
  }
  
  
  Matter.Runner.run(engine);
}

function draw() {
  // Main
  background(225); // Grayscale white
  
  if (frameCount % 10 == 0 && balls.length <= 150) {
    balls.push(new Ball(width/2 + random(-0.05, 0.05), height/15)); // 'x' coordinate has randomness
  }
  
  pegs_map.display(); // Draws pegs
  
  for (let wall of walls) { // Draw walls/dividers
    wall.display();
  }
  
  for (let ball of balls) { // Draws balls
    ball.display();
  }
}