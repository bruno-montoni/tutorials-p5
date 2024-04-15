// #################### p5 Basics ####################
// [p5 Blocks] p5 has 2 main functions:
//                - 'setup()': mainly where we set up the canvas (runs once, typically used for initialization)
//                - 'draw()': where objects are created and drawn (runs repeatedly, in a loop, and incorporates animation)
//                            every loop iteration works like a frame drawn on top of each other, like a flip book (meaning previous iteration's drawings keep visibile until drawn over)
//                            real update takes place with the final state of things at the end of 'draw()' (we don't see every step of its 'body')
//             p5 functions are not available outside 'setup()'/'draw()' (we can move dependent initializations to 'setup()' for example to bypass this behavior)

// [Comments] Same as JS via '//' for single-line

// [Canvas] A canvas is basically a cartesian coordinate system, where:
//             - 'x' axis: is oriented left -> right
//             - 'y' axis: is oriented up -> down
//          Therefore, the canvas works similarly to the 4th quadrant (in a regular cartesian coordinate system), with the origin at top-left corner
//          'createCanvas([width],[height])': creates a canvas element and sets its dimensions in pixels
//                                             calling more than once result in very unpredictable behavior
//                                             it's affected by any existing CSS properties (like padding)
//          'resizeCanvas([width],[height],[no_redraw])': clears, redraws canvas with given '[width],[height]' and re-renders sketch
//          'width'/'height': system variables that store the width/height of the canvas 

// [Environment] 'print([contents])': displays '[contents]' in the console (helpful while debugging)
//               'windowWidth'/'windowHeight': system variables that store the width/height of the window (space assign to render) 

// [Rendering] 'createGraphics([width],[height],[renderer],[canvas])': creates an offsecreen new p5.Graphics object (like a canvas) with '[width]'/'[height]' dimensions
//                                                                     to be able to see it, we need to 'image([img],[x],[y])' it
//                                                                     to draw on it we use the '.' (dot) operator and use shapes methods  
//             'blendMode([mode])': modes to blend new pixels (A; next frame) with current pixels, already in display (B; current frame):
//                                  BLEND (default): linear interpolation of colors
//                                  ADD: sum of A and B
//                                  DARKEST: only darkest colour succeeds
//                                  LIGHTEST: only lightest colour succeeds
//                                  DIFFERENCE: subtract colors
//                                  EXCLUSION: similar to 'DIFFERENCE' (less extreme)
//                                  MULTIPLY: multiply colors (result is always darker)
//                                  SCREEN: opposite multiply (uses inverse color values)
//                                  REPLACE: pixels entirely replace others (doesnt consider alpha)
//                                  REMOVE: removes pixels from B with A's alpha
//                                  OVERLAY: mix of 'MULTIPLY' and 'SCREEN' ('multiplies' dark values, 'screens' light values)
//                                  HARD_LIGHT: 'SCREEN' when greater than 50% gray, 'MULTIPLY' when lower
//                                  SOFT_LIGHT: mix of 'DARKEST' and 'LIGHTEST' (like 'OVERLAY', but not as harsh)
//                                  DODGE: lightens light tones and increases contrast (ignores darks)
//                                  BURN: darker areas are applied, increasing contrast (ignores lights)
//                                  SUBTRACT: remainder of A and B

// [Loop] By default, p5.js loops through 'draw()' continuously, executing the code within it
//        'noLoop()': stops continuous execution of 'draw()'
//                    if used in 'setup()', it should be the last line in it
//                    when used, it's not possible to access events (such as 'mousePressed()') nor drawing can happen
//        'loop()': turns on continuous execution of 'draw()'
//                  should not be used in 'setup()'
//        'isLooping()': returns the looping current state (a boolean)

// [Constants] System helpfull constants 
//             'PI': constant value 3.14159...
//             'TWO_PI': constant value 2 * 3.14159... (6.28318...)
//             'HALF_PI': constant value 3.14159.../2 (1.57079...)
//             'QUARTER_PI': constant value 3.14159.../4 (0.78539...)
//             'DEGREES': to be used with the 'angleMode()' to interpret/calculate angles in degrees
//             'RADIANS': to be used with the 'angleMode()' to interpret/calculate angles in radians

