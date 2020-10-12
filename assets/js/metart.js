// Setting up api portal
const apiMet = "https://collectionapi.metmuseum.org/public/collection/v1/";
const apiMetObject =
  "https://collectionapi.metmuseum.org/public/collection/v1/objects/";

// Declaring global variables used by more than one function

var searchCrit1 = "";
var searchCrit2 = "";
var qryStr = ""; // q
var qryHighlight; // isHighlight
var qryDept; // departmentId
var qryDeptName; //Selection form now asks for name, not id.
var qryView; // isOnView
var qryCult; // artistOrCulture
var qryMedium; // medium
var qryImages; // hasImages
var qryLoc; // geoLocation
// must have both values for dateBegin and dateEnd queries:
var qryBegin; // dateBegin
var qryEnd; // dateEnd
// Department array to hold id and name used by functions writeDepts,getDeptName,returnDeptName
var depts = [];
var deptName; //department Name
var totalObjects; // to capture the total number of objects listed on the Met's public collections
var displayObjects = [];
let currentPg = 1;

/*
    Initialising popovers to help with selection criteria validation, UX
    Also returning total objects in collection.
    Also populating departments array
*/

$(document).ready(function () {
  $('[data-toggle="popover"]').popover();
  totalCollection();
  loadDepts();
});

function getTotalObjects(cb) {
  var xhr = new XMLHttpRequest();
  var apiAll = apiMetObject.substring(0, apiMetObject.length - 1);
  xhr.open("GET", apiAll);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      cb(JSON.parse(this.responseText));
      console.log(
        "********  JSON response text " + JSON.parse(this.responseText)
      );
    }
  };
}

function totalCollection() {
  getTotalObjects(function (item) {
    totalObjects = item.total;
    document.getElementById(
      "metArtTotal"
    ).innerHTML = `There are a total of <mark>${totalObjects}</mark> available objects in the Met's collection.`;
    document.getElementById(
      "metArtTotal"
    ).innerHTML += `<br>Use the selection criteria wisely.`;
    return totalObjects;
  });
}

function getMetDeptTotals(cb, DId) {
  var apiMetDeptStub = apiMet + "objects?departmentIds=";
  var apiQuery = apiMetDeptStub + DId;
  var xhr3 = new XMLHttpRequest();
  xhr3.open("GET", apiQuery);
  xhr3.send();
  xhr3.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      cb(JSON.parse(this.responseText));
    }
  };
}

function getMetDept(cb) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", apiMet + "departments");
  xhr.send();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      cb(JSON.parse(this.responseText));
    }
  };
}

function writeDepts() {
  document.getElementById("metArtDept").innerHTML = "";
  depts.forEach(function (item) {
    document.getElementById(
      "metArtDept"
    ).innerHTML += ` ${item.departmentId} ) ${item.displayName} <br>`;
  });
}

function loadDepts() {
  /*  
    Using temporary store for department names keys and ID values.
    Will clear when browser closed.
*/
  sessionStorage.clear();
  getMetDept(function (item) {
    depts = item.departments;
    depts.forEach(function (item) {
      /* need a lookup from department name back to id. */
      sessionStorage.setItem(item.displayName, item.departmentId);
    });
  });
}

function writeDeptName(data) {
  document.getElementById("metCriteria").innerHTML += "<p> " + data.displayName + "</p>";
}

function getDeptName(deptId) {
  getMetDept(function (item) {
    depts.forEach(function (item) {
      if (item.departmentId == deptId) {
        writeDeptName(item);
      }
    });
  });
}

function returnDeptName(deptId) {
/*
    depends upon populated  global array 'depts' to lookup name from id.
*/
  var deptName = "";
  depts.forEach(function (item) {
    if (item.departmentId == deptId) {
      deptName = item.displayName;
    }
  });
  return deptName;
}
function returnDeptId(deptName) {
/*
    depends upon the sessionStorage of key displayName against value of departmentId
*/
  return sessionStorage.getItem(deptName);
}

