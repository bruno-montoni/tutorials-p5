// Global Variables
let width = 300, height = 300;
let particle_system;
let img;


// User-Defined Classes
class Particle {  
  constructor(img_obj) {
      // Attributes
      this.img = img_obj;
      this.position = createVector(width/2, height/3); 
      this.velocity = createVector(random(-2,2), random(-1,-2)); 
      this.acceleration = createVector(0,0);
      this.r = 5; // Particle radius
      this.mass = 10;
      this.lifespan = 80 // Counter
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
    imageMode(CENTER);
    tint(255, 0, 0, 100);
    image(this.img, this.position.x, this.position.y);
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
  add(img_obj){
    let count = this.arr_particles.push(new Particle(img_obj));
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


// User-Defined Functions


// p5 Main
function setup() {
  createCanvas(width, height); // Creating the canvas with 'img' dimensions
  img = loadImage("smoke.png"); // Load image just once (better performance)
  particle_system = new ParticleSystem();
}

function draw() {
  // Main
  background(0); // Grayscale white
  blendMode(BLEND); // How new pixels (A; next frame) interact with current pixels (B; current frame):
  
  let gravity = createVector(0, 0.4); // Both are accelerations
  let wind = createVector(0.2, 0);
  
  particle_system.add(img); // Adds particle to system
  particle_system.apply_force(gravity); // System uses the acceleration (not the force)
  particle_system.apply_force(wind); // System uses the acceleration (not the force)
  
  particle_system.update();
  particle_system.del();
  particle_system.display();
}
