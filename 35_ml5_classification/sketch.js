



// TODO: class this whole code
//       include visualization as seen here https://github.com/nature-of-code/noc-examples-p5.js/tree/master/chp10_nn/NOC_10_04_NetworkAnimation








// Instructions:
//    't': trains the model (logs in console);
//    's': saves data points (in same folder as 'inputs.json')
//    'm': saves the model (in same folder as 'model.xxxx')


// User Global Variables
let canvas; // Reference to p5 canvas object (see 'setup()')
let width = 300, height = 300; // Plot area: width x width
let train_data = []; // Stores training data
let model; // The NN custom model
let target_label = "A"; // Used to define the data point category (via mouse clicks)
let state = "collection"; // State of the program ('collection' > 'training' > 'prediction')
                               

// User-Defined Classes

  
// User-Defined Functions
function keyPressed() {
  if (key == 't') { // Trains the model
    console.log("Training Started!");
    state = "training"; // Updates the state
    let train_options = {epochs: 100}; // 1 epoch = trains over all data sent
                                       // Therefore: 30 data points over 100 epochs = 3000 samples pushed to NN 
                                       // If training set is small, we compensate with more epochs
    model.normalizeData(); // Normalizes training data
    model.train(train_options, whileTraining, finishedTraining); // Trains the NN
                                                                 // 'whileTraining': callback function executed on every epoch
                                                                 // 'finishedTraining': callback function executed after last epoch                            
  }
  else if (key == 's') { // Saves the data points
    console.log("Data Points Saved");
    model.saveData("inputs"); // Saves current data in model as JSON (without drawing; should be in file's root)
                              // Callback can be there (we just dont need it)
  }
  else if (key == 'm') { // Saves the model config
    console.log("Model Saved");
    model.save(); // Saves current model config as 3 files: 'model_meta.json', 'model.json', 'model_weights.bin' (saved name is ignored; bug!)
                  // Should be saved in './saved_model/'
                  // Callback can be there (we just dont need it)
  }
  target_label = key.toUpperCase(); // All data labels are upper
}

function whileTraining(epoch, loss) { // Callback receives info about training process (useful for debugging)
                                      // 'epoch': current training epoch
                                      // 'loss': combined error for the epoch (ideally, it should go down as training progresses)
  console.log("Training Epoch: " + epoch);
}


function finishedTraining() {
  console.log("Training Completed!");
  state = "prediction";
}

function mousePressed() {
  let input = {x: mouseX,
               y: mouseY}; // Gets mouse location (predictors)
  
  // Collection Phase
  if (state == "collection") {
    let target = {label: target_label}; // Target

    model.addData(input, target); // Adds input-target pairs to the NN
                                  // ml5 shuffles them (random order results in more effective training)
    push(); // Style: Train Points
    stroke(0); // Circle
    strokeWeight(1);
    noFill();
    circle(mouseX, mouseY, 20);
    fill(0); // Label
    noStroke();
    textAlign(CENTER, CENTER);
    text(target_label, mouseX, mouseY);
    pop();
  }
  else if (state == "prediction") {
    model.classify(input, get_result); // 'classify()': makes prediction (in classification models)
  }
}

function get_result(error, result) { // Callback function that returns the prediction
  if (error) { // If an error occours...
    console.error(error);
    return 
  }
    console.log(result); // Prints the result
                         // For classification, 'result' is an array as many values as categories:
                         //    'category': label (defined during 'collection' phase)
                         //    'label': the category label
                         //    'confidence': prediction certainty
    push(); // Style: Test Points
    fill(0,0,255);
    stroke(0); // Circle
    strokeWeight(1);
    circle(mouseX, mouseY, 20);
    fill(255); // Label
    noStroke();
    textAlign(CENTER, CENTER);
    text(result[0].label, mouseX, mouseY);
    pop();
}
  
function loaded_data() {
  let data = model.neuralNetworkData.data.raw; // Loaded data actually lives here
  for (let i = 0; i < data.length; i++) {
    let input = data[i].xs; // Please check 'data's structure
    let target = data[i].ys;
    
    push(); // Style: Loaded Points (same as Data Points)
    stroke(0); // Circle
    strokeWeight(1);
    noFill();
    circle(input.x, input.y, 20);
    fill(0); // Label
    noStroke();
    textAlign(CENTER, CENTER);
    text(target.label, input.x, input.y);
    pop();
  }
  let train_options = {epochs: 100}; // Full description in 'keyPressed()' (above)
  model.normalizeData(); 
  model.train(train_options, whileTraining, finishedTraining); 
}

  function loaded_model() {
    console.log("Model Loaded");
    state = "prediction"; // Going to prediction phase since trained model is loaded,,,,,,,,
}


// p5 Main
function setup() {
  canvas = createCanvas(width, height); // Canvas reference
  background(240); // Grayscale white
  
  // ml5 NN Config
  let create_options = {inputs: ["x", "y"], // NN config
                        outputs: ["label"],
                        task: "classification",
                        degub: 'true'} // Allows viz functionality (part of Tensorflow.js)
  model = ml5.neuralNetwork(create_options); // Instantiating the NN
  model.loadData("inputs.json", loaded_data); // 'loaded_data': callback function
                                              // If used in p5 editor, the file must be uploaded first
  
  const model_files = {model: './saved_model/model.json',
                       metadata: './saved_model/model_meta.json',
                       weights: './saved_model/model.weights.bin'} // Handler for al lfiles location
  model.load(model_files, loaded_model); // 'loaded_model': callback function
                                         // Important: we're still training the model in 'loaded_data' (for this exercise it's OK, but we should either load the trained model or train it based on loaded data...not both) 
}