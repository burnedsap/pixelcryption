/*
Attribution
textarea: @lmccart (Github) @kanolab (p5js Editor)
*/
let writeMessage, readMessage;
let readMessageButton, writeMessageButton;
let writeMessageBox;
let imageRead, imageWrite;
let baseCol = 220;
let messageLen = 160;
let InterL, InterSB;

function preload() {
  interL = loadFont('Inter-Light.ttf');
  interSB = loadFont('Inter-SemiBold.ttf');
}

function setup() {
  createCanvas(600, 600);
  pixelDensity(1);

  // textFont(interL);
  writeMessage = createFileInput(handleWrite);
  writeMessage.position(50, 190);
  writeMessage.style('color', color(240));
  readMessage = createFileInput(handleRead);
  readMessage.position(350, 190);
  readMessage.style('color', color(30));
  wFrame();
}

// —————————— Visual Layout —————————— 
function wFrame() {

  //Backgrounds
  background(baseCol);
  noStroke();
  fill(240);
  rect(0, 0, 300, height);
  fill(30);
  rect(300, 0, 300, height);

  //Foreshadowing
  blendMode(DIFFERENCE);
  for (let i = 0; i < 150; i += 1) {
    noStroke();
    fill(255);
    rect(random(width), random(0, 50), 3, 3);
    rect(random(width), random(50, 100), 2, 2);
    rect(random(width), random(100, 170), 1, 1);
  }
  for (let i = 0; i < 150; i += 1) {
    noStroke();
    fill(255);
    rect(random(width), random(580, 600), 3, 3);
    rect(random(width), random(550, 580), 2, 2);
    rect(random(width), random(500, 550), 1, 1);
  }
  blendMode(BLEND);

  textAlign(LEFT);
  //Encrypt
  fill(30);
  textSize(32);
  textFont(interSB);
  text("Encrypt", 50, 110);

  //Decrypt
  fill(230);
  textSize(32);
  textFont(interSB);
  text("Decrypt", 350, 110);
}

// —————————— Write Block —————————— 
function handleWrite(file) {
  print(file);
  textSize(11);
  fill(240);
  noStroke();
  rect(40, 200, 200, 40);
  if (file.type === 'image') {
    imageWrite = loadImage(file.data);
    fill(30);
    textFont(interL);
    text("Upload Sucessful", 50, 230);
    fill(20, 200, 20);
    noStroke();
    ellipse(35, 200, 12, 12);
    writeMessageBox = createElement('textarea');
    writeMessageBox.elt.placeholder = 'write your message here (check length of message!)';
    writeMessageBox.attribute('rows', '9');
    writeMessageBox.position(50, 260);
    writeMessageBox.style('font-family', interL)
    readMessageButton = createButton('Encrypt');
    readMessageButton.style('cursor', 'pointer');
    readMessageButton.style('background-color', color(30));
    readMessageButton.style('color', color(240));
    readMessageButton.style('border', 'none');
    readMessageButton.style('font-family', 'Inter');
    readMessageButton.position(50, 420);
    readMessageButton.mousePressed(writeEngine);
  } else {
    imageWrite = null;
    fill(200, 20, 20);
    noStroke();
    ellipse(35, 200, 12, 12);
    fill(30);
    textFont(interL);
    text("Please upload an image!", 50, 230)
  }

}

function writeEngine() {
  let inputMessage = writeMessageBox.value();
  inputMessage = inputMessage.toLowerCase();
  if (imageWrite) {
    let messageArr = [];
    let imageColArr = [];
    imageWrite.loadPixels();
    for (let x = 0; x < messageLen; x++) {
      for (let y = 0; y < 1; y++) {
        let index = (x + y * messageLen);
        imageColArr[index] = imageWrite.get(x, y);

        messageArr[index] = inputMessage.charAt(index);
        let d;
        for (var i = 0; i < cipher.length; i++) {
          if (messageArr[index] == cipher.charAt(i)) {
            d = i;
            break;
          } else {
            d = 255;
          }
        }
        imageWrite.set(x, y, color(d, imageColArr[index][1], imageColArr[index][2]));
      }
    }

    imageWrite.updatePixels();
    save(imageWrite);
  }
}


// —————————— Read Block —————————— 
function handleRead(file) {
  print(file);
  textSize(12);
  fill(30);
  noStroke();
  rect(340, 200, 200, 40);
  if (file.type === 'image') {
    imageRead = loadImage(file.data);
    fill(20, 200, 20);
    noStroke();
    ellipse(335, 200, 12, 12);
    fill(230);
    textFont(interL);
    text("Upload Sucessful", 350, 230);
    readMessageButton = createButton('Decrypt');
    readMessageButton.position(350, 260);
    readMessageButton.mousePressed(readEngine);
  } else {
    imageRead = null;
    fill(200, 20, 20);
    noStroke();
    ellipse(335, 200, 12, 12);
    fill(230);
    textFont(interL);
    text("Please upload an image!", 350, 230);
  }

}

function readEngine() {
  if (imageRead) {
    let messageArr = [];
    let showMessageArr = [];
    for (let x = 0; x < messageLen; x++) {
      for (let y = 0; y < 1; y++) {
        let index = (x + y * messageLen);
        messageArr[index] = imageRead.get(x, y);
        if (messageArr[index][0] == 255) {
          showMessageArr[index] = "";
        } else {
          showMessageArr[index] = cipher.charAt(messageArr[index][0]);
        }
      }
    }
    fill(baseCol);
    noStroke();
    fill(30);
    rect(350, 300, 250, 200);
    fill(240);
    text(join(showMessageArr, ''), 355, 320, 190, 170);
  }
}


// —————————— Cipher —————————— 
let cipher = 'abcdefghijklmnopqrstuvwxyz0123456789.,-?@ '; //255 chars only