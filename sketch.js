

function setup() {
  createCanvas(800, 800);
  
}

function draw() {
  // Here is the most straightforward way to read date and time information
  const d = new Date();
  const month = d.getMonth();
  const date = d.getDate();
  const day =  d.getDay();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();


  console.log(month, date, day, hours, minutes, seconds);

}

