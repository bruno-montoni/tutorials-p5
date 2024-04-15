// User Global Variables
let canvas; // Reference to p5 canvas object (see 'setup()')
let width = 400, height = 600;
let ca; // Cellular Automata

// User-Defined Classes
class CellularAutomata { // 1D Wolfram Cellular Automata
  constructor(rule_num, side=4) {
    // Grid Specs
    this.side = side; // Cell dimension (sqare)
    this.rows = height / this.side; // Total rows
    this.cols = width / this.side; // Total columns
    // Simulation
    this.generation = 0; // Current generation (0-indexed)
    this.ruleset = null; // Array (ex: Ruleset 222 - [0,1,1,1,1,0,1,1]; order: left to right)
                         // Reference: https://mathworld.wolfram.com/ElementaryCellularAutomaton.html
    // Matrix
    this.matrix = []; // Generations placeholder 
                      // Has fixed 'canvas' size (gets updated as generations pass)
    
    this.set_ruleset(rule_num);
    this.build_matrix();
  }
  // Methods
  set_ruleset(rule_num) {
    let rule_output = Number(rule_num).toString(2).padStart(8,"0"); // Converts 'rule_num' integer to binary (backwards)
    this.ruleset = rule_output.split("").reverse(); // Converting to array and reverting to right order
  }
  build_matrix() { // Initialize 'this.matrix'
    for(let i = 0; i < this.rows; i++) { // Looping rows...
      this.matrix.push(new Array(this.cols)); // Adding array with 'this.cols' elements
      for(let j = 0; j < this.cols; j++) { // Looping new element...
        this.matrix[i][j] = 0; // Default value
      }
      this.matrix[0][floor(this.cols/2)] = 1; // Arbitrarily setting middle cell to '1' (starting point)
    }
  }
  generate() { // Creates a new generation and adds to 'this.matrix's last row
    for (let j = 0; j < this.cols; j++) { // Looping columns...
      let left = this.matrix[this.generation % this.rows][(j + this.cols - 1) % this.cols]; // Left neighbor
                                                                                            // 'this.generation % this.rows': loops through 'this.matrix's rows
                                                                                            // '(j + this.cols - 1) % this.cols': wraps around first/last cells (gets left)
      let current = this.matrix[this.generation % this.rows][j]; // Current cell
      let right = this.matrix[this.generation % this.rows][(j + 1) % this.cols]; // Right neighbor
                                                                                 // '(j + 1) % this.cols': wraps around first/last cells (gets right)

      this.matrix[(this.generation + 1) % this.rows][j] = this.apply_rule(left, current, right); // '(this.generation + 1) % this.rows': populates next row
    }
    this.generation++; // Iterates generation
  }
  apply_rule(left, cell, right) {
    let states_str = "" + left + cell + right; // Decimal representation of states
    let index = parseInt(states_str, 2); // 'parseInt(string, radix)': receives string argument and returns integer in base 'radix' 
                                         // Important: outputs (in 'ruleset') are ordered (in ascent) 
    return this.ruleset[index]; // Returns corresponding output
  }
  show() { // Also manages 'this.matrix' slicing
    let row_offset = this.generation % this.rows;
    
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let new_row_idx = i - row_offset; // Shifts all rows up 1 unit (based on 'this.generation')
        if (new_row_idx <= 0) new_row_idx = this.rows + new_row_idx; // If 'new_row_idx' is negative, wraps around first/last rows
        
        if (this.matrix[i][j] == 1) { // Only draws cell with state '1'
          fill(0);
          noStroke();
          rect(j * this.side, (new_row_idx - 1) * this.side, this.side, this.side); // 'j * this.side': ('x' value) square left side at integer
                                                                                    // '(new_row_idx - 1)': ('y' value) considers new row index (0-indexed)
        }
      }
    }
  }
}

  
// User-Defined Functions


// p5 Main
function setup() {
  canvas = createCanvas(width, height); // Canvas reference
  
  let rule_num = 30; // Current/Neighbors states (that result in the rule's outputs) are ordered (in ascent)
                     // 'left/current/right' binary representation is the output index

  ca = new CellularAutomata(rule_num); // Instantiating 'CellularAutomata' class
}

function draw() {
  // Main
  background(225); // Grayscale white

  ca.generate(); // Creates/Updates states
  ca.show(); 
}