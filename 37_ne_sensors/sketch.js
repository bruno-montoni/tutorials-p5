// User Global Variables
let width = 300, height = 500;
let canvas; // Reference to p5 canvas object (see 'setup()')
let spawn_rate = 20; // For 'Block' spawn
                     // Important: can't be over 100 (otherwise 'blocks' is empty and breaks 'vehicle.cast_rays')
let gravity;
let walls = []; // Always restricted to canvas' bounds
let blocks = [];
let vehicle; // 'Vehicle' object
let ga; // 'GA' object


// User-Defined Classes
class GA { 
  constructor(pop_size=50, elite_perc=0.3, mutation_rate=0.05) {
    // Population
    this.pop_size = pop_size;
    // Vehicles
    this.vehicles = [];
    this.best_vehicles = []; // Best ever vehicles
    this.init_vehicles();
    // Elitism
    this.elite_perc = elite_perc; // Percentage of individuals to keep for next generation
    // Mutation
    this.mutation_rate = mutation_rate;
    // Stop Criteria
    this.epoch = 0; // Current epoch
  }
  // Population Methods
  init_vehicles() {
    for (let i = 0; i < this.pop_size; i++) {
      this.vehicles[i] = new Vehicle(); // Instantiates 'Vehicle' class (without trained NN)
    }
  }
  // Run Methods
  run(walls) {
    for (let vehicle of this.vehicles) { // Loops all vehicles...
      if (vehicle.is_alive) { // If vehicle is alive...
        for (let block of blocks) { // Loops all blocks...
          if (block.collides(vehicle)) { // If vehicle collides...
            vehicle.kill(); // Kills vehicle
          }
        }
        vehicle.out_bounds(); // Checks position
        vehicle.predict(); // Feeds NN
        vehicle.run(); // Updates position/velocity/acceleration
        vehicle.show(); // Draws (vehicle + rays)
      }
    }
  }
  // Death Methods
  vehicles_dead() { 
    for (let vehicle of this.vehicles) { // Loops all vehicles...
      if (vehicle.is_alive) { // If any vehicle is alive...
        return false;
      } 
    }
    return true; // All vehicles dead
  }
  // NN Methods
  normalize_fitness() {
    let sum_fitness = 0;
    for (let vehicle of this.vehicles) { // Calculating 'sum_fitness'
      sum_fitness += vehicle.fitness;
    }
    for (let vehicle of this.vehicles) { // Normalizing all fitness values
      vehicle.fitness /= sum_fitness;
    }
  }
  reproduce() {
    let elite_vehicles = this.vehicles.slice(); // Best vehicles in current generation (deep copy)
    let next_vehicles = []; // Next generation vehicles 
    // Elitism
    elite_vehicles.sort(function(vehicle1,vehicle2){ return vehicle2.fitness - vehicle1.fitness }); // Sorts descending
    elite_vehicles = elite_vehicles.slice(0, floor(this.elite_perc * elite_vehicles.length)); // Keeps % of current vehicles
    
    this.best_vehicles = this.best_vehicles.concat(elite_vehicles); // Adds current bests to all-time bests
    this.best_vehicles.sort(function(vehicle1,vehicle2){return vehicle2.fitness - vehicle1.fitness}); // Sorts descending
    this.best_vehicles = this.best_vehicles.slice(0, floor(this.elite_perc * this.best_vehicles.length)); // Keeps % of best ever vehicles
    
    for (let i = 0; i < this.pop_size; i++) { // Looping 'this.pop_size' indexes...
      let nn1 = this.best_vehicles[floor(random() * this.best_vehicles.length)].nn; // Chooses 2 parents' 'nn'
      let nn2 = this.best_vehicles[floor(random() * this.best_vehicles.length)].nn;
      let nn_child = nn1.crossover(nn2); // Mating with ml5.js' built-in 'crossover'
      nn_child.mutate(this.mutation_rate); // Mutating with ml5.js' built-in 'mutate'
      next_vehicles[i] = new Vehicle(nn_child); // Adds 'Vehicle' (with 'nn_child') to 'next_vehicles' 
    }
    this.vehicles = next_vehicles; // Updates 'this.vehicles' for next epoch
  }
  // Draw Methods
  show_stats() {
    let alive = 0;
    let best_fitness = 0;
    for (let vehicle of this.vehicles) {
      if (vehicle.is_alive) {alive += 1}
      if (vehicle.fitness > best_fitness) {best_fitness = vehicle.fitness}
    }
    push(); // Style: Box
    fill(0);
    noStroke();
    rectMode(CORNERS);
    textSize(10);
    textFont("Arial");
    textAlign(LEFT, CENTER);
    text("Generation: " + this.epoch, 10, 20);
    text("Alive: " + round(100*alive/this.vehicles.length, 2) + "%", 10, 30);
    text("Best Fitness: " + best_fitness, 10, 40);
    pop(); 
  }
}

