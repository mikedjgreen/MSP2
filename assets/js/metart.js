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
            //console.log("********  JSON response text "+JSON.parse(this.responseText));
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
                document.getElementById("metArtDept").innerHTML += "<p> "+item.departmentId+") "+item.displayName+" </p>";
            });
    });
}

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

function getMetObject(obj) {
    var xhr3 = new XMLHttpRequest();
    xhr3.open("GET",apiMetObject + obj);
    xhr3.send();
    xhr3.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {  
            JSON.parse(this.responseText);
            //console.log("********  JSON response text "+JSON.parse(this.responseText));
        } else {
            console.log("******** state "+ this.readyState +" ******* status " +this.status);
        };
    };
}

function writeObjects() {
    getMetSearch(function(item) {
       var objects = [];
       var total_found;
       total_found = item.total;
       document.getElementById("metArt").innerHTML += "<p> Total found: "+total_found+" </p>";
       objects=item.objectIDs;
       console.dir(objects);
       console.log("**** objects:"+objects);
       for (let arrayindex of objects) {
           document.getElementById("metArt").innerHTML += "<p> "+ getMetObject(arrayindex) +" </p>";
       }
       /*
       objects.forEach(function(item) {
                document.getElementById("metArt").innerHTML += "<p> "+ objects.objectIDs +" </p>";
            });
        */
    });
}