// [Conversion] 'float([str])': converts string to floating point (if '[str]' doesn't resemble a number, returns NaN)
//              'int([value])': converts boolean, string or float to integer
//              'str([value])': converts boolean or number to string
//              'boolean([value])': converts boolean or string to boolean
//              'byte([value])': converts a number, string or boolean to byte 
//              'char([value])': converts a number or string to single-character string
//              'hex([value],[digits])': converts a number to hexadecimal string with '[digits]' characters
//              'degrees([radians])': converts '[radians]' to degrees
//              'radians([degrees])': converts '[degrees]' to radians

// [Color] Are parameterized via 3 channels (R,G,B) with integers from 0 (black) to 255 (white)
//         If RGB values are greater than 255, they're truncated to 255
//         When R = G = B we have a color in the grayscale pallete
//         'alpha([color])': returns alpha (transparency) value of p5.Color object ('[color]')
//         'red([color])'/'blue([color])'/'green([color])': returns red/blue/green value of p5.Color object ('[color]')
//         'hue([color])'/'saturation([color])'/'brightness([color])': returns hue/saturation/brightness value of p5.Color object ('[color]')
//         'brightness([color])'/'lightness([color])': returns brightness/lightness value of p5.Color object ('[color]')
//         'color([v1],[v2],[v3],[alpha])': creates a p5.Color object
//            '[v1]': red or hue
//            '[v2]': green or saturation
//            '[v3]': blue or brightness

// [Setting] 'background([r],[g],[b],[alpha])': sets the the background color of the canvas via RGB channels (or a color object)     
//                                              if used in 'setup()' sets the background on the first frame; if in 'draw()' clears the display at beginning of each frame
//           'clear()': clears the pixels on the canvas (every pixel 100% transparent)
//           'fill([r],[g],[b],[alpha])': sets the color used to fill shapes (default: white)
//           'noFill()': sets the color used to fill shapes to transparent
//           'stroke([r],[g],[b],[alpha])': sets the color used to draw lines/borders (default: black)
//           'noStroke()': sets the color used to draw lines/borders to transparent
//              Important: 'fill()', 'stroke()' commands set the colors for everything below them (so if we want to change, we need to call them as many times as necessary)  
//                         '[alpha]': controls pixel transparency (0-255)

// [Attributes] 'strokeWeight([weight])': sets width of stroke used for lines, points, shape borders (unit in pixels)
//              'strokeCap([cap])': sets style for rendering line endings (Available: 'ROUND','SQUARE','PROJECT')
//              'strokeJoin([join])': sets style for joints (line segments connections; corners; Available: 'MITER','BEVEL','ROUND')
//              'smooth()': draws all geometry with anti-aliased edges (improves performance and is active by default)
//              'noSmooth()': draws all geometry aliased (jagged) edges
//              'ellipseMode([mode])': sets the location from which ellipses/circles/arcs are drawn (Available: 'CORNER','RADIUS')
//              'rectMode([mode])': sets the location from which rectangles/squares are drawn (Available: 'CORNER','CENTER')

// [Pixels] 'pixels': 0-indexed system array object containing color of each pixel on canvas
//                    colors are stored as RGB numbers and alpha
//                    array is 1D and maps each RGBA value starting from top-left corner (origin)
//                    each pixel is thus represented by 4 values (RGBA) where the 1st (R) is located at index 'x + (y * width)' ('x' and 'y' are 0-indexed; 'width' is 1-indexed)
//          'loadPixels()': loads current value of each pixel on canvas (must be called before reading from or writing to 'pixels' array)
//          'updatePixels([x],[y],[width],[height])': updates canvas with 'pixels' array (must be called after updating 'pixels' array)
//          'pixelDensity([value])': sets pixel scaling for high density displays (default: matches display density)
//                                   high pixel density screens (such as Mac Retina) pack 4 pixels into 1 (which is displayed)

