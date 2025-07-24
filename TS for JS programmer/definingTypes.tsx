// you can explicitly describes this object shape using an interface declaration


interface User{
name: string;
id: number;
}

interface Sample{
    id: number;
}


const user = {
    name: "Jai",
    id: 3,
};

//You can then declare that a JavaScript object conforms to the shape of your new interface by using syntax like : TypeName after a variable declaration:

const sample : Sample = {
    id: 4,
};

// Typescript also support object - oriented programming, so we can user interface with classes too

class UserAccount {
    name: string;
    id: number;
   
    constructor(name: string, id: number) {
      this.name = name;
      this.id = id;
    }
  }

const testClass : User = new UserAccount("Jai", 1);

//You can use interfaces to annotate parameters and return values to functions:

function deleteUser(user : User){
    // ...
}

function getAdminUser(name: string): void {
    console.log(name);
}