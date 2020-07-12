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

  // using localstorage
  //localStorage.setItem("testJSON", memberJSON);

  //  Setting up an external members file
  const memberFile = "assets/data/members.txt";

  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      myObj = JSON.parse(this.responseText);
      for (x in myObj) {
        txt += myObj[x].name + "<br>";
      }
      document.getElementById("Mike").innerHTML = txt;
    }
  };

  xmlhttp.open("POST", memberFile, true);
  xmlhttp.setRequestHeader("Content-type", "application/json");
  xmlhttp.send(memberJSON);
}
