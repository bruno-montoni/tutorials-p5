// User Global Variables
let width = 500, height = 300;
let gravity; // Placeholder for vector
let pipes = []; // Placeholder for 'Pipe' instances

// User-Defined Classes
class Flock { // Abstraction for GA + 'Bird' management
  constructor(pop_size=30, elite_perc=0.2, mutation_rate=0.05) {
    // Population
    this.pop_size = pop_size;
    // Birds
    this.birds = [];
    this.best_birds = []; // Best ever birds
    this.init_birds();
    // Elitism
    this.elite_perc = elite_perc; // Percentage of individuals to keep for next generation
    // Mutation
    this.mutation_rate = mutation_rate;
    // Stop Criteria
    this.epoch = 0; // Current epoch
  }
  // Methods
  init_birds() {
    for (let i = 0; i < this.pop_size; i++) {
      this.birds[i] = new Bird(); // Instantiates 'Bird' class
    }
  }
  run(pipes) {
    for (let bird of this.birds) { // Loops all birds...
      if (bird.is_alive) { // If bird is alive...
        for (let pipe of pipes) { // loops all pipes...
          if (pipe.collides(bird)) { // If bird collides...
            bird.death(); // Kills bird
          }
        }
        bird.apply_force(gravity); // Applies gravity
        bird.out_bounds(); // Checks for ground
        bird.predict(pipes); // Feeds NN (and flaps or not)
        bird.update(); // Updates position/velocity/acceleration
        bird.show();
      }
    }
  }
  birds_dead() { // We shouldn't remove birds from 'this.birds' because we still need their fitness (so only flagging)
    for (let bird of this.birds) { // Loops all birds...
      if (bird.is_alive) { // If any bird is alive...
        return false;
      } 
    }
    return true; // All birds dead
  }
  // NeuroEvolution Methods
  normalize_fitness() {
    let sum_fitness = 0;
    for (let bird of this.birds) { // Calculating 'sum_fitness'
      sum_fitness += bird.fitness;
    }
    for (let bird of this.birds) { // Normalizing all fitness values
      bird.fitness /= sum_fitness;
    }
  }
  reproduce() {
    let elite_birds = this.birds.slice(); // Best birds in current generation (deep copy)
    let next_birds = []; // Placeholder for best birds (next generation)
    // Elitism
    elite_birds.sort(function(bird1,bird2){return bird2.fitness - bird1.fitness}); // Sorts descending
    elite_birds = elite_birds.slice(0, floor(this.elite_perc * elite_birds.length)); // Keeps the best birds
    
    this.best_birds = this.best_birds.concat(elite_birds); // Adds current best to all-time best
    this.best_birds.sort(function(bird1,bird2){return bird2.fitness - bird1.fitness}); // Sorts descending
    this.best_birds = this.best_birds.slice(0, floor(this.elite_perc * this.best_birds.length)); // Keeps the best birds
    
    for (let i = 0; i < this.pop_size; i++) { // Looping 'this.pop_size' indexes...
      let brain1 = this.best_birds[floor(random() * this.best_birds.length)].brain; // Chooses 2 parents' 'brains'
      let brain2 = this.best_birds[floor(random() * this.best_birds.length)].brain;
      let brain_child = brain1.crossover(brain2); // Mating with ml5.js' built-in 'crossover' function 
      brain_child.mutate(this.mutation_rate); // Mutating with ml5.js' built-in 'mutate' function
      next_birds[i] = new Bird(brain_child); // Adds 'Bird' (with 'brain_child') to 'next_birds' 
    }
    this.birds = next_birds; // Updates 'this.birds' for next epoch
  }
  // Draw Methods
  show_stats() {
    let alive = 0;
    let best_fitness = 0;
    for (let bird of this.birds) {
      if (bird.is_alive) {alive += 1}
      if (bird.fitness > best_fitness) {best_fitness = bird.fitness}
    }
    
    push(); // Style: Stats
    fill(240);
    stroke(0);
    strokeWeight(1.5);
    rectMode(CORNERS);
    textSize(12);
    textFont("Arial");
    textAlign(RIGHT, CENTER);
    text("Generation: " + this.epoch, width - 10, 15);
    text("Alive %: " + round(100*alive/this.birds.length,2), width - 10, 30);
    text("Best Fitness: " + best_fitness, width - 10, 45);
    pop(); 
  }
}

