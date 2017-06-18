//Set current time
function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  // add a zero in front of numbers<10
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('time').innerHTML = h + ":" + m + ":" + s;
  t = setTimeout(function() {
    startTime()
  }, 500);
}
startTime();

//This function is to convert string time to moment variable
function getMomentFromTimeString(str) {
  var t = moment(str, 'HH:mm A');

  if (t.get('hour') < 22)
    t.add('d', 1);

  return t;
}

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCVG-aTPpZHYnXmfzu8sqIMcEbHF6lvgTQ",
  authDomain: "robertobrooks-92eef.firebaseapp.com",
  databaseURL: "https://robertobrooks-92eef.firebaseio.com",
  projectId: "robertobrooks-92eef",
  storageBucket: "robertobrooks-92eef.appspot.com",
  messagingSenderId: "810015357559"
};

// Initialize db with configuration provided
firebase.initializeApp(config);

// Define a variable for the database library
var database = firebase.database();

// This array will store the arrival times
var array = [];

// Get the data from child for each property
var name = firebase.database().ref().child('/name/');
var destination = firebase.database().ref().child('/destination/');
var destination = firebase.database().ref().child('/frequency/');

// Get the value for each train using snapshot
database.ref().on('value', function(snapshot) {
  snapshot.forEach(function(snap) {
    var itemVal = snap.val();
    array.push(itemVal);
  });

  for (i = 0; i < array.length; i++) {
    var newTime = moment(array[i].first, "HH:mm").format("HH:mm");

// Created a while loop to determine the closest time in the future based on the frequency and the start time
    while (moment().format('HH:mm') > newTime) {
      newTime = moment(newTime, "HH:mm").add({
        minutes: array[i].frequency
      }).format('HH:mm');
    }

// Setting the current time
    var timeNow = moment().format("HH:mm");

// Use the custom function to set the closest future train time and current times to moment objects
    var start = getMomentFromTimeString(timeNow); //now
    var end = getMomentFromTimeString(newTime);
// Determine the difference between the next train and the current time
    var timeDiff = end.diff(start, 'minutes');

// Creating the values for each table row/columns
    document.getElementById('table').innerHTML += '<tr id="col' + i + '"></tr>';
    document.getElementById('col' + i).innerHTML += '<td>' + array[i].name + '</td>';
    document.getElementById('col' + i).innerHTML += '<td>' + array[i].destination + '</td>';
    document.getElementById('col' + i).innerHTML += '<td>' + array[i].frequency + '</td>';
    document.getElementById('col' + i).innerHTML += '<td>' + newTime + '</td>';
    document.getElementById('col' + i).innerHTML += '<td>' + timeDiff + '</td>';
  }

});

// Creating the functionality for the submit button
document.getElementById("submit").onclick = function() {
  var trainName = $("#name").val().trim();
  var trainDestination = $("#destination").val().trim();
  var trainFirst = $("#first").val().trim();
  var trainFrequency = $("#frequency").val().trim();

  database.ref().push({
    name: trainName,
    destination: trainDestination,
    first: trainFirst,
    frequency: trainFrequency
  });

  location.reload();

};
