// POC: writing member data to

  //  Setting up an external members file
  const memberFile = "assets/data/members.txt";
  const apiURI = "https://storage.googleapis.com/update/storage/v1/b/msp2_memberlist/o/"


function loadMember() {
  var aMember = {
    forname: "Mike",
    surname: "Green",
    email: "m.d.j.green@ntlworld.com",
    phone: "012345678555",
    exhibit: "Yes",
    subYear: "2019",
  };
  var memberJSON = JSON.stringify(aMember);

  console.log("loadMember ");

  window.localStorage.setItem('membership',memberJSON);

 /* console.log("Member file in "+apiURI);

  console.log("******POST  *******");
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", apiURI,true);
  xmlhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8","Authorization: Bearer 141e0367c9d0e4ee8e7a9f0accfca9cc29df187f");
  console.log("***** "+memberJSON);
  xmlhttp.send(memberJSON);
  xmlhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
             document.getElementById("memberData").innerHTML = this.memberJSON;
        } else {
            console.log("******** state "+ this.readyState +" ******* status " +this.status);
        };   
  }
  */
  
}

//loadMember();

// POC: Reading member data
function getMembers(cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET",memberFile);
    console.log("****** memberFile: "+memberFile)
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
             document.getElementById("memberData").innerHTML = this.responseText;
            //console.log(JSON.parse(this.responseText));
        } else {
            console.log("******** state "+ this.readyState +" ******* status " +this.status);
        };
    };
}

function getMet(cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET",apiMet);
    console.log("****** Met Art: "+apiMet)
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.dir(this.responseText);
             document.getElementById("metArt").innerHTML = this.responseText;
            //console.log(JSON.parse(this.responseText));
        } else {
            console.log("******** state "+ this.readyState +" ******* status " +this.status);
        };
    };
}



function writeToDocument() {
   /* getMembers(function(data){
        document.getElementById("memberData").innerHTML=data;
    });
    */
   var memberString;
   memberString = window.localStorage.getItem('membership');
   //var el = document.getElementById("memberData").innerHTML=memberString;
   //el.innerHTML = "";
   // console.log("memberString "+memberString);
   var memberJSON;
   memberJSON = JSON.parse(memberString);
   console.dir(memberJSON);
   
   document.getElementById("memberData").innerHTML  = "<p>" + memberJSON.forname + " ";
   document.getElementById("memberData").innerHTML  += memberJSON.surname + " ";
   document.getElementById("memberData").innerHTML  += memberJSON.email + "</p>";
  

}

function printDataToConsole(data) {
    console.log(data);
}

//getMembers(printDataToConsole);