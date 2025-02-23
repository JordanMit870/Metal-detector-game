/* metal detector from https://www.eod-gear.com/vallon-vmh4-metal-detector/

  family running from https://imgbin.com/png/FDff1RAG/miami-beach-resort-hotel-family-png
  
  group walking from https://www.seekpng.com/ipng/u2q8w7u2o0t4e6u2_beach-people-png-people-beach-png/
  
  treasure chest from
https://www.theinteriorgallery.com/products_printerfriendly.cfm?PID=5013

sand castle from
https://toppng.com/free-image/big-sand-castle-PNG-free-PNG-Images_117371
  
  */
let angleW = 0;
let inland;
let from;
let to;
let beachColors = ["#7D6D3C", "#9C884B", "#B39F61", "#C2B280"];
let beach;
let mound;
let xb = 0;
let xb2;

//Images
let md; // to hold MetalDetector.png
let people1; //Family
let people2; //group
let chest;
let sandCastle;

let yb;
let yb2;
let sx;
let sy;

let distance;
let hover;

let numMounds = 5;
let sm = [];
let score;

function preload() {
  md = loadImage("MetalDetector.png");
  people1 = loadImage("BeachFamily1-transformed.png");
  people2 = loadImage("groupWalking-transformed.png");
  chest = loadImage("treasurechest-03-transformed.png");
  sandCastle = loadImage("sandCastle-transformed.png");
}

function setup() {
  createCanvas(400, 400);
  textStyle(BOLDITALIC);
  textSize(20);

  from = color(40, 255, 255);
  to = color(15, 82, 186);
  inland = 85;
  xb2 = width + 20;
  beach = new Specks();
  beach.sand();

  // mound = new SandMound(1);

  for (let i = 0; i < numMounds; i++) {
    let a = new SandMound(i + 1);
    sm[i] = a;
  }
  score = 0;

  yb = random(inland, height - inland);
  yb2 = random(inland, height - inland);
  sx = random(width);
  sy = random(inland, height - inland);
}

function draw() {
  sand();
  ocean(inland);

  // mound.show();
  // mound.hotOrCold();
  // score = mound.score()

  for (let i = 0; i < numMounds; i++) {
    sm[i].show();
    sm[i].hotOrCold();
    // score = sm[i].score(); //having issues with it being the total amount
    // score += sm[i].score() //continuesly increases score
  }
  score = sm[0].score()+sm[1].score()+sm[2].score()+sm[3].score()+sm[4].score(); //Will error out if i change the size of sm
  push();
  fill(255, 215, 0);
  text("Number of chests found: " + score, 100, 20);
  pop();

  push();
  imageMode(CENTER);
  image(md, mouseX, mouseY, 60, 60);
  pop();

  decoration();
}

function decoration() {
  image(sandCastle, sx, sy, 45, 45);
  people();
}
function people() {
  beachFamily();
  beachGroup();
}
function beachFamily() {
  image(people1, xb, yb, 200, 100);
  xb += 2;
  if (xb > width + 10) {
    xb = -120;
    yb = random(inland, height - inland);
  }
}
function beachGroup() {
  image(people2, xb2, yb2, 100, 100);
  xb2 -= 2;
  if (xb2 < -100) {
    xb2 = width + 20;
    yb2 = random(inland, height - inland);
  }
}

function ocean(inland) {
  //how close the waves are to the shore
  waves(inland + 5, "#B39F61"); //wet sand layer
  for (let i = inland; i >= -35; i -= 10) {
    waves(i, lerpColor(to, from, i * 0.01));
  }
}

function waves(y, color) {
  let s1;
  let offset = 0.4;
  let y1;

  angleW += 0.04;

  for (let x = 0; x < width; x++) {
    s1 = sin(angleW + x / 100); //this one looks more accuret
    // s1 = sin(angleW+x/30) //looks nicer though...
    // s1 = sin(angleW+x*2)// looks interesting
    // s1 = sin(angleW)// og
    y1 = map(s1, -1, 1, y, y + 30);
    push();
    fill(color);

    noStroke();
    circle(x + x * 10, y1 + 10, 20);
    pop();
  }
}

function sand() {
  background("#D1C59F");
  beach.show();
}
function Specks() {
  //parameters
  this.x = [];
  this.y = [];
  this.color = [];

  //functions
  this.sand = function () {
    for (let i = 0; i < 10000; i++) {
      this.x[i] = random(width);
      this.y[i] = random(height);
      this.color[i] = random(beachColors);
    }
  };
  this.show = function () {
    for (let i = 0; i < this.x.length; i++) {
      stroke(this.color[i]);
      point(this.x[i], this.y[i]);
    }
  };
}
function SandMound(sandMound) {
  //amount of hills, distance of water
  //make one because of hover function. then make an array to hold the rest

  //parameters
  this.x = random(20, width - 20);
  this.y = random(inland + 50, height);
  this.s = 1; //for scaling the sand mound
  this.time = 50;
  this.chests = 0; //score

  this.color = color("#9C884B");
  this.center = 40;

  //functions
  this.hotOrCold = function () {
    this.distance = dist(this.x, this.y, mouseX, mouseY);
    this.warm = 70;
    this.cold = 90;
    this.hot = 30;

    this.hover = this.distance < this.hot;
    fill(this.color);

    if (this.hover == true && mouseIsPressed == true) {
      //Finally fixed it
      print("You found treasure!");
      this.x = random(20, width - 20);
      this.y = random(inland + 50, height);
    } else if (this.hover == true) {
      print("Beep beep!!");
      // fill("red");
    } else if (this.distance < this.warm) {
      // fill("blue");
      print("Beep");
      this.s += 0.1;
      if (this.s > 1.5) {
        this.s = 1.5;
      }
    } else if (this.distance > this.cold) {
      // fill("green")
      this.s -= 0.1;
      if (this.s < 0.5) {
        this.s = 0.5;
      }
    } else {
      console.log(
        "Distance from treasure " +
          sandMound +
          " is " +
          round(this.distance) +
          " feet"
      );
      fill(this.color);
    }

    //Do I actually want it invisable and for them to use the numbers? It will actaully be a challenge and may be a bit more fun. Unless they have to navigate 5 at a time...
    push();
    translate(this.x, this.y);
    scale(this.s);
    arc(0, 0, this.center, 50, PI, PI * 2, CHORD);
    pop();
  };

  this.show = function () {
    push();
    fill(255, 215, 0);
    // text("Number of chests found: " + this.chests + " (inside)", 100, 40);
    pop();

    if (this.hover == true && mouseIsPressed == true) {
      for (let i = 0; i < this.time; i += 0.01) {
        push();
        translate(this.x, this.y);
        imageMode(CENTER);
        image(chest, 0, 0, 50, 50);
        pop();
      }
      this.chests++;
    }
  };

  this.score = function () {
    return this.chests;
  };
}