// [Vertex] 'vertex([x],[y])': shapes are constructed by connecting a series of vertices
//          'beginShape([kind])': begins recording vertices to connect into a shape 
//                                '[kind]' can have the following values:
//                                   'POINTS': draw points
//                                   'LINES': draw unconnected line segments (individual lines)
//                                   'TRIANGLES': draw separate triangles
//                                   'TRIANGLE_FAN': draw connected triangles sharing the first vertex (fan-like)
//                                   'TRIANGLE_STRIP': draw connected triangles (strip fashion)
//                                   'QUADS': draw separate quads
//                                   'QUAD_STRIP': draw quad strip using adjacent edges to form next quad
//                                   'TESS': (WEBGL only) handle irregular polygon for filling curve by explicit tessellation
//          'endShape([mode])': stops recording vertices for a shape
//                              '[mode]' defines how to close the shape (default: 'CLOSE' which connects beginning to end)   

// [Arrays] '[array].push([value])': adds a value to the end of [array]
//          '[array1].concat([array2])': concatenates 2 arrays ('[array2]' at '[array1]'s end)
//          '[array].reverse()': reverses the order of '[array]'
//          '[array].pop()': removes the last element from '[array]'
//          'shuffle([array],[in_place])': randomizes the order of the elements of '[array]'
//          '[array].sort() ': sorts the elements of '[array]' in-place and returns it sorted
//          '[array].splice([start],[delete_count])': removes elements (number of elements of '[delete_count]') in-place, starting from index '[start]'
//          '[array].slice([start],[end])': returns shallow copy of sliced '[array]' from '[start]' to '[end]'

// [Vectors] Vector is visualized as an arrow pointing in space. Vectors have both magnitude and direction (and are p5.Vector objects)
//           'p5.Vector([x],[y],[z])' has the following methods:
//              '[vector].toString()': returns a string representation (useful for debugging)
//              '[vector].set([x],[y],[z])': sets '[x]'/'[y]'/'[z]' components using separate values (if not provided, sets them to 0)
//              '[vector].copy()': returns a copy of '[vector]'
//              '[vector].add([x],[y],[z])'/'p5.Vector.add([vector1],[vector2])': adds '[x]'/'[y]'/'[z]' components to [vector]
//                                                                                adds '[vector1]' and '[vector2]' returning another p5.Vector object
//              '[vector].sub([x],[y],[z])'/'p5.Vector.sub([vector1],[vector2])': equivalent behavior to 'add()'
//              '[vector].mult([num])'/'p5.Vector.mult([vector],[num])': multiplies '[vector]'s components by '[num]'
//              '[vector].div([num])'/'p5.Vector.div([vector],[num])': equivalent behavior to 'mult()'
//              '[vector].mag()': returns '[vector]'s magnitude
//              '[vector].dot([x],[y],[z])'/'p5.Vector.dot([vector1],[vector2])': returns dot product of '[vector1]' and '[vector2]'
//                                                                                dot product can be thought of as the projection of '[vector1]' on '[vector2]'
//              '[vector1].cross([vector2])'/'p5.Vector.cross([vector1],[vector2])': returns cross product of '[vector1]' and '[vector2]'
//                                                                                   cross product can be thought of as the vector that points to the opposite vertex of the parallelogram created by the vectors
//              'dist([x1],[y1],[x2],[y2])'/'p5.Vector.dist([vector1],[vector2])': returns distance between 2 points represented by vectors
//              '[vector].normalize()': scales '[vector]'s components in-place so that its magnitude is 1
//              '[vector].heading()': returns angle (in 'angleMode()' units) '[vector]' (2D) makes with the positive x-axis
//              '[vector].rotate([angle])': rotates '[vector]' (2D) by '[angle]' (in 'angleMode()' units) with no changes to magnitude
//              '[vector1].angleBetween([vector2])': returns angle (in 'angleMode()' units and signed) between '[vector1]' and '[vector2]' 
//              '[vector].array()': returns the '[vector]'s components as array
//              '[vector1].equals([vector2])': True if '[vector1]' and '[vector2]' components are the same 

