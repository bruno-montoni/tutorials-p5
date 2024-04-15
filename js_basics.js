// #################### JS Basics ####################

// [Comments] There are 2 types of comments: 1) Single-line: via '//' which ignores everything after;
//                                           2) Multi-line: via '/* .. */' which ignores everything in-between

// [Semi-Colon] The semi-colon (';') character is used to delimit parts of the code
//              Browsers has a feature ("Automatic Semi-colon Insertion")which does a good job of "filling in the blanks" (inserting missing semi-colon where needed)

// [Output] We can use 'console.log()' function to output strings
console.log("Hello, World"); // Single object
console.log("Hello," + " " + "World"); // Concatenated objects
console.log("Hello,", "World"); // Multiple objects (separated by space)

// [Variables] Variables are containers for values
//             We declare variables via 'let [variable_name];' (with 'undefined' since no value was assigned yet)
//                We can also declare variables via 'var [variable_name];' but this is discouraged, since it's confusing and error-prone     
//             We initialize a variable by assigning it a value via '[variable_name] = [value];'
//             We can also initialize variables during declaration via 'let [variable_name] = [value];'
let x = 1

// [Variable Types] There're different types of data we can store in variables:
//                  1) Numbers: Integer, floating-point and double (greater precision than floating point)
//                  2) Strings: Pieces of text, wrapped in single/double quotes
//                  3) Booleans: 'true'/'false' values (or results from conditions)
//                  4) Arrays: Single object that contains multiple values (enclosed in '[]' and separated by commas)
//                             Arrays can be accessed/sliced via '[]' and are 0-indexed
//                  5) Objects: structure of code that models abstractions
//                  'typeof': returns the value's corresponding data type
console.log(typeof 42);

// [Constants] Are like variables, except that 1) must be initialized when declared; 2) are immutable (more below)
//             We declare constants via 'const [constant_name] = [value];'
//             We can update properties of an object declared as 'const' (though the content has changed, it still ponts to the same object) 
//             'Use const when you can, and use let when you have to' (good practice)

// [Data Type] We can get the data type of a value via 'typeof [value];'
//             Available: 'undefined', 'boolean', 'number', 'bigint', 'string', 'symbol', 'function', 'object' (Null is 'object')

// [Null vs Undefined] Null: the absence of value
//                     Undefined: a variable not yet assigned a value

// [Number Methods] 'number.toFixed(digits)': trims decimals to 'digits'
console.log(123.456.toFixed(2));
//                  'Number(value)': constructor for Number objects (returns 'value' as type Number)
console.log(Number("123.456"));

// [Arithmetic Operators] Used for performing mathematical calculations (mathematical operator precedence is present)
//                        '+' (Addition): adds two numbers
console.log(1+1);
//                        '-' (Subtraction): subtracts the right number from the left
console.log(2-1);
//                        '*' (Multiplication): multiplies two numbers
console.log(2*1);
//                        '/' (Division): divides the left number by the right (no need to have a flot for result to be float)
console.log(1/2);
//                        '%' (Modulo): remainder of division of left number by the right
console.log(1/2);
//                        '**' (Exponent): base number to the exponent power
console.log(2**2);

// [Increment/Decrement] Increment ('++') / Decrement ('--') are use to add/subtract 1 to/from a numeric variable
//                       '[variable_name]++' os equivalent to '[variable_name] = [variable_name] + 1'

// [Assignment Operators] Assign a value to a variable
//                        '+=' (Addition): adds value on the right to variable on the left
//                        '[variable_name] += [value]' -> '[variable_name] = [variable_name] + [value]'
console.log(x+=1);
//                        '-=' (Subtraction): subtracts value on the right to variable on the left
//                        '[variable_name] -= [value]' -> '[variable_name] = [variable_name] - [value]'
console.log(x-=1);
//                        '*=' (Multiplication): multiplies value on the right to variable on the left
//                        '[variable_name] *= [value]' -> '[variable_name] = [variable_name] * [value]'
console.log(x*=2);
//                        '/=' (Division): divides value on the right to variable on the left
//                        '[variable_name] /= [value]' -> '[variable_name] = [variable_name] / [value]'
console.log(x/=2);