class Vehicle { 
  constructor(_nn, side=10, offset=2.5) { // 'offset': used in triangle position
    // Shape
    this.side = side; // Triangle shape: bottom=side / height=2*side
    // Physics
    this.position = createVector(width/2, height - offset); // Middle point of bottom side
    this.velocity = createVector(0, 0); 
    this.acceleration = createVector(0, 0); 
    this.max_speed = 2; // Velocity cap
    this.max_force = 0.5; // 'apply_force()' cap
    // Rays
    this.rays = []; // [lst:Ray] 
    this.build_rays();
    // Status
    this.is_alive = true; 
    // NN
    this.nn = null;
    this.fitness = 0; // 'time' based
    this.init_nn(_nn);
  }
  // Ray Methods
  build_rays(see_angle=20, step=10) { // 'see_angle': visibility cone range (in degrees)
    this.rays = []; // Reset rays
    angleMode(DEGREES); // Sets angle unit
    let angle_center = -90; // North direction (unit vector)
    let angle_half = see_angle/2;
    for (let angle = -angle_half; angle <= angle_half; angle += step) { // From left to right
      this.rays.push(new Ray(this.position, radians(angle_center + angle))); // Instantiating 'Ray' class
    }
  }
  cast_rays(){ // Calculates ray's 'target'
    for (let ray of this.rays) { // Looping 'this.rays'...
      let closest_point = null; 
      let min_distance = Infinity; // Distance to compare (we want the smallest)
      let edges = walls.slice(); // Considers canvas' walls (deep copy)
      
      for (let block of blocks) { // Loooping 'blocks'...
        edges = edges.concat(block.get_edges()); // All edges in 1 place
        for (let edge of edges) { // Looping 'edges'...
          let point = ray.calc_point(edge); // Always returns a 'point' ('vehicle' is boxed)
          if (point) {
            const distance = p5.Vector.dist(this.position, point);      
            if (distance < min_distance) { // If closest...
              closest_point = point; // Updates
              min_distance = distance; 
            }
          }
        }     
      }
      ray.target = closest_point; // Records smallest found for each 'ray' 
                                  // [vector]
    } 
  }
  // Movement Methods
  update() {
    this.velocity.add(this.acceleration); // Updates velocity
    this.velocity.limit(this.max_speed); // Limits velocity
    this.position.add(this.velocity); // Updates position
    this.acceleration.mult(0); // Reset acceleration
    
    this.velocity.mult(0.95); // Dampens velocity (friction with floor)
    
    this.fitness++; // Increments fitness
  }
  out_bounds() { // Checks/Keeps 'vehicle' blocks fall zone
    let offset = blocks[0].side/2; // Getting a block's 'side'
    
    if (this.position.x <= offset) { // Left bound
      this.position.x = offset;
      this.velocity.mult(0); // Reset velocity
    }
    if (this.position.x >= width - offset) { // Right bound
      this.position.x = width - offset;
      this.velocity.mult(0); // Reset velocity
    }
  }
  move(nn_force) { // Exclusive for NN
    this.apply_force(nn_force);
  }
  apply_force(force) {
    this.acceleration.add(force);
  }
  // Death Methods
  kill() {
    this.is_alive = false; // Kills the 'vehicle'
    
    let offset = blocks[0].side/2; // Block's 'side'
    let left_bound = round(offset * 1.1);
    let right_bound = round((width - offset) * 0.9);
    let position = round(this.position.x);
    if (position <= left_bound || position >= right_bound) {
      this.fitness = 0; // Fitness penalty
    }
  }
  // Run Methods
  run() { // 'Vehicle' is not affected by gravity
    this.build_rays(); // Resets rays
    this.cast_rays(walls); // Finds rays 'target'
    
    this.update(); // Updates position/velocity/acceleration
  }
  // NN Methods
  init_nn(_nn) { // NN initialization
    if (_nn) { // (Later Generations) With trained NN...
      this.nn = _nn; 
    } else { // (1st Generation) Without trained NN...
      let options = {inputs: 3, // 3 rays
                     outputs: ["left", "right"], // Output nodes
                     task: "classification", // NN type
                     learningRate: 0.05, // Learning rate
                     noTraining: true} // 'Blank' NN
      this.nn = ml5.neuralNetwork(options); 
    }
  }
  calc_inputs() { // 'this.rays' order: [left, center, right] (considering 3 rays)
    let inputs = [];
    for (let ray of this.rays) {
      inputs.push(ray.calc_distance()/height); // Normalized distance to closest point (using 'height' since it's the longest dimension)
    }
    return inputs;
  }
  predict() { 
    let inputs = this.calc_inputs(); 
    let outputs = this.nn.classifySync(inputs); // FeedForwards 'inputs' into NN 
                                                // Returns list with as many elements as outputs (ordered as 'options.outputs')
    angleMode(DEGREES); 
    let nn_force; 
    if (outputs[0].label == "left") { // If greatest score is 'left'...
      nn_force = createVector(-this.max_force, 0); // Moves left
    } else {
      nn_force = createVector(this.max_force, 0); // Moves right
    }
    this.move(nn_force); // Applies 'nn_force'
  }
  // Draw Methods
  show() {
    push(); // Style: Rays
    for (let ray of this.rays) {
      ray.show();
    }
    pop();
    
    push(); // Style: Vehcile
    fill(127);
    stroke(0);
    strokeWeight(1.25);
    translate(this.position.x, this.position.y);
    strokeJoin(ROUND); // Rounded joint
    triangle(-this.side/2, 0, 0, -this.side*2, this.side/2, 0); // Vehicle
    pop(); 
  }
}

