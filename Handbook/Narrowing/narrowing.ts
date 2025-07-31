// **The process of refining types to more specific types than declared is called narrowing.

function padLeft(padding: number | string, input: string): string { // declare the type here
    if(typeof padding === "number"){    // refining the type here
        return " ".repeat(padding) + input;
    }
    return padding + input; // automatically refined because if it a number we are addressing it above so this for string only
}

// => typeof type guards

function printAll(strs: string | string[] | null) {
    if(strs === "object"){
        for(const s of strs){
            console.log(s);
        }
    }
    else if (strs === "string") {
        console.log(strs);
    }
    else{
        // do nothing
    }
}

/*
- Array are of object types in Javascript
- TypeScript lets us know that strs was only narrowed down to string[] | null instead of just string[].
- Though in here i am not seeing the error that strs is a null too?
*/

// => Truthiness narrowing e.g

// both of these result in 'true'
Boolean("hello"); // type: boolean, value: true
//!!"world"; // type: true,    value: true
//This kind of expression is always truthy.

// '!!' -> this is called double-boolean negotiation.

// some other example of truthy
function printAll2(strs: string | string[] | null) {
    if (strs && typeof strs === "object") {
      for (const s of strs) {
        console.log(s);
      }
    } else if (typeof strs === "string") {
      console.log(strs);
    }
  }

  // DON'T DO THIS KEEP READING, WHY?
  function printAll3(strs: string | string[] | null) {
    if (strs) { 
        // we can correct this by using this if(strs !== null) instead of this if(strs) then it will ok and using the Equality Narrowing
      if (typeof strs === "object") {
        for (const s of strs) {
          console.log(s);
        }
      } else if (typeof strs === "string") {
        console.log(strs);
      }
    }
  }
// HERE'S WHY - By doing this we are neglicting to handle the empty string case correctly

// Narrowing with Boolean Negation
function multiplyAll(
    values: number[] | undefined,
    factor: number
): number[] | undefined {
    if(!values) {
        return values;
    } else {
        return values.map((x) => x*factor);
    }
}

// => Equality Narrowing 
// TypeScript also uses switch statements and equality checks like ===, !==, ==, and != to narrow types. For example:
function example(x: string | number, y: string | boolean){
    if(x === y){
        x.toUpperCase();
        y.toUpperCase();
    }
    else{
        console.log(x);
        console.log(y);
    }
}

// JavaScript’s looser equality checks with == and != also get narrowed correctly. 
// If you’re unfamiliar, checking whether something == null actually not only checks whether it is specifically the value null - it also checks whether it’s potentially undefined. 
// The same applies to == undefined: it checks whether a value is either null or undefined.

interface Container {
    value: number | null | undefined;
};
function multiplyAll2(container: Container, factor: number){
    if(container.value != null){ // Remove both 'null' and 'undefined' from the type. 
        console.log(container.value);
        container.value *= factor;
    }
}

// => The in operator
// JavaScript has an operator for determining if an object or its prototype chain has a property with a name: the in operator. e.g;

type Fish = { swim: () => void };
type Bird = { fly: () => void };
 
// function move(animal: Fish | Bird) {
//   if ("swim" in animal) {
//     return animal.swim();
//   }
 
//   return animal.fly();
// }

// one example with the oprional property
//fish and bird alias already there add Human

type Human = { swim?: () => void, fish?: () => void };

function move (animal: Fish | Bird | Human){
  if("swim" in animal){
    return animal;
  }else{
    return animal;
  }
}

// => Instanceof Narrowing
function logValue (x: Date | string){
  if(x instanceof Date){
    console.log(x.toUTCString());
  } else{
    console.log(x.toUpperCase());
  }
}

// => Assignments
// When we assign to any variable, TypeScript looks at the right side of the assignment and narrows the left side appropriately.
let x = Math.random() < 0.5 ? 10 : "Hello World";
x=1;
console.log(x);

x= "Good Bye";
console.log(x);

//If we’d assigned a boolean to x, we’d have seen an error since that wasn’t part of the declared type.
//x=true;
console.log(x);

// => Control Flow Analysis

/*
Let's take this function
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}
- padLeft returns from within its first if block.
- TypeScript was able to analyze this code and see that the rest of the body (return padding + input;) is unreachable in the case where padding is a number.
- As a result, it was able to remove number from the type of padding (narrowing from string | number to string) for the rest of the function.

- This analysis of code based on reachability is called control flow analysis and
- TypeScript uses this flow analysis to narrow types as it encounters type guards and assignments. 
- When a variable is analyzed, control flow can split off and re-merge over and over again, and that variable can be observed to have a different type at each point.
e.g;
*/
function example1(){
let x: string | number | boolean;
x= Math.random() < 0.5
console.log(x);

if(Math.random() < 0.5){
  x = "hello world";
  console.log(x);
}
else{
  x = 100;
  console.log(x);
}
return x;
}