// [Comparison Operators] Returns True/False based on the result of a test
//                        '===' (Equality): whether the left and right values are identical
console.log(5 === 2+4);
//                        '!==' (Non-Equality): whether the left and right values are not identical
console.log(5 !== 2+4);
//                        '<' (Less Than): whether the left value is smaller than the right
console.log(5 < 2+4);
//                        '>' (Greater Than): whether the left value is greater than the right
console.log(5 > 2+4);
//                        '<=' (Less Than or Equal): whether the left value is smaller than or equal than the right
console.log(5 <= 2+4);
//                        '>=' (Greater Than or Equal): whether the left value is greater than or equal the right
console.log(5 >= 2+4);

// [Strings] We declaring a string variable by surrounding its value with quotes
//           We can choose single quotes ('), double quotes (") to wrap strings as long as they match
//           Depending on the choice above (single or double quotes) for outer quotes, we may need to escape ('\') similar quotes within the value
console.log("This is a escaped \"\" double quote");
//           We can also concatenate strings and numbers (JS automatically converts everything to strings)
console.log("This is a " + 1);
//           'Template literal' are strings with placeholders ('${[variable_name]}') for variables/expressions to be included in the string
//              Mulitple 'template literals' can be used in the same string            
console.log(`Hello, ${x}! ${x+1}`);

// [String Methods] 'String(value)': constructor for String objects (returns 'value' as type String)
console.log(typeof String(1));
//                  '[string_obj].length': returns the length of the string
console.log("this is a string".length);
//                  '[string_obj][index]': access a character inside a string by its index (0-index)
//                                         negative values invert the direction
console.log("this is a string"[0]);
//                  '[string].includes([substring])': returns True if '[string]' contains the '[substring]'
console.log("this is a string".includes("this"));
//                  '[string].startsWith([start_string])': returns True if '[string]' starts with '[start_string]'
console.log("this is a string".startsWith("this"));
//                  '[string].endsWith([end_string])': returns True if '[string]' ends with '[end_string]'
console.log("this is a string".endsWith("this"));
//                  '[string].indexOf([substring], [position])': returns the index of first occurence of '[substring]' after '[position]' within '[string]' ('-1' if not present)
console.log("this is a string".indexOf("is")); // If '[position]' is not provided, defaults to 0
//                  '[string].slice([start], [end]))': extracts the semi-open interval '[[start], [end])' of [string]
console.log("this is a string".slice(5,8)); // If '[end]' is not provided, goes all the way
//                  '[string].toLowerCase()': convert all the characters to lowercase
console.log("This is a string".toLowerCase()); 
//                  '[string].toUpperCase()': convert all the characters to uppercase
console.log("This is a string".toUpperCase()); 
//                  '[string].replace([pattern], [string])': replaces one match of '[pattern]' by '[string]'
console.log("This is a string string".replace("string", "car")); // Returns new string (not in-place)
//                  '[string].replaceAll([pattern], [replace_string])': replaces all matches of '[pattern]' by '[replace_string]'
console.log("This is a string string".replaceAll("string", "car")); // Returns new string (not in-place)

// [Arrays] Are single objects that contain multiple values stored in a list ('[]')
let items = ["bread", "milk", "cheese", "hummus", "noodles"];     

// [Arrays Methods] '[array].indexOf([element], [start_index])': returns the index of first occurence of '[element]' after '[start_index]' ('-1' if not present) 
console.log(items.indexOf("cheese")); // If '[start_index]' is not provided, defaults to 0
//                  '[array].push([element])': adds 1+ elements to the end of '[array]' (returns new length '[array]')
console.log(items.push("juice"));
//                  '[array].unshift([element])': adds 1+ elements to the beginning of '[array]' (returns new length '[array]')
console.log(items.unshift("cookie"));
//                  '[array].pop()': removes and returns last item from '[array]'
console.log(items.pop());
//                  '[array].shift()': removes and returns first item from '[array]'
console.log(items.shift());
//                  '[array].splice([start], [del_count])': removes an returns, from '[array]', '[del_count]' elements starting at '[start]'
console.log(items.splice(1, 2));
//                  '[array].filter([callback_func])': creates a shallow copy of a portion of '[array], filtered down to elements that pass the '[callback_func]' test
console.log(items.filter((each) => each.length >= 4)); // Returns new array
                                                       // Lambda function syntax: '([variable_name]) => [expression]'
