// Global Variables
let kernel = [[1/9.0, 1/9.0, 1/9.0],
              [1/9.0, 1/9.0, 1/9.0],
              [1/9.0, 1/9.0, 1/9.0]]; // Blur kernel

// User-Defined Classes

// User-Defined Functions

// p5 Main
function preload() {
  img = loadImage("./puppy.png"); // Loads image into p5.Image object
}

function setup() {
  createCanvas(img.width, img.height); // Creating the canvas with 'img' dimensions
  noLoop(); // No need for loop
}

function draw() {
  // Main
  image(img, 0, 0);
  edge_img = createImage(img.width, img.height); // Creating new image (same dimensions as 'img')
                                                 // This is the modified image
  img.loadPixels(); // Loading 'img.pixels' and 'edgeImg.pixels' (arrays)
  edge_img.loadPixels(); 

  for (let x = 1; x <= img.width - 1; x++) { // Looping pixels in 'img'
    for (let y = 1; y <= img.height - 1; y++) { 
      let sum_r = 0, sum_g = 0, sum_b = 0;  // Sums for current pixel's RGB channels
      let idx = (x + (y * img.width)) * 4; // Index in the '_.pixels' array
      for (kx = -1; kx <= 1; kx++) { // Looping neighbors ('kx'/'ky' can be: -1, 0, 1)
        for (ky = -1; ky <= 1; ky++) {
          let xpos = x + kx; // Current pixel's 'x'/'y'
          let ypos = y + ky;
          let r = red(img.get(xpos, ypos)); // Getting RGB channels values
          let g = green(img.get(xpos, ypos));
          let b = blue(img.get(xpos, ypos));
          
          sum_r += kernel[kx + 1][ky + 1] * r; // '+1' so we don't have negative indexes in 'kernel
          sum_g += kernel[kx + 1][ky + 1] * g;
          sum_b += kernel[kx + 1][ky + 1] * b; 
      }
    }
    edge_img.pixels[idx+0]= sum_r; // Updating RGB channels with black
    edge_img.pixels[idx+1]= sum_g;
    edge_img.pixels[idx+2]= sum_b;
    edge_img.pixels[idx+3]= 255;
    }
  edge_img.updatePixels(); //Updating 'pixels' system object (array)
  image(edge_img, 0, 0); // Drawing modified image
  }
}