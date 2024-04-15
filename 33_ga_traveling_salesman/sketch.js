// User Global Variables
let canvas; // Reference to p5 canvas object (see 'setup()')
let width = 600, height = 480;


// User-Defined Classes
class GeneticAlgorithm { 
  constructor(total_cities=15, pop_size=100, padding_perc=0.05, max_epochs=25000) {
    // Cities
    this.cities = []; // Array: [Vector(x,y)] 
                      // Stores cities' coordinates
    this.cities_order = []; // Array: [id] (matches 'this.cities's order)
    this.create_cities(total_cities, padding_perc);
    // Population (Path)
    this.pop_threshold = 0.1; // % of individuals selected for mating (next generation)
    this.population = []; // Placeholder for current individuals
                          // Array [[id_num]] 
    this.next_population = []; // Placeholder for next generation individuals
    this.init_population(pop_size, total_cities);
    // Fitness
    this.fitness = []; // Array:[scalar] (eventually)
                       // Matches 'this.population's order
    this.best_distance = Infinity; // Smallest distance found
    this.best_route = null; // Array: [id] 
    // Elitism
    this.elite_perc = 0.2; // Percentage of best individuals to keep for next generation
    // Mutation
    this.mutation_rate = 0.05;
    // Stop Criteria
    this.epoch = 0; // Current epoch
    this.max_epochs = max_epochs; // Stop criteria
    // Draw
    this.padding_perc = padding_perc;
    this.radius = 8;
  }
  // Methods
  create_cities(total_cities, padding_perc) { // Initializes 'this.cities'
    for (let i = 0; i < total_cities; i++) {
      this.cities.push(new p5.Vector(random(2*padding_perc * width, (1 - 2*padding_perc) * width), // x
                                     random(2*padding_perc * height, (0.8 - 2*padding_perc) * height))); // y
      this.cities_order.push(i); // id
    }
  }
  init_population(pop_size) { // Initializes 'this.population'
    let route; // Individual
    for (let i = 0; i < pop_size; i++) {
      route = shuffle(this.cities_order); // 'shuffle()': returns deep copy
      this.population[i] = route; // Populating 
    }
  }
  calc_distance(route) { // Calculates 'route' distance (see 'calc_finess()')
    let route_distance = 0; 
    for (let i = 0; i < route.length - 1; i++) { // '-1': considers the 'i+1' for the next city
      let id1 = route[i]; // City ID
      let city1_vec = this.cities[id1]; // City coords vector
      let id2 = route[i + 1]; // Label
      let city2_vec = this.cities[id2]; // City ID
      
      let distance = dist(city1_vec.x, city1_vec.y, city2_vec.x, city2_vec.y); // Calculates distance between connected cities
      route_distance += distance; // Scalar
    }
    return route_distance;
  }
  calc_fitness() { // Updates 'this.fitness'
    for (let i = 0; i < this.population.length; i++) { // Looping individuals...
      let route_distance = this.calc_distance(this.population[i]); 
      if (route_distance < this.best_distance) {
        this.best_distance = route_distance; // Scalar
        this.best_route = this.population[i]; // Array: [id]
      }
      this.fitness[i] = 1 / (pow(route_distance, 8) + 1); // Approach: the smaller the distance the greater the fitness
                                                          //           we then normalize (0-1) and make a random 'roulette' selection (all add to 100%)
    }
  }
  normalize_fitness() {
    let sum_fitness = 0;
    for (let i = 0; i < this.fitness.length; i++) { // Calculating 'sum_fitness'
      sum_fitness += this.fitness[i];
    }
    for (let i = 0; i < this.fitness.length; i++) { // Normalizing all fitness values
      this.fitness[i] /= sum_fitness;
    }
  }
  next_generation() { 
    let elite_fitness = this.fitness.slice(); // Deep copy
    elite_fitness.sort(function(a,b){return a - b}); // Sorts ascending
    elite_fitness.slice(0, floor(this.elite_perc * elite_fitness.length)); // Keeps the best fitness
    
    let elite_population = []; // Stores best individuals 
    for (let i = 0; i < elite_fitness.length; i++) { // Looping 'elite_fitness'...
      let idx = this.fitness.indexOf(elite_fitness[i]); // Gets element index from 'this.fitness' (that matches 'this.population')
      elite_population[i] = this.population[idx]; // Appends to 'elite_population'
    }
    
    for (let i = 0; i < this.population.length; i++) { // Looping 'this.population' size...
      let route1 = elite_population[floor(random() * elite_population.length)]; // Chooses 2 individuals
      let route2 = elite_population[floor(random() * elite_population.length)];
      let child = this.crossover(route1, route2); // Mating
      child = this.mutation(child); // Mutation
      this.next_population[i] = child; // Adds 'child' to 'this.next_population' 
    }
    this.population = this.next_population; // Updates population for next round
  }
  step() { // Stops simulation  
    if (this.epoch >= this.max_epochs) {noLoop()} else {this.epoch += 1} // Stoping criteria
  }
  
