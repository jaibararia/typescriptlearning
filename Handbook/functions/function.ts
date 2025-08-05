// => Function Type Expressions - e.g;
function greeter( fn: (a: string) => void ){
    fn("Hello World");
}

function printToConsoles(s: string){
    console.log(s);
}

greeter(printToConsoles);

/*
- The syntax (a: string) => void means “a function with one parameter, named a, of type string, that doesn’t have a return value”.
- Just like with function declarations, if a parameter type isn’t specified, it’s implicitly any.
- Note that the parameter name is required. The function type (string) => void means “a function with a parameter named string of type any“!

-we can use a type alias to name a function type: e.g;
*/
type GreetFunction = (a: string) => void;
function greeter1(fn: GreetFunction){
    //.....
}

// => Call Signatures
type DescriableFunction = {
    description: string;
    (somArgs: number): boolean;
};

function doSomething(fn: DescriableFunction) {
    console.log(fn.description + " returned " + fn(6));
}

function myFunc(someArgs: number){
    return someArgs > 3;
}

myFunc.description = "default description";
doSomething(myFunc);

// => Construct Signature
//JavaScript functions can also be invoked with the new operator. TypeScript refers to these as constructors because they usually create a new object. You can write a construct signature by adding the new keyword in front of a call signature:
type SomeObject = any;
type SomeConstructor = {
    new(s: string): SomeObject;
};
function fn(ctor: SomeConstructor){
    return new ctor("hello");
}

// => Generic Function
// In TypeScript, generics are used when we want to describe a correspondence between two values. We do this by declaring a type parameter in the function signature:
function firstElement<Type>(arr: Type[]): Type | undefined{
    return arr[0];
}

// By adding a type parameter Type to this function and using it in two places, we’ve created a link between the input of the function (the array) and the output (the return value). 
// Now when we call it, a more specific type comes out:
// s is of type 'string'
const s = firstElement(["a", "b", "c"]);
// n is of type 'number'
const n = firstElement([1, 2, 3]);
// u is of type undefined
const u = firstElement([]);

// => Inference
// Note that we didn’t have to specify Type in this sample. The type was inferred - chosen automatically - by TypeScript.

function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[]{
    return arr.map(func);
}

const result1 = map([1, 2, 3], x => x * 2);
// Input is number and output is also number

const numbers = map(["1", "2", "3"], (str) => parseInt(str));
//                   ↑              ↑
//              Input = string   Output = number
// Result: numbers is number[]

const users = [
    { name: "Pluto", age: 30 },
    { name: "North NO. 2", age: "30" }
];

const names = map(users, (user) => user.name);
//                ↑           ↑
//        Input = {name: string, age: number}   Output = string
// Result: names is string[]

// COmplex Example

interface Person {
    name: string,
    age: number
}

interface PersonSummary {
    summary: string,
}

const people: Person[] = [
    { name: "Alice", age: 30 },
    { name: "Bob", age: 25 }
  ];

  // TypeScript infers:
// Input = Person
// Output = PersonSummary
const summaries = map(people, (person) => ({
    summary: `${person.name} is ${person.age} years old.`
}));

// summaries is PersonSummary[]


// => COnstraints
/*
- We’ve written some generic functions that can work on any kind of value. 
- Sometimes we want to relate two values, but can only operate on a certain subset of values.
- In this case, we can use a constraint to limit the kinds of types that a type parameter can accept.
*/

// Basic Syntax
// function example<T extends SomeTypes>(param: T): T{
    // T must be SomeType or extend/implement SomeType
    //console.log(param);
// }

function getLength<T extends {length: number}>(item: T): number{
    return item.length;
}
// ✅ These work:
getLength("hello");        // string has length
getLength([1, 2, 3]);      // array has length
getLength({ length: 5 });  // object with length property

// ❌ These don't work:
// getLength(42);             // Error: number doesn't have length
// getLength(true);           // Error: boolean doesn't have length

// Example 2
interface Identifiable {
    id: number;
};