function loadSelDepts() {
  var selHTML = "";
  var selOptions = "";

  depts.forEach(function (dItem) {
    /* need a lookup from department name back to id. */
    selOptions += `     <option>${dItem.displayName}</option>`;
  });

  selHTML = `      <label for="deptNameSel"`;
  selHTML += ` data-toggle="popover" data-trigger="hover" data-placement="top" `;
  selHTML += ` title="Department Name"`;
  selHTML += ` data-content="Select Met Museum Art Departments valid list">`;
  selHTML += ` Select one Department: </label>`;
  selHTML += `     <select class="form-control" id="deptNameSel"  required > `;
  selHTML += selOptions;
  selHTML += `     </select>`;
  //alert(selHTML);
  document.getElementById("selDept").innerHTML += selHTML;
}

/*
    MET API search returns
        a listing of all Object IDs for objects 
        that contain the search query 
        within the object’s data.
        The returned query also contains total number of objects found.
*/

function getMetSearch(cb1) {
  var xhr2 = new XMLHttpRequest();
  xhr2.open("GET", apiMet + "search?" + searchCrit1 + searchCrit2);
  xhr2.send();
  xhr2.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      cb1(JSON.parse(this.responseText));
      //console.log("********  JSON response text "+JSON.parse(this.responseText));
    }
  };
}

function getMetObject(obj_ID, cb2) {
  var xhr3 = new XMLHttpRequest();
  xhr3.open("GET", apiMetObject + obj_ID);
  xhr3.send();

  xhr3.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      cb2(JSON.parse(this.responseText));
    }
  };
}

function writeCriteria() {
  document.getElementById("metCriteria").innerHTML =
    "<p> Search criteria: " + searchCrit1 + " " + searchCrit2 + " </p>";
}

/* Object DisplayObject and its constructor */
class DisplayObject {
  constructor(artCount, metObjectId, pageCount) {
    this.artCnt = artCount;
    this.objectId = metObjectId;
    this.pageCnt = pageCount;
  }
  /* methods */
  get workId() {
    return this.objectId;
  }
  get pageNo() {
    return this.pageCnt;
  }
}

function writeObjects() {
  var objects = [];
  var objectId;
  var totalInt;
  var artCnt = 0;
  var pageCnt = 1;

  /*
        Clear down any previous search results...
  */
  document.getElementById("metArt").innerHTML = "";
  document.getElementById("selDept").innerHTML = "";
  /*
        Now for current search results.....
  */
  writeCriteria();
  getMetSearch(function (item) {
    var total_Found;
    total_Found = item.total;
    document.getElementById(
      "metArt"
    ).innerHTML += `<p> Total found: ${total_Found} </p>`;
    totalInt = parseInt(total_Found);
    /*
            If there are no objects found, no need to display get objects button
        */
    if (totalInt == 0) {
      document.getElementById("btnGetObjects").style.display = "block";
      document.getElementById(
        "metDebug"
      ).innerHTML += `<br> No works found : ${totalInt}`;
    } else {
      /* 
                If there are objects found for the search crieria given
                need to hide the selection button until after the objects have been displayed
                just to simplify UX
            */
      if (totalInt > 0) {
        document.getElementById("btnGetCriteria").style.display = "none";
        document.getElementById("btnGetObjects").style.display = "block";
      }
      objects = item.objectIDs;
      for (objectId of objects) {
        if (totalInt < 6) {
          writeObjectDetails(objectId);
          generatePaginationButton(pageCnt);
        } else {
          /*  Decided on 5 artworks per page, to save on memory issues... */
          artCnt++;
          if (artCnt < 6) {
            writeObjectDetails(objectId);
            var thisArtWork = new DisplayObject(artCnt, objectId, pageCnt);
            document.getElementById(
              "metDebug"
            ).innerHTML += `<br> ${thisArtWork.workId} , ${thisArtWork.pageNo} less than 6`;
            displayObjects.push(thisArtWork);
          } else {
            //if ( artCnt == 6) {pageCnt++};
            if (artCnt % 5 == 1) {
              pageCnt++;
            }
            generatePaginationButton(pageCnt);
            var thisArtWork = new DisplayObject(artCnt, objectId, pageCnt);
            document.getElementById(
              "metDebug"
            ).innerHTML += `<br> ${thisArtWork.workId} , ${thisArtWork.pageNo}`;
            displayObjects.push(thisArtWork);
          }
        }
      }
    }
  });
  document.getElementById("metDebug").innerHTML =
    "*********** TESTING ********";
}

