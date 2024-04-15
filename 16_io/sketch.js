// Important: Check 'index.html' and check the 'main_canvas' div element
//            Necessary for positioning elements within the canvas

// Global Variables
let width = 300, height = 400;
let canvas; // Reference to p5 canvas object (see 'setup()')

// User-Defined Classes
class Input {  
  constructor(x, y, header="", has_header=true) {
    // Attributes
    this.elem = null; // Input Box
    this.header = null; // Header
    this.create_elem(x, y);
    if (has_header) { this.create_header(header); }
  }
  // Methods
  create_elem(x, y) {
    let input = createInput(); // Creates 'input' element
    input.position(x, y); // Positions element
    input.parent("main_canvas"); // Requires an HTML element in 'index.html' file
                                 // 'main_canvas' is that element 'id'
    this.elem = input; // Assigns
  }
  create_header(header_str, offset=45, elem_type="h3") {
    let header = createElement(elem_type, header_str); // Creates an HTML element
    header.position(this.elem.x, this.elem.y - offset); // Relative positions element
    this.header = header; // Assigns
  }
  get_value() {
    let value = this.elem.value();
    console.log(value);
  }
}

class Button {  
  constructor(x, y, label="") {
    // Attributes
    this.elem = null; // Button
    this.create_elem(x, y, label);
  }
  // Methods
  create_elem(x, y, label) {
    let button = createButton(label); // Creates 'button' element
    button.position(x, y); // Positions element
    button.parent("main_canvas"); // Requires an HTML element in 'index.html' file
                                  // 'main_canvas' is that element 'id'
    this.elem = button; // Assigns
  }
  pressed() {
    let value = input.get_value(); // Gets global 'input' value (filled by user)
    console.log(value);
  }
}

class Slider {  
  constructor(x, y, size=100) {
    // Attributes
    this.elem = null; // Slider
    this.create_elem(x, y, size);
  }
  // Methods
  create_elem(x, y, size) {
    let slider = createSlider(0, size, 0, 1); // Creates 'slider' element
    slider.position(x, y); // Positions element
    slider.parent("main_canvas"); // Requires an HTML element in 'index.html' file
                                  // 'main_canvas' is that element 'id'
    this.elem = slider; // Assigns
  }
  get_value() {
    let value = this.elem.value();
    return value;
  }
  show(font_size=16, label_offset=30) { // Draws the label (not the element)
    let value = this.get_value();
    push(); // Style: Text
    fill(0);
    textSize(font_size);
    textFont("Arial");
    textAlign(CENTER, CENTER);
    text(value, this.elem.x + this.elem.width + label_offset, this.elem.y + 2*this.elem.height/3);
    pop();
  }
}

class Checkbox {  
  constructor(x, y, label="") {
    // Attributes
    this.elem = null; // Checkbox
    this.create_elem(x, y, label);
  }
  // Methods
  create_elem(x, y, label) {
    let checkbox = createCheckbox(label); // Creates 'checkbox' element
    checkbox.position(x, y); // Positions element
    checkbox.parent("main_canvas"); // Requires an HTML element in 'index.html' file
                                    // 'main_canvas' is that element 'id'
    this.elem = checkbox; // Assigns
  }
  get_value() {
    let bool = this.elem.checked();
    return bool;
  }
  show(font_size=16, label_offset=20) { // Draws the label (not the element)
    let bool_str = this.get_value();
    push(); // Style: Text
    fill(0);
    textSize(font_size);
    textFont("Arial");
    textAlign(LEFT, CENTER);
    text(bool_str, this.elem.x + this.elem.width/4 + label_offset, this.elem.y + this.elem.height/2); // 'this.elem.width/4': compensating for object's high width
    pop();
  }
}