// ==> Type Predicates

//Type predicates are functions that return a boolean and help TypeScript understand what type a value is.
// Basic Syntax
function isString(value: unknown): value is string {
  return typeof value === "string";
}
//The key part is `value is string` - this tells TypeScript "if this function returns true, then the parameter is definitely a string."
// Example Usage

function processValue(value: unknown) {
  if (isString(value)) {
    // TypeScript now knows value is string here!
    console.log(value.toUpperCase()); // Works
    console.log(value.length);        // Works
  } else {
    // TypeScript knows value is NOT string here
    console.log(value); // Still unknown type
  }
}

// More Complex Type Predicates:
interface User {
  name: string;
  email: string;
}

interface Admin {
  name: string;
  permissions: string[];
}

// Type predicate for custom types
function isAdmin(user: User | Admin): user is Admin {
  return 'permissions' in user;
}

function handleUser(user: User | Admin) {
  if (isAdmin(user)) {
    // TypeScript knows user is Admin
    console.log(user.permissions); // Works
  } else {
    // TypeScript knows user is User
    console.log(user.email); // Works
  }
}

// Array Filtering with Type Predicates:

const mixedArray: (string | number | null)[] = ["hello", 42, null, "world", 0];

// Filter out null values and narrow the type
const validValues = mixedArray.filter((item): item is string | number => 
  item !== null
);

// validValues is now (string | number)[] - no null!
validValues.forEach(value => {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
});

// ==> Assertion Function

//Assertion functions **throw an error** if a condition isn't met, and tell TypeScript to narrow the type if the function returns normally.

// Basic Syntax:
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Expected string!");
  }
}
// The key part is `asserts value is string` - this tells TypeScript "if this function returns (doesn't throw), then the parameter is definitely a string."

//Example Usage:
function processUnknownValue(value: unknown) {
  assertIsString(value);
  
  // After the assertion, TypeScript knows value is string!
  console.log(value.toUpperCase()); // Works
  console.log(value.length);        // Works
  // No need for if/else - if we get here, it's definitely a string
}

// Usage
try {
  processUnknownValue("hello"); // Works fine
  processUnknownValue(42);      // Throws error
} catch (error) {
  console.log("Not a string!");
}

// Node.js Style Assertions:

function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

function divide(a: number, b: number): number {
  assert(b !== 0, "Cannot divide by zero");
  
  // TypeScript knows b is not 0 here (truthy)
  return a / b;
}

// More Complex Assertion Functions:
function assertIsUser(value: unknown): asserts value is User {
  if (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "email" in value &&
    typeof (value as any).name === "string" &&
    typeof (value as any).email === "string"
  ) {
    return; // All good
  }
  throw new Error("Not a valid User object");
}

function handleApiResponse(response: unknown) {
  assertIsUser(response);
  
  // TypeScript knows response is User here
  console.log(`Hello ${response.name}!`);
  console.log(`Email: ${response.email}`);
}

//Real-World Example:
// Type predicate for optional handling
function isValidEmail(email: string | null): email is string {
  return email !== null && email.includes("@");
}

// Assertion function for required validation
function assertValidEmail(email: string | null): asserts email is string {
  if (!email || !email.includes("@")) {
    throw new Error("Invalid email address");
  }
}

// Usage
function sendEmail(email: string | null) {
  // Option 1: Handle both cases
  if (isValidEmail(email)) {
    console.log(`Sending to ${email}`);
  } else {
    console.log("No valid email provided");
  }
  
  // Option 2: Fail fast
  assertValidEmail(email);
  console.log(`Sending to ${email}`); // email is definitely string here
}

// ==> The never type and Exhaustiveness Checking
/*
- When narrowing, you can reduce the options of a union to a point where you have removed all possibilities and have nothing left. In those cases, TypeScript will use a never type to represent a state which shouldn’t exist.
- The never type is assignable to every type; however, no type is assignable to never (except never itself).
- This means you can use narrowing and rely on never turning up to do exhaustive checking in a switch statement.
- For example, adding a default to our getArea function which tries to assign the shape to never will not raise an error when every possible case has been handled.
*/

interface Circle{
  kind: "circle";
  radius: number;
}

interface Square{
  kind: "square";
  sideLength: number;
}

// interface Triangle{
//   kind: "triangle";
//   sideLength: number;
// }

//type Shape = Circle | Square | Triangle;
type Shape = Circle | Square;

function getArea(shape: Shape){
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      //Type 'Triangle' is not assignable to type 'never'.
      return _exhaustiveCheck;
  }
}

// Adding a new member to the Shape union, will cause a TypeScript error: Line 368, 373