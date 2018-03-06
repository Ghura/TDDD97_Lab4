var connection; // global variable that chart can use
var chart1;
var chart2; //så att vi kan update shitten
var tabbis;         // en global variabel så att vi kan använda den senare med att posta till en wall ("Browse").

// Välja vilken sida som ska visas beroende på inloggad eller ej.
displayView = function () {
    if (localStorage.getItem("token")) {
        document.getElementById("content").innerHTML = document.getElementById("profileview").innerHTML;
        document.getElementById("defaultOpen").click();
    } else {
        document.getElementById("content").innerHTML = document.getElementById("welcomeview").innerHTML;
    }
};

/*window.onbeforeunload = function() {
    connection.onclose = function () {}; // disable onclose handler first
    connection.close()

};*/

window.onload = function () {
    displayView();
};

// Validation: Kolla lösenord och repeatpw (behövs inte egentligen, men det ger snygyga "onkeyup" för användaren)...
checkpassword = function () {
    var password = document.getElementById("password").value;
    var mess = document.getElementById("mess");

    if (password.length < 4) {
        mess.innerHTML = "Password is too short.";
    } else {
        mess.innerHTML = "";
    }
};

checkpassword2 = function () {
    var password = document.getElementById("password").value;
    var repeatpw = document.getElementById("repeatpw").value;
    var mess = document.getElementById("mess");

    if (password.length < 4) {
        mess.innerHTML = "Password is too short.";
    }
    if (password != repeatpw) {
        mess.innerHTML = "Passwords does not match.";
    } else {
        mess.innerHTML = "";
    }
};

// Byta password och grejer
checknewpassword = function() {
    var newpassword = document.getElementById("newpassword").value;
    var newpassmess = document.getElementById("newpassmess");

    if (newpassword.length < 4) {
        newpassmess.innerHTML = "New password is too short.";
    } else {
        newpassmess.innerHTML = "";
    }
};

checknewpassword2 = function() {
    var newpassword = document.getElementById("newpassword").value;
    var repeatnewpassword = document.getElementById("repeatnewpassword").value;
    var newpassmess = document.getElementById("newpassmess");

    if (newpassword.length < 4) {
        newpassmess.innerHTML = "New password is too short.";
    }
    if (newpassword != repeatnewpassword) {
        newpassmess.innerHTML = "New passwords does not match.";
    } else {
        newpassmess.innerHTML = "";
    }
};

// ------------------------------------------------------------------------------------

changePassword = function(){
    var token = localStorage.getItem("token");
    var oldPassword = document.getElementById("oldpassword").value;
    var newPassword = document.getElementById("newpassword").value;
    var repeatnewpassword = document.getElementById("repeatnewpassword").value;
    var newpassmess = document.getElementById("newpassmess");

    if (newPassword.length < 4) {                // "guard block"
        newpassmess.innerHTML = "New password is too short.";
        return false;
    }
    if (newPassword != repeatnewpassword) {    // "guard block"
        newpassmess.innerHTML = "New passwords does not match.";
        return false;
    }

    var changepass = {
        "old_password" : document.getElementById("oldpassword").value,
        "new_password" : document.getElementById("newpassword").value
    };

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(xhttp.responseText);
            if (result == true) {
                newpassmess.innerHTML = result.message;
            } else {
                newpassmess.innerHTML = result.message;
            }
        }
    };
    xhttp.open("POST",'/changepassword',true);
    xhttp.setRequestHeader("Authorization", token);
    xhttp.setRequestHeader("Content-Type","application/json");
    xhttp.send(JSON.stringify(changepass));
};

// Sign up for life //
signupValidation = function () {
    var password = document.getElementById("password").value;
    var repeatpw = document.getElementById("repeatpw").value;
    var mess = document.getElementById("mess");

    if (password.length < 4) {              // "guard block"
        return false;
    }
    if (password != repeatpw) {            // "guard block"
        return false;
    }

    var regData = {
        "email": document.forms["signupform"]["email"].value,
        "password": document.forms["signupform"]["password"].value,
        "firstname": document.forms["signupform"]["firstname"].value,
        "familyname": document.forms["signupform"]["familyname"].value,
        "gender": document.forms["signupform"]["gender"].value,
        "city": document.forms["signupform"]["city"].value,
        "country": document.forms["signupform"]["country"].value
    };

    PostFunctionAJAX("/signup", localStorage.getItem("token"), "Content-Type", "application/json", regData, function() {
            if (this.success) {
                loginValidation(document.forms["signupform"]["email"].value, document.forms["signupform"]["password"].value);
            } else {
                document.getElementById("mess").innerHTML = this.message;
                console.log(this.message);
            }
        });

};