// [Mouse] p5 offers system variables that are updated (based on events) on every 'draw' loop
//         'mouseX': variable with horizontal position of mouse relative to (0,0)
//         'mouseY': variable with vertical position of mouse relative to (0,0)
//         'pmouseX': variable with horizontal position of mouse, in the previous frame, relative to (0,0)
//         'pmouseY': variable with vertical position of mouse, in the previous frame, relative to (0,0)
//         'mouseButton': variable that tracks the mouse button is pressed and which one is it (possible results: 'LEFT','RIGHT','CENTER')
//         'mouseIsPressed': True if mouse is pressed (hold down); False if not
//         'mouseClicked([event])': function called once after a mouse button is pressed and then released
//                                  function has standardized name (we can declare it with any content) and it's triggered by corresponding events
//         'mousePressed([event])': function called once after a mouse button is pressed (same as 'mouseClicked()')
//         'mouseReleased([event])': function called once after a mouse button is released (same as 'mouseClicked()')
//         'mouseDragged([event])': function called once every time the mouse moves and a mouse button is pressed (same as 'mouseClicked()')

// [Random] p5 offers its own random distributions (which will produces different results each time, unless using 'randomSeed()')
//          'random([min],[max])'/'random([array])': returns a uniformly distributed float random number/element from an array 
//          'randomGaussian([mean],[stdev])': returns a float random number fitting a normal distribution
//          'randomSeed([constant])': sets the seed value for 'random()' and 'randomGaussian()' above

// [Noise] Perlin noise values are created by adding layers of noise together (octaves; default: 4 octaves)
//         Lower octaves define the overall intensity of noise; higher octaves create finer-grained details
//         'noise([x],[y])': returns Perlin noise value at coordinates ('[x]' and '[y]')
//         'noiseDetail([octaves],[falloff])': defines the number of octaves ('[octaves]') and how much an octave contribute compared to its predecessor ('[falloff]')

// [Shapes 2D] 'arc([x],[y],[width],[height],[start],[stop],[mode])': draws an arc along the outer edge of an ellipse (defined by '[x]','[y]','[width]','[height]')
//                                                                    '[start]','[stop]': start/end angles in radians
//                                                                    '[mode]':arc's fill style (Available: 'OPEN','CHORD','PIE')
//             'ellipse([x],[y],[width],[height])': draws an ellipse ('[x]','[y]' set the center location; '[width]','[height]' set the shape)
//             'circle([x],[y],[diameter])': draws a circle to the canvas ('[x]','[y]' set the center location; '[diameter]' sets the diameter)
//             'line([x1],[y1],[x2],[y2])': draws a line between 2 points (defined by 2 '[x_]' and '[y_]')
//             'point([x],[y])': draws a point (with default size equal to 1 pixel)
//             'rect([x],[y],[width],[height])': draws a rectangle ('[x]','[y]' set the upper-left corner location; '[width]','[height]' set the shape)
//             'square([x],[y],[size])': draws a square  ('[x]','[y]' set the upper-left corner location; '[size]' set the side)
//             'triangle([x1],[y1],[x2],[y2],[x3],[y3])': draws a triangle (defined by 3 '[x_]' and '[y_]')

// [Math Calculation] 'abs([num])': absolute value of '[num]'
//                    'ceil([num])'/'floor([num])': closest integer that is greater/less than '[num]'
//                    'constrain([num],[low],[high])': constrains '[num]' between '[low]' and '[high]'
//                    'dist([x1],[y1],[x2],[y2])': distance between 2 points ('[x_]' and '[y_]')
//                    'exp([num])': returns 'e' (2.71828...) raised to the power of '[num]'
//                    'lerp([start],[stop],[increm])': number between 2 numbers ('[start],[stop]') at a specific 0%-100% increment ([increm])
//                                                     useful to create motion along a straight path or drawing dotted lines
//                    'log([num])': natural logarithm (base 'e') of '[num]'
//                    'mag([x],[y])': magnitude/length of a vector (distance to origin (0,0))
//                    'map([value],[start1],[stop1],[start2],[stop2])': re-maps '[value]' from one range to another
//                                                                      '[start1]'/'[stop1]' position '[value]' in initial range
//                                                                      '[start2]'/'[stop2]' define target range
//                    'min([array])'/'max([array])': return min/max value in '[array]'
//                    'norm([value],[start],[stop])': maps '[value]' from range ('[start]'/'[stop]') to value between 0-1
//                    'pow([base],[exponent])': exponential expression of form '[base]'^'[exponent]'
//                    'round([value],[decimals])': integer closest to the '[value]' (or closest float with '[decimals]' palces)
//                    'sqrt([value])': square root of '[value]'
//                    'fract([value])': returns fractional part of '[value]'

