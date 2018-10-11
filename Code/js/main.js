var latestLinkArray=[]; //Initialises an empty array of links

//Function to get linkData and return an array of links
function getLinkData(callback) {
  chrome.storage.sync.get("linkData", function(linkObject){
    if (!chrome.runtime.error) {
      for (linkArrayCounter in linkObject) {
        var linkArray = linkObject[linkArrayCounter];
        console.log('Retrieved Link Array - ' + linkArray);
        latestLinkArray = linkArray;
        callback();
        break;
        }
    } else {
      console.log('Error in fetching stored link data.')
    }
  });
}

//Function to add new link to linkArray
function addLink(newLink, callback){
  latestLinkArray = latestLinkArray.concat(newLink);
  console.log(latestLinkArray);
  callback(latestLinkArray, updateLinkList);
}

//Function to delete link
function deleteLink(linkForDeletion, callback){
  latestLinkArray.splice(latestLinkArray.indexOf(linkForDeletion), 1 );
  callback(latestLinkArray, updateLinkList);
}

//Function to update link data store
function updateLinkStore(linkArray, callback){
  chrome.storage.sync.set({'linkData': linkArray}, function() {
  console.log('Link Data Updated - ' + linkArray);
  });
  callback();
}

//Function to update link list
function updateLinkList(){
  console.log('Update Link List');
  clearLinkList();
  for (var linkCounter = 0; linkCounter < latestLinkArray.length; linkCounter++){
    //console.log("#" + linkCounter + "." + latestLinkArray[linkCounter]);
    var link = latestLinkArray[linkCounter];
    var linkList = document.getElementById("myUL")
    var li = document.createElement("LI");
    var linkText = document.createTextNode(link);
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "deleteSource";
    span.appendChild(txt);
    li.appendChild(linkText);
    li.appendChild(span);
    linkList.appendChild(li);
  }
}

//Function to clear link list
function clearLinkList() {
  var linkList = document.getElementById("myUL")
  linkList.innerHTML = '';
}

//Function to update links on page load
document.addEventListener("DOMContentLoaded",updateLinks);
function updateLinks(){
  //chrome.storage.sync.clear();
  getLinkData(updateLinkList);
}


//Script to go to a random link from one of the link sources
document.getElementById("gobutton").addEventListener("click", randomlinks);
function randomlinks(){
  getLinkData(updateLinkList);
  var links = latestLinkArray;
  var numberOfLinks = latestLinkArray.length;
  var myrandom=Math.round(Math.random()*(numberOfLinks-1));
  if (numberOfLinks > 0){
    url = links[myrandom];
    /*if (!url.match(/^http?:\/\//i) || !url.match(/^https?:\/\//i)) {
        url = 'http://' + url;
    }*/
    if (!(url.indexOf("http://") == 0 || url.indexOf("https://") == 0)) {
        url = 'https://' + url;
    }
    window.open(url,"_blank");
  } else {
    alert ('You have not entered a source yet!')
  }
}

//Script for AddLinks Modal
document.getElementById("img-add-button").addEventListener("click", addLinkSources);
function addLinkSources(){
  // Get the modal
  var modal = document.getElementById('add-links-modal');
  // Get the <span> element that closes the modal
  var span = modal.getElementsByClassName("close")[0];
  // Display the modal
  modal.style.display = "block";
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
  }
}

var classname = document.getElementsByClassName("classname");
for(i=0;i<classname.length;i++){
classname[i].addEventListener('click', myFunction, false);
}

// Click on a close button to hide the current list item
document.addEventListener('click', function (event) {

	// If the clicked element doesn't have the right selector, bail
	if (!event.target.matches('.deleteSource')) {
    return;
  } else {
      var linkForDeletion = event.target.parentElement.childNodes[0].nodeValue;
      console.log(linkForDeletion);
      deleteLink(linkForDeletion, updateLinkStore);
  }
	// Don't follow the link
	event.preventDefault();
}, false);



// Create a new list item when clicking on the "Add" button
var input = document.getElementById("sourceInput");
input.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        saveElement();
    }
});

function saveElement() {
  var inputValue = document.getElementById("sourceInput").value;
  if (inputValue === '') {
    alert("You must write something!");
  } else {
      addLink(inputValue, updateLinkStore);
      document.getElementById("sourceInput").value = "";

    }
}

document.getElementById("info-text").addEventListener("click", openInfoModal);
function openInfoModal(){
  // Get the modal
  var modal = document.getElementById('info-modal');
  // Get the <span> element that closes the modal
  var span = modal.getElementsByClassName("close")[0];
  // Display the modal
  modal.style.display = "block";
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
  }
}