// Constraint: T must have an id property
function updateEntity<T extends Identifiable>(entity: T, charges: Partial<T>): T{
    return {...entity, ...charges};
}
// Partial<T> this will make all the properties in T optional and assign it to charges.
// ✅ Works:
const user = { id: 1, name: "Alice", email: "alice@example.com" };
const updatedUser = updateEntity(user, { name: "Alice Smith" });

// ❌ Error: missing id property
const invalid = { name: "Bob" };
//updateEntity(invalid, { name: "Robert" }); // Error!

// Example 3
// Constraint: K must be a key of T
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
  }
  
  const person = {
    name: "Alice",
    age: 30,
    email: "alice@example.com"
  };
  
  // ✅ These work:
  const nam = getProperty(person, "name");     // string
  const age = getProperty(person, "age");       // number
  const email = getProperty(person, "email");   // string
  
  // ❌ This doesn't work:
  //const invalid = getProperty(person, "salary"); // Error: 'salary' doesn't exist on person

//Example 4

// T must extend string, number, or boolean
function stringify<T extends string | number | boolean>(value: T): string {
    return String(value);
  }
  
  // ✅ These work:
  stringify("hello");    // string
  stringify(42);         // number  
  stringify(true);       // boolean
  
  // ❌ These don't:
//  stringify({});         // Error: object not allowed
//  stringify([]);         // Error: array not allowed

// Example 5
// T must be a function
function callTwice<T extends (...args: any[]) => any>(fn: T, ...args: Parameters<T>): ReturnType<T> {
    fn(...args); // Call once
    return fn(...args); // Call twice, return second result
  }
  
  // ✅ Works:
  const add = (a: number, b: number) => a + b;
  const result = callTwice(add, 5, 3); // 8 (calls add(5, 3) twice)
  
  // ❌ Error: not a function
  //callTwice("hello", 1, 2); // Error!



/*
- **`Parameters<T>`**: This is a **built-in TypeScript Utility Type**.

- It takes a function type `T` (which we know `fn` is) and **extracts the types of its parameters** as a tuple.
- Example: If `T` is `(a: number, b: string) => boolean`, then `Parameters<T>` would be `[number, string]`.
- This ensures that the `...args` you pass to `callTwice` perfectly match the expected arguments of the `fn` function.
*/

/*
  **`ReturnType<T>`**: This is another **built-in TypeScript Utility Type**.

- It takes a function type `T` and **extracts the type of its return value**.
- Example: If `T` is `(a: number, b: string) => boolean`, then `ReturnType<T>` would be `boolean`.
- This ensures that `callTwice` correctly declares the type of the value it will return (which is the return value of the *second* call to `fn`).
*/

// => Guidlines for wrting Good Generic Functions

// -> Push Type Parameter Down
function firstElement2<Type>(arr: Type[]){
    return arr[0];
}

function secondElement2<Type extends any[]>(arr: Type){
    return arr[0];
}

const a = firstElement2([1,2,3]);
const b = secondElement2([4,5,6]);

/* Explaination
- These might seem identical at first glance, but firstElement1 is a much better way to write this function.
- Its inferred return type is Type, but firstElement2’s inferred return type is any because 
- TypeScript has to resolve the arr[0] expression using the constraint type, rather than “waiting” to resolve the element during a call.

- Rule: When possible, use the type parameter itself rather than constraining it
*/

// -> Use Fewer Type Parameters
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
    return arr.filter(func);
  }
   
  function filter2<Type, Func extends (arg: Type) => boolean>(
    arr: Type[],
    func: Func
  ): Type[] {
    return arr.filter(func);
  }
/* Explaination
- We’ve created a type parameter Func that doesn’t relate two values.
- That’s always a red flag, because it means callers wanting to specify type arguments have to manually specify an extra type argument for no reason.
- Func doesn’t do anything but make the function harder to read and reason about!

- Rule: Always use as few type parameters as possible
*/

// -> Type Parameters Should Appear Twice
function greet<Str extends string>(s: Str) {
    console.log("Hello, " + s);
  }
   
  greet("world");

// We could just as easily have written a simpler version:
function greet2(s: string) {
    console.log("Hello, " + s);
  }