// [Angle] 'angleMode([mode])': changes angle interpretation (Available: 'DEGREES','RADIANS' - default: 'RADIANS'

// [Trigonometry] All trigonometric functions are 'angleMode()' aware (meaning, arguments must be in the same unit)
//                'sin([angle])'/'cos([angle])'/'tan([angle])': sine/cosine/tangent of '[angle]'
//                'asin([value])'/'acos([value])'/'atan([value])': inverse of sine/cosine/tangent of '[value]'

// [Transform] 'rotate([angle])': rotates a shape by '[angle]' rotated around their relative position to origin ('[axis]' is needed for 3D)
//                                positive '[angle]' rotate clockwise 
//             'scale([factor_x],[factor_y])': increases/decreases the size of a shape by expanding/contracting vertices
//                                  scaling always take place from object's relative origin to the coordinate system's origin
//                                  '[factor_x]'/'factor_y' are percentage to scale in x-axis and y-axis
//             'translate([x],[y])': move object left-right (via '[x]') and top-bottom ('[y]')   

// [Image] 'loadImage([path])': loads an image to create a p5.Image object ('[path]' can be 1) relative path; 2) URL; 3) raw base64 encoded image)
//         'image([img],[x],[y],[width],[height])': draws '[img]' (image object with original size) to canvas at '[x]'/'[y]'
//         'imageMode([mode])': defines how images are drawn (when 'image()' is called; Available: 'CORNER','CORNERS','CENTER')
//         'tint([r],[g],[b],[alpha])': tints image using a '[r]'/'[g]'/'[b]' color

// [Text] Text is always drawn within an invisible rectangle containing the contents (defined by '[max_width]'/'[max_height]'; see below)
//        Text wraps to fit text box (and text outside of the box is not drawn)
//        Style is done via 'fill()', 'stroke()'/'noStroke()', 'strokeWeight()' + text-related functions (below) 
//        'text([text],[x],[y],[max_width],[max_height])': draws '[text]' at '[x]'/'[y]' ('[max_width]'/'[max_height]' bounds the text box)
//        'textFont([font],[size])': sets the font used by the 'text()' with '[size]' in pixels ('[font]' are opentype.js)
//        'textSize([size])': sets the font size (in pixels);
//        'textStyle([style])': sets the style (Available: 'NORMAL','ITALIC','BOLD','BOLDITALIC')
//        'textAlign([hrz_align],[vert_align])': sets text alignment
//           '[hrz_align]': 'LEFT','CENTER','RIGHT'
//           '[vert_align]': 'TOP','BOTTOM','CENTER','BASELINE'

// [States] 'push()': saves the current drawing style settings/transformations
//          'pop()': restores the saved drawing style settings/transformations (set by 'push()')

// [DOM] '[element].input(callback_function)': triggers function when a p5.Element receives input (aka changes value)
//       'createSlider([min],[max],[value],[step])': creates a slider element (ranging from '[min]' to '[max]', with default '[value]' and spacing '[step]')
//       'createButton([label],[value])': creates a button element (with '[label]' displayed and default '[value]')
//       'createCheckbox([label],[value])': creates a checkbox element (with '[label]' displayed and default '[value]')
//                                          returns True if box is checked; False, otherwise    
//       'createSelect([multiple_bool])': creates a dropdown element which supports/not multiple selections (based on '[multiple_bool]')
//                                        '[select].option([name],[value])': adds an option with '[name]' as display/value (if '[value]' is provided, '[name]' is the key to '[value]')
//                                        '[select].value()': returns current selected option's value
//                                        '[select].selected()': returns current selected option name
//                                        '[select].disable()': marks all dropdown options as disabled
//                                        '[select].enable()': marks all dropdown options as enable
//       'createRadio([name])': creates a radio button element (with '[name]' as display)
//                              '[radio].option([name],[value])': adds an option with '[name]' as display
//                              '[radio].value()': returns current selected option's value
//                              '[radio].selected()': returns current selected option name 
//                              '[radio].disable([bool])': enables/disables all radio button if '[bool]'
//       'createInput([value])': creates a text element (with '[value]' as default)        


