// Global Variables

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
  img.loadPixels();
  edge_img = createImage(img.width, img.height); // Creating new image (same dimensions as 'img')
                                                 // This is our modified image
  edge_img.loadPixels(); // Loading 'edgeImg.pixels' (array)

  for (let x = 1; x <= img.width - 1; x++) { // Both loops account for neighbor indexes
    for (let y = 1; y <= img.height - 1; y++) { 
      let loc1 = (x + (y * img.width)) * 4; // Target index (1st position; Red channel)
      let loc2 = ((x + 1) + (y * img.width)) * 4; // Neighbor index (1st position; Red channel)
      let b1 = img.pixels[loc1];
      let b2 = img.pixels[loc2];
      let diff = abs(b1 - b2);
      
      if (diff >= 10) { // Based on 'diff'
        edge_img.pixels[loc1+0]= 0; // Updating RGB channels with black
        edge_img.pixels[loc1+1]= 0;
        edge_img.pixels[loc1+2]= 0;
        edge_img.pixels[loc1+3]= 255;
      } else {
        edge_img.pixels[loc1+0]= 255; // Updating RGB channels with grayscale
        edge_img.pixels[loc1+1]= 255;
        edge_img.pixels[loc1+2]= 255;
        edge_img.pixels[loc1+3]= 255;
      }
    }
  }
  edge_img.updatePixels(); //Updating 'pixels' system object (array)
  image(edge_img, 0, 0);
}