/* 
- Remember, type parameters are for relating the types of multiple values.
- If a type parameter is only used once in the function signature, it’s not relating anything. 
- This includes the inferred return type; for example, if Str was part of the inferred return type of greet, 
- it would be relating the argument and return types, so would be used twice despite appearing only once in the written code.

- Rule: If a type parameter only appears in one location, strongly reconsider if you actually need it
*/

// -> Optional Parameters = ?

// -> Function Overloads
// In TypeScript, we can specify a function that can be called in different ways by writing overload signatures. 
// To do this, write some number of function signatures (usually two or more), followed by the body of the function:

function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
// const d3 = makeDate(1, 3); //error

/*
- In this example, we wrote two overloads: one accepting one argument, and another accepting three arguments. 
- These first two signatures are called the overload signatures.
- Then, we wrote a function implementation with a compatible signature.
- Functions have an implementation signature, but this signature can’t be called directly.
- Even though we wrote a function with two optional parameters after the required one, it can’t be called with two parameters!
*/

// -> Overload Signatures and the Implementation Signature
/*
- The signature of the implementation is not visible from the outside. 
- When writing an overloaded function, you should always have two or more signatures above the implementation of the function.

function fn2(x: string): void;
function fn2() {
  // ...
}
fn2();
*/

// -> Writing Good Overloads
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any)
// { return x.length; }
function len(x: any[] | string) {
    return x.length;
}
/*
- This function is fine; we can invoke it with strings or arrays.
- However, we can’t invoke it with a value that might be a string or an array,
- because TypeScript can only resolve a function call to a single overload:
*/
len(""); // OK
len([0]); // OK
len(Math.random() > 0.5 ? "hello" : [0]); 
// this will showw error because no overload match this call.
// For this we can define the function like this check line 334
// After doing changes in we are able to run this call

// Rule - Always prefer parameters with union types instead of overloads when possible

// Declare "this" in the function

const user2 = {
    id: 123,
   
    admin: false,
    becomeAdmin: function () {
      this.admin = true;
    },
  };

/*
- TypeScript understands that the function user.becomeAdmin has a corresponding this which is the outer object user.this,
- can be enough for a lot of cases, but there are a lot of cases where you need more control over what object this represents.
- The JavaScript specification states that you cannot have a parameter called this, and so TypeScript uses that syntax space to let you declare the type for this in the function body.
*/

interface User {
    id: number;
    admin: boolean;
  }
  declare const getDB: () => DB;
  // ---cut---
  interface DB {
    filterUsers(filter: (this: User) => boolean): User[];
  }
  
  const db = getDB();
  const admins = db.filterUsers(function (this: User) {
    return this.admin;
  });
// This pattern is common with callback-style APIs, where another object typically controls when your function is called.
// Note that you need to use function and not arrow functions to get this behavior:

const admins2 = db.filterUsers(() => this.admin); // by using arrow function "this" converted into 'typeof globalThis' which has no index signature.

// => Other Types to Know About

// -> void
// - void represents the return value of functions which don’t return a value.
// - t’s the inferred type any time a function doesn’t have any return statements, or doesn’t return any explicit value from those return statements
// The inferred return type is void
function noop() {
    return;
  }
// In JavaScript, a function that doesn’t return any value will implicitly return the value undefined
// Note - In typescript void is not the same as undefined.

// => object
/*
- The special type object refers to any value that isn’t a primitive (string, number, bigint, boolean, symbol, null, or undefined). 
- This is different from the empty object type { }, and also different from the global type Object.
- It’s very likely you will never use Object.
- Note: object is not Object. Always use object!
- Note that in JavaScript, function values are objects: They have properties, have Object.prototype in their prototype chain, are instanceof Object, you can call Object.keys on them, and so on.
- For this reason, function types are considered to be objects in TypeScript.
*/

// => unknown
// - The unknown type represents any value. This is similar to the any type, but is safer because it’s not legal to do anything with an unknown value:
function f1(a: any) {
    a.b(); // OK
  }
  function f2(a: unknown) {
   // a.b();
   a;
  }
// - This is useful when describing function types because you can describe functions that accept any value without having any values in your function body.
// - Conversely, you can describe a function that returns a value of unknown type:
declare const someRandomString: string;
function safeParse(s: string): unknown{
    return JSON.parse(s);
}

