// Modal Image Gallery
function onClick(element) {
  document.getElementById("img01").src = element.src;
  document.getElementById("modal01").style.display = "block";
  var captionText = document.getElementById("caption");
  captionText.innerHTML = element.alt;
}


// Toggle between showing and hiding the sidebar when clicking the menu icon
var mySidebar = document.getElementById("mySidebar");

function w3_open() {
  if (mySidebar.style.display === 'block') {
    mySidebar.style.display = 'none';
  } else {
    mySidebar.style.display = 'block';
  }
}

// Close the sidebar with the close button
function w3_close() {
    mySidebar.style.display = "none";
}

function openViz(vizName) {
  var i;
  var x = document.getElementsByClassName("training-viz");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(vizName).style.display = "block";
  plotAllTraining()
}

function openImg(divID) {
  var i;
  var x = document.getElementsByClassName("model-img");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(divID).style.display = "block";
}

function openViz2(vizName) {
  var i;
  var x = document.getElementsByClassName("reddit-viz");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(vizName).style.display = "block";
  plotAllReddit()
}
