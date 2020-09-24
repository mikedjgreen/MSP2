// Setting up api portal
const apiMet = "https://collectionapi.metmuseum.org/public/collection/v1/";
const apiMetObject = "https://collectionapi.metmuseum.org/public/collection/v1/objects/";

// Declaring global variables used by more than one function

var searchCrit1 = "departmentID=";
var searchCrit2 = "q=sunflower";
var qryStr ="";  // q
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
var deptName; //department Name
var totalObjects;   // to capture the total number of objects listed on the Met's public collectsions


function getTotalObjects(cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET",apiMetObject);
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

function totalCollection() {
    getTotalObjects(function(item) {
       totalObjects = item.total;
       console.log(`There are a total collection of ${totalObjects} objects` );
       return totalObjects;
    })
};



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

function writeDeptName(data) {
    document.getElementById("metCriteria").innerHTML += " : "+ data.displayName + "</p>";
}

function getDeptName(deptId) {
    var depts = [];
    getMetDept(function(item) {
        depts=item.departments;
        depts.forEach(function(item) {
              if ( item.departmentId == deptId ){
                  writeDeptName(item);
              }
        });
    });
}

/*
    Initialising popovers to help with selection criteria validation, UX
*/

$(document).ready(function(){
  $('[data-toggle="popover"]').popover();
});

/*
    MET API search returns
        a listing of all Object IDs for objects 
        that contain the search query 
        within the object’s data.
        The returned query also contains total number of objects found.
*/





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

    /*
        Clear down previous search results...
    */
   document.getElementById("metArt").innerHTML = "";
    /*
        Now for current search results.....
    */
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
    var objName = "";
    var objCulture = "";
    var objPeriod = "";
    var objDynasty = "";
    var objReign = "";
    var objDimensions = "";
    var objCreditLine = "";
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
        objName = item.objectName;
        objCulture = item.culture;
        objPeriod = item.period;
        objDynasty = item.dynasty;
        objReign = item.reign;
        objDimensions = item.dimensions;
        objCreditLine = item.creditLine;
        document.getElementById("metArt").innerHTML += obj_ID + ": "+ objTitle +" <br>";
        document.getElementById("metArt").innerHTML += objName +" <br>";
        document.getElementById("metArt").innerHTML += "<img src="+ objPrimaryImage +" alt="+objTitle+"\"> <br>";
        document.getElementById("metArt").innerHTML += "artist: " + objArtistDisplayName +" <br>";
        if (objArtistBegin.length > 0 ) {
            document.getElementById("metArt").innerHTML += "artist birth: " + objArtistBegin +" death: "+objArtistEnd+ "<br>";
        }
        document.getElementById("metArt").innerHTML += "medium: " + objMedium +" <br>";
        document.getElementById("metArt").innerHTML += "department: " + objDept +" <br>";
        if (objCulture.length > 0) {
            document.getElementById("metArt").innerHTML += "culture: " + objCulture +" <br>";
        }
        if (objPeriod.length > 0){
            document.getElementById("metArt").innerHTML += "period: " + objPeriod +" <br>";
        }
        if (objDynasty.length > 0){
            document.getElementById("metArt").innerHTML += "dynasty: " + objDynasty +" <br>";
        }
        if (objReign.length > 0){
            document.getElementById("metArt").innerHTML += "reign: " + objReign +" <br>";
        }
        if (objDimensions.length > 0){
            document.getElementById("metArt").innerHTML += "artwork dimensions: " + objDimensions +" <br>";
        }        
        document.getElementById("metArt").innerHTML += "object begin date: " + objBegin + " object end date: "+ objEnd + " <br>";
        if (objCreditLine.length > 0){
            document.getElementById("metArt").innerHTML += "origin and year acquired: " + objCreditLine +" <br>";
        }         
        document.getElementById("metArt").innerHTML += "<hr>";
    });
};

function getSelection() {
    $(document).ready(function(){
        $("#searchBtn").on("click",function() {
            document.getElementById("metCriteria").innerHTML = "";
            writeSelection();
        });
    });  
};

function writeSelection() {
    qryStr = document.forms["metArtCriteria"]["queryString"].value;
    qryDept = document.forms["metArtCriteria"]["qryDept"].value;
    qryHighlight = document.forms["metArtCriteria"]["qryHighlight"].value;
    qryView = document.forms["metArtCriteria"]["qryView"].value;        // isOnView
    qryCult = document.forms["metArtCriteria"]["qryCult"].value;       // artistOrCulture
    qryMedium = document.forms["metArtCriteria"]["qryMedium"].value;     // medium
    qryImages = document.forms["metArtCriteria"]["qryImages"].value;       // hasImages
    qryLoc = document.forms["metArtCriteria"]["qryLoc"].value;          // geoLocation
// must have both values for dateBegin and dateEnd queries:
    qryBegin = document.forms["metArtCriteria"]["qryBegin"].value;        // dateBegin
    qryEnd = document.forms["metArtCriteria"]["qryEnd"].value;    

    let criteriaString = `Selection: ${qryStr} Department: ${qryDept} highlighted: ${qryHighlight} on view: ${qryView}
        artist or culture: ${qryCult} medium: ${qryMedium} has images: ${qryImages} geographic location: ${qryLoc} 
        work date began: ${qryBegin} work date finished: ${qryEnd}`;
    document.getElementById("metCriteria").innerHTML = "<p> " + criteriaString + "</p>";
    //document.getElementById("metCriteria").innerHTML += " Department: "+this.qryDept+" ";

    getDeptName(qryDept);  

    searchCrit1 = `departmentId=${qryDept}&q=${qryStr}`;
    searchCrit2 = `isHighlight=${qryHighlight}&isOnView=${qryView}&hasImages=${qryImages}&geoLocation=${qryLoc}&dateBegin=${qryBegin}&dateEnd=${qryEnd}`;
};