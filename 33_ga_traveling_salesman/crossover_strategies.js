// User Global Variables
let total_cities = 6;
let route1; // Genome 1
let route2; // Genome 2


// User-Define Functions
function crossover_original(route1, route2) {
  let length = route1.length;
  let split = floor(random() * length); // Split
  
  let child1 = [...route1.slice(0,split),...route2.slice(split, length)]; // Crossover
  let child2 = [...route2.slice(0,split),...route1.slice(split, length)];
  
  return "[A. Original] Split: " + split + "; " + "Children: " + child1 + " / " + child2;
}

function crossover_2_points(route1, route2) {
  let length = route1.length;
  let split1 = floor(random() * length); // Split
  let split2 = floor(random() * length);
  if (split1 > split2) { // Ordering the splits
    let tmp = split2; // Buffer
    split2 = split1; 
    split1 = tmp; 
  }
  // Crossover ('split1' comes before 'split2')
  let child1 = [...route1.slice(0,split1),...route2.slice(split1, split2),...route1.slice(split2, length)];
  let child2 = [...route2.slice(0,split1),...route1.slice(split1, split2),...route1.slice(split2, length)];
  
  return "[B. Two-Point Crossover] Splits: " + split1 + " / " + split2 + "; " + "Children: " + child1 + " / " + child2;
}

function crossover_pmx(route1, route2) {
  let length = route1.length;
  let split1 = floor(random() * length); // Split
  let split2 = floor(random() * length);
  if (split1 > split2) { // Ordering the splits ('split1' comes before 'split2')
    let tmp = split2; // Buffer
    split2 = split1; 
    split1 = tmp; 
  }
  // Crossover 
  let map1_2 = {}; // Maps 'route1' to 'route2'
  let map2_1 = {}; // Maps 'route2' to 'route1'
  let child1 = Array.from(route1); // Children (initially exactly as parents)
  let child2 = Array.from(route2);
  // Filling the middle section
  for (let i = split1; i < split2; i++) { // Looping middle section...
    child1[i] = route2[i]; // Transfers 'route2' middle to 'child1'
    map1_2[route2[i]] = route1[i]; // Maps 'route2' value to 'route1' value (at same index)
    child2[i] = route1[i]; // Vice-versa
    map2_1[route1[i]] = route2[i];
  }
  // Populating left/right sections (while 'fixing' duplicates)
  for (let i = 0; i < split1; i++) { // Left section
    while (child1[i] in map1_2) {
      child1[i] = map1_2[child1[i]];
    }
    while (child2[i] in map2_1) {
      child2[i] = map2_1[child2[i]];
    }
  }
  for (let i = split2; i < length; i++) { // Right section
    while (child1[i] in map1_2) {
      child1[i] = map1_2[child1[i]];
    }
    while (child2[i] in map2_1) {
      child2[i] = map2_1[child2[i]];
    }
  }
  return "[C. Partially Mapped Crossover] Splits: " + split1 + " / " + split2 + "; " + "Children: " + child1 + " / " + child2;
}

function crossover_uniform(route1, route2) { // Custom version
  let length = route1.length;
  let spares1 = [...Array(length).keys()];
  let spares2 = [...Array(length).keys()]; 
  let child1 = []; // Children
  let child2 = [];
  
  for (let i = 0; i < length; i++) { // 
    if (random() < 0.5) {  
      // '< 0.5': 'child1' receives from 'route1'
      if (child1.includes(route1[i])) { // 'route1' already present in 'child1'
        child1[i] = spares1[0]; 
        spares1.splice(0,1); 
      } else { // 'route1' not present in 'child1'
        child1[i] = route1[i]; // Gets 'route1'
        spares1.splice(spares1.indexOf(route1[i]),1); // Element not available
      }
      
      if (child2.includes(route2[i])) { // 'route2' already present in 'child2'
        child2[i] = spares2[0];
        spares2.splice(0,1);
      } else {
        child2[i] = route2[i];
        spares2.splice(spares2.indexOf(route2[i]),1);
      }
      
    } else { // '>= 0.5': 'child1' receives from 'route2'
      if (child1.includes(route2[i])) {
        child1[i] = spares1[0]; 
        spares1.splice(0,1); 
      } else {
        child1[i] = route2[i]; 
        spares1.splice(spares1.indexOf(route2[i]),1); 
      }
      
      if (child2.includes(route1[i])) {
        child2[i] = spares2[0];
        spares2.splice(0,1);
      } else {
        child2[i] = route1[i];
        spares2.splice(spares2.indexOf(route1[i]),1);
      }
    }
  }
  return "[D. Uniform Crossover] Children: " + child1 + " / " + child2; //// NAO ESTA FUNCIONANDO
}


// p5 Main
function setup() {
  createCanvas(400, 400);
  
  // Initializing the genomes
  original = [...Array(total_cities).keys()] ; // Creates 'route1' (0-indexed)
  // Shuffling
  route1 = shuffle(original);
  route2 = shuffle(original);
  // Outputing
  print("Route 1: " + route1);
  print("Route 2: " + route2);
  
  // Crossover Strategies
  // A. Original: 1 crossover point is randomly selected at same position from each parent. Chromosomes are then split at this point and data beyond the points is swapped between them;
  print(crossover_original(route1, route2));
  
  // B. Two-Point Crossover: 2 crossover points are randomly selected at same position from each parent. Chromosomes are then split at those points and data beyond the points is swapped between them;
  print(crossover_2_points(route1, route2));
  
  // C. Partially Mapped Crossover (PMX): similar to 'Two-Point Crossover' as 2 crossover points continue to be randomly selected at same position from each parent. Children are made by copying the genes between those points from 'route1' and joining the before/after genes from 'route2' (and vice-versa). If a gene has been already provided by 'route1', the corresponding gene from 'route2' replaces it; 
  print(crossover_pmx(route1, route2));
  
  // D. Uniform Crossover: each gene is chosen from either parent with equal probability ('toin coss'). If a gene is already present in the corresponding child, the first available gene is pulled from an ordered list of the same genes ('spare_')
  print(crossover_uniform(route1, route2));
  
}

function draw() {
  background(220);
}