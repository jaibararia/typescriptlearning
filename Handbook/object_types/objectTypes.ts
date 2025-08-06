// => Property Modifiers
// -> Optional Parameter
/*
- Much of the time, we’ll find ourselves dealing with objects that might have a property set.
- In those cases, we can mark those properties as optional by adding a question mark (?) to the end of their names.
*/
interface Shape2 {};
declare function getShape(): Shape2;
interface PaintOptions{
    shape: Shape2;
    xPos?: number;
    yPos?: number;
}

function paintShape(opt: PaintOptions){
    console.log(opt.shape);
}

const shape = getShape();
paintShape({shape});
paintShape({shape, xPos: 100});
paintShape({shape, xPos: 100, yPos: 100});
//paintShape({xPos: 100}); // Error because shape is necessary here

// In JavaScript, even if the property has never been set, we can still access it - it’s just going to give us the value undefined.
// We can just handle undefined specially by checking for it.

/*
function paintShape(opt: PaintOptions){
    let xPos = opt.xPos === undefined ? 0 : opt.xPos

    let yPos = opt.yPos === undefined ? 0 : opt.yPos
}
Now both are considered as number.
*/
/*
Or we can use the destructuring also

function paintShape({ shape, xPos = 0, yPos = 0 }: PaintOptions) {
  console.log("x coordinate at", xPos);
                                  
(parameter) xPos: number
  console.log("y coordinate at", yPos);
                                  
(parameter) yPos: number
  // ...
}

- Here we used a destructuring pattern for paintShape’s parameter, and provided default values for xPos and yPos.
- Now xPos and yPos are both definitely present within the body of paintShape, but optional for any callers to paintShape.

-- Note that there is currently no way to place type annotations within destructuring patterns. This is because the following syntax already means something different in JavaScript.

function draw({ shape: Shape, xPos: number = 100 }) {
    render(shape);
    Cannot find name 'shape'. Did you mean 'Shape'?
      render(xPos);
    Cannot find name 'xPos'.
    }

-- In an object destructuring pattern, shape: Shape means “grab the property shape and redefine it locally as a variable named Shape.” Likewise xPos: number creates a variable named number whose value is based on the parameter’s xPos.
*/

// -> readonly
// - Properties can also be marked as readonly for TypeScript.
// - While it won’t change any behavior at runtime, a property marked as readonly can’t be written to during type-checking.

interface SomeType {
    readonly prop: string;
}
function doSomething3(obj: SomeType) {
    // We can read from 'obj.prop'.
  console.log(`prop has the value '${obj.prop}'.`);

  // But we can't re-assign it.
  // obj.prop = "hello";
  //Cannot assign to 'prop' because it is a read-only property.
}
// - Using the readonly modifier doesn’t necessarily imply that a value is totally immutable - or in other words, that its internal contents can’t be changed.
// - It just means the property itself can’t be re-written to.

interface Home {
    readonly resident: {name: string, age: number};
}
function invite(home: Home){
    // We can read and update properties from 'home.resident'.
    console.log(`Happy Birthday ${home.resident.name}`);
    home.resident.age++;
}

function evict(home: Home) {
    // But we can't write to the 'resident' property itself on a 'Home'.
    /*home.resident = {
  //Cannot assign to 'resident' because it is a read-only property.
      name: "Victor the Evictor",
      age: 42,
    };*/
  }

// - It’s important to manage expectations of what readonly implies.
// - It’s useful to signal intent during development time for TypeScript on how an object should be used.
// - TypeScript doesn’t factor in whether properties on two types are readonly when checking whether those types are compatible, so readonly properties can also change via aliasing.

interface Person{
    name: string;
    age: number;
}

interface ReadonlyPerson {
    readonly name: string;
    readonly age: number;
}

let writablePerson: Person = {
    name: "Person McPersonface",
    age: 42,
}

let readonlyPerson: ReadonlyPerson = writablePerson;

console.log(readonlyPerson.age); // 42
writablePerson.age++;
console.log(readonlyPerson.age); // 43

// -> Index Signature
//- An index signature defines the type of values that can be accessed using bracket notation (`[]`) with a specific key type.

// example explaination
interface StringArray {
    [index: number]: string;
    //  ↑       ↑        ↑
    //  key    key      value
    //
} // ** This means: "Any property accessed with a `number` key will return a `string` value."
/*

This creates a type that:

- Can be indexed with numbers (`[0]`, `[1]`, `[2]`, etc.)
- Always returns a string when indexed
- Is essentially describing an array-like structure
*/

  
  // This satisfies the StringArray interface
  const fruits: StringArray = {
    0: "apple",
    1: "banana", // now if i change the value to number or boolean it will give error
    2: "orange"
  };
  
  console.log(fruits[0]); // "apple"
  console.log(fruits[1]); // "banana"
  
  // Regular arrays also satisfy this interface!
  const colors: StringArray = ["red", "green", "blue"];
  console.log(colors[1]); // "green"

