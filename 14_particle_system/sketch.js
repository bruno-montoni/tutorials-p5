// Global Variables
let width = 300, height = 400;
let particle_system;
let repeller;
let counter;


// User-Defined Classes
class Particle {  
  constructor() {
      // Attributes
      this.position = createVector(width/2, height/4); 
      this.velocity = createVector(random(-1,1), random(-1,-2)); 
      this.acceleration = createVector(0,0);
      this.r = 5; // Particle radius
      this.mass = 10;
      this.lifespan = 120 // Counter
  }
  // Methods
  is_dead(){
    return this.lifespan <= 0
  }
  apply_force(force_vec) {
    let a_vec = force_vec.div(this.mass); // 'a_vec': acceleration vector from 'force_vec'
    this.acceleration.add(a_vec);
  }
  update() {
    this.velocity.add(this.acceleration);
    this.velocity.mult(this.factor); // Penalizing velocity
    this.position.add(this.velocity);
    this.acceleration.mult(0); // Reseting acceleration
    this.lifespan -= 2; // Reducing lifespan
  }
  display() {
    stroke(0, this.lifespan); // Black outlines (with 'lifespan' alpha)
    strokeWeight(1.5); // Line stroke
    fill(50, this.lifespan); // Dark gray (with 'lifespan' alpha)
    ellipse(this.position.x, this.position.y, 2*this.r); // Ball
  }
}

class ParticleSystem {  
  constructor() {
      // Attributes
      this.arr_particles = []; 
      this.size = 0;
  }
  // Methods
  apply_force(a_vec){ // Receives the acceleration, not the force ('wind' is just an acceleration)
    for(let particle of this.arr_particles){
      let weight = p5.Vector.mult(a_vec, particle.mass);
      particle.apply_force(weight);
    }
  }
  apply_repeller(repeller) { // Calculates force from 'repeller'
    for(let particle of this.arr_particles){
      let a_repel = repeller.repel(particle); // Vector (acceleration)
      let repel_force = p5.Vector.mult(a_repel, particle.mass);
      particle.apply_force(repel_force);
    }
  }
  update(){
    for(let particle of this.arr_particles){
      particle.update();
    }
  }
  display(){
    for(let particle of this.arr_particles){
      particle.display();
    }
  }
  // Array Methods
  add(){
    let count = this.arr_particles.push(new Particle());
    this.size = count;
  }
  del(){
    for (let i = this.size - 1; i >= 0; i--){
      if (this.arr_particles[i].is_dead()){
        this.arr_particles.splice(i, 1);
      }
    }
  }
}

class Repeller {  
  constructor() {
    // Attributes
    this.position = createVector(width/2, 3*height/4);
    this.mass = 1500;
    this.r = 15; // Radius
    this.G = 1; // Gravitational constant
  }
  // Methods
  repel(particle){
    let a_vec = new p5.Vector.sub(particle.position, this.position); // Acceleration vector (from repeller to particle)
    let dist = a_vec.mag(); // Scalar (runs before normalization)
    a_vec.normalize(); // Unit vector
    //dist = constrain(dist, 5, 100); // Limiting 'distance'
    let a_repel = (this.G * this.mass) / dist**2 // 'F = (G * m_r * m_p) / d**2 = m_p * a_p' therefore 'a_p = (G * m_r) / d**2'
    a_vec.mult(a_repel); // Assigns 'a_repel' magnitude
    return a_vec; // Vector
  }
  display(){
    stroke(0); // Black outlines
    strokeWeight(2); // Line stroke
    fill(125); // Dark gray (with 'lifespan' alpha)
    ellipse(this.position.x, this.position.y, 2*this.r); // Ball
  }
}
  
class Counter {  
  constructor(_str=null) {
      // Attributes
      this.content = _str;
  }
  // Methods
  update(_str) {
    this.content = _str;
  }
  display() {
    noStroke();
    textFont("Helvetica",14);
    textStyle(NORMAL); 
    textAlign(CENTER, CENTER);
    text(this.content, width*0.95, height*0.95);
  }
}


// User-Defined Functions


// p5 Main
function setup() {
  createCanvas(width, height); // Creating the canvas with 'img' dimensions
  particle_system = new ParticleSystem();
  repeller = new Repeller();
  counter = new Counter();
}

function draw() {
  // Main
  background(220); // Grayscale white
  
  let gravity = createVector(0, 0.4); // Both are accelerations
  let wind = createVector(0.1, 0);
  
  particle_system.add(); // Adds particle to system
  particle_system.apply_force(gravity); // System uses the acceleration (not the force)
  if(mouseIsPressed) { // 'mouseIsPressed': 'draw()' queries variable every frame (as long as it's pressed)
                       // 'mousePressed()': function (which needs to be declared) is executed once per click (mouse has to be unpressed and repressed, for function to execute again)
    particle_system.apply_force(wind); // System uses the acceleration (not the force)
  }
  particle_system.apply_repeller(repeller);
  
  particle_system.update();
  particle_system.del();
  particle_system.display();
  
  repeller.display();
    
  counter.update(particle_system.size); // Update text
  counter.display(); // Draws
}
