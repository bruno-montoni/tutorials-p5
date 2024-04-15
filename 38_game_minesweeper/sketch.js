// User Global Variables
let width = 301, height = 301; // '1': for 'stroke' visibility
let grid;

// User-Defined Classes
class Cell { 
  constructor(i, j, side, bomb_threshold=0.2) {
    // Cell
    this.i = i; // 'Grid's row index
    this.j = j; // 'Grid's column index
    this.x = i * side; // 'Cell's 'x' coordinate
    this.y = j * side; // 'Cell's 'y' coordinate
    this.side = side;
    // Neighbors
    this.neighbors = 0; // Neighbor counter
    // Status
    this.is_flag = false; // Updated via 'mousePressed'
    this.is_bomb = false; // Populated via 'populate_cell'
      this.populate_cell(bomb_threshold);
    this.is_revealed = false;
  }
  // Methods
  populate_cell(bomb_threshold) {
    if (random(1) < bomb_threshold) {this.is_bomb = true} else {this.is_bomb = false};
  }
  // Mouse Methods
  contains_click(m_x, m_y) { // 'm_': mouse coordinates
    return (m_x > this.x && m_x < this.x + this.side && m_y > this.y && m_y < this.y + this.side);
  }
  reveal() {
    this.is_revealed = true; // Updates status
    
    if (this.neighbors == 0) { // If no neightbors...
      this.flood_fill(); // Reference: https://en.wikipedia.org/wiki/Flood_fill
    }
  }
  flood_fill() {
    for (let i_off = -1; i_off <= 1; i_off++) { // Looping neighbor cells...
      for (let j_off = -1; j_off <= 1; j_off++) {
        let n_i = this.i + i_off; // Neighbor's indexes
        let n_j = this.j + j_off;

        if (n_i > -1 && n_i < grid.rows && n_j > -1 && n_j < grid.cols) { // If neighbor has acceptable indexes...
          let neighbor = grid.grid[n_i][n_j];
          if (!neighbor.is_bomb && !neighbor.is_revealed) { // If neighbor is not a bomb and not revealed (otherwise infinte loop)...
            neighbor.reveal();
          }
        }
      }
    }
  } 
  count_neighbors() {
    if (this.is_bomb) {
      this.neighbors = -1; // '-1': default bomb value
      return;
    }
    
    let bombs = 0; // Counter
    for (let i_off = -1; i_off <= 1; i_off++) { // Looping neighbor cells...
      for (let j_off = -1; j_off <= 1; j_off++) {
        let n_i = this.i + i_off; // Neighbor's indexes
        let n_j = this.j + j_off;
        
        if (n_i > -1 && n_i < grid.rows && n_j > -1 && n_j < grid.cols) { // If neighbor has acceptable indexes...
          if (grid.grid[n_i][n_j].is_bomb) { // Checks neighbor
            bombs += 1; // Increments
          } 
        }
      } // Important: no need to excluse self bomb, since they wouldn't reach the counter
    }
    this.neighbors = bombs; 
  }
  // Draw Methods
  show() { 
    push(); // Style: Cell
    fill(200);
    stroke(0);
    strokeWeight(1.2);
    rectMode(CORNER); // 'i'/'j' at top-left corner
    rect(this.x, this.y, this.side, this.side);
    pop();
    
    if (this.is_revealed) {
      push(); // Style: Blank Cell
      fill(255);
      stroke(0);
      strokeWeight(1.2);
      rect(this.x, this.y, this.side, this.side);
      pop();
      if (this.is_bomb) { 
        push(); // Style: Bomb
        fill(177, 18, 38); 
        stroke(0);
        strokeWeight(1.2);
        circle(this.x + this.side*0.5, this.y + this.side*0.5, 10);
        pop();
      } else { 
        if (this.neighbors > 0) { // Only values >= 0 at this point
          push(); // Style: Number
          fill(0);
          textSize(14);
          textFont("Arial");
          textAlign(CENTER, CENTER);
          text(this.neighbors, this.x + this.side*0.5, this.y + this.side*0.5);
          pop();
        } else { // 'this.neighbors == 0'
          push(); // Style: Blank
          fill(0);
          pop();
        }
      }
    } else {
      if (this.is_flag) {
        push(); // Style: Flag
        fill(0);
        textSize(14);
        textFont("Arial");
        textAlign(CENTER, CENTER);
        text("X", this.x + this.side*0.5, this.y + this.side*0.5);
        pop();
      }
    }
  }
}

class Grid { 
  constructor(side=20) {
    // Specs
    this.side = side; // Cell dimension (square)
    this.rows = floor(height / this.side); // Total rows
    this.cols = floor(width / this.side); // Total columns
    // Grid
    this.grid = []; // 2D array of 'Cell's
      this.build_grid();  
  }
  // Methods
  build_grid() { // Builds nested arrays
    for(let i = 0; i < this.rows; i++) { // Looping rows...
      this.grid.push(new Array(this.cols)); // Adding array with 'this.cols' elements
      for(let j = 0; j < this.cols; j++) { // Looping new element...
        this.grid[i][j] = new Cell(i, j, this.side); // 'Cell' object
      }
    }
  }
  populate_neighbors() {
    for(let i = 0; i < this.rows; i++) { // Looping rows...
      for(let j = 0; j < this.cols; j++) { // Looping columns...
        this.grid[i][j].count_neighbors(); // Counts neighboring bombs
      }
    }
  }
  show() { 
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j].show();
      }
    }
  }
}

  
// User-Defined Functions
function mousePressed() {
  for (let i = 0; i < grid.rows; i++) {
    for (let j = 0; j < grid.cols; j++) {
      let curr_cell = grid.grid[i][j]; // Clicked 'Cell'

      if (curr_cell.contains_click(mouseX, mouseY) && (curr_cell.is_revealed == false)) {
        if (mouseButton === LEFT) {
          curr_cell.reveal(); // Reveals the 'Cell'

          if (curr_cell.is_bomb) {
            game_over(); // Ends game
          }
        }
        if (mouseButton === RIGHT) {
          curr_cell.is_flag = !curr_cell.is_flag; // Inverts status
        }
      }
    }
  }
}

function game_over() {
  for (let i = 0; i < grid.rows; i++) {
    for (let j = 0; j < grid.cols; j++) {
      grid.grid[i][j].is_revealed = true; // Reveals everything
    }
  }
}


// p5 Main
function setup() {
  createCanvas(width, height); // Canvas reference
  
  grid = new Grid(); // Instantiating 'Grid' class
  grid.populate_neighbors();
}

function draw() {
  // Main
  background(255); // White background

  grid.show(); 
}