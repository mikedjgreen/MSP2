// Setting up api portal
const apiMet = "https://collectionapi.metmuseum.org/public/collection/v1/"

function getMetDept(cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET",apiMet + "departments");
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {  
            cb(JSON.parse(this.responseText));
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
                document.getElementById("metArt").innerHTML += "<p> "+item.departmentId+") "+item.displayName+" </p>";
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
            //console.log(JSON.parse(this.responseText));
        } else {
            console.log("******** state "+ this.readyState +" ******* status " +this.status);
        };
    };
}