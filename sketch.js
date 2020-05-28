//creating arrays and variables
var isDrawing = false;
var drawing = [];
var currentPath = [];
var drawingStroke;
var drawColor = 255;
var strokeWeight = 4;
var databases;

function setup() {
  var canvas = createCanvas(800, 800);
 //creating movements
  canvas.mousePressed(startPath);
  canvas.mouseReleased(endPath);
  canvas.parent('canvascontainer');

 // copied firebase configuration from firebase
  var firebaseConfig = {
    apiKey: "AIzaSyBPtvxWGRIwYWDUOQGQRgIQwf0UpiyaQbA",
    authDomain: "shivrealtimecanvas.firebaseapp.com",
    databaseURL: "https://shivrealtimecanvas.firebaseio.com",
    storageBucket: "shivrealtimecanvas.appspot.com",
    messagingSenderId: "83069359641"
     };
//initialising firebase
  firebase.initializeApp(firebaseConfig);
  databases = firebase.database();

  // creating a save button 
  var saveButton = select('#saveButton');
  saveButton.mousePressed(saveDrawing);
   
  //creating a clear button
  var clearButton = select('#clearButton');
  clearButton.mousePressed(clearDrawing);
  var params = getURLParams();
  console.log(params);
  if (params.id) {
    console.log(params.id);
    showDrawing(params.id);
  }

  // writing call back function to monitor changes
  var ref = databases.ref('drawings');
  ref.on('value', gotData, errData);
 
}

//to make drawing visible and creating random various stroke weights and colors
function startPath() {
  isDrawing = true;
  currentPath = [];
  drawingStroke = {
    path: currentPath,
    myColorr: random(0, 255),
    myColorg: random(0, 255),
    myColorb: random(0, 255),
    myWeight: random(1, 10)
  }
 //pushing drawingStroke into drawing array
  drawing.push(drawingStroke);

}
//on mousePressed release turn off the drawing
function endPath() {
  isDrawing = false;
}

function draw() {
  background(0);
  // on mousePresses trace x and y position
  if (isDrawing) {
    var point = {
      x: mouseX,
      y: mouseY

    }
   // pushing var point into currentPath array
      currentPath.push(point);
  }
  noFill();
  //drawing to the canvas
  for (var i = 0; i < drawing.length; i++) {
    var pathobj = drawing[i].path;
    stroke(drawing[i].myColorr, drawing[i].myColorg, drawing[i].myColorb);
    strokeWeight(drawing[i].myWeight);
    beginShape();
    for (var j = 0; j < pathobj.length; j++) {

      vertex(pathobj[j].x, pathobj[j].y);
    }
    endShape();
  }

}

function saveDrawing() {
 //saving drawing to firebase
  var ref = databases.ref('drawings');
  var data = {
    name: 'shivani',
    drawing: drawing
  };
  var result = ref.push(data, dataSent);
  console.log(result.key);

  function dataSent(err, status) {
    console.log(status);
  }
}

function gotData(data) {
 //clear the listing
 var drawingList = selectAll('.listing');
 for (var i = 0; i < drawingList.length; i++) {
    drawingList[i].remove();
 }
// listing the drawings from firebase
 var drawings = data.val();
 var keys = Object.keys(drawings);
 for (var i = 0; i < keys.length; i++) {
   var key = keys[i];
   var li = createElement('li', '');
   li.class('listing');
   var ahref = createA('#', key);
   ahref.mousePressed(showDrawing);
   ahref.parent(li);
   
   var link = createA('?id=' + key, 'DrawingLink');
   link.parent(li);
   link.style('padding', '10px');

   li.parent('drawinglist');
 }

}
function errData(err) {
  console.log(err);
}
//show drawing from database
function showDrawing(key) {
  
  if (key instanceof MouseEvent) {
    key = this.html();
  }

  var ref = databases.ref('drawings/' + key);
  ref.once('value', oneDrawing, errData);

  function oneDrawing(data) {
    var dbdrawing = data.val();
    drawing = dbdrawing.drawing;
    
  }
 
}
function clearDrawing(){
  drawing=[];
}