// #################### p5 Strategy ####################
// [Global Variables] Global variables should be defined ('let') before 'setup()'
//                    If we declare it in 'setup()' it'll have local scope (and we can only use it there)
//                    Global variables should be initialized in 'setup()' and updated/used in 'draw()'

// [Scope] All variables should either be declared (not necessarily initialized) as global
//         Once declared we can either initialize them in 'setup()' (if they don't change in the future) or 'draw()' (if they change at each frame)
//         Declarations in 'setup()'/'draw()' have local scope

// [Classes] Instantiation (via 'new'; which calls the constructor) should be done in 'setup()'
//           Instances behavior (like moving and be drawn) should be handled by a class' methods;
//           Global functions (like 'mousePressed()') can't exist inside classes (we should call class-related methods in the global function instead)

// [Preload] 'preload()' is called before 'setup()' and is used to handle asynchronous loading of external files in a blocking way
//            If a 'preload()' function is defined (must be declared as a regular function), 'setup()' waits until all load calls within it have finished
//            Nothing besides load calls should be inside 'preload()'

// [Push/Pop] Functions like 'translate()'/'rotate()' are very powerful and continue to affect all code that comes after them
//            So when dealing with complex simulations, we want to have different states (that are encapsulated and not impact everything)
//            Encapsulating transformations begins with 'push()' (which saves the current drawing style and starts a new state) and end with 'pop()' (that returns to the saved drawing style, set by 'push()')
//            This can be done as many time as necessary


// #################### Nature of Code (Daniel Schiffman) ####################
// [Forces] 'A force is a vector that causes an object with mass to acccelerate'
//          'F = m * a' where 'F' is the net force (vector), 'm' the mass and 'a' the accelaration (vector)
//          That means that on every 'draw()' iteration we'll need to:
//              Update the acceleration (if object is not inertial)
//              Update the velocity (by an 'a' factor); 'v_f = v_0 + a*t'
//              Update the position (by a velocity factor); 's_f = s_0 + v*t'
//              Reset the acceleration (so it's ready for next loop)
//          Rule of thumb: we never directly change position nor velocity, but rather use acceleration to achieve it 

// [Net Force] Since 'draw()' runs all its block before outputting, we want to accumulate all forces in an object and not just update 'a'
//             Every iteration of 'draw()' is a new moment in the simulation and thus must reset 'a' (multiply it by 0)
//             We should implement a method 'apply_force' which vector sums to 'a' every time it's called

// [Mass] 'It's the amount of matter in an object' (measured in Newtons)
//        In simulations, 'mass' will be a value (attribute)

// [Gravity] We know that, in vaccum, 2 objects (with different masses) will fall with the same accelaration
//           Gravitational force is 'F = (m1 * m2 *G)/d**2' which can also be written as 'F = m * a' (from the object's perspective)
//           If we consider Earth as object1 then 'F = C * m2' ('C' is huge since 'm1' is huge, compared to 'G' and 'd**2')
//           Finally if we compare both 'F' (considering 'm' as 'm2'; object) we have 'a = C'

// [Vectors] An object's position vector extends from the origin to its anchor point (usually its center)
//           Velocity describes the object's speed and the direction it's moving
//           Adding an object's velocity vector to its position vector moves it (via 'pos.add(vel)')

