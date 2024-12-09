//position of sun/moon is based on user time
//press s or S for auto mode 
let angle = 0;
let radius = 145; //arc radius
let hillHeight = 100; 
let hillWidth = 400;
let hillColor;
let lightGreen, darkGreen;
let dayColor, nightColor,midDayColor,afterSunRiseColor,sunSetColor,sunRiseColor;
let sunX, sunY, moonX, moonY;
let sunDiameter = 100;
let moonDiameter = 50;
let sunColor;
let skyColor;
let timeInMinutes = 0;
let autoMode = false;  //for auto mode
let hr = 0;
let mn = 0;
let starY,starX,starBrightness,starSpeed;
let cloudsArray = [];  
let numClouds = 3;     
let cloudSpeed = 0.01; 
let starsArray = [];

function setup() {
  createCanvas(450, 500);    
  lightGreen = color(144, 238, 144);  
  darkGreen = color(0,41,0); 
  nightColor = color(30)// nighttime sky
  sunRiseColor = color(205,98,152)//color(255, 83, 73);// 4am
  endSunRiseColor = color(255, 255, 0);  // 5:59am 
  midDayColor = color(135,206,250);//very light blue
  afterSunRiseColor = color(173, 216, 230); //sky blue
  sunSetColor = color(255, 102, 0);  // 12pm-6pm
  
  for (let i = 0; i < numClouds; i++) {
    cloudsArray.push({
      x: random(-100, width),     
      y: random(200, height/2), 
      speed: random(0.05, 0.2)       
    });
  }

  for (let i = 0; i < 200; i++) {
    starsArray.push({ x: random(width), y: random(height) });
  }
}

function draw() {
  if (autoMode) {
    //auto mode values for mn and hr
    mn++;
    if (mn >= 60) {
      mn = 0;
      hr++;
    }
    if (hr >= 24) {
      hr = 0;
    }
  } else {
    //use realtime
    hr = hour();
    mn = minute();
  }
  
   timeInMinutes = hr * 60 + mn; 
  let totalDayTimeMinutes = 14 * 60; //minutes from 4am to 6pm
  let totalNightTimeMinutes = 10 * 60; //minutes from 6pm to 4am
  let sunMinutes= (hr - 6) * 60 + mn;  
  
  
  //mapping the sun's position in the sky
  sunX = map(sunMinutes, 0, totalDayTimeMinutes, 0, width);
  let maxY = height - 60; //lowest point (sunrise/sunset)
  let minY = 50; //highest point (noon)
  sunY = map(sin(PI * sunMinutes / totalDayTimeMinutes), -1, 1, maxY, minY);
  
  skyColor = nightColor;
  background(skyColor);
  
 
  if (hr >= 4 && hr <= 18) {
  //sun is above the horizon
  sunX = map(sunMinutes, 0, totalDayTimeMinutes, 0, width + 90);
  sunY = map(sin(PI * sunMinutes / totalDayTimeMinutes), -1, 1, maxY, minY);
} else if (hr > 18 || hr < 6) {
  sunY += 5;  //slowly move it downward out of view
}
  let moonMinutes; 
  if (hr >= 18) {
    //time after 6 PM to midnight 
    moonMinutes = (hr - 18) * 60 + mn;
  } else {
    //time after midnight to 6 AM 
    moonMinutes = (hr + 6) * 60 + mn; 
  }
  

  //sky color changing logic based on time
  if( (hr >= 4) && (hr <= 11 ) ){
    skyColor = lerpColor(sunRiseColor, afterSunRiseColor, timeInMinutes/(11*60 + 59));
    //skyColor = lerpColor(color(205,98,152), midDayColor, timeInMinutes/(11*60 + 59)); 
  }
  else if( (hr > 11) && (hr <= 15)) {
    skyColor = lerpColor(afterSunRiseColor, midDayColor, timeInMinutes/(11*60 + 59));
    //skyColor = lerpColor(midDayColor, midDayColor, timeInMinutes/(11*60 + 59)); 
  }
  else if( (hr >= 16) && (hr <= 18)) {
    skyColor = lerpColor(midDayColor, color(248, 152, 128),timeInMinutes/(17*60 + 59));
  }
  else {
    skyColor = nightColor;  
  }
  background(skyColor);

  

  if ((hr >= 4) && (hr <= 18)) {
    sunColor = lerpColor(color("orange"), color("yellow"), map(timeInMinutes, 0, totalDayTimeMinutes / 2, 0, 1));
    fill(sunColor);
    noStroke();
    ellipse(sunX, sunY, sunDiameter);
    noStroke();
    fill(lerpColor(color("white"),color('grey'),timeInMinutes/(24*60)));
  } 
  else {
    fill(255,255,191);
    moonX = map(moonMinutes, 0, totalNightTimeMinutes, -100, width+40);
    moonY = map(sin(PI * moonMinutes / totalNightTimeMinutes), -1, 1, maxY, minY);
    ellipse(moonX, moonY, moonDiameter);
    stars();
  }
  
  if(timeInMinutes>= 4*60 && timeInMinutes<=19*60){
    fill(color("white"));
  }
  else{
    fill(color(105,105,105));
  }
  cloudMovement();

  //hill color and shape
  if (hr >= 4 && hr <= 18) {
    hillColor = lerpColor(lightGreen, color(26,102,46), map(timeInMinutes, 0, totalDayTimeMinutes, 0, 1));
  } else {
    stroke(1,50,32);
    hillColor = color(1,50,32);
  }
  fill(hillColor);
  beginShape();
  vertex(0, height);
  for (let x = 0; x <= width; x++) {
    
    let halfwayPoint = width / 2;
  // moves multiplier from 1 to 1.5 as x goes from 0 to halfwayPoint
  let multiplier = map(x, halfwayPoint, width, 1, 1.5); 

  let y = height - hillHeight - sin(TWO_PI * x / hillWidth) * hillHeight * multiplier;
  vertex(x, y);
    
  }
  vertex(width, height);
  endShape(CLOSE);
  
  


}

//triggers automode
function keyPressed() {
  if (key === 's' || key === 'S') {
    autoMode = !autoMode;  
  }
}


function stars() {
  let t = random(PI);
  for (let star of starsArray) {
    let starBrightness = random(100, 255); // twinkle effect
    fill(255, 255, 255, starBrightness);
    noStroke();
    ellipse(star.x, star.y, random(0.25, 3));
  }
}

function clouds(someX,someY){
  noStroke();
  ellipse(someX+5,someY-20,70,50);
  ellipse(someX-10,someY-10,70,50);
  ellipse(someX+20,someY-10,70,50); 
}

function cloudMovement() {
  for (let cloud of cloudsArray) {
    cloud.x += cloud.speed;  

    //when it goes off-screen
    if (cloud.x > width + 100) {
      cloud.x = -100;  //start from the left when off the right edge
      cloud.y = random(100,200);  //so it doesn't overlap with hills
    }

    clouds(cloud.x, cloud.y);
  }
}