class Select {  
  constructor(x, y) {
    // Attributes
    this.elem = null; // Checkbox
    this.create_elem(x, y);
  }
  // Methods
  create_elem(x, y) {
    let checkbox = createSelect(); // Creates 'select' element
    checkbox.position(x, y); // Positions element
    checkbox.parent("main_canvas"); // Requires an HTML element in 'index.html' file
                                    // 'main_canvas' is that element 'id'
    this.elem = checkbox; // Assigns
  }
  add_option(label) {
    this.elem.option(label); // Adds a single option
  }
  add_options(labels_lst) {
    for (let label of labels_lst) { // Adds bulk options
      this.elem.option(label); 
    }
  }
  set_value(label) {
    this.elem.selected(label); // Sets the selected option
  }
  get_value() {
    let value = this.elem.value();
    return value;
  }
  show(font_size=16, label_offset=50) { // Draws the label (not the element)
    let value = this.get_value();
    push(); // Style: Text
    fill(0);
    textSize(font_size);
    textFont("Arial");
    textAlign(LEFT, CENTER);
    text(value, this.elem.x + this.elem.width + label_offset, this.elem.y + this.elem.height/2); // 'this.elem.width/2': compensating for object's high width
    pop();
  }
}

class Radio {  
  constructor(x, y, size) {
    // Attributes
    this.elem = null; // Checkbox
    this.create_elem(x, y, size);
  }
  // Methods
  create_elem(x, y, size=65) {
    let radio = createRadio(); // Creates 'radio' element
    radio.position(x, y); // Positions element
    radio.style("width", "60px"); // Important: if 'width' is:
                                  //               too small: options breaks lines
                                  //               too big: options share same line 
    radio.style("fontFamily", "Arial"); // Changes font type (values as strings like in CSS)
    radio.style("fontSize", "12px"); // Changes font size (values as strings like in CSS)
    radio.parent("main_canvas"); // Requires an HTML element in 'index.html' file
                                 // 'main_canvas' is that element 'id'
    this.elem = radio; // Assigns
  }
  add_option(label) {
    this.elem.option(label); // Adds a single option
  }
  add_options(labels_lst) {
    for (let label of labels_lst) { // Adds bulk options
      this.elem.option(label); 
    }
  }
  set_value(label) {
    this.elem.selected(label); // Sets the selected option
  }
  get_value() {
    let value = this.elem.value();
    return value;
  }
  show(font_size=16, label_offset=10) { // Draws the label (not the element)
    let value = this.get_value();
    push(); // Style: Text
    fill(0);
    textSize(font_size);
    textFont("Arial");
    textAlign(LEFT, CENTER);
    text(value, this.elem.x + this.elem.width + label_offset, 1.125*this.elem.y); // 'this.elem': broken '.height' is 0
    pop();
  }
}


// User-Defined Functions


// p5 Main
function setup() {
  canvas = createCanvas(width, height); // Canvas reference
  
  input = new Input(20, 50, "'input' Element"); // Instantiates 'Input' class
  
  button = new Button(20, 80, "Print 'input'"); // Instantiates 'Button' class
  button.elem.mousePressed(button.pressed); // Important: 'mousePRessed' is available for the element (not instance itself)
  
  slider = new Slider(20, 140, 100); // Instantiates 'Slider' class
  
  checkbox = new Checkbox(20, 190, "Checkbox"); // Instantiates 'Checkbox' class
  
  select_elem = new Select(20, 240); // Instantiates 'Select' class
  select_elem.add_option("Red"); // Adds 1 option
  select_elem.add_options(["Blue", "Green", "Yellow"]); // Adds multiple options
  select_elem.set_value("Blue"); // Sets option
  
  radio = new Radio(20, 280); // Instantiates 'Radio' class
  radio.add_option("Red"); // Adds 1 option
  radio.add_options(["Blue", "Green", "Yellow"]); // Adds multiple options
  radio.set_value("Green"); // Sets option
}

function draw() {
  // Main
  background(250); // Grayscale white
  
  slider.show(); // Slider value
  
  checkbox.show(); // Checkbox value
  
  select_elem.show(); // Select value
  
  radio.show(); // Radio value
}