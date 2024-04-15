// #################### Matter.js Basics ####################
// [Core Concepts] Engine: manages the physics simulation and how the world is updated
//                 Bodies: primary elements corresponding to physical objects in the world (every body created has to be added to the world) 
//                         a body has a position and velocity (analog to the 'Ball' class in examples 1-15) and geometry to define its shape
//                 Composite: container that allows for creation of entities made up of multiple bodies (world itself is a composite)
//                 Constraints: connections between bodies

// [World] The physics environment is a Composite object called 'world' (stored in the engine)
//         Any body must be added to world so it's simulated with physics (via 'Composite.add()')
//         When not needed anymore bodies must be deleted from the world, not just their 'main' reference (via 'Composite.remove()')

// [Matter.Vector] Entity with magnitude and direction (with 'x'/'y' components), analog to 'p5.Vector' class (in theory, not needed anymore)
//                 All vector methods are static; if we want to change a 'Matter.Vector' (while operating on it) we can add it as an optional argument

// [Engine] 'Matter.Engine' contains methods for creating and manipulating engines (controllers that update the world)
//          Should be created in 'setup()' (with a declared global variable, 'engine')
//          '.create([options])': returns an engine with '[options]' overriding default properties
//                                default properties include gravity (a (0,1) vector) pointing down
//          '.update([engine],[delta])': moves the simulation forward in time by '[delta]' milliseconds
//                                       triggers 'beforeUpdate'/'afterUpdate'/'collisionStart'/'collisionActive'/'collisionEnd' events

// [Engine Properties] Must be done 'outiside' and after engine creation
//                     '[engine].gravity': gravitational acceleration applied to all bodies in world on every update
//                                         set '[engine].gravity.scale' to 0 to turn it off
//                                         use components ('engine.gravity.x'/'engine.gravity.y'/'engine.gravity.z') to change direction (default: (0,1))
//                     '[engine].world': root of 'Matter.Composite' which contains all bodies


// [Render] 'Matter.Render' is a canvas based renderer for visualising instances of 'Matter.Engine'
//          '.create([options])': returns an renderer with '[options]' overriding default properties
//                                canvas size lives under 'options: {width:[width], height:[height]}' parameter                 

// [Runner] 'Matter.Runner' provides a game loop (like p5's 'draw()') that continuously updates 'Matter.Engine'
//          If user is using their own loop, call 'Engine.update()' inside it
//          '.create([options])': returns a runner with '[options]' overriding default properties

// [Composite] Composites are containers made of 1+ objects (even if they're not physically connected)
//             The 'world' is a composite itself and all objects must be added/deleted to/from it to be acknowledged by engine (and thus physics)
//             '.create([options])': returns a composite with '[options]' overriding default properties
//             '.add([composite],[object])': adds a '[object]' (which can be a single/array of body/constraint) to '[composite]' (like world)
//                                           triggers '[composite]'s 'beforeAdd'/'afterAdd' events
//             '.remove([composite],[object],[deep])': removes '[object]' (which can be a single/array of body/constraint) from '[composite]' (like world)
//                                                     triggers '[composite]'s 'beforeRemove'/'afterRemove' events

// [Bodies] Primary element in the world (analog to the 'Ball' class in examples 1-15)
//          Factory 'Matter.Bodies.[object_class]([options])' doesnt draw anything (like p5) but rather builds the geometry for a 'Body' object 
//          'Body' objects properties such as 'density' (which affets mass), 'friction'/'restitution' (which affect bounciness) customizable via '[options]' or static methods (like 'setVelocity()')
//          All bodies must be added to the world via 'Composite.add(engine.world, [body_name]);'
//          '.circle([x],[y],[radius],[options],[maxSides])': creates a circle body at '[x]'/'[y]' with '[radius]'
//          '.rectangle([x],[y],[width],[height],[options])': creates a rectangle body with '[width]'/'[height]' at '[x]'/'[y]' 
//          '.trapezoid([x],[y],[width],[height],[slope],[options])': creates a trapezoid body at '[x]'/'[y]' 

