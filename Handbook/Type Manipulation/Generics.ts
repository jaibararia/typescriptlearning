// -> Hello world of Generics
// - To start off, let’s do the “hello world” of generics: the identity function.
// - The identity function is a function that will return back whatever is passed in.
// - You can think of this in a similar way to the echo command.

// - Without generics, we would either have to give the identity function a specific type:
/*
function identity(arg: number): number {
    return arg;
  }
*/

// or we could use any type
/*
function identity(arg: any): any {
    return arg;
  }

- It will provide any type if we passsed number or string or any thing else. so that is not ideal, it makes us loose information
*/

// - Instead, we need a way of capturing the type of the argument in such a way that we can also use it to denote what is being returned.
// - Here, we will use a type variable, a special kind of variable that works on types rather than values.

function identity<Type>(arg: Type): Type {
    return arg;
  }

let output = identity<number>(2);
let output2 = identity(true);
// bu still we should mention it like output because that way is safer to avoid compiler fail issue.

// => Working with Generic type variables
// You can't add a non-generic types into generic functions.
// like if you use .length method in the above example of identity fucntion it will give you 
/*
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length);
// Property 'length' does not exist on type 'Type'.
  return arg;
}
*/
// This doesn't work here because it is not related to string or number types, You cna use it for arrays or object so that we will do
function loggingIdentity<Type>(arg: Type[]): Type[] {
    console.log(arg.length); // Array has a .length, so no more error
    return arg;
  }
// You may already be familiar with this style of type from other languages. 
// In the next section, we’ll cover how you can create your own generic types like Array<Type>.

// => Generic Types
// - In previous sections, we created generic identity functions that worked over a range of types.
// - In this section, we’ll explore the type of the functions themselves and how to create generic interfaces.

// - The type of generic functions is just like those of non-generic functions, with the type parameters listed first, similarly to function declarations:
// - We could also have used a different name for the generic type parameter in the type, so long as the number of type variables and how the type variables are used line up.

// Function identity is already created
let myIdentity: <Input>(arg: Input) => Input = identity;

// We can also write the generic type as a call signature of an object literal type:
let myIdentity2: { <Type>(arg: Type): Type } = identity;

// Instead we can create our generic interface which can be used here directly
interface GenericIdentityFn {
    <Type>(arg: Type): Type;
}
/*
With Function defination also you can use these
- Normal
function identity<Type>(arg: Type): Type {
  return arg;
}

- Other way to write it

// You can declare the function with the interface type:
const identity: GenericIdentityFn = function(arg) {
  return arg;  // TypeScript infers the types from the interface
};

// Or with arrow function:
const identityArrow: GenericIdentityFn = (arg) => {
  return arg;  // Types are inferred
};

const identity: GenericIdentityFn = (arg) => arg;

*/
const identity3: GenericIdentityFn = (arg) => arg;
let myidentity3: GenericIdentityFn = identity3;

/*
We can also use the Type as a Paramenter of the interface so when we use it can be visible to all the other member of the Interface.
interface GenericIdentityFn<Type> {
  (arg: Type): Type;
}
 
function identity<Type>(arg: Type): Type {
  return arg;
}
 
let myIdentity: GenericIdentityFn<number> = identity;
*/

// => Generic Classes
// - A generic class has a similar shape to a generic interface. Generic classes have a generic type parameter list in angle brackets (<>) following the name of the class.

class GenericNumber<NumType> {
    zeroValue: NumType;
    add: (x: NumType, y: NumType) => NumType;
  }
/*
this zeroValue or add mention above in class can give you error "Property 'zeroValue' has no initializer and is not definitely assigned in the constructor."
for that we can resolve it with 2 ways
1st method - Add undefined type
    zeroValue: NumType | undefined;
    add: ((x: NumType, y: NumType) => NumType) | undefined;

2nd method - Add defintie assignemnt assertion to the property by adding (!) after the variable name 
- it is also meaning that we are not sure if it will defined or not so we added this then TS knows that it will be defined for sure
    zeroValue!: NumType;
    add!: (x: NumType, y: NumType) => NumType;
*/
   
  let myGenericNumber = new GenericNumber<number>();
  myGenericNumber.zeroValue = 0;
  myGenericNumber.add = function (x, y) {
    return x + y;
  };

// - This is a pretty literal use of the GenericNumber class, but you may have noticed that nothing is restricting it to only use the number type.
// - We could have instead used string or even more complex objects.

  let stringNumeric = new GenericNumber<string>();
  stringNumeric.zeroValue = "";
  stringNumeric.add = function (x, y) {
    return x + y;
  };
   
  console.log(stringNumeric.add(stringNumeric.zeroValue, "test"));

// => Generic Constraints
// We will add the constriant for the loggingIdentity function to run .length for that
// - we’ll create an interface that describes our constraint.
// - Here, we’ll create an interface that has a single .length property and then we’ll use this interface and the extends keyword to denote our constraint:

interface Lengthwise {
    length: number;
  }
   
  function loggingIdentity2<Type extends Lengthwise>(arg: Type): Type {
    console.log(arg.length); // Now we know it has a .length property, so no more error
    return arg;
  }

  // - Because the generic function is now constrained, it will no longer work over any and all types:
  //loggingIdentity2(3);
  // Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.

// - Instead, we need to pass in values whose type has all the required properties:
//loggingIdentity({ length: 10, value: 3 });

// => Using Type Parameters in Generic Constraints

// - You can declare a type parameter that is constrained by another type parameter.
// - For example, here we’d like to get a property from an object given its name.
// - We’d like to ensure that we’re not accidentally grabbing a property that does not exist on the obj, so we’ll place a constraint between the two types:
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}
 
let x = { a: 1, b: 2, c: 3, d: 4 };
 
getProperty(x, "a");
//getProperty(x, "m"); // Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.

// => Using Class Types in Generics
// - When creating factories in TypeScript using generics, it is necessary to refer to class types by their constructor functions.

function create<Type>(c: { new (): Type }): Type {
  return new c();
}

// - A more advanced example uses the prototype property to infer and constrain relationships between the constructor function and the instance side of class types.
class BeeKeeper {
  hasMask: boolean = true;
}
 
class ZooKeeper {
  nametag: string = "Mikle";
}
 
class Animal {
  numLegs: number = 4;
}
 
class Bee extends Animal {
  numLegs = 6;
  keeper: BeeKeeper = new BeeKeeper();
}
 
class Lion extends Animal {
  keeper: ZooKeeper = new ZooKeeper();
}
 
function createInstance<A extends Animal>(c: new () => A): A {
  return new c();
}
 
createInstance(Lion).keeper.nametag;
createInstance(Bee).keeper.hasMask;

// => Generic Parameter Defaults
// - Generic default parameters are perfect for **library design** where you want to provide sensible defaults while maintaining full flexibility for advanced users!

type Container<T, U> = {
  element: T;
  children: U;
};

// ---cut---
declare function create<
T extends HTMLElement = HTMLDivElement, // Default: HTMLDivElement
U extends HTMLElement[] = T[]           // Default: Array of T
>(
  element?: T,
  children?: U
): Container<T, U>;
const div = create();
//    ^?

const p = create(new HTMLParagraphElement());
//    ^?

/*
**Breaking down the generics:**

- `T extends HTMLElement = HTMLDivElement`:

- `T` must be an HTMLElement
- **Default**: If no type specified, use `HTMLDivElement`



- `U extends HTMLElement[] = T[]`:

- `U` must be an array of HTMLElements
- **Default**: If no type specified, use array of whatever `T` is


## Rules for Generic Default Parameters

1. **Order matters**: Required generics must come before optional ones
2. **Constraints still apply**: Defaults must satisfy the constraints
3. **Inference works**: TypeScript can infer from arguments even with defaults
4. **Cascading defaults**: Later defaults can reference earlier generics (like `U = T[]`)
*/

// => Variance Annotation
// - **Variance** describes how type relationships change when you use generic types. It answers the question:
// - "If `A` is a subtype of `B`, what's the relationship between `Container<A>` and `Container<B>`?"

// - TypeScript 4.7+ introduced **variance annotations** (`in`, `out`) to explicitly control this behavior.

// -> Types of Variance
/*
1. Covariance**(`out T`) - "Flows Out"

- If `A extends B`, then `Container<A>` extends `Container<B>`
- Used when `T` only appears in **output positions** (return types)
- **Safe for reading**, not for writing

2. Contravariance**(`in T`) - "Flows In"

- If `A extends B`, then `Container<B>` extends `Container<A>` (reversed!)
- Used when `T` only appears in **input positions** (parameter types)
- **Safe for writing**, not for reading

3. Invariance**(no annotation) - "No Flow"

- No subtype relationship between `Container<A>` and `Container<B>`
- Used when `T` appears in both input and output positions
*/

/* Examples ====
// Example 1: Covariance (out T)
interface Producer<out T> {
  produce(): T;  // T only in output position
}

// ✅ This works because of covariance
const dogProducer: Producer<Dog> = { produce: () => new Dog() };
const animalProducer: Producer<Animal> = dogProducer; // Dog producer → Animal producer

// Example 2: Contravariance (in T)
interface Consumer<in T> {
  consume(item: T): void;  // T only in input position
}

// ✅ This works because of contravariance  
const animalConsumer: Consumer<Animal> = { consume: (animal) => console.log(animal) };
const dogConsumer: Consumer<Dog> = animalConsumer; // Animal consumer → Dog consumer

// Example 3: Invariance (no annotation)
interface Storage<T> {
  store(item: T): void;    // Input position
  retrieve(): T;          // Output position
}

// ❌ This doesn't work - must be exact type
const dogStorage: Storage<Dog> = { store: () => {}, retrieve: () => new Dog() };
const animalStorage: Storage<Animal> = dogStorage; // Error!

*/

/*
## Why This Matters

**Without variance annotations**, TypeScript has to be conservative and make everything invariant, which can be overly restrictive. **With variance annotations**, you get:

1. **Better type safety** - Explicit about how types flow
2. **More flexible APIs** - Allow safe substitutions
3. **Clearer intent** - Code documents how generics should be used
4. **Better performance** - TypeScript can optimize type checking


The event system example shows how variance annotations enable building flexible, type-safe APIs where producers and consumers can be safely substituted based on their type relationships!
*/