//                  '[string].split([sep])': takes '[sep]' and divides '[string]' into an ordered list of substrings
console.log("Manchester,London,Liverpool".split(",")); 
//                  '[array].join([sep])': joins all elements in '[array]' into a string using '[sep]'
console.log(["Manchester", "London", "Liverpool"].join("_")); 
//                  '[array].toString()': similar to 'join()' with ',' as '[sep]'
console.log(["Manchester", "London", "Liverpool"].toString()); 
//                  '[array].map([callback_func])': creates new array populated with results of '[callback_func]' on every element of '[array]'
const a_map = [1,2,3,4].map((x) => x*2);
console.log(a_map);
//                  '[array].reduce([callback_func])': reduces the elements of '[array]' to a single value via '[callback_func]'
function bruno_sum(value1, value2) {
    return value1 + value2;
}
console.log([1,2,3,4].reduce(bruno_sum));
//                  '[array].sort()': sorts in-place '[array]' elements in lexigraphic order (alphabet > numbers > symbols) as strings
//                                    default sort order is ascending
console.log([1,10,2,9,3].sort());

// [Date] Objects in UTC with the following format (year, month, day, hour, minute, seconds, ms); evaluated against the local time zone
//        When no parameters are provided, represents current UTC date and time / if any parameters overflow, they're added to object on top of it
const date_1 = new Date(2024, 1, 1, 26, 0, 0, 0); // Overflowing 26 hours
const date_2 = new Date("2024-01-01 12:00:00");
console.log(date_1, date_2);

// ['For' Loops] 'for ([initialization]; [condition]; [aftert_hought]) {[block]}': made of 3 optional expressions
//                  '[initialization]': of the form 'let/var [variable_name] = [value]' (variable declaration/initialization evaluated once before the loop begins)
//                                      if 'let', declaration on local scope; if 'var', declaration on global scope 
//                  '[condition]': expression to be evaluated before each loop iteration (if False, execution exits the loop)
//                  '[aftert_hought]': expression to be evaluated at the end of each loop iteration (before the next evaluation of '[condition]')
let y = ""
for (let i = 0; i < 9; i++) {
    y = y + i; // '[block]'
}
console.log(y);
//               'for ([variable_name] in [iterable]) {[block]}': iterates over enumerable string properties of '[iterable]' 
for (const each in {a: 1, b: 2}) { // For dictionary, 'each' gets keys
    console.log(each);
}
//               'for ([variable_name] of [iterable]) {[block]}': iterates over values of '[iterable]' 
for (const each in [1,2,3]) { 
    console.log(each);
}

// ['While' Loops] 'while ([condition]) {[block]}': '[condition]' is evaluated before executing '[block]'
let z = 1
while (z < 3) {
    z++; // Increment 'z'
    console.log(z);
}
//                 'do {[block]} while ([condition])': '[condition]' is evaluated after executing '[block]'
do {
    z++; // Increment 'z'
    console.log(z);
} while (z < 5);

// [If...Else] 'if ([condition]) {[true_block]} else {[false_block]}': executes '[true_block]' if '[condition]' is True, otherwise executes '[false_block]'
if (1 > 0) {
    console.log("True block");
} else {
    console.log("False block");
}
//             The 'if...else' can be represented by a ternary operator: '[condition] ? [true_block] : [false_block]'
(1 > 0) ? console.log("True block") : console.log("False block");

// [Switch...Case...Default] 'switch ([expression]) {
//                              case [value1]: [block1]; 
//                              case [value2]: [block2]; ... 
//                              default: [default_block]}': Similar to nested 'if...else's but for cases where a value depending on a condition can assume large number of choices
//                                                          A matching 'case' is where the execution starts (all cases are evaluated if not exited)
//                                                          (Cont'd) Therefore we need 'break' statements within each 'case' block
const choice = 7%3;
switch (choice) {
    case 1:
        console.log("Remainder 1");
        break;
    case 2:
        console.log("Remainder 2");
        break;
    default:
        console.log("Default"); // Equivalent to 'else' (no matching 'case' found)
                                // No 'break' needed since it's the last block
}

// [Logical Operators] '&&': AND
//                     '||': OR
//                     '!': NOT