function writeNextPage(pageCnt) {
  /*  Clear down any previous page results...  */
  document.getElementById("metArt").innerHTML = "";
  if (currentPg < pageCnt) {
    currentPg++;
  }
  /* writing current Page number to screen */
  document.getElementById("metPageCount").innerHTML = `Page: ${currentPg}`;

  var myWrk = {};
  var myArr = Object.values(displayObjects);

  /* unpacking the found art works */
  for (let i in myArr) {
    myWrk = myArr[i];
    if (myWrk.pageNo == currentPg) {
      document.getElementById(
        "metDebug"
      ).innerHTML += `<br>Next page ${myWrk.workId}`;
      writeObjectDetails(myWrk.workId);
    }
  }
  if (currentPg < 2) {
    document.getElementById("btnPrev").style.display = "none";
  } else {
    document.getElementById("btnPrev").style.display = "block";
  }
  if (currentPg == pageCnt) {
    document.getElementById("btnNext").style.display = "none";
  } else {
    document.getElementById("btnNext").style.display = "block";
  }
}

function writePreviousPage(pageCnt) {
  /*  Clear down any previous page results...  */
  document.getElementById("metArt").innerHTML = "";
  if (currentPg > 1) {
    currentPg--;
  }
  /* writing current Page number to screen */
  document.getElementById("metPageCount").innerHTML = `Page: ${currentPg}`;

  var myWrk = {};
  var myArr = Object.values(displayObjects);

  /* unpacking the found art works */
  for (let i in myArr) {
    myWrk = myArr[i];
    if (myWrk.pageNo == currentPg) {
      document.getElementById(
        "metDebug"
      ).innerHTML += `<br>Prev page ${myWrk.workId}`;
      writeObjectDetails(myWrk.workId);
    }
  }
  if (currentPg < 2) {
    document.getElementById("btnPrev").style.display = "none";
  } else {
    document.getElementById("btnPrev").style.display = "block";
  }
  if (currentPg == pageCnt) {
    document.getElementById("btnNext").style.display = "none";
  } else {
    document.getElementById("btnNext").style.display = "block";
  }
}