const obj = safeParse(someRandomString);

// => never
//Some functions never return a value:
function fail(msg: string): never{
    throw new Error(msg)
}
// The never type represents values which are never observed. In a return type, this means that the function throws an exception or terminates execution of the program.

//never also appears when TypeScript determines there’s nothing left in a union.
function fn2(x: string | number) {
    if (typeof x === "string") {
      // do something
    } else if (typeof x === "number") {
      // do something else
    } else {
      x; // has type 'never'!
    }
  }

// => Function
// The global type Function describes properties like bind, call, apply, and others present on all function values in JavaScript.
//  It also has the special property that values of type Function can always be called; these calls return any:
function doSomething2(f: Function) {
    return f(1, 2, 3);
  }
// This is an untyped function call and is generally best avoided because of the unsafe any return type.
// If you need to accept an arbitrary function but don’t intend to call it, the type () => void is generally safer.

// => Rest Parameters and Arguments
// -> Rest Parameters
/*
- In addition to using optional parameters or overloads to make functions that can accept a variety of fixed argument counts, we can also define functions that take an unbounded number of arguments using rest parameters.
- A rest parameter appears after all other parameters, and uses the ... syntax:
*/
function multiply(n: number, ...m: number[]) {
    return m.map((x) => n * x);
  }
  // 'a1' gets value [10, 20, 30, 40]
  const a1 = multiply(10, 1, 2, 3, 4);
// - In TypeScript, the type annotation on these parameters is implicitly any[] instead of any, and any type annotation given must be of the form Array<T> or T[], or a tuple type (which we’ll learn about later).

// -> Rest Arguments
// Conversely, we can provide a variable number of arguments from an iterable object (for example, an array) using the spread syntax. For example, the push method of arrays takes any number of arguments:
const arr1 = [1,2,3];
const arr2 = [4,5,6];
arr1.push(...arr2);

// Note that in general, TypeScript does not assume that arrays are immutable. This can lead to some surprising behavior:
// Inferred type is number[] -- "an array with zero or more numbers",
const args = [8, 5];
// const angle = Math.atan2(...args);
// A spread argument must either have a tuple type or be passed to a rest parameter.ts(2556)

// The best fix for this situation depends a bit on your code, but in general a const context is the most straightforward solution:
// Inferred as 2-length tuple
const args2 = [8, 5] as const;
// OK
const angle = Math.atan2(...args2);

// => Parameter Destructuring
// You can use parameter destructuring to conveniently unpack objects provided as an argument into one or more local variables in the function body. In JavaScript, it looks like this:
// function sum({ a, b, c }) {
//     console.log(a + b + c);
//   }
//   sum({ a: 10, b: 3, c: 9 });

// The type annotation for the object goes after the destructuring syntax:
function sum({ a, b, c }: { a: number; b: number; c: number }) {
    console.log(a + b + c);
}

// This can look a bit verbose, but you can use a named type here as well:
// Same as prior example
type ABC = { a: number; b: number; c: number };
function sum2({ a, b, c }: ABC) {
  console.log(a + b + c);
}

// => Assignability of Functions
// -> Return type void
/*
- The void return type for functions can produce some unusual, but expected behavior.
- Contextual typing with a return type of void does not force functions to not return something.
- Another way to say this is a contextual function type with a void return type (type voidFunc = () => void),
- when implemented, can return any other value, but it will be ignored.
- Thus, the following implementations of the type () => void are valid:
*/
type voidFunc = () => void;

const f3: voidFunc = () => {
  return true;
};

const f4: voidFunc = () => true;

const f5: voidFunc = function () {
  return true;
};

const v1 = f3();

const v2 = f4();

const v3 = f5();

// This behavior exists so that the following code is valid even though Array.prototype.push returns a number and the Array.prototype.forEach method expects a function with a return type of void.

const src = [1, 2, 3];
const dst = [0];
 
src.forEach((el) => dst.push(el));

// There is one other special case to be aware of, when a literal function definition has a void return type, that function must not return anything.

function f6(): void {
    // @ts-expect-error
    return true;
  }
   
  const f7 = function (): void {
    // @ts-expect-error
    return true;
  };