// [Autonomous Agents] Autonomous agents (aka Vehicles) have limited ability to perceive the environment
//                        This awareness doesn’t refer to just the external environment but also to agent’s internal states (such as position, velocity, etc)
//                        Agents take their own state into account when making decisions. 
//                     Vehicles process the environment info and calculate action
//                        Action is always a force
//                     Vehicles have no leader
//                        Group behaviors are intelligent and structured group dynamics that emerge not from a leader, but from the local interactions
//                     Vehicles have 3 layers:
//                        Action Selection: a vehicle has a goal (or goals) and can choose an action (or a combination of actions) based on that goal. This is essentially where I left off in the discussion of autonomous agents. The vehicle takes a look at its environment and selects an action based on a desire: “I see a zombie marching toward me. Since I don’t want my brains to be eaten, I’m going to flee from the zombie.” The goal is to keep one’s brains, and the action is to flee. Reynolds’s paper describes many goals and associated actions, such as seeking a target, avoiding an obstacle, and following a path. In a moment, I’ll start building out these examples with p5.js code.
//                        Steering: next move is the steering force (steering force = desired velocity – current velocity)
//                        Locomotion: in p5, motion is an illusion, since it's basically a sequence of drawings; however here we consider the vehicle's design and how to animate it

// [Complex Systems] Defined as a system that’s bigger than the sum of its parts
//                   Individuals may be incredibly simple, yet the system's behavior can be highly complex/intelligent (and difficult to predict)
//                   Complex systems have 3 key principles:
//                      Short-Range Relationships: vehicles have limited perception of environment
//                      Vehicles Operate in Parallel: in every 'draw()' loop, all units calculate their steering forces, creating the illusion of parallalelism
//                      Emergent Phenomena: patterns eventually emerge from the interactions

// [Flocking] A group animal behavior found in many living creatures (such as birds or fish)
//            There're 3 rules that rule flocking:
//               Separation (aka Avoidance): steers to avoid colliding with neighbors
//               Alignment (aka Copy): steers in the same direction as neighbors (within a certain visibility radius)
//               Cohesion (aka Center): steers toward the center of neighbors (stay with the group)
//            It's up to the user to weight those influences (those behaviors can be triggered by specific circumstances on the 'vehicle' level)

// [Cellular Automata] Cellular Automata (CA) is a cell-model with the following characteristics:
//                        Cells are a bit (with value called 'state')
//                        Cells live in an array (1D)
//                        States (finite) can vary over time and are influenced by neighbors
//                        Each cell has at least 1 neighborhood (adjacent to it)
//                     Time is discrete and goes on steps, called generations (likely tied to the frame count of the animation)
//                     Ruleset: new future states are determined by predefined rules ('ruleset') on current/neighbors states
//                              if we consider only the current cell and its adjacent neighbors, we have 2**3 = 8 possible combinations (each one with an output)
//                              all rulesets inputs are as: [1,1,1], [1,1,0], [1,0,1], [1,0,0], [0,1,1], [0,1,0], [0,0,1], [0,0,0]
//                              rulesets are indexed as the decimal representation of its ouput binary number (example: rule 30 = [0 0 0 1 1 1 1 0])

// [Game of Life] Basically an application of 2D Cellular Automata (instead of an array of cells, we now have a 2D matrix of cells)
//                Each cell’s neighborhood has now expanded from 2 to 512 (= 2**8)
//                Rules are as follows:
//                   Death: if a cell is alive (state=1), it will die (state=0) if:
//                             Overpopulation: cell has 4+ living neighbors
//                             Loneliness: cell has 1- living neighbors
//                   Birth: cell comes to life when it has exactly 3 living neighbors
//                   Stasis: cell’s state doesn’t change
//                              Staying Alive: if cell is alive and has exactly 2 or 3 live neighbors, it stays alive
//                              Staying Dead: i cell is dead and has anything other than 3 live neighbors, it stays dead

// [Genetic Algorithms] Implementing a GA should fit the following steps within the standard structure of a p5 sketch:
//                         'setup()': [Step 1] Initialization: creates the starting population with randomly generated individuals
//                         'draw()': [Step 2] Selection: evaluates fitness of each individual of population and builds the mating pool
//                                   [Step 3] Reproduction (Repeats 'n' times): picks 2 parents with high fitness
//                                                                              creates children by combining 2 parents (via crossover)
//                                                                              modifies the child via mutation (probability-based)
//                                                                              adds new child to new population (next generation)
//                                   [Step 4]: replaces old population with new population (returning to Step 2)