// eg = 2
interface StringDictionary {
    [key: string]: string;
  }
  
  const translations: StringDictionary = {
    hello: "hola",
    goodbye: "adiós",
    thank_you: "gracias"
  };
  
  console.log(translations["hello"]); // "hola"
  console.log(translations.goodbye);  // "adiós" (dot notation also works)

// eg 3
interface MixedArray {
  [index: number]: string;    // Numeric indices return strings
  [key: string]: string | number;      // String keys also return strings
  length: number;             // But we can have specific properties too
}
/**The issue:** In JavaScript, numeric indices are actually converted to strings under the hood. So `obj[0]` is the same as `obj["0"]`. This means:

- The `length` property can be accessed as `obj.length` OR `obj["length"]`
- Since `[key: string]: string` says ALL string keys return strings
- But `length: number` says this specific key returns a number
- **Conflict!** TypeScript doesn't know whether `obj["length"]` should return `string` or `number`
- Solution [key: string]: string | number; earlier it was [key: string]: string;
*/

const mixed: MixedArray = {
  0: "first",
  1: "second",
  length: 2,
  name: "my array"  // This works because string index signature allows it
};

console.log(mixed[0]);        // "first"
console.log(mixed.length);    // 2
console.log(mixed.name);      // "my array"

// eg 4
  
  function getStringArray(): StringArray {
    // Could return a regular array
    return ["apple", "banana", "cherry"];
    
    // Or an array-like object
    // return {
    //   0: "apple",
    //   1: "banana", 
    //   2: "cherry"
    // };
  }
  
  const myArray: StringArray = getStringArray();
  const secondItem = myArray[1]; // "banana"
  console.log(secondItem);

// => Excess Property Checks
/*
- Where and how an object is assigned a type can make a difference in the type system.
- One of the key examples of this is in excess property checking, which validates the object more thoroughly when it is created and assigned to an object type during creation.
*/

interface SquareConfig{
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): {color: string, area: number}{
    return {
        color: config.color || "red",
        area: config.width ? config.width * config.width : 20,
    };
};

// let mySquare = createSquare({colour: "red", width: 100});
// Error in 236 = Object literal may only specify known properties, but 'colour' does not exist in type 'SquareConfig'. Did you mean to write 'color'?

// - You could argue that this program is correctly typed, since the width properties are compatible, there’s no color property present, and the extra colour property is insignificant.
// - However, TypeScript takes the stance that there’s probably a bug in this code.
// - Object literals get special treatment and undergo excess property checking when assigning them to other variables, or passing them as arguments. 
// - If an object literal has any properties that the “target type” doesn’t have, you’ll get an error:

// - Getting around these checks is actually really simple. The easiest method is to just use a type assertion:
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);

// - However, a better approach might be to add a string index signature if you’re sure that the object can have some extra properties that are used in some special way. 
// - If SquareConfig can have color and width properties with the above types, but could also have any number of other properties, then we could define it like so:

interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: unknown;
  }

/*
- Here we’re saying that SquareConfig can have any number of properties, and as long as they aren’t color or width, their types don’t matter.
- One final way to get around these checks, which might be a bit surprising, is to assign the object to another variable: Since assigning squareOptions won’t undergo excess property checks, the compiler won’t give you an error:
*/
let squareOptions = { colour: "red", width: 100 };
let mySquare2 = createSquare(squareOptions);

/*
- The above workaround will work as long as you have a common property between squareOptions and SquareConfig.
- In this example, it was the property width. It will however, fail if the variable does not have any common object property.
*/

let squareOptions2 = { colour: "red" };
let mySquare3 = createSquare(squareOptions2);
//Type '{ colour: string; }' has no properties in common with type 'SquareConfig'.
// it is working here because we have added index signature in SquareConfig - [propName: string]: unknown; if we remove that and use as old CquareConfig then it will give us the error


// => Extending Types

/*
- The extends keyword on an interface allows us to effectively copy members from other named types, and add whatever new members we want.
- This can be useful for cutting down the amount of type declaration boilerplate we have to write, and for signaling intent that several different declarations of the same property might be related.
- For example, AddressWithUnit didn’t need to repeat the street property, and because street originates from BasicAddress, a reader will know that those two types are related in some way.
*/