  // GA Methods
  crossover(route1, route2) { // 'route1'/'route2': Array: [id]
                              // Since we can't have repetitions, crossing over can't be just splitting 2 genomes in a random location and mixing them
                              // Approach: we keep a random 'piece' of 'route1' and keep the ordered missing elements from 'route2'
    let start_idx = floor(random(route1.length)); // Start/End indexes in 'route1'
    let end_idx = floor(random(start_idx + 1, route1.length));
    let piece = route1.slice(start_idx, end_idx); // 'route1's crossover leg (will be the left part of child's genome)
    for (let i = 0; i < route2.length; i++) { // Looping 'route2'...
      let city_id = route2[i]; 
      if (!piece.includes(city_id)) { // If 'piece' doesnt have current 'city_id'...
        piece.push(city_id); // Child's genome starts with 'piece' and gets appended with 'route2's remaining 'city_id's (in order)
      }
    }
    return piece;
  }
  mutation(route) {
    for (let i = 0; i < route.length; i++) {
      if (random(1) < this.mutation_rate) { // Each element has its own chance of mutation
        let idx1 = floor(random(route.length)); // Indexes to be swapped
        let idx2 = (idx1 + 1) % route.length;
        let value_buffer = route[idx1]; // Buffering value
        route[idx1] = route[idx2]; // Swapping
        route[idx2] = value_buffer;
      }
    }
    return route;
  }
  // Draw Methods
  show() {
    let city_id;
    let font_size = 12;
    
    push(); // Style: Background
    fill(240);
    stroke(90);
    strokeWeight(3);
    rectMode(CORNERS);
    rect(this.padding_perc * width, this.padding_perc * height, (1 - this.padding_perc) * width, 3*height/4, 10);
    pop();
    
    push(); // Style: Routes (Lines)
    beginShape();
    noFill();
    stroke(110);
    strokeWeight(2);
    strokeJoin(ROUND);
    for (let i = 0; i < this.best_route.length; i++) {
      city_id = this.best_route[i]
      vertex(this.cities[city_id].x, this.cities[city_id].y);  
    }
    endShape();
    pop();
    
    push(); // Style: Cities (Circles)
    textSize(8);
    textAlign(CENTER, CENTER);
    for (let i = 0; i < this.best_route.length; i++) {
      fill(255);
      stroke(0);
      strokeWeight(2);
      city_id = this.best_route[i]
      circle(this.cities[city_id].x, this.cities[city_id].y, 2*this.radius);
      fill(0);
      noStroke();
      text(city_id, this.cities[city_id].x, this.cities[city_id].y);
    }
    pop();
    
    push(); // Style: Stats
    textSize(font_size);
    textAlign(LEFT, CENTER);
    translate(this.padding_perc * width, 5*height/6);
    text("Current Epoch: " + this.epoch, 0, 0);
    text("Best Distance: " + this.best_distance.toFixed(2), 0, font_size); // 'toFixed': rounds decimal places
    text("Best Route: " + join(this.best_route, " > "), 0, 2*font_size);
    if (this.epoch >= this.max_epochs) {
      fill(255,0,0);
      text("End of Simulation", 0, 4*font_size);
    }
    pop();
  }
}
    
  
// User-Defined Functions


// p5 Main
function setup() {
  canvas = createCanvas(width, height); // Canvas reference

  ga = new GeneticAlgorithm();
}

function draw() {
  // Main
  background(250); // Grayscale white

  ga.calc_fitness();
  ga.next_generation();
  ga.show();
  
  ga.step(); // Increments 'this.epoch' and stops simulation
}