function writeObjectDetails(obj_ID) {
  var objTitle = "";
  var objPrimaryImage = "";
  var objArtistDisplayName = "";
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
  var objAdditionalImages = [];
  var objConstituents = [];
  var objArtistDisplayBio = "";
  var objPortfolio = "";
  var objArtistRole = "";
  var objArtistPrefix = "";
  var objArtistSuffix = "";
  var objArtistNationality = "";
  var objArtistGender = "";
  var objDate = "";
  var objCity = "";
  var objState = "";
  var objCounty = "";
  var objCountry = "";
  var objRegion = "";
  var objSubRegion = "";
  var objLocale = "";
  var objLocus = "";
  var objExcavation = "";
  var objRiver = "";
  var objClassification = "";

  getMetObject(obj_ID, function (item) {
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
    //objAdditionalImages = item.additionalImages; // array
    for (let i in item.additionalImages) {
      objAdditionalImages.push(item.additionalImages[i]);
    }
    //objConstituents = parse(item.constituents);  //array
    /*
    for ( let i in item.constituents ) {
        objConstituents.push(item.constituents[i]);
    }    
    */
    objWiki = item.objectWikidata_URL;
    objArtistDisplayBio = item.artistDisplayBio;
    objPortfolio = item.portfolio;
    objArtistRole = item.artistRole;
    objArtistPrefix = item.artistPrefix;
    objArtistSuffix = item.artistSuffix;
    objArtistNationality = item.artistNationality;
    objArtistGender = item.artistGender;
    objDate = item.objectDate;
    objCity = item.city;
    objState = item.state;
    objCounty = item.county;
    objCountry = item.country;
    objRegion = item.region;
    objSubRegion = item.subregion;
    objLocale = item.locale;
    objLocus = item.locus;
    objExcavation = item.excavation;
    objRiver = item.river;
    objClassification = item.classification;

    document.getElementById(
      "metArt"
    ).innerHTML += `(${obj_ID}) ${objTitle}<br>`;
    document.getElementById("metArt").innerHTML += `${objName} <br>`;
    document.getElementById(
      "metArt"
    ).innerHTML += `"<img class="img-fluid" src="${objPrimaryImage}" alt="${objTitle}"> <br>`;
    if (objArtistDisplayName.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `Artist: ${objArtistDisplayName} <br>`;
    }
    if (objArtistDisplayBio.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `Artist's bio: ${objArtistDisplayBio} <br>`;
    }
    if (objArtistBegin.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `Artist's birth: ${objArtistBegin} and death: ${objArtistEnd} <br>`;
    }
    if (objMedium.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `Medium: ${objMedium} <br>`;
    }
    document.getElementById(
      "metArt"
    ).innerHTML += `Department: ${objDept} <br>`;
    if (objCulture.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `Culture: ${objCulture} <br>`;
    }
    if (objPeriod.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `Period: ${objPeriod} <br>`;
    }
    if (objDynasty.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `Dynasty: ${objDynasty} <br>`;
    }
    if (objReign.length > 0) {
      document.getElementById("metArt").innerHTML += `Reign: ${objReign} <br>`;
    }
    if (objDimensions.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `Artwork dimensions: ${objDimensions} <br>`;
    }
    document.getElementById(
      "metArt"
    ).innerHTML += `Artwork began: ${objBegin} Artwork finished: ${objEnd} <br>`;

    if (objCreditLine.length > 0) {
      document.getElementById("metArt").innerHTML +=
        "Origin and year acquired: " + objCreditLine + " <br>";
    }

    /*  blanking out additional images for the moment...another window? 
    if (objAdditionalImages.length > 0) {
        for ( let i in objAdditionalImages ) {
            document.getElementById("metArt").innerHTML += `Additional images: <img class="img-fluid" src="${objAdditionalImages[i]}" alt="add image"> <br>`;
        };
    };
    */

    if (objConstituents.length > 0) {
      for (let i in objConstituents) {
        document.getElementById(
          "metArt"
        ).innerHTML += `Constituents: ${objConstituents[i]} <br>`;
      }
    }

    if (objWiki.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `WIKIData: <a href="${objWiki}" target="_blank" title="WIKIData link">WIKI link</a>  <br>`;
    }

    if (objPortfolio.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `Portfolio: ${objPortfolio} <br>`;
    }

    if (objArtistRole.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `Artists role: ${objArtistRole} <br>`;
    }
    if (objArtistPrefix.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `Prefix: ${objArtistPrefix} <br>`;
    }

    if (objArtistSuffix.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `Suffix: ${objArtistSuffix} <br>`;
    }
    if (objArtistNationality.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `Nationality: ${objArtistNationality} <br>`;
    }
    if (objArtistGender.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `Gender: ${objArtistGender} <br>`;
    }
    if (objDate.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `Artwork date: ${objDate} <br>`;
    }
    if (objCity.length > 0) {
      document.getElementById("metArt").innerHTML += `City: ${objCity} <br>`;
    }
    if (objState.length > 0) {
      document.getElementById("metArt").innerHTML += `State: ${objState} <br>`;
    }
    if (objCounty.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `County: ${objCounty} <br>`;
    }
    if (objCountry.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `Country: ${objCountry} <br>`;
    }
    if (objRegion.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `Region: ${objRegion} <br>`;
    }
    if (objSubRegion.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `Subregion: ${objSubRegion} <br>`;
    }
    if (objLocale.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `Locale: ${objLocale} <br>`;
    }
    if (objLocus.length > 0) {
      document.getElementById("metArt").innerHTML += `Locus: ${objLocus} <br>`;
    }
    if (objExcavation.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `Excavation: ${objExcavation} <br>`;
    }
    if (objRiver.length > 0) {
      document.getElementById("metArtt").innerHTML += `River: ${objRiver} <br>`;
    }
    if (objClassification.length > 0) {
      document.getElementById(
        "metArt"
      ).innerHTML += `Classification: ${objClassification} <br>`;
    }

    document.getElementById("metArt").innerHTML += "<hr>";
  });
}

