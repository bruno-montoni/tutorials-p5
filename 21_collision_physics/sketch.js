// User Global Variables
let width = 500, height = 200;
let canvas; // Reference to p5 canvas object (see 'setup()')
let ground;
let balls = [];
// Matter.js Global Variables
const {Engine, World, Bodies, Composite, Constraint, Body, Vector, Mouse, MouseConstraint}  = Matter; // Alias for all modules
let engine; // Initialized at 'setup()'
let world; // Used as a shortcut to 'engine.world'


// User-Defined Classes
class Ball {
  constructor(x, y, radius) {
    this.radius = radius;
    this.color = color(127); // Initial color
    this.body = Bodies.circle(x, y, this.radius, {restitution: 0.6}); 
    this.body.plugin.ball = this; // Custom 'plugin' parameter (for collision detection)
  
    Composite.add(world, this.body); // Adds 'Ball' to world
  }
  // Methods
  change_color() {
    this.color = color(random(100, 255), 0, random(100, 255));
  }
  check_edge() {
    return this.body.position.y > height + this.radius; // To check on 'Ball's that fall off 'ground'
  }
  display() {
    rectMode(CENTER);
    fill(this.color);
    stroke(0);
    strokeWeight(1.5);
    push();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    circle(0, 0, this.radius * 2);
    line(0, 0, this.radius, 0); // For direction
    pop();
  }
  // Matter.js Methods
  remove() {
    Composite.remove(engine.world, this.body);
  }
}

class Boundary {
  constructor(_x, _y, _width, _height) {
    this.x = _x;
    this.y = _y;
    this.width = _width;
    this.height = _height;
    this.body = Bodies.rectangle(this.x, this.y, this.width, this.height, {isStatic: true}); 

    Composite.add(world, this.body); // Adds 'Ball' to world
  }
  // Methods
  display() {
    rectMode(CENTER);
    fill(127);
    noStroke();
    rect(this.x, this.y, this.width, this.height);
  }
}

   
// User-Defined Functions
function collision_callback(event) { // 'event': created by Matter.js and parsed to callback on collision
  for (let pair of event.pairs) {
    let bodyA = pair.bodyA; // 'pair.body_': returns the Matter.js 'Body' (not our class instance; thus the importance of 'plugin')
    let bodyB = pair.bodyB;
    let ballA = bodyA.plugin.ball; // Pulling the instance object from 'plugin' parameter
    let ballB = bodyB.plugin.ball;
    
    if (ballA instanceof Ball && ballB instanceof Ball) { // Confirming the collision is between 2 'Ball's
      ballA.change_color(); // Changing 'Ball' color
      ballB.change_color();
    }
  }
}


// p5 Main
function setup() {
  canvas = createCanvas(width, height); // Canvas reference
  
  engine = Engine.create(); // Creating the engine (default properties)
  engine.gravity.y = 0.6; // Adjusting the gravity
  world = engine.world;
  
  ground = new Boundary(width/2, height - 5, width, 10); // '-5': for a 10 'height' rectangle
  
  Matter.Events.on(engine, "collisionStart", collision_callback); // Listening for 'collisionStart' events (calls 'collision_callback' when so)
  Matter.Runner.run(engine);
}

function draw() {
  // Main
  background(225); // Grayscale white
  
  if (random(1) <= 0.05) {
    balls.push(new Ball(random(width), 0, random(4,8))); // 'x' coordinate has randomness
  }
    
  for (let i = balls.length-1; i >= 0; i--) { // Looping backwards for deletion
    balls[i].display();
    if (balls[i].check_edge()) { // Checks for deletion
      balls[i].remove(); // Removes from 'engine'
      balls.splice(i, 1); // Removes from 'balls'
    }
  }
  ground.display(); // Draws the ground
}