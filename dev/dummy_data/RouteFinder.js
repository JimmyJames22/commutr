const fs = require("fs");

let student_raw = fs.readFileSync("./data/student.json");
let driver_raw = fs.readFileSync("./data/driver.json");
let school_raw = fs.readFileSync("./data/school.json");

let student_data = JSON.parse(student_raw);
let driver_data = JSON.parse(driver_raw);
let school_data = JSON.parse(school_raw);

let dist;
let i;
let j;

class User {
  constructor(user){
    this.x = user.x
    this.y = user.y
    this.firstname = user.firstname
    this.lastname = user.lastname
    this.class_year = user.class_year
    this.email = user.email
    this.phone = user.phone
    this.uid = user.uid
    this.distances = 
  }
}

const recursion = (dist) => {
  
}

const findRoutes = () => {
  for (i = 0; i < driver_data.length; i++) {
    let driver = driver[i]
    dist = Math.sqrt(Math.pow((driver.x - school_data.x), 2) + Math.pow((driver.y - school_data.y), 2)
    recursion(dist, 0, driver.car_capacity, [])
  }
};

findRoutes();