interface BasicAddress {
    name?: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
  }
/*  interface AddressWithUnit {
    name?: string;
    unit: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
  }
 instead doing like this we can do it like mention below */

 interface AddressWithUnit extends BasicAddress{
    unit: string;
 }

// => Intersection Types
// - interfaces allowed us to build up new types from other types by extending them.
// - TypeScript provides another construct called intersection types that is mainly used to combine existing object types.

// - An intersection type is defined using the & operator.
interface Colorful {
    color: string;
  }
  interface Circle2 {
    radius: number;
  }
   
  type ColorfulCircle = Colorful & Circle2;

  function draw(circle: ColorfulCircle) {
    console.log(`Color was ${circle.color}`);
    console.log(`Radius was ${circle.radius}`);
  }

  draw({ color: "blue", radius: 42 });

// => Interface Extensions and Intersection
/* Interface Extension example
    interface Base {
        id: string;
        value: string;
    }
    
    interface Extended extends Base {
      id: number;  // ❌ ERROR! Cannot override with incompatible type
        // Interface 'Extended' incorrectly extends interface 'Base'
        // Types of property 'id' are incompatible
    }
*/

/* Intersection example
 
 type Base = {
    id: string;
    value: string;
  }
  
  type Extended = Base & {
    id: number;  // ✅ No error, but creates: id: string & number (never)
  }
  
  const obj: Extended = {
    id: "hello",     // ❌ Error: string is not assignable to never
    id: 123,         // ❌ Error: number is not assignable to never
    value: "test"
  };
*/

// => Generic Object Types
//Let’s imagine a Box type that can contain any value - strings, numbers, Giraffes, whatever.
interface Box1 {
    contents: any;
  }
/* 
-  To avoid getting stuck in this condition and thinking of defining the interface of each type of box, or overloading the function,
- or using the unknown which will create a unneccessary steps to check the type of known properties.
- Instead we can use Genrics Object Types and that will be used in Generic function Types
*/
interface Box<Type>{
    content: Type
}

// - You might read this as “A Box of Type is something whose contents have type Type”. 
// - Later on, when we refer to Box, we have to give a type argument in place of Type.
let box: Box<string>;
// - Think of Box as a template for a real type, where Type is a placeholder that will get replaced with some other type.
// - When TypeScript sees Box<string>, it will replace every instance of Type in Box<Type> with string, and end up working with something like { contents: string }.

// - Box is reusable in that Type can be substituted with anything. That means that when we need a box for a new type, we don’t need to declare a new Box type at all (though we certainly could if we wanted to).
   
  interface Apple {
    // ....
  }
   
  // Same as '{ contents: Apple }'.
  type AppleBox = Box<Apple>;

// This also means that we can avoid overloads entirely by instead using generic functions.

function setContents<Type>(box: Box<Type>, newContents: Type) {
    box.content = newContents;
  }

// -> The Array Type
/*
- Generic object types are often some sort of container type that work independently of the type of elements they contain.
- It’s ideal for data structures to work this way so that they’re re-usable across different data types.
- It turns out we’ve been working with a type just like that throughout this handbook: the Array type.
- Whenever we write out types like number[] or string[], that’s really just a shorthand for Array<number> and Array<string>.
*/
function doSomething5(value: Array<string>) {
    // ...
  }
  
  let myArray2: string[] = ["hello", "world"];
  
  // either of these work!
  doSomething5(myArray2);
  doSomething5(new Array("hello", "world"));

// - Modern JavaScript also provides other data structures which are generic, like Map<K, V>, Set<T>, and Promise<T>.
// - All this really means is that because of how Map, Set, and Promise behave, they can work with any sets of types.

// -> The ReadonlyArray Type
// The ReadonlyArray is a special type that describes arrays that shouldn’t be changed.

function doStuff(values: ReadonlyArray<string>) {
    // We can read from 'values'...
    const copy = values.slice();
    console.log(`The first value is ${values[0]}`);
  
    // ...but we can't mutate 'values'.
    //values.push("hello!");
  }

/*
- Much like the readonly modifier for properties, it’s mainly a tool we can use for intent.
- When we see a function that returns ReadonlyArrays, it tells us we’re not meant to change the contents at all, and when we see a function that consumes ReadonlyArrays, it tells us that we can pass any array into that function without worrying that it will change its contents.
- Unlike Array, there isn’t a ReadonlyArray constructor that we can use.

new ReadonlyArray("red", "green", "blue");
'ReadonlyArray' only refers to a type, but is being used as a value here

- Instead, we can assign regular Arrays to ReadonlyArrays.
const roArray: ReadonlyArray<string> = ["red", "green", "blue"];


- Just as TypeScript provides a shorthand syntax for Array<Type> with Type[], 
- it also provides a shorthand syntax for ReadonlyArray<Type> with readonly Type[].
*/

