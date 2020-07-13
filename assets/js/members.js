// POC: writing member data to

  //  Setting up an external members file
  const memberFile = "assets/data/members.txt";


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

  console.log("Member file "+memberFile);

  console.log("******POST  *******");
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", memberFile, true);
  xmlhttp.setRequestHeader("Content-type", "text/json");
  console.log("***** "+memberJSON);
  xmlhttp.send(memberJSON);
}

//loadMember();

// POC: Reading member data
function getMembers(cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET",memberFile);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cb(JSON.parse(this.responseText));
        }
    };
}

function printDataToConsole(data) {
    console.log(data);
}

//getMembers(printDataToConsole);