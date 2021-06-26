class Puppet {

    constructor(name, age) {
      this.name=name;
      this.age=age;
  
      setTimeout(this.timeoutMethodMethod, 5000);
  
      setTimeout( (event) => {
        console.log(this);
        console.log(event);
        console.log("Set Timeout Arrow Function", this.name);
        console.log("Set Timeout Arrow Function", this.age);
        }, 10000);    
      }
  
    timeoutMethodMethod(event) {
      console.log(this);
      console.log(event);
      console.log("Set Timeout Method Call", this.name);
      console.log("Set Timeout Method Call", this.age);
    }
    
    methodMethod() {
      console.log(this);
      console.log("Straight", this.name);
      console.log("Straight", this.age);
    }
  
  }
  
  
  const person = new Puppet("Harry", 32);
  
  person.methodMethod();
  
  