function getSelection() {
  $(document).ready(function () {
    $("#searchBtn").on("click", function () {
      /* clear down any previous searches */
      document.getElementById("qryDeptValidation").innerHTML = "";
      document.getElementById("metCriteria").innerHTML = "";

      writeSelection();
    });
  });
}

function writeSelection() {
  document.getElementById("metCriteria").innerHTML = "";
  document.getElementById("metArt").innerHTML = "";

  qryStr = document.forms["metArtCriteria"]["queryString"].value;
  /*    
        Prototype search form asked for department id.
        Updated search form, now asking, via drop-down selections, for department names
        For API search endpoint, need to convert 'human' name back to Id
    */
  qryDeptName = document.forms["metArtCriteria"]["deptNameSel"].value;
  //qryDept = document.forms["metArtCriteria"]["qryDept"].value;
  qryDept = returnDeptId(qryDeptName);

  qryHighlight = document.forms["metArtCriteria"]["qryHighlight"].value;
  qryView = document.forms["metArtCriteria"]["qryView"].value; // isOnView
  qryCult = document.forms["metArtCriteria"]["qryCult"].value; // artistOrCulture
  qryMedium = document.forms["metArtCriteria"]["qryMedium"].value; // medium
  qryImages = document.forms["metArtCriteria"]["qryImages"].value; // hasImages
  qryLoc = document.forms["metArtCriteria"]["qryLoc"].value; // geoLocation
  // must have both values for dateBegin and dateEnd queries:
  qryBegin = document.forms["metArtCriteria"]["qryBegin"].value; // dateBegin
  qryEnd = document.forms["metArtCriteria"]["qryEnd"].value;

  getDeptName(qryDept);
  /*
        So we have a set of selected criteria, but also unselected or blank criteria from the form
        Need to strip out the blank selection qualifiers
  */

  searchCrit1 = `departmentId=${qryDept}&q=${qryStr}`;
  var searchCrit2Orig = `isHighlight=${qryHighlight}&isOnView=${qryView}&artistOrCulture=${qryCult}&medium=${qryMedium}&hasImages=${qryImages}&geoLocation=${qryLoc}&dateBegin=${qryBegin}&dateEnd=${qryEnd}`;
  searchCritArray = searchCrit2Orig.split("&");
  searchCrit2 = stripBlankSelections(searchCritArray);
  document.getElementById(
    "metCriteria"
  ).innerHTML += `<p> Search criteria: ${searchCrit1}${searchCrit2} </p>`;

  /* let criteriaString = `Selection: ${qryStr} Department: ${qryDept} highlighted: ${qryHighlight} on view: ${qryView}
        artist or culture: ${qryCult} medium: ${qryMedium} has images: ${qryImages} geographic location: ${qryLoc} 
        work date began: ${qryBegin} work date finished: ${qryEnd}`;
  document.getElementById("metCriteria").innerHTML =    "<p> " + criteriaString + "</p>";
  */

  /*
    Now display the button to allow user to get selected works....
*/
  document.getElementById("btnGetObjects").style.display = "block";
}

