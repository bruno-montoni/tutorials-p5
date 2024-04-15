// ####### Perlin Noise #######
// This noise is way 'smoother' than a random noise (which is uniformly distributed) because it takes into /
// consideration several 'octaves' (different 'time' aggregations)

// Global Variables
let width = 400, height = 400;
let incrm = 0.01; // Increment to allow us to 'walk' along the distribution above
                  // Higher values increase granularity

// User-Defined Classes

// User-Defined Functions

// p5 Main
function setup() {
  createCanvas(width, height); // Creating the canvas
  stroke(255); // 'vertex' color  
  noFill(); // Since we''l use 'beginShape()'/'endShape()'
  pixelDensity(1); // Packing 1 pixel to each pixel displayed (sharper image)
  noiseDetail(6); // Number of octaves in Perlin noise
}

function draw() {
  background(0); // Grayscale black
  // Main
  let x_offset = 0; // Start point in the Perlin Noise distribution
                    // Initialized outside 
  loadPixels(); // Loads 'pixels' array (system object)
  for (let x = 0; x < width; x++) {
    let y_offset = 0; // Start point in the Perlin Noise distribution
                      // Initialized inside because we want adjacent columns to have similar values 
    for (let y = 0; y < height; y++) {
      let idx = (x + (y * width)) * 4; // 'x + (y * width) * 4': finds the 1st value (Red) for the pixel
                                        // We access the rest of values (GBA) by adding 1/2/3 to the first index (R)
      let pnoise = map(noise(x_offset, y_offset), 0, 1, 0, 255);
      pixels[idx + 0] = pnoise; // Red channel
      pixels[idx + 1] = pnoise; // Green channel
      pixels[idx + 2] = pnoise; // Blue channel
      pixels[idx + 3] = 255; // Alpha channel
      y_offset += incrm; // Incremented inside since initialization is inside
    }
    x_offset += incrm; // Incremented outside since initialization is outside
  }
  updatePixels(); // Updates 'pixels' array (system object)
}