class Ray {
  constructor(vehicle_position, theta) { // 'theta': considers 'vehicle' direction
    this.position = vehicle_position; // Origin (point A)
    this.direction = p5.Vector.fromAngle(theta); // Unit vector
    this.target = createVector(); // Destination (point B)
  }
  // Calculation Methods
  calc_point(edge) { // 'edge': [a, b]
    let x1 = edge.a.x; // Edge A
    let y1 = edge.a.y;
    let x2 = edge.b.x; // Edge B
    let y2 = edge.b.y;
    
    let x3 = this.position.x; // Vehicle origin
    let y3 = this.position.y;
    let x4 = this.position.x + this.direction.x; // Vehicle direction (unit vector)
    let y4 = this.position.y + this.direction.y;
    // Line Intersection: https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    //                    when 2 lines are parallel/coincident, 'denominator' is 0
    let denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denominator == 0) { return } // Returns 'undefined' (exit)
    // Finding intersection points
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator; 
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;
    if (t > 0 && t < 1 && u > 0) { // Intersection exists if 0 ≤ t ≤ 1 and 0 ≤ u
      let point = createVector(x1 + t * (x2 - x1), 
                               y1 + t * (y2 - y1)); // [Vector]
      return point; // Intersection
    } else {
      return; // No intersection
    }
  }
  calc_distance() {
    return dist(this.position.x, this.position.y, this.target.x, this.target.y); // [scalar]
  }
  // Draw Methods
  show() {
    push(); // Style: Ray
    stroke(200);
    strokeWeight(0.5);
    line(this.position.x, this.position.y, this.target.x, this.target.y); // Ray
    fill(220, 100);
    stroke(50, 100);
    circle(this.target.x, this.target.y, 4); // Target
    pop();
  }
}
  
