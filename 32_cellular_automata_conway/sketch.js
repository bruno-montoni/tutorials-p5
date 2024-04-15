// User Global Variables
let canvas; // Reference to p5 canvas object (see 'setup()')
let width = 600, height = 480;
let ca; // Cellular Automata

// User-Defined Classes
class GameOfLife { // 2D Conway Cellular Automata
  constructor(rule_num, side=8) {
    // Grid Specs
    this.side = side; // Cell dimension (square)
    this.rows = height / this.side; // Total rows
    this.cols = width / this.side; // Total columns
    // Matrix
    this.board = []; // Current board
      this.build_board(); // Builds 'this.board'
      this.populate_board(); // Initializes 'this.board'
    this.next = structuredClone(this.board); // Next iteration board (deep copy)
  }
  // Methods
  build_board() { // Initialize 'this.board'
    for(let i = 0; i < this.rows; i++) { // Looping rows...
      this.board.push(new Array(this.cols)); // Adding array with 'this.cols' elements
      for(let j = 0; j < this.cols; j++) { // Looping new element...
        this.board[i][j] = 0; // Default value (important for edges)
      }
    }
  }
  populate_board() {
    for (let i = 1; i < this.rows - 1; i++) { // Looping rows (without borders)...
      for (let j = 1; j < this.cols - 1; j++) { // Looping columns (without borders)...
        this.board[i][j] = floor(random(2)); // Randomly populates with 0/1
      }
    }
  }
  run() {
    for(let i = 1; i < this.rows - 1; i++) { // Looping rows (without borders)
      for(let j = 1; j < this.cols - 1; j++) { // Looping columns (without borders)
        let neighbor_sum = 0;
        // Looping neighbors...
        for (let h = -1; h <= 1; h++) { // Horizontal increment
          for (let v = -1; v <= 1; v++) { // Vertical increment
            neighbor_sum += this.board[i + h][j + v]; // Sums all neighbors states
          }
        }
        neighbor_sum -= this.board[i][j]; // Removes current cell state from 'neighbor_sum'
        this.apply_rules(i, j, neighbor_sum); // Applies Game of Life 's rules
      }
    }
    this.board = structuredClone(this.next); // Updates 'this.board' (deep copy)
  }
  apply_rules(i, j, neighbor_sum) { 
    if (this.board[i][j] == 1 && neighbor_sum < 2) this.next[i][j] = 0; // Loneliness (cell dies)
    else if (this.board[i][j] == 1 && neighbor_sum > 3) this.next[i][j] = 0; // Overpopulation (cell dies)
    else if (this.board[i][j] == 0 && neighbor_sum == 3) this.next[i][j] = 1; // Birth (cell lives)
    else this.next[i][j] = this.board[i][j]; // Stasis (cell stays the same)
  }
  show() { 
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        fill(255 - this.board[i][j] * 255); // Smart way of assigning colors
        stroke(0); // Always black
        rect(j * this.side, i * this.side, this.side);
      }
    }
  }
}

  
// User-Defined Functions


// p5 Main
function setup() {
  canvas = createCanvas(width, height); // Canvas reference
  
  game = new GameOfLife(); // Instantiating 'GameOfLife' class
}

function draw() {
  // Main
  background(255); // Grayscale white

  game.run(); 
  game.show(); 
}