// [Static Bodies] A static body can never change position/angle and is completely fixed (mass/inertia set to Infinity)
//                 Bodies become static via the 'isStatic' flag (boolean)
//                 Static bodies don’t incorporate material properties (like restitution or friction)

// [Body Properties] All the below can be override when creating bodies (via '[options]' parameter):
//                   '[body].angle': angle of the body (in radians; default: 0)
//                   '[body].angularSpeed': rotational speed of the body (magnitude of angular velocity; default: 0)
//                   '[body].area': area of a convex body (calculated when verties are set)
//                   '[body].density': density of the body (mass/area; default: 0.001)
//                   '[body].force': Vector (format '{x: [val_x], y:[val_y]}') with accumulated total forces applied on body (is zeroed after every 'Engine.update')
//                   '[body].friction': defines the friction of the body (value in range (0, 1); default: 0.1)
//                                      0: body slides indefinitely / 1: body stops instantly after a force is applied
//                   '[body].frictionAir': defines the air friction of the body (air resistance; default: 0.01)
//                                         0: body never slows down when moves through space / high value: body slows down faster when moving through space
//                   '[body].frictionStatic': defines the static friction of the body (default: 0.5)
//                                            0: body never 'stick' when stationary (only dynamic friction is used) / 10: more force needed to initially get the body moving
//                   '[body].inertia': defines the moment of inertia of the body (calculated when vertices/mass/density are set)
//                   '[body].isSleeping': flag indicating whether the body is considered sleeping. A sleeping body acts similar to a static body, except it is only temporary and can be awoken  (default: false)
//                   '[body].isStatic': flag indicating whether a body is considered static (default: false)
//                   '[body].mass': defines the mass of the body ('density' is updated when this is set)
//                   '[body].position': defines the current position of the body (default: '{x: 0, y: 0}')
//                   '[body].restitution': defines the restitution (elasticity) of the body (value in range (0, 1); default: 0)
//                                         collision are based on pairs of bodies and restitution values are combined as 'max(bodyA.restitution, bodyB.restitution)'
//                                         0: collisions are perfectly inelastic (no bouncing) / 0.8: body bounces back with ~80% of its kinetic energy 
//                   '[body].slop': specifies a thin boundary around body where it's allowed to sink into other bodies (required for proper collision response; default: 0.05)
//                   '[body].torque': defines total accumulated torque (turning force) applied to the body (is zeroed after every 'Engine.update')
//                                    torque results in angular acceleration on every update (which depends on inertia)
//                   '[body].velocity': velocity of the body (non-negative; default: '{x: 0, y: 0}')

// [Constraints] A constraint is a mechanism to connect one body to another (which enables swinging simulations)
//               Constraints have no geometry (they're more a relationship than a physical body), although we draw them for viz purposes
//                  Distance Constraint: connection of fixed length between 2 bodies
//                                       constraint is attached to each body at a specified anchor (relative to the body’s center)
//                  Revolute Constraint: constraint that connects 2 bodies at a common anchor point
//                                       there's no separate revolute constraint; we make one with a regular Constraint of 'length' 0 and 'stiffness' 1 (otherwise it may not be stable)
//                                       
//                  Mouse Constraint: if we manually assign the position of a body, engine no longer knows how to compute the physics
//                                    it's the equivalent of teleportating instantly an object from point A to point B (and Newton's laws don't account for teleportation)
//                                    in this context, a mouse constraint allows us to tie a 'string' around the mouse, in point B, and make it drag the object from point A there
//                                    the moment we click the mouse on the object, it attaches a 'string' to its body; now when we move the mouse, it drags the body around with it until it's released
//                                    'Mouse' object listens for mouse inputs with the p5 canvas (assigned to it at creation)
//                                       Important: always make sure pixel density is matched between p5/Matter.js via '[mouse].pixelRatio = pixelDensity()'
//                                    'MouseConstraint' receives the 'Mouse' object and allows interactions with objects
//                                    There's no need to explicitly attach 'MouseConstraint' to a particular body (any clicked body will be constrained to mouse)