class Block {
  constructor(side=40) {
    // Object
    this.side = side;
    this.center = createVector(random(this.side/2, width-this.side/2), 0.25*width);
    // Movement
    this.position = createVector(this.center.x, this.center.y); // 'x' starts at top
    this.velocity = createVector(0, 0); // Top-Bottom velocity
    this.acceleration = createVector(0, 0);
  }
  // Edges Methods
  get_edges() { // Appends edges: right, bottom, left (top is not needed)
    let edges = [];
    edges.push({"a": createVector(this.position.x - this.side/2, this.position.y + this.side/2),
                "b": createVector(this.position.x + this.side/2, this.position.y + this.side/2)}); // Bottom
    edges.push({"a": createVector(this.position.x + this.side/2, this.position.y - this.side/2),
                "b": createVector(this.position.x + this.side/2, this.position.y + this.side/2)}); // Right
    edges.push({"a": createVector(this.position.x - this.side/2, this.position.y - this.side/2),
                "b": createVector(this.position.x - this.side/2, this.position.y + this.side/2)}); // Left
    return edges
  }
  // Movement Methods 
  update() {
    this.velocity.add(this.acceleration); // Updates velocity
    this.position.add(this.velocity); // Updates position
    this.acceleration.mult(0); // Reset acceleration
  }
  apply_force(force) { // 'force': gravity (mass not considered)
    this.acceleration.add(force);
  }
  // Environment Methods
  out_bounds() { // Checks if block is below floor
    if (this.position.y - this.side > height) { return true } else { return false } // Top edge is beyond
  }
  collides(vehicle) { 
    let v_collision = vehicle.position.y - vehicle.side*2 <= this.position.y + this.side/2; // Is 'vehicle's top above 'block's bottom edge
    let h_collision = vehicle.position.x >= this.position.x - this.side/2 && vehicle.position.x <= this.position.x + this.side/2; // Is 'vehicle's side lesser than 'block' left/right edges
    
    //console.log(v_collision, h_collision)
    
    return v_collision && h_collision; // Collision means both simultaneously ([bool])
  } 
  // Run Methods
  run() { // 
    this.apply_force(gravity); // Applies gravity
    this.update(); // Updates position/velocity/acceleration
  }
  // Draw Methods
  show() {
    push(); // Style: Block
    fill(200);
    stroke(0);
    strokeWeight(1);
    rectMode(CENTER);
    rect(this.position.x, this.position.y, this.side, this.side);
  }
}

class Wall {
  constructor(x1, y1, x2, y2) {
    // Motion
    this.a = createVector(x1, y1); // Start point
    this.b = createVector(x2, y2); // End point
  }
  // Methods
  show() { 
    push(); // Style: Wall
    stroke(0);
    strokeWeight(2);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
    pop(); 
  }
}

  
// User-Defined Functions
function reset_blocks() { // Removes all blocks (except for last one)
  blocks.splice(0, blocks.length - 1); 
}


// p5 Main
function setup() {
  createCanvas(width, height); // Canvas reference
  ml5.tf.setBackend("cpu"); // Sets ml5 to use CPU processing (available: 'cpu', 'gpu')
  
  gravity = createVector(0, 0.1); // An acceleration
  
  walls.push(new Wall(0, 0, width, 0)); // Top wall
  walls.push(new Wall(width, 0, width, height)); // Right wall
  walls.push(new Wall(0, height, width, height)); // Bottom wall
  walls.push(new Wall(0, 0, 0, height)); // Left wall
  
  ga = new GA(); // Instantiates 'GA' class
  
  blocks.push(new Block()); // Instantiates 'Block' class
}

function draw() {
  // Main
  background(255); // Grayscale white
  
  // Edges
  for (let wall of walls) { 
    wall.show(); // Draws
  }
  
  // Blocks
  if (frameCount % spawn_rate == 0) { // Spawns new block
    blocks.push(new Block()); 
  }
  for (let i = blocks.length - 1; i >= 0; i--) { // Descend looping (blocks will be deleted)...
    blocks[i].run(); // 1) Applies 'gravity'; 2) Updates
    blocks[i].show(); // Draws
    if (blocks[i].out_bounds()) { // If below floor level...
      blocks.splice(i, 1); // Deletes block
    }
  }
  
  // GA
  ga.run(walls); // 1) Checks collision; 2) Kills collided; 3) Out of bounds; 5) Predicts; 6) Updates; 7) Draws
  
  // Evolution
  if (ga.vehicles_dead()) { // If all vehicles dead...
    ga.normalize_fitness();
    ga.reproduce(); // Results in a new batch of vehicles
    reset_blocks(); // Next epoch
    ga.epoch++;
  }
  
  ga.show_stats(); // Stats
}