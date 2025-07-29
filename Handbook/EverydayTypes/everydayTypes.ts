

// Type annotation on Variables. e.g;
let myName: string = 'Jai';


// => Fucntions

// Parameter Type Annaotaion. e.g;
function greet(name: string){
    console.log("Hello, " + name.toUpperCase() + "!!");
}

// ** "Even if you don’t have type annotations on your parameters, TypeScript will still check that you passed the right number of arguments."


// Return Type Annotations
function getNumber() : number{
    return 26;
}

// Function which returns promises
async function getFavouriteNumber(): Promise <number> {
    return 26;
}

// Anonymous Functions e.g;

const names = ["zoro", "roronoa", "Jai"];

// Contextual typing for function - parameter s inferred to have type string
names.forEach(function (s) {
    console.log(s.toUpperCase());
  });

// Contextual typing also applies to arrow functions
names.forEach((s) => {
    console.log(s.toUpperCase());
  });

//Even though the parameter s didn’t have a type annotation, TypeScript used the types of the forEach function, along with the inferred type of the array, to determine the type s will have.
//This process is called contextual typing because the context that the function occurred within informs what type it should have.

// Object Types. e.g;
// The parameter's type annotation is an object type
function printCoord(pt: {x:number, y:number}){
    console.log ("The coordinates of value x are" + pt.x);
    console.log ("The Coordinates of y are" + pt.y);
}
printCoord({ x: 3.788899999, y: 7908 });

// Optional Properties =>
// Object types can also specify that some or all of their properties are optional. To do this, add a ? after the property name: e.g;
function printName (obj: {first: string, last?: string}){
    console.log (obj.first + obj.last);
}

// Both are OK
printName({ first: "Zoro" });
printName({ first: "Zoro", last: "Roronoa" });

// In JS for non-exist properties, we'll get a "undefined" value not a runtime error.
// For this we have to for undefined when we read the optional property. e.g;

function printName2(obj2: {first: string, last?: string}){
    console.log(obj2.last?.toLowerCase()); //Error - might crash if last is not defined

    if(obj2.last !== undefined){
        console.log(obj2.last?.toLowerCase());
    }

    // A safe alternative using modern JavaScript syntax:
    console.log(obj2.last?.toLowerCase());
}

// => Union Types
// Defining a Union Type
function printID(id: number | string){
    console.log ("Your id is" + id);
}

printID(202); // OK
printID("100"); //OK
//printID({myID: 22}); // Error

// The Separator of the unio member is allowed before the first element. e.g;
function printTextOrNumberOrBool(context: |string |number |boolean){
    console.log(context);
}

// Working with Union Type
// TypeScript only allow operation if it valid for every member of union. e.g;
/*function printID2(id: number | string){
    console.log (id.toUpperCase());
    //we can't do this here because this function only works with string not with the number property.
}*/ // Solution for this we need to "narrow" the union.
//Narrowing occurs when TypeScript can deduce a more specific type for a value based on the structure of the code. e.g;
function printID2(id: number | string){
    if(typeof id === 'string'){
        console.log(id.toUpperCase());
    }else{
        console.log(id);
    }
}
// One e.g; to use a function like "Array.isArray"
function welcomePeople(x: string[] | string) {
    if (Array.isArray(x)) {
      // Here: 'x' is 'string[]'
      console.log("Hello, " + x.join(" and "));
    } else {
      // Here: 'x' is 'string'
      console.log("Welcome lone traveler " + x);
    }
  }

// If all the member of union have something in common then we don't need to use narrow.
// E.g; related to array and string which cna use slice property

// Return type is inferred as number[] | string
function getFirstThree(x: number[] | string) {
    return x.slice(0, 3);
  }

// Types Aliases e.g;

type Point = {
    x: number;
    y: number;
};

/* 
function printCoord(pt: {x:number, y:number}){
    console.log ("The coordinates of value x are" + pt.x);
    console.log ("The Coordinates of y are" + pt.y);
}
printCoord({ x: 3.788899999, y: 7908 }); 
Now in the above function we can also define it like this
function printCoord(pt: Point){.... Rest all can be same}
This will automatically take the types from an Alias
*/

// => Interfaces

//A interface declaration are another way to name an object type

interface Point_1 {
    x: number;
    y: number;
};


// Differences Between Type Aliases and Interfaces
// ** Type aliases and interfaces are very similar, and in many cases you can choose between them freely. Almost all features of an interface are available in type, the key distinction is that a type cannot be re-opened to add new properties vs an interface which is always extendable.
//#Interface e.g; Extending an Interface
interface Animal{
    name: string;
};
interface Bear extends Animal {
    honey: boolean;
}

