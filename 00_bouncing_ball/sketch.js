// Global variables
let width=400, height=300; // Canvas
let ball = {x: 200, // 'x' position
            y: 200, // 'y' position
            x_vel: 5, // 'x' speed
            y_vel: 3, // 'y' speed
            radius: 10} // Radius

function setup() {
  createCanvas(width, height);
}

function draw() {
  background(0); // Grayscale black
  // Main
  move(); // Moving ball
  bounce(); // Collision detection
  display(); // Drawing ball
}

// User-Defined Functions
function move(){
  ball.x += ball.x_vel; // Update 'x'
  ball.y += ball.y_vel; // Update 'y'
}

function bounce(){
  if (ball.x + ball.radius >= width || ball.x - ball.radius <= 0) { // Left-Right bounds
    ball.x_vel *= -1
  };
  if (ball.y + ball.radius >= height || ball.y - ball.radius <= 0) { // Top-Bottom bounds
    ball.y_vel *= -1
  };
}

function display(){
  stroke(255); // Lines/Border color
  strokeWeight(3); // Lines/Border width
  noFill(); // No filling color
  ellipse(ball.x, ball.y, 2*ball.radius);
}