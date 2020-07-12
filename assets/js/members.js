// POC: writing member data to
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

  //  Setting up an external members file
  const memberFile = "assets/data/members.txt";

  console.log(memberFile);

  console.log("******POST  *******");
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", memberFile, true);
  xmlhttp.setRequestHeader("Content-type", "text/json");
  console.log("***** "+memberJSON);
  xmlhttp.send(memberJSON);
}

loadMember();