// [Constraint Properties] All the below can be override when creating constraints (via '[options]' parameter):
//                         '[constraint].bodyA': 1st body attached to [constraint]
//                         '[constraint].bodyB': 2nd body attached to [constraint]
//                         '[constraint].damping': amount of resistance applied to each body (based on velocities) to limit oscillation (default: 0.01)
//                                                 only apparent when the constraint has a very low 'stiffness'
//                                                 0: no damping / 1: heavy damping (no oscillation)
//                         '[constraint].length': target rest length of [constraint] (calculated in 'Constraint.create()' from initial 'bodyA'/'bodyB' positions
//                         '[constraint].pointA': offset of [constraint] from center of 'bodyA' (default: uses 'bodyA's center - '{x: 0, y: 0}')
//                         '[constraint].pointB': offset of [constraint] from center of 'bodyB' (default: uses 'bodyB's center - '{x: 0, y: 0}')
//                         '[constraint].stiffness': rate at which '[constraint]' returns to its 'constraint.length' (default: 1)
//                                                   0: soft spring / 1: very stiff

// [ Collisions] When bodies collide Matter.js alerts us via the events
//               'Events.on([engine],[event_names],[callback_func])': subscribes '[callback_func]' to the given '[engine]'s '[event_names]'
//               'Events.off([engine],[event_names],[callback_func])': removes the '[callback_func]' to the given '[engine]'s '[event_names]'
//                  '[callback_func]': a function that receives an 'event' parameter (object including all data associated with the collision; created automatically by Matter.js)
//                                     'event.pairs' is an array with any pair of colliding bodies (if looped, can let us identify 'bodyA'/'bodyB')
//                                                   once with the bodies objects, we can access default (like 'id', 'labels', 'position') or custom params (in 'plugin')
//                                                   Important: when customizing 'plugin', make sure to add a new property and not overwrite it entirely ([object].plugin.[param] = [value])
//               Common events include:
//                  'collisionStart': triggers whenever a collision between 2 bodies starts
//                  'collisionActive': triggers (over and over) for the duration of a collision between 2 bodies
//                  'collisionEnd': triggers whenever 2 bodies stop colliding
//                  


// #################### Matter.js Strategy ####################
// [Basic Framework] 'setup()': creates/initializes objects in the world
//                   'draw()': calculates all forces and applies them to objects (with 'F = m * a')
//                             updates positions of all objects, based on their accelerations
//                             draws all objects

// [Module Aliases] Assign module namespaces to global variables (with same name) to reduce verbose (OOP's dor operator)
//                  For safety, should be done with destructuring (example: 'const { Engine, Vector } = Matter;')
//                  Most common modules to alias are 'Matter.Engine','Matter.Render','Matter.World','Matter.Bodies'

// [Add/Delete Objects] All objects must be added to the world composite to be considered in the engine
//                      Therefore there's always 2 levels of object management tha must be addressed:
//                         'draw()'/'setup()': instances of user-defined objects (usually grouped in a list)
//                         world (composite):  bodies added/removed from world
//                      Important: every add/remove action must be done in both fronts

// [Drawing] Since all objects params now reside in the world composite, we need to:
//              Query: query objects in the world composite (via either 'Composite.allBodies()', 'Composite.get()' or '[composite].bodies')
//              Fetch: pull the desired params (usually 'position' and 'angle')
//              Call: in 'draw()' call the instance 'display()' method (or similar)
//              Display: use p5 objects (with fetched params, above) and draw them (using 'rect()', 'circle()', etc)

// [Mouse Constraint] Import 'Mouse' and 'MouseConstraint' modules (during alias phase)
//                    Create a 'mouse' (Mouse) assigning 'canvas.elt' during creation (and aligning 'pixelRatio')
//                    Create a 'mouse_constr' (MouseConstraint) assigning 'mouse' during creation (and adding to the world)

// [Collisions] '[callback_func]' function, assigned at 'Events.off([engine],[event_names],[callback_func])' loops over 'event.pairs'
//              For each pair, we assign both objects (mapped via 'pair.body_') to new variables 
//              Then we assign the class instance via 'body_.plugin.[attribute]'
//              Use class instance for object's functionality 