// Logga in. Visar felmeddelande om användare/lösenord är fel, annars får man en token tilldelad, kör en dispview => profileview
loginValidation = function (email, password) {

    if (email == null || password == null) {
        var loginData = {
            "email" : document.forms["loginform"]["loginemail"].value,
            "password" : document.forms["loginform"]["loginpassword"].value
        };

    } else {
        var loginData = {
            "email" : email,
            "password" : password
        };
        }

    PostFunctionAJAX("/signin", localStorage.getItem("token"), "Content-Type", "application/json", loginData, function() {
            if (this.success) {
                connectToSocket(this.data);
                localStorage.token = this.data;
                localStorage.email = loginData.email;
                displayView();
                console.log(this.message);
            } else {
                document.getElementById("mess2").innerHTML = this.message;
            }
    });

};

signOut = function () {
    token = localStorage.getItem("token");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            result = JSON.parse(xhttp.responseText);
            if (result.success) {
                localStorage.clear();
                displayView();
            } else {
                console.log(result.message);
            }
        }
    };
    xhttp.open("POST",'/signout', true);
    xhttp.setRequestHeader("Authorization", token);
    xhttp.send();
};

// Tabs och grejs
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    tabbis = tabName;

   if (tabName === "Home") {
        userInfo();
        updateWall();
    }
    if (tabName === "Account") {
        initiateChart();
    }
}

var GetFunctionAJAX = function(url, token, callback) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            callback.call(JSON.parse(xhttp.responseText));
        }
    };
    xhttp.open("GET", url, true);
    if (token) {
        xhttp.setRequestHeader("Authorization", token);
    }
    xhttp.send();
};

var PostFunctionAJAX = function(url, token, Header, HeaderValue, parameters, callback) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            callback.call(JSON.parse(xhttp.responseText));
        }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Authorization", token);
    xhttp.setRequestHeader(Header, HeaderValue);
    xhttp.send(JSON.stringify(parameters));
};

userInfo = function(email) {
    if (email == null) {
        email = localStorage.getItem("email");
    }

    GetFunctionAJAX('get-user-data-by-email/' + email, localStorage.getItem("token"), function() {
        if (this.success) {
            document.getElementById("loggedinname").innerHTML = this.data[0].firstname;
            document.getElementById("loggedinfamilyname").innerHTML = this.data[0].familyname;
            document.getElementById("loggedinemail").innerHTML = this.data[0].email;
            document.getElementById("loggedingender").innerHTML = this.data[0].gender;
            document.getElementById("loggedincity").innerHTML = this.data[0].city;
            document.getElementById("loggedincountry").innerHTML = this.data[0].country;
        } else {
            console.log(this.message);
        }
    });
};

postToWall = function() {
    var text = document.getElementsByName("posttextarea");
    token = localStorage.getItem("token");

    if (tabbis === "Browse") {
        var postMessage = {
            "message" : text[1].value,
            "recipient" : document.getElementById("searchemail").value
        };

        PostFunctionAJAX("/post-message", token, "Content-Type", "application/json", postMessage, function() {
            if (this.success) {
                document.getElementsByName("posttextarea")[0].value = "";
                searchForUser();
            } else {
                console.log(this.message);
            }
        });

    } else {
       var postMessageOwnWall = {
           "message" : text[0].value,
           "recipient" : localStorage.getItem("email")
       };

        PostFunctionAJAX("/post-message", token, "Content-Type", "application/json", postMessageOwnWall, function() {
            if (this.success) {
                document.getElementsByName("posttextarea")[0].value = "";
                updateWall();
                console.log(this.message);
            } else {
                console.log(this.message);
            }
        });
   }
};

