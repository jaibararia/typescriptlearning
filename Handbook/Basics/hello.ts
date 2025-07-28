// this is a output file of hello.ts it was created when we run "npx tsc hello.ts" it gives the output of .ts file

console.log("hello world");

// function greet(person, date){
//     console.log(`Hello ${person}, today is ${date}!`);
// }

//greet("Jai"); // this shows me error that date is not passed in the argument


// "tsc --noEmitOnError hello.ts" This command will stop js file to get updated

// Now let's fix that function

function greet(person: string, date: Date){
    console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Jai", new Date());

//let msg = "Hello Jai"; // Here i didn't tell typscript that this is a string but it able to figure that see when you hover it.

// Erased Types
// function greet(person: string, date: Date) {
//     console.log(`Hello ${person}, today is ${date.toDateString()}!`);
//   }
  
//   greet("Maddison", new Date());


// Downlevling cmd => tsc --target es2015 hello.ts
// Downleveling the process of moving from "newer/higher" version to "older/lower" version. SO we go from ES6 to ES2015

