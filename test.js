// Create an Object
const person = {
    name: "John",
    age: 30,
    city: "New York"
};

// Build a Text
let text = "";
for (let x in person) {
    text += person[x] + " "
};

// Display the Text
console.log(text)