// [Neural Networks] 2 important libraries are 'TensorFlow.js' and 'ml5.js' (we'll use this one)
//                   The model life cycle is typically broken into:
//                      1. Data Collection: might involve running experiments, manually inputting values, sourcing public data, etc
//                      2. Data Preparation: raw data might have duplicate/missing values or outliers (such inconsistencies must be adjusted)
//                                           additionally, NNs work best with normalized data (scaled to fit within a standard range - usually 0-1)
//                                           finally it's desired to split the data into distinct sets: training, validation, and testing
//                      3. Choose Model: design the architecture of NN (design is a consequence of types of data/outputs)
//                      4. Train Model: feed the NN the training data and allow it to adjust the weights based on the errors
//                      5. Evaluate Model: use the test data (not used in training), to evaluate the model's performance (on unseen data)
//                      6. Tune Parameters: fine-tuning hyperparameters and revisiting steps 4 (Training), 3 (Selection) and 2 (Data Preparation)
//                      7. Deployment: once performance is satisfactory, it’s time to use the model!

// [ml5.js] Library is a collection of ML models, accessed via 'ml5.[function_name]()' syntax
//          'ml5.neuralNetwork()': creates an empty NN for the user to train
//                                 the object is initialized with an 'options' dictionary, where the user specifies:
//                                    'task': the type of task to be performed (available: 'classification', 'regression', 'imageClassification') 
//                                    'inputs': scalar/list with labels representing number of input nodes
//                                    'outputs': scalar/list with labels representing number of output nodes
//                                    'dataUrl': external URL to data (structured as CSV or JSON)
//                                    'layers': a list of dictionaries specifying nodes for a layer as follows:
//                                                 'type': type of layer (available: 'dense', 'conv2d', 'maxPooling2d', 'flatten')
//                                                 'units': total nodes (default: 'this.options.hiddenUnits')
//                                                 'activation': activation function (available: 'relu', 'softmax', 'sigmoid')
//                                    'learningRate': how much the error affects the weights 
//                                    'debug': exposes Tensorflow.js training visualization in browser
//                                    'modelUrl': saved model file path 
//                                 most common methods include:
//                                    'addData(xs,ys)': adds data point to 'neuralNetworkData.data.raw' (an array that stores all data pushed to the model)
//                                                      'xs'/'ys': arrays ordered as specified in constructor 
//                                                      works as alternative for 'dataUrl' parameter (above) 
//                                    'normalizeData()': normalizes data stored in 'neuralNetworkData.data.raw' and stores the normalized values 'neuralNetwork.data.training' (another array to store data for the model)
//                                    'saveData(file_name,callback)': allows saving data from  'neuralNetworkData.data.raw' array   
//                                                                    'callback' called after data is saved
//                                    'loadData(file_path,callback)': allows loading data previously saved (via 'saveData()')
//                                                                    'callback' called after data is loaded
//                                    'train(options,while_callback,finished_callback)': trains the model using data in 'neuralNetwork.data.training' array
//                                                                                       can receive 'options' as parameter (with 'batchSize' and 'epochs') 
//                                                                                       triggers 2 callbacks: 
//                                                                                          'whileTraining(epoch,loss)': called after each epoch
//                                                                                          'doneTraining()': called when training is completed
//                                    'predict(inputs,callback)': in 'regression' tasks, allows making a prediction with input array/JSON
//                                                                'callback' handles result
//                                    'predictMultiple(inputs,callback)': in 'regression' tasks, allows making batched predictions with input array of arrays/JSONs
//                                                                        'callback' handles results
//                                    'classify(inputs,callback)': in 'classification' tasks, allows making a classification with input array/JSON  
//                                                                'callback' handles result 
//                                                                this method is asynchronous (since time is required to process large data) and a callback function might be needed to deal with long times to get a result from the model
//                                                                   for synchronous version, use 'classifySync()'  
//                                    'classifyMultiple(inputs,callback)': in 'classification' tasks, allows making batched classifications with input array of arrays/JSONs
//                                                                         'callback' handles results
//                                    'save(file_name,callback)': saves the trained model (resulting in 3 files)
//                                                                'callback' called after model is saved
//                                    'load(file_path,callback)': loads the trained model (based on 3 files)
//                                                                'callback' called after model is loaded
