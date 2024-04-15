// ####### Perlin Noise #######
// This noise is way 'smoother' than a random noise (which is uniformly distributed) because it takes into /
// consideration several 'octaves' (different 'time' aggregations)

// Global Variables
let width = 400, height = 400;
let start = 0; // This will be used to scan the Perlin Noise distribution
let incrm = 0.01; // Increment to allow us to 'walk' along the distribution above

// User-Defined Classes

// User-Defined Functions

// p5 Main
function setup() {
  createCanvas(width, height); // Creating the canvas
  stroke(255); // 'vertex' color  
  noFill(); // Since we''l use 'beginShape()'/'endShape()'
}

function draw() {
  background(0); // Grayscale black
  // Main
  let x_offset = start; // Making start point in Perlin Noise distribution depending on 'start' 
                        // Which will be incremented for scan effect
  beginShape(); // Start recording vertices to connect into a shape
    for (let x = 0; x < width; x++) {
      let pnoise = map(noise(x_offset), 0, 1, 0, height); // Mapping 'noise' since it returns 0<>1
      let sine = map(sin(x_offset), -1, 1, -40, 40); // Mapping 'sin' since it returns -1<>1
      let y = pnoise + sine; // Superposing 'pnoise' and 'sine'
      vertex(x, y);  
      x_offset += incrm; // Increments mean both offsets move through Perlin Noise distribution
    }
  endShape(); // Stops recording vertices (without closing shape)
  start += incrm; // Scanning the start point in Perlin Noise distribution
}

