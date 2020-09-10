// Setting up api portal
const apiMet = "https://collectionapi.metmuseum.org/public/collection/v1/"
const apiMetObject = "https://collectionapi.metmuseum.org/public/collection/v1/objects/"

function getMetDept(cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET",apiMet + "departments");
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {  
            cb(JSON.parse(this.responseText));
            console.log("********  JSON response text "+JSON.parse(this.responseText));
        } else {
            console.log("******** state "+ this.readyState +" ******* status " +this.status);
        };
    };
}

function writeDepts() {
    getMetDept(function(item) {
       var depts = [];
       depts=item.departments;
       depts.forEach(function(item) {
                document.getElementById("metArtDept").innerHTML += item.departmentId+") "+item.displayName+" <br>";
            });
    });
}

/*
function getMet(cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET",apiMet + "objects");
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.dir(this.responseText);
             document.getElementById("metArt").innerHTML = this.responseText;
        } else {
            console.log("******** state "+ this.readyState +" ******* status " +this.status);
        };
    };
}
*/

/*
    MET API search returns
        a listing of all Object IDs for objects 
        that contain the search query 
        within the object’s data.
        The returned query also contains total number of objects found.
*/

var searchCrit1 = "departmentID=11"
var searchCrit2 = "q=sunflower"


function getMetSearch(cb1) {
    var xhr2 = new XMLHttpRequest();
    //xhr2.open("GET",apiMet + "search?departmentID=11&q=sunflower");
    xhr2.open("GET",apiMet + "search?"+searchCrit1+"&"+searchCrit2);
    xhr2.send();
    xhr2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {  
            cb1(JSON.parse(this.responseText));
            //console.log("********  JSON response text "+JSON.parse(this.responseText));
        } else {
            console.log("******** state "+ this.readyState +" ******* status " +this.status);
        };
    };
}

function getMetObject(obj_ID) {
    var foundObjects;
    var xhr3 = new XMLHttpRequest();
    xhr3.open("GET",apiMetObject + obj_ID);
    xhr3.send();
    xhr3.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {  
            foundObjects = JSON.parse(this.responseText);
            //console.log("******** foundObjects "+JSON.stringify(foundObjects) +" ");
            console.log("******** returning "+obj_ID+ ": " + foundObjects.title);
            return JSON.stringify(foundObjects.title);
        } else {
            console.log("******** state "+ this.readyState +" ******* status " +this.status);
        };
    };
}

function writeObjects() {
    getMetSearch(function(item) {
       var objects = [];
       var total_Found;
       var object_Title = "";
       total_Found = item.total;
       document.getElementById("metArt").innerHTML += "<p> Total found: "+total_Found+" </p>";
       objects=item.objectIDs;
       //console.dir(objects);
       //console.log("**** objects:"+objects);
       for (let arrayindex of objects) {
           //document.getElementById("metArt").innerHTML += "<p> "+ getMetObject(arrayindex) +" </p>";
           object_Title = getMetObject(arrayindex);
           console.log("********* objectID: "+arrayindex+" object_Title: "+object_Title);
           document.getElementById("metArt").innerHTML += arrayindex + ": "+ object_Title +" <br>";
       }
       /*
       objects.forEach(function(item) {
                document.getElementById("metArt").innerHTML += "<p> "+ objects.objectIDs +" </p>";
            });
        */
    });
}

