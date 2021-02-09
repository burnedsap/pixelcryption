let writeMessage, readMessage, writeMessageBox, cipherInputBox;
let imageRead, imageWrite;
let baseCol = 220;
let messageLen = 280; //default length
let cypherInput;
let cipher = [];

function setup() {
    noCanvas();
    loadStrings('cypher.txt', readString);
    writeMessage = createFileInput(handleWrite);
    writeMessageBox = createElement('textarea');
    writeMessageBox.elt.placeholder = 'write your message here (check length of message!)';
    writeMessageBox.attribute('rows', '9');
    writeMessageBox.hide();
    readMessageButton1 = createButton('Encrypt');
    readMessageButton1.hide();
    writeMessageBox.parent('encrypt');
    readMessageButton1.parent('encrypt');
    writeMessage.parent('encrypt');


    readMessage = createFileInput(handleRead);
    readMessageButton2 = createButton('Decrypt');
    readMessageButton2.hide();
    cipherInputBox = createElement('textarea');
    cipherInputBox.elt.placeholder = 'write down the cipher';
    //    cipherInput.attribute('rows', '1');
    cipherInputBox.hide();
    cipherInputBox.parent('decrypt');
    readMessage.parent('decrypt');
    readMessageButton2.parent('decrypt');

    //  wFrame();
}

function readString(result) {
    cypherInput = result[0];
    cipher = split(cypherInput, '');
    cipher = Dshuffle(cipher);
    console.log(cipher);
    //    console.log(cipher);
    //    console.log(FYshuffle(cypher1));
    //    console.log(Dshuffle(cypher1));

}


function handleWrite(file) {
    print(file);

    rect(40, 200, 200, 40);
    if (file.type === 'image') {
        text("Upload Sucessful", 50, 230);
        imageWrite = loadImage(file.data);
        writeMessageBox.show();
        readMessageButton1.show();
        readMessageButton1.mousePressed(writeEngine);
    } else {
        imageWrite = null;
        text("Please upload an image!", 50, 230)
    }
}



function handleRead(file) {
    print(file);

    if (file.type === 'image') {
        imageRead = loadImage(file.data);

        text("Upload Sucessful", 350, 230);
        cipherInputBox.show();
        readMessageButton2.show();
        readMessageButton2.mousePressed(readEngine);
    } else {
        imageRead = null;
        text("Please upload an image!", 350, 230);
    }

}

function writeEngine() {
    let inputMessage = writeMessageBox.value();
    inputMessage = inputMessage.toLowerCase();
    messageLen = inputMessage.length;
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
                    if (messageArr[index] == cipher[i]) {
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
        var h = document.createElement("p") // Create a <h1> element
        //        let message = join(cipher, '');
        var t = document.createTextNode((join(cipher, ''))); // Create a text node
        //        h.parent(t);
        h.appendChild(t);
        document.body.appendChild(h);
    }

}

function readEngine() {
    let cipherInput = cipherInputBox.value();
    cipherInput = cipherInput.toLowerCase();
    if (imageRead) {
        if (cipherInput) {
            let messageArr = [];
            let showMessageArr = [];
            for (let x = 0; x < messageLen; x++) {
                for (let y = 0; y < 1; y++) {
                    let index = (x + y * messageLen);
                    messageArr[index] = imageRead.get(x, y);
                    if (messageArr[index][0] == 255) {
                        showMessageArr[index] = "";
                    } else {
                        showMessageArr[index] = cipherInput.charAt(messageArr[index][0]);
                    }
                }
            }
            text(join(showMessageArr, ''), 355, 320, 190, 170);
            var h = document.createElement("p") // Create a <h1> element
            var t = document.createTextNode((join(showMessageArr, ''))); // Create a text node
            //        h.parent(t);
            h.appendChild(t);
            document.body.appendChild(h);
            //            h.appendChild('decrypt');
        }
    }
}

/*
Attribution
textarea: @lmccart (Github) @kanolab (p5js Editor)
*/


/* Cypher Shuffle Algorithms */

function FYshuffle(array) { //Fisher-Yates (aka Knuth) Shuffle
    //taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function Dshuffle(array) { // Durstenfeld shuffle
    //taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