class Bird { // Similar to 'Vehicle' class (no horizontal velocity)
  constructor(_brain, x=50, y=100, radius=14) {
    // Motion
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0); 
    this.acceleration = createVector(0, 0);
    this.flap_force = createVector(0, -8); // '-': bird flaps upwards
    // Object
    this.radius = radius; 
    // Status
    this.is_alive = true; 
    // NN
    this.brain = null;
    this.fitness = 0; // 'distance'/'time' based
    this.init_brain(_brain);
  }
  // Methods
  update() {
    this.velocity.add(this.acceleration); // Updates velocity
    this.position.add(this.velocity); // Updates position
    this.acceleration.mult(0); // Reset acceleration
    this.velocity.mult(0.95); // Dampens velocity
    
    this.fitness++; // Increments fitness
  }
  flap() {
    this.apply_force(this.flap_force);
  }
  apply_force(force) { // Receives a force (mass is not considered in this example)
    this.acceleration.add(force);
  }
  out_bounds() { // Checks if bird is below the floor
    if (this.position.y > height) {
      this.position.y = height;
      this.velocity.mult(0); // Reset velocity
    }
  }
  death() {
    this.is_alive = false; // Kills the bird
  }
  // NN Methods
  init_brain(_brain) {
    if (_brain) { // If a brain was passed during instantiation...
      this.brain = _brain; // Loads brain
    } else {
      let options = {inputs: 4, // 1) bird 'position.y'; 2) bird 'velocity.y'; 3) imediate pipe 'top'/'bottom'; 4) bird 'x' distance to pipe
                     outputs: ["flap", "no_flap"], // Output nodes
                     task: "classification", // NN type
                     learningRate: 0.05, // Learning rate
                     noTraining: true} // XXXXXXX
      this.brain = ml5.neuralNetwork(options); // 'Blank' brain
    }
  }
  calc_inputs(pipes) {
    let closest_pipe = null; // Not necessarily the 1st pipe (in 'pipes') is desired (they can be past the bird and still on canvas)
    for (let pipe of pipes) { // Looping from start to end...
      if (pipe.position.x + pipe.width > this.position.x) { // Finds 1st pipe before bird
        closest_pipe = pipe;
        break; // Breaks for-loop
      }
    }
    // Normalized Inputs (same order described in 'init_brain()')
    let inputs = [this.position.y/height, // Normalizing vertical properties by 'height'
                  this.velocity.y/height, 
                  closest_pipe.top/height, 
                  (closest_pipe.position.x - this.position.x)/width]; // Normalizing horizontal properties by 'width'
    return inputs;
  }
  predict(pipes) { 
    let inputs = this.calc_inputs(pipes); // Gets inputs (in right format/order)
    let outputs = this.brain.classifySync(inputs); // FeedForwards 'inputs' in NN (returns list with as many elements as outputs)
    if (outputs[0].label == "flap") { // If NN's biggest score is 'flap'...
      this.flap(); // Flaps!
    }
  }
  // Draw Methods
  show() { // Renaming from 'display' to 'show'
    push(); // Style: Bird
    fill(200, 100);
    stroke(0, 100);
    strokeWeight(1.5);
    circle(this.position.x, this.position.y, this.radius);
    pop(); 
  }
}

class Pipe { // The object that moves (only with horizontal velocity)
  constructor() {
    // Motion
    this.spacing = 100; // Pipes opening size
    this.top = random(height - this.spacing); // Top edge of pipes opening ('y')
    this.bottom = this.top + this.spacing; // Bottom edge of pipes opening ('y')
    this.position = createVector(width, 0); // 'x' starts at left edge
    this.width = 40; // Pipes width
    this.velocity = createVector(-3, 0); // Right-Left velocity
  }
  // Methods
  update() {
    this.position.add(this.velocity); // Updates position
  }
  collides(bird_obj) { // Easier to track 1 bird than several pipes (reason why method is here)
    let vert_collision = bird_obj.position.y < this.top || bird_obj.position.y > this.bottom; // Is bird above 'top' or below 'bottom'?
    let horiz_collision = bird_obj.position.x > this.position.x && bird_obj.position.x < this.position.x + this.width; // Is bird within 'width' of pipes?
    return vert_collision && horiz_collision; // If it's both, it's a hit ([bool])
  }
  out_bounds() {
    return this.position.x < -this.width; // If pipe is beyond left bound of canvas ([bool])
  }
  show() { 
    push(); // Style: Pipe
    fill(0);
    noStroke();
    rect(this.position.x, 0, this.width, this.top); // Top pipe
    rect(this.position.x, this.bottom, this.width, height - this.bottom); // Bottom pipe
    pop(); 
  }
}

  
// User-Defined Functions
function reset_pipes() {
  // Remove all the pipes but the very latest one
  pipes.splice(0, pipes.length - 1); // Deletes all pipes (except for last one)
}


// p5 Main
function setup() {
  createCanvas(width, height); // Canvas reference
  ml5.tf.setBackend("cpu"); // Sets ml5 to use CPU processing (available: 'cpu', 'gpu')
  
  gravity = createVector(0, 0.4); // An acceleration

  flock = new Flock(); // Instantiating 'Flock' class 
  pipes.push(new Pipe()); // Instantiating 'Pipe' class
}

function draw() {
  // Main
  background(255); // Grayscale white

  // Pipes
  for (let i = pipes.length - 1; i >= 0; i--) { // Descend looping (some pipes will be deleted)...
    pipes[i].update(); // Updates
    pipes[i].show(); // Draws
    if (pipes[i].out_bounds()) { // If out of canvas...
      pipes.splice(i, 1); // Deletes pipe
    }
  }
  if (frameCount % 75 == 0) { // Spawns new pipe
    pipes.push(new Pipe()); 
  }
  
  // Flock
  flock.run(pipes); // 1) Checks collision; 2) Kills collided birds; 3) Applies 'gravity'; 4) Out of bounds; 5) Predicts; 6) Updates; 7) Draws
  
  // Evolution
  if (flock.birds_dead()) { // If all birds dead...
    flock.normalize_fitness();
    flock.reproduce(); // Results in a new batch of birds ('flock.birds')
    reset_pipes(); // Next epoch
    flock.epoch++;
  }
  
  // Stats
  flock.show_stats(); // Draws statistics
}