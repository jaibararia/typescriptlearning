

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
async function getFavouriteNumber(): Promise<number> {
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