function stripBlankSelections(searchCritArray) {
  var searchString = "";
  for (let i in searchCritArray) {
    if (searchCritArray[i].length != searchCritArray[i].lastIndexOf("=") + 1) {
      searchString += "&" + searchCritArray[i];
    }
  }
  return searchString;
}

function generatePaginationButton(pageCnt) {
  document.getElementById("metPages").innerHTML = `<table><tr><td>`;
  document.getElementById(
    "metPages"
  ).innerHTML = `<div class="btn-group btn-group-sm">`;
  document.getElementById(
    "metPages"
  ).innerHTML += `<button id="btnPrev" onClick="writePreviousPage(${pageCnt})" class="btn btn-info">Previous 5 artworks of <span class="badge badge-light">${pageCnt}</span> pages</button>`;
  document.getElementById("metPages").innerHTML += `</td></tr>`;

  document.getElementById("metPages").innerHTML += `<tr><td>`;

  document.getElementById(
    "metPages"
  ).innerHTML += `<button id="btnNext" onClick="writeNextPage(${pageCnt})" class="btn btn-info">Next 5 artworks of <span class="badge badge-light">${pageCnt}</span> pages</button>`;
  document.getElementById("metPages").innerHTML += `</td></tr>`;

  document.getElementById("metPages").innerHTML += `<tr><td>`;

  document.getElementById(
    "metPages"
  ).innerHTML += `<button id="btnNew" onClick="clickBtnNew()" class="btn btn-warning">New selection</button>`;
  document.getElementById("metPages").innerHTML += `</div>`;
  document.getElementById("metPages").innerHTML += `</td></tr></table>`;

  document.getElementById("metPagesTop").innerHTML = `<table><tr><td>`;
  document.getElementById(
    "metPagesTop"
  ).innerHTML = `<div class="btn-group btn-group-sm">`;
  document.getElementById(
    "metPagesTop"
  ).innerHTML += `<button id="btnPrev" onClick="writePreviousPage(${pageCnt})" class="btn btn-info">Previous 5 artworks of <span class="badge badge-light">${pageCnt}</span> pages</button>`;
  document.getElementById("metPagesTop").innerHTML += `</td></tr>`;

  document.getElementById("metPagesTop").innerHTML += `<tr><td>`;
  document.getElementById(
    "metPagesTop"
  ).innerHTML += `<button id="btnNext" onClick="writeNextPage(${pageCnt})" class="btn btn-info">Next 5 artworks of <span class="badge badge-light">${pageCnt}</span> pages</button>`;
  document.getElementById("metPagesTop").innerHTML += `</td></tr>`;

  document.getElementById("metPagesTop").innerHTML += `<tr><td>`;
  document.getElementById(
    "metPagesTop"
  ).innerHTML += `<button id="btnNew" onClick="clickBtnNew()" class="btn btn-warning">New selection</button>`;
  document.getElementById("metPagesTop").innerHTML += `</div>`;
  document.getElementById("metPagesTop").innerHTML += `</td></tr></table>`;
}

function clickBtnNew() {
  /*    Clear down previous search results...  */
  document.getElementById("metArt").innerHTML = "";
  document.getElementById("metCriteria").innerHTML = "";
  document.getElementById("btnGetObjects").style.display = "none";
  document.getElementById("metPages").innerHTML = "";
  document.getElementById("metPagesTop").innerHTML = "";
  document.getElementById("metDebug").innerHTML = "";
  /* allow user to make another selection */
  document.getElementById("btnGetCriteria").style.display = "block";
  /* initialise variables holding old selections */
  currentPg = 1;
  displayObjects = [];
}