const bear = getBear();
bear.name;
bear.honey;


// #Type e.g; Extending a type via intersections
type AnimalT = {
    name: string;
};

type BearT = AnimalT & {
    honey: boolean;
}

const bearT = getBearT();
bearT.name;
bearT.honey;

// Interface e.g; Adding new fields to an existing interface
interface Window{
    title: string;
};

interface Window{
    ts: boolean;
};

//const src = 'const a = "Hello World"';
//window.ts.transpileModule(src, {});

// Type e.g; A type cannot be changed after being created
/*type WindowT = {
    title: string;
  }
  
  type WindowT = {
    ts: TypeScriptAPI;
  }
*/
   // Error: Duplicate identifier 'Window'.

// => Type Assertion

// For example, if you’re using document.getElementById, TypeScript only knows that this will return some kind of HTMLElement, but you might know that your page will always have an HTMLCanvasElement with a given ID.
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;

//Like a type annotation, type assertions are removed by the compiler and won’t affect the runtime behavior of your code.

//You can also use the angle-bracket syntax (except if the code is in a .tsx file), which is equivalent: e.g;
const myCanvastsx = <HTMLCanvasElement>document.getElementById("main_canvas");

// **Reminder: Because type assertions are removed at compile-time, there is no runtime checking associated with a type assertion. There won’t be an exception or null generated if the type assertion is wrong. 

//TypeScript only allows type assertions which convert to a more specific or less specific version of a type. This rule prevents “impossible” coercions like:e.g;
// const x = "hello" as number; //see the error by hovering on it

//Sometimes this rule can be too conservative and will disallow more complex coercions that might be valid. If this happens, you can use two assertions, first to any (or unknown), then to the desired type:
declare const expr: any;
type T = { a: 1; b: 2; c: 3 };
const a = expr as any as Point;

// => Literal Types

let changingStirngs = "Hello World";
changingStirngs = "Namaste Duniya";
// Because `changingString` can represent any possible string, that
// is how TypeScript describes it in the type system
changingStirngs;

const constantString = "Hello Planet";
// Because `constantString` can only represent 1 possible string, it
// has a literal type representation
constantString;

let z: "Konichiwa" = "Konichiwa";
z= "Konichiwa"

// Literals with unions
function printText(s: string, alignment: "left" | "right" | "center") {
    // ...
  }
  printText("Hello, world", "left");
  //printText("G'day, mate", "centre"); // This will throw an error because the centre is not assignable to parameter of type

// one with non-literal types
interface Options{
    width: number;
};

function configure(x: Options | "auto"){
    console.log(x);
}

configure({width: 20});
configure("auto");
//configure(100); 
//configure("auto1")

// => Literals Inference
//When you initialize a variable with an object, TypeScript assumes that the properties of that object might change values later. For example, if you wrote code like this: e.g;
const obj = {counter: 0};
if (obj){
    obj.counter = 1;
}
/*
- TypeScript doesn’t assume the assignment of 1 to a field which previously had 0 is an error.
- Another way of saying this is that obj.counter must have the type number, not 0,
- Because types are used to determine both reading and writing behavior.

The same applies to string e.g;
*/
declare function handleRequest(url: string, method: "GET" | "POST"): void;
//const req = {url: "https://xyz.org", method: "GET"};
//handleRequest(req.url, req.method);
// Here req.method is considered as string not the type "GET" i.e; it is throwing an error

// there are 2 ways to resolve this
// 1. You can change the inference by adding a type assertion in either location:
    //change1
    //const req = { url: "https://example.com", method: "GET" as "GET" };
    //change 2
    //handleRequest(req.url, req.method as "GET");
/* 
- Change 1 means “I intend for req.method to always have the literal type "GET"”, preventing the possible assignment of "GUESS" to that field after.
- Change 2 means “I know for other reasons that req.method has the value "GET"“.
*/
// 2. You can use as const to convert the entire object to be type literals: e.g;
    const req = { url: "https://example.com", method: "GET" } as const;
    handleRequest(req.url, req.method);
//  The as const suffix acts like const but for the type system, ensuring that all properties are assigned the literal type instead of a more general version like string or number.

// null and undefined
// We must use strictNullChecks on for better performance and then we have to use narrowing to check for null or undefined value
function doSomething(x: string | null){
    if(x=== null){
        // do nothing
    }else{
        console.log(x);
    }
}

// Non-Null Assertion operator (Postfix !)
/*
- TypeScript also has a special syntax for removing null and undefined from a type without doing any explicit checking. 
- Writing ! after any expression is effectively a type assertion that the value isn’t null or undefined: 
*/
function liveDangerously(x?: number | null) {
    // No error
    console.log(x!.toFixed());
  }