// [Functions] Can contain whatever code we like
function say_hello(first_name, last_name="Montoni") { //'first_name': mandatory arg/ 'last_name': optional/default arg
    console.log(`Hello, ${first_name} ${last_name}!`);
} // No ';' needed after declaration
say_hello("Bruno"); // Calling the function

// ['=' Operators] '=' can be used in 3 different contexts:
//                    '=': assignment
//                    '=='/'!=': comparison (compares if values are equal) -> 3.14 == '3.14' returns True
//                    '==='/'!==': strict equality (compares if values and datatypes are equal) -> 3.14 === '3.14' returns False    

// ['...' Operator] 'func_call(...[iterable])' (spread operator; used to input) allows an iterable to be unpacked into separate elements (like opening a box and taking the elemnts out)
let numbers = [1,2,3,4,5];
console.log(Math.max(numbers)); // Returns NaN
console.log(Math.max(...numbers)); // Returns 5
//                  'func_params(...[args])' (rest operator; used to group) allows set of arguemnts to be packed into an iterable
function pack(...strings) {
    return strings.join(" ");
}
console.log(pack("Bruno", "Vasconcelos", "Montoni")); 

// [Keyed Collections] 'Map': a map of key-value pairs, like Python dictionaries (keys can be strings/number)
const another_map = new Map([["key1","a"], ["key2","b"]]); // Constructor: 'new Map([iterable])' where '[iterable]' is of format '[[key1, value1], [key2, value2],...]'
another_map.set("key3", 3); // 'set([key], [value])': adds key-value pair (can be chained like '.set("key1", "value1").set("key2", "value2")'             
another_map.delete("key3"); // 'delete([key])': deletes key-value pair based on '[key]' (returns True if '[key]' existed and has been removed; False if '[key]' does not exist)
console.log(another_map.has("key1")); // 'has([key])': returns True if '[key]' exists and False otherwise
console.log(another_map.get("key1")); // 'get([key])': returns value associated with '[key]' ('undefined' if there is none)
console.log(another_map.keys().next().value); // 'keys()': returns iterator with keys (using 'next().value' to return the first value)
console.log(another_map.values().next().value); // 'values()': returns iterator with values 
console.log(another_map.entries().next().value); // 'entries()': returns iterator with key-values as lists (using 'next().value' to return the first value)
console.log(another_map.clear()); // 'clear()': removes all elements (returns 'undefined')
//                     'Set': stores unique values of any type
const a_set = new Set([1,2,3,4]); // Constructor: 'new Set([iterable])' where '[iterable]' is of format '[value1, value2, value3,...]'
const another_set = new Set([4]);
another_set.add(5).add(6); // 'add([value])': inserts a new element in the set (can be chained like '.add("value1").set("value2")'
another_set.delete(6); // 'delete([value])': deletes value based on '[value]' (returns True if '[value]' existed and has been removed; False if '[value]' does not exist)
console.log(another_set.has(4)); // 'has([key])': returns True if '[key]' exists and False otherwise
console.log(another_set.values().next().value); // 'values()': returns iterator that yields values for each element
console.log(another_set.size); // 'size': returns number of elements

// [Classes] Classes can be defined in 2 ways: expression (directly instantiated and assigned; anonymous or with own type) or declaration (default)
class Rectangle { // Declaration
    constructor(height, width) { // 'constructor()': equivalent to Python's '__init()__'
        // Attributes
        this.width = width; // 'this': equivalent to Python's 'self'
        this.height = height; 
    }
    // Methods (no need to write 'function')
    calc_area() {
        return this.width * this.height
    }
}
let rect = new Rectangle(4, 3); // Instantiating
console.log(rect.calc_area());
//           Inheritance is done via 'extends' operator 
class Animal { // Parent class
    constructor(name) {
        this.name = name
    }

    speak() { 
        console.log(`${this.name} made a noise`);
    }
}    

class Dog extends Animal { // Child class
    constructor(name) {
        super(name); // 'super()' is a way to access the parent class asssets (if by itself, calls the constructor)
                     // 'super.speak()' runs the parent's method (not 'Dog's overriden method)
        this.name = name
    }

    speak() { // Overrides parent class' 'speak()' method
        console.log(`${this.name} barked`);
    }
}
let dog = new Dog("Fido"); // Instantiating
console.log(dog.speak());