// Important: It might seem odd to spot 4+ points falling in the same quadtree when 'QuadTree.capacity' is 4. We need to remember that quadtrees are 'nested' and instantiated chronologically. When a quadtree is full, it spawns 4 new smaller quadtrees inside it (which collectively cover its area), each of which can hold 4 points. So when they're full, there will be 4 + 4*4 = 20 points that seem to be in the original quadtree (4 actually are, and the remaining 16 are actually inside the children quadtrees)

// User Global Variables
let width = 400, height = 400;
let max_points = 0;
let boundary;
let quadtree;


// User-Defined Classes
class Point { 
  constructor(x, y, radius=2) {
    this.x = x; // Coordinates
    this.y = y; 
    this.radius = radius;
  }
  // Methods
  // Draw Methods
  show() { 
    push(); // Style: Point
    fill(255);
    noStroke();
    circle(this.x, this.y, this.radius);
    pop();
  }
}

class Rectangle { 
  constructor(x, y, h_width, h_height) {
    this.x = x; // Center coordinates
    this.y = y; 
    this.h_width = h_width; // Distance from center to edge
    this.h_height = h_height;
  }
  // Methods
  contains(point) { // Checks if 'point's coords match 'Rectangle's dimensions 
    return (point.x >= this.x - this.h_width && point.x < this.x + this.h_width) && // Horizontal check
           (point.y >= this.y - this.h_height && point.y < this.y + this.h_height); // Vertical check
  }
}

class QuadTree { // References only the root ('top parent')
  constructor(boundary, capacity=4) { // 'boundary': 'Rectangle' instance
                                      // 'capacity': tells us when the quadtree need to subdivide
    // Root
    this.boundary = boundary; // 'Rectangle'
    this.capacity = capacity;
    this.points = []; // Tracks points added (within capacity)
    // Status
    this.is_divided = false;
    // Subdivisions
    this.nw = null; // Top-left
    this.ne = null; // Top-right
    this.sw = null; // Bottom-left
    this.se = null; // Bottom-right
  }
  // Methods
  insert_point(point) {
    if (!this.boundary.contains(point)) {return false} // Exits 
    
    if (this.points.length < this.capacity) { // Within capacity...
      this.points.push(point); // Adds 'point' to 'this.points'
      return true;
    } else { // Beyond capacity...
      if (!this.is_divided) { // If not divided...
        this.subdivide();
      }
      if (this.nw.insert_point(point)) {return true}
      else if (this.ne.insert_point(point)) {return true}
      else if (this.sw.insert_point(point)) {return true}
      else if (this.se.insert_point(point)) {return true}
    }
  }
  subdivide() { // Defines children's center points/half_width and half_size + stores them
    let x = this.boundary.x; // Boundary ('Rectangle') params
    let y = this.boundary.y;
    let h_width = this.boundary.h_width;
    let h_height = this.boundary.h_height;
    
    let nw_boundary = new Rectangle(x - h_width/2, y - h_height/2, h_width/2, h_height/2);
    this.nw = new QuadTree(nw_boundary, this.capacity); // Top-left
    let ne_boundary = new Rectangle(x + h_width/2, y - h_height/2, h_width/2, h_height/2);
    this.ne = new QuadTree(ne_boundary, this.capacity); // Top-right
    let sw_boundary = new Rectangle(x - h_width/2, y + h_height/2, h_width/2, h_height/2);
    this.sw = new QuadTree(sw_boundary, this.capacity); // Bottom-left
    let se_boundary = new Rectangle(x + h_width/2, y + h_height/2, h_width/2, h_height/2);
    this.se = new QuadTree(se_boundary, this.capacity); // Bottom-right
    
    this.is_divided = true; // Updates
  }
  // Draw Methods
  show() { 
    push(); // Style: Subdivisions
    noFill();
    stroke(255);
    strokeWeight(1);
    rectMode(CENTER);
    rect(this.boundary.x, this.boundary.y, this.boundary.h_width*2, this.boundary.h_height*2);
    pop();
    
    for (let point of this.points) { // Draws current points
      point.show();
    }
    
    if (this.is_divided) {
      this.nw.show(); // Recursion
      this.ne.show();
      this.sw.show();
      this.se.show();
    }
    
    
  }
}

  
// User-Defined Functions
function populate_points() {
  for (let i = 0; i < max_points; i++){
    let x = randomGaussian(width/2, width/4);
    let y = randomGaussian(height/2, height/4);
    let point = new Point(x, y); // Instantiates 'Point' class
    quadtree.insert_point(point);
  }
}


// p5 Main
function setup() {
  createCanvas(width, height); // Canvas reference
  
  boundary = new Rectangle(width/2, height/2, width/2, height/2); // Instantiates 'Rectangle' class
  quadtree = new QuadTree(boundary); // Instantiates 'QuadTree' class ('capacity' as optional)
  populate_points();
}

function draw() {
  // Main
  background(0); // Black background

  quadtree.show();
  
  if (mouseIsPressed) {
    quadtree.insert_point(new Point(mouseX, mouseY));
  }
}