function doStuff2(values: readonly string[]) {
  // We can read from 'values'...
  const copy = values.slice();
  console.log(`The first value is ${values[0]}`);
 
  // ...but we can't mutate 'values'.
  //values.push("hello!");
//Property 'push' does not exist on type 'readonly string[]'.
}

// - One last thing to note is that unlike the readonly property modifier, assignability isn’t bidirectional between regular Arrays and ReadonlyArrays.
let x2: readonly string[] = [];
let y: string[] = [];
 
x2 = y;
//y = x2;
// - The type 'readonly string[]' is 'readonly' and cannot be assigned to the mutable type 'string[]'.

// => Tuple Types
// - A tuple type is another sort of Array type that knows exactly how many elements it contains, and exactly which types it contains at specific positions.
type StringNumberPair = [string, number];

// - Here, StringNumberPair is a tuple type of string and number. 
// - Like ReadonlyArray, it has no representation at runtime, but is significant to TypeScript.
// - To the type system, StringNumberPair describes arrays whose 0 index contains a string and whose 1 index contains a number.
function doSomething4(stringHash: [string, number]) {
    const [inputString, hash] = stringHash;
   
    console.log(inputString);               
  //            ^?const inputString: string
   
    console.log(hash);             
  //            ^?const hash: number
  }

// - Other than those length checks, simple tuple types like these are equivalent to types which are versions of Arrays that declare properties for specific indexes, and that declare length with a numeric literal type.
interface StringNumberPair2 {
    // specialized properties
    length: 2;
    0: string;
    1: number;
   
    // Other 'Array<string | number>' members...
    slice(start?: number, end?: number): Array<string | number>;
  }

// - Another thing you may be interested in is that tuples can have optional properties by writing out a question mark (? after an element’s type). Optional tuple elements can only come at the end, and also affect the type of length.
type Either2dOr3d = [number, number, number?];
 
function setCoordinate(coord: Either2dOr3d) {
  const [x3, y3, z2] = coord;
  //             ^?const z2: number | undefined
 
  console.log(`Provided coordinates had ${coord.length} dimensions`);
   //                                               ^?(property) length: 2 | 3
}

// - Tuples can also have rest elements, which have to be an array/tuple type.
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];

//- A tuple with a rest element has no set “length” - it only has a set of well-known elements in different positions.
const a3: StringNumberBooleans = ["hello", 1];
const b3: StringNumberBooleans = ["beautiful", 2, true];
const c3: StringNumberBooleans = ["world", 3, true, false, true, false, true];

// - Why might optional and rest elements be useful? Well, it allows TypeScript to correspond tuples with parameter lists. Tuples types can be used in rest parameters and arguments, so that the following:

function readButtonInput(...args: [string, number, ...boolean[]]) {
    const [name, version, ...input] = args;
    // ...
  }

/* is basically equivalent to:
- function readButtonInput(name: string, version: number, ...input: boolean[]) {
  // ...
}
- This is handy when you want to take a variable number of arguments with a rest parameter, and you need a minimum number of elements, but you don’t want to introduce intermediate variables.
*/

// ==> readonly Tuple Types

// - One final note about tuple types - tuple types have readonly variants, and can be specified by sticking a readonly modifier in front of them - just like with array shorthand syntax.

//function doSomething6(pair: readonly [string, number]) {// ...}

// - As you might expect, writing to any property of a readonly tuple isn’t allowed in TypeScript.
function doSomething6(pair: readonly [string, number]) {
   // pair[0] = "hello!";
  //Cannot assign to '0' because it is a read-only property.
}

// - Tuples tend to be created and left un-modified in most code, so annotating types as readonly tuples when possible is a good default.
// - This is also important given that array literals with const assertions will be inferred with readonly tuple types.

let point = [3, 4] as const;
 
function distanceFromOrigin([x, y]: [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2);
}
 
//distanceFromOrigin(point);
//err0 - Argument of type 'readonly [3, 4]' is not assignable to parameter of type '[number, number]'.
//err0.2 - The type 'readonly [3, 4]' is 'readonly' and cannot be assigned to the mutable type '[number, number]'.

// - Here, distanceFromOrigin never modifies its elements, but expects a mutable tuple. Since point’s type was inferred as readonly [3, 4],
// - it won’t be compatible with [number, number] since that type can’t guarantee point’s elements won’t be mutated.