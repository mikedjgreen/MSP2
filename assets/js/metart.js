// Setting up api portal
const apiMet = "https://collectionapi.metmuseum.org/public/collection/v1/";
const apiMetObject = "https://collectionapi.metmuseum.org/public/collection/v1/objects/";

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
};

function writeDepts() {
    getMetDept(function(item) {
       var depts = [];
       depts=item.departments;
       depts.forEach(function(item) {
                document.getElementById("metArtDept").innerHTML += item.departmentId+") "+item.displayName+" <br>";
            });
    });
};

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

var searchCrit1 = "departmentID=";
var searchCrit2 = "q=sunflower";
var qryStr ="Initial";  // q
var qryHighlight;   // isHighlight
var qryDept;        // departmentId
var qryView;        // isOnView
var qryCult;        // artistOrCulture
var qryMedium;     // medium
var qryImages;       // hasImages
var qryLoc;          // geoLocation
// must have both values for dateBegin and dateEnd queries:
var qryBegin;        // dateBegin
var qryEnd;          // dateEnd



function getMetSearch(cb1) {
    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET",apiMet + "search?"+searchCrit1+"&"+searchCrit2);
    xhr2.send();
    xhr2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {  
            cb1(JSON.parse(this.responseText));
            //console.log("********  JSON response text "+JSON.parse(this.responseText));
        };
    };
};

function getMetObject(obj_ID, cb2) {
 
    var xhr3 = new XMLHttpRequest();
    xhr3.open("GET",apiMetObject + obj_ID);
    xhr3.send();

    xhr3.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {  
            cb2(JSON.parse(this.responseText));
         };
    };
};

function writeCriteria() {
    document.getElementById("metCriteria").innerHTML = "<p> Search criteria: "+searchCrit1+" "+searchCrit2+" </p>";
};

function writeObjects() {
    var objects = [];
    var objectId;
 
    writeCriteria();
    getMetSearch(function(item) {
       var total_Found;
       total_Found = item.total;
       document.getElementById("metArt").innerHTML += "<p> Total found: "+total_Found+" </p>";
       objects=item.objectIDs;
       
       for (objectId of objects) {
           //document.getElementById("metArt").innerHTML += "<p> "+objectId+" </p>";
           writeObjectDetails(objectId);
       };

    });
};

function writeObjectDetails(obj_ID) {
    var objTitle = "";
    var objPrimaryImage ="";
    var objArtistDisplayName ="";
    var objMedium = "";
    var objDept = "";
    var objBegin = "";
    var objEnd = "";
    var objArtistBegin = "";
    var objArtistEnd = "";
    getMetObject(obj_ID,function(item){
        objTitle = item.title;
        objPrimaryImage = item.primaryImageSmall;
        objArtistDisplayName = item.artistDisplayName;
        objMedium = item.medium;
        objDept = item.department;
        objBegin = item.objectBeginDate;
        objEnd = item.objectEndDate;
        objArtistBegin = item.artistBeginDate;
        objArtistEnd = item.artistEndDate;
        document.getElementById("metArt").innerHTML += obj_ID + ": "+ objTitle +" <br>";
        document.getElementById("metArt").innerHTML += "<img src="+ objPrimaryImage +" alt="+objTitle+"\"> <br>";
        document.getElementById("metArt").innerHTML += "artist: " + objArtistDisplayName +" <br>";
        document.getElementById("metArt").innerHTML += "artist birth: " + objArtistBegin +" death: "+objArtistEnd+ "<br>";
        document.getElementById("metArt").innerHTML += "medium: " + objMedium +" <br>";
        document.getElementById("metArt").innerHTML += "department: " + objDept +" <br>";
        document.getElementById("metArt").innerHTML += "object begin date: " + objBegin + " object end date: "+ objEnd + " <br>";
        document.getElementById("metArt").innerHTML += "<hr>";
    });
};

function getSelection() {
    $(document).ready(function(){
        $("#searchBtn").on("click",function() {
            writeSelection();
        });
    });  
};

function writeSelection() {
    qryStr = document.forms["metArtCriteria"]["queryString"].value;
    qryDept = document.forms["metArtCriteria"]["qryDept"].value;

    document.getElementById("metCriteria").innerHTML = "<p> writeSelection: "+this.qryStr+" </p>";
    document.getElementById("metCriteria").innerHTML += "<p> writeSelection: "+this.qryDept+" </p>";

    searchCrit1 = "departmentId=" + qryDept;
    searchCrit2 = "q="+ qryStr;
};