
// With TypeScript, you can create complex types by combining simple ones. There are two types for this
//  ====== 1. Unions ==========
// => With a union, you can declare that a type could be one of many types.
type MyBool = true | false; //descrbing boolean type as true or false

//Union provides a way to handle different types too
function getLength(obj: string | string[]){
    return obj.length;
}

// To learn the type we can use typeof

function wrapinArray(obj: string | string[]){
    if(typeof obj === 'string'){
        return [obj];
    }
    return obj;
}

// ====== 2. Generics =========

// Generics provide variables to types
type StringArray = Array<string>;
type NumberArray = Array<number>;
type ObjectWithNameArray = Array<{ name: string }>;

// You can declare your own types that use generics:
interface Backpack<Type> {
    add: (obj: Type) => void;
    get: () => Type;
  }

// This line is a shortcut to tell TypeScript there is a
// constant called `backpack`, and to not worry about where it came from.
declare const backpack: Backpack<string>;
 
// object is a string, because we declared it above as the variable part of Backpack.
const object = backpack.get();


// ===== Structural Typing =====
//One of TypeScript’s core principles is that type checking focuses on the shape that values have. This is sometimes called “duck typing” or “structural typing”.

interface Point {
    x: number;
    y: number;
  }
   
function logPoint(p: Point) {
    console.log(`${p.x}, ${p.y}`);
}
   
const point = { x: 12, y: 26 };
logPoint(point);

// the point variable is not declared to be a Point type. 
// However, TypeScript compares the shape of point to the shape of Point in the type-check.

// There is no difference between how classes and objects conform to shapes:
class VirtualPoint {
    x: number;
    y: number;
   
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
  }
   
  const newVPoint = new VirtualPoint(13, 56);
  logPoint(newVPoint);