updateWall = function(email) {
    if (email == null) {
        email = localStorage.getItem("email");
    }

    GetFunctionAJAX("/get-user-messages-by-email/" + email, localStorage.getItem("token"), function() {
        if (this.success) {
            // for (var i = 0; i<this.data.length; ++i) {
            for (var i = this.data.length-1; i >=0; i--) {
                if (i === this.data.length-1)
                    document.getElementById("messages").innerHTML = "<div>From: " + this.data[i].sender + " Message: " + this.data[i].message + "</div>";
                else
                    document.getElementById("messages").innerHTML += "<div>From: "+ this.data[i].sender + " Message: " + this.data[i].message + "</div>";
            }
            } else {
                document.getElementById("messages").innerHTML = this.message;
            }
    });
};

searchForUser = function() {
    var email = document.getElementById("searchemail").value;

    if (email == localStorage.getItem("email")) {        // "guard block"
         document.getElementById("searchusermess").innerHTML = "You can't search for yourself, go to your Homeview instead!";
         document.getElementById("searcheduserpage").innerHTML = "";
         return false;
    }

    userInfo(email);
    updateWall(email);

    GetFunctionAJAX('get-user-data-by-email/' + email, localStorage.getItem("token"), function() {
        if (this.success) {
            document.getElementById("searchusermess").innerHTML = "";
            document.getElementById("searcheduserpage").innerHTML = document.getElementById("Home").innerHTML;
        } else {
            document.getElementById("searchusermess").innerHTML = this.message;
            document.getElementById("searcheduserpage").innerHTML = "";
        }
    });
};

// --------------------- SOCKET STUFF --------------------- //

connectToSocket = function (token) {
    connection = new WebSocket('ws://127.0.0.1:5666/api');

    // Send some data to server when connection is open
    connection.onopen = function (){

        var tokenSend = new Object();
        tokenSend.id = "token";
        tokenSend.token = token;
        connection.send(JSON.stringify(tokenSend));
        //https://stackoverflow.com/questions/24027589/how-to-convert-raw-javascript-object-to-python-dictionary

    };
    connection.onmessage = function(response) {

        var messageFromServer = JSON.parse(response.data);
        // parse to make in a JavaScript object

        if (messageFromServer.id == "signOutNow") {
            localStorage.clear();
            displayView();
            console.log("You logged in somewhere else.");
        }
        else if (messageFromServer.id == "update_the_charts") {
            //updateCharts(messageFromServer.online, messageFromServer.users, messageFromServer.received, messageFromServer.sent);
            updateUsersChart(messageFromServer.online, messageFromServer.users);
            updateMessagesChart(messageFromServer.received, messageFromServer.sent);
            console.log("Updated charts!");
        }
        else if (messageFromServer.id == "users_update") {
            updateUsersChart(messageFromServer.online, messageFromServer.users);
            console.log("Someone logged in or out!");
        }
        else if (messageFromServer.id == "messages_update") {
            updateMessagesChart(messageFromServer.received, messageFromServer.sent);
            console.log("Someone sent a message to you, or you sent a message!");
        }

    };

    connection.onclose = function () {
        connection.close();
    };
};

// --------------------- CHARTS --------------------- //

initiateChart = function () {
    var ctx1 = document.getElementById('theChart').getContext('2d');
    chart1 = new Chart(ctx1, {
        type: 'doughnut',

        data: {
            labels: ["... logged in", "... logged off"],
            datasets: [{
                label: "User info",
                data: [0, 0],
                backgroundColor: ["#FF6384", "#36A2EB"]
            }]
        },
        options: {
            animations : true,
            title: {
                display: true,
                text: "Users..."
            }
        }
    });

    var ctx2 = document.getElementById('theChartTwo').getContext('2d');
    chart2 = new Chart(ctx2, {
        type: 'bar',
    data: {
        labels: ["... received", "... sent"],
        datasets: [{
            data: [0, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        animations : true,
        title: {
            display: true,
            text: "Messages that you have..."
        },
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    min: 0
                }
            }]
        }
    }
    });

    var charUpdateSend = new Object();
    charUpdateSend.id = "chartUpdate";
    charUpdateSend.token = localStorage.getItem("token");
    connection.send(JSON.stringify(charUpdateSend));

};

// chart update https://stackoverflow.com/questions/17354163/dynamically-update-values-of-a-chartjs-chart

updateUsersChart = function (online, users) {
    chart1.data.datasets[0].data[0] = online;
    chart1.data.datasets[0].data[1] = users-online;
    chart1.update();
};

updateMessagesChart = function (recieved, sent) {
    chart2.data.datasets[0].data[0] = recieved[0];
    chart2.data.datasets[0].data[1] = sent[0];
    chart2.update();
};