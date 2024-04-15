// User Global Variables
let canvas; // Reference to p5 canvas object (see 'setup()')
let width = 400, height = 500; // Plot area: width x width
                               // Perceptron area: width x (height - width)
let total_points = 2000; // Total data points
let train_data = []; // Stores training points ([x, y, bias])
let train_idx = 0; // Global index for 'train_data' (perceptron is fed 1 point at a time)
let xmin = -1; // x_min (Coordinates space: everything derive from those)
let ymin = -1; // y_min
let xmax = 1; // xmax
let ymax = 1; // y_max

// User-Defined Classes
class Point { 
  constructor() {
    // Attributes
    this.input = [random(xmin,xmax), random(ymin,ymax), 1]; // Input list (x, y, bias)
                                                            // Initializing 'bias' as 1
    this.output = null; // Label (calculated via 'this.calc_ouput')
                        // Available: -1, +1 
    this.calc_output();
  }
  // Methods
  calc_output() { // Calculates label based on 'x'/'y'
    if (this.input[1] < this.custom_linear(this.input[0])) this.output = -1; // 'y' < 'y_calc'
    else this.output = 1; // 'y' >= 'y_calc
  }
  custom_linear(x) { // Original division of canvas region (and thus, data labels)
    let y_calc = 0.3*x + 0.4;
    return y_calc;
  }
}

class Perceptron { // 1 Neuron: 3 inputs (x, y, bias)
  constructor(num_inputs, learn_rate=0.0025) {
    // Attributes
    this.learn_rate = learn_rate; // Tells how much we should "steer into the error" (if too aggressive, we'll always miss it)
                                  // Using a very small value so we can check the animation (not optimal)
    this.weights = Array(num_inputs); // Array with 'undefined' elements
    this.init_weights();
  }
  // Methods
  init_weights() { // Initializes 'this.weights'
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] = random(xmin, xmax); // Randomly initializing the weights
    }
  }
  feed_forward(input) { // Asks perceptron to make an evaluation based on 'inputs' and current weights
    let sum = 0;
    for (let i = 0; i < this.weights.length; i++) { // 'this.weights' has same size as 'inputs.input'
      sum += input[i] * this.weights[i]; // Processes neuron's inputs/weights
    }
    let output = this.activate(sum); // Parses 'sum' through activation function
    return output;
  }
  activate(sum) { // Custom activation function (Available: linear, ReLu, logistic, etc)
    if (sum > 0) return 1;
    else return -1;
  }
  train(train_data) { // Trains (update weights) with 1 'Point' at a time
                      // 'train_data': contains 1 'Point' (with both inputs/output)
    let prediction = this.feed_forward(train_data.input); // Predicts 'inputs'
    let target = train_data.output;
    let error = target - prediction; // Supervised learning (can only be -2, 0, +2)
    
    for (let i = 0; i < this.weights.length; i++) { // 'i': input component index
      this.weights[i] += error * train_data.input[i] * this.learn_rate; // Adjust weights (gradient descent)
    }
  }
  // Draw Methods
  show(train_data) {
    let custom_linear = train_data[0]["custom_linear"]; // Assigning 'custom_linear' function to variable
    
    // Style: Plot Area (Gray)
    push(); 
    noStroke();
    fill(245);
    rect(0, 0, width, width); // Background
    pop();
    
    // Style: Target Line
    let x1 = map(xmin, xmin, xmax, 0, width); // Mapping min/max values to plot area ('width' x 'width')
    let y1 = map(custom_linear(xmin), ymin, ymax, 0, width);
    let x2 = map(xmax, xmin, xmax, 0, width);
    let y2 = map(custom_linear(xmax), ymin, ymax, 0, width);
    push(); 
    stroke(200);
    strokeWeight(2);
    drawingContext.setLineDash([5, 5]); // 'drawingContext': some native HTML5 Canvas functionality (not exposed by p5)
                                        // 'setLineDash': sets the line pattern to 'dashed'
    line(x1, y1, x2, y2); // Considers canvas as width x width
    pop();
    
    // Style: Data Points
    push(); 
    noStroke();
    for (let i = 0; i < train_idx; i++) {
      let point = train_data[i];
      let x = map(point.input[0], xmin, xmax, 0, width);
      let y = map(point.input[1], ymin, ymax, 0, width);
      if(point.output == -1) { fill("red") } else { fill("blue") }; // Data point color
      circle(x, y, 4);
    }
    pop();
    
    // Style: NN Line (Formula: weights[0]*x + weights[1]*y + weights[2] = 0)
    x1 = xmin; // Reseting values
    y1 = (-this.weights[2] - this.weights[0]*x1) / this.weights[1]; 
    x2 = xmax;
    y2 = (-this.weights[2] - this.weights[0]*x2) / this.weights[1];
    
    x1 = map(x1, xmin, xmax, 0, width);
    y1 = map(y1, ymin, ymax, 0, width); // 'width' replacing 'height' (so we're constrined to plotting area)
    x2 = map(x2, xmin, xmax, 0, width);
    y2 = map(y2, ymin, ymax, 0, width); // 'width' replacing 'height' (so we're constrined to plotting area)
    push();
    stroke(0);
    strokeWeight(1.5);
    line(x1, y1, x2, y2); 
    pop();
    
    // Style: Perceptron
    let radius = 25
    push(); 
    noStroke();
    fill(255); // White background (Perceptron section)
    translate(0, width);
    rect(0, 0, width, width); // Background
    stroke(0);
    strokeWeight(1.25);
    circle(width/2, (height-width)/2, 2*radius);
    line(1.2*width/3, (height-width)/3, width/2 - 0.85*radius, (height-width)/3); // Input #1
    line(1.1*width/3, 1.5*(height-width)/3, width/2 - 1.05*radius, 1.5*(height-width)/3); // Input #2
    line(width/3, 2*(height-width)/3, width/2 - 0.85*radius, 2*(height-width)/3); // Bias
    line(width/2 + 1.05*radius, 1.5*(height-width)/3, width/2 + 2*radius, 1.5*(height-width)/3); // Output
    pop();
    
    // Style: Perceptron Labels
    push(); 
    translate(0, width);
    noStroke();
    textSize(10);
    let point = train_data[train_idx];
    textAlign(RIGHT);
    text("x = " + round(point.input[0],3), 1.15*width/3, (height-width)/3); // x
    text("y = " + round(point.input[1],3), 1.05*width/3, 1.5*(height-width)/3); // y
    text("bias = " + round(point.input[2],3), 0.95*width/3, 2*(height-width)/3); // Bias
    textAlign(LEFT);
    text("out = " + round(point.output,3), width/2 + 2.2*radius, 1.5*(height-width)/3); // Output
    pop();
    
    // Style: Weights
    push(); 
    noStroke();
    textSize(10);
    translate(0, height - 2.5);
    textAlign(RIGHT);
    text("w_x = " + round(this.weights[0],3), width/3, -5); // wO
    textAlign(CENTER);
    text("w_y = " + round(this.weights[1],3), width/2, -5); // w1
    textAlign(LEFT);
    text("w_bias = " + round(this.weights[2],3), 2*width/3, -5); // Bias
    pop();
    
    // Style: Stats
    push(); 
    noStroke();
    textSize(10);
    textAlign(RIGHT);
    translate(0, width);
    text("Train Points = " + train_idx, 0.95*width, 15); // Train data
    pop();
  }
}
    
  
// User-Defined Functions


// p5 Main
function setup() {
  canvas = createCanvas(width, height); // Canvas reference
  
  perceptron = new Perceptron(3); // Instantiates ' Perceptron' class
  
  for (let i = 0; i < total_points; i++) { // Creating 'train_data'
    train_data[i] = new Point(); // Random 'Point' (with 'target = 1')
  }

}

function draw() {
  // Main
  background(255); // Grayscale white
  
  perceptron.train(train_data[train_idx]); // Slicing 'train_data' with 'train_idx'
  perceptron.show(train_data); // Parses all 'train_data'
  
  train_idx += 1; // Increments
  
  if (train_idx == total_points) { noLoop() };
}