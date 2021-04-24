"use strict";
var _a;
console.log("Script");
(_a = document.getElementById("initiatestreambtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", InitiateStream);
var evtSource;
function InitiateStream() {
    var eventList = document.getElementById("list");
    var connectedStatus = document.getElementById("connectedStatus");
    if (evtSource != null) {
        evtSource.close();
    }
    eventList.innerHTML = "";
    var streamName = document.getElementById("StreamName").value;
    console.log(streamName);
    evtSource = new EventSource("http://localhost:3000/stream/" + streamName, {
        withCredentials: true,
    });
    evtSource.onopen = function (event) {
        var connStream = streamName;
        if (connStream.length <= 1) {
            connStream = "Default";
        }
        connectedStatus.innerText = "You're connected to the '" + connStream + "' stream!";
    };
    evtSource.onmessage = function (event) {
        var divElement = document.createElement("div");
        var titleElement = document.createElement("h1");
        var pElement = document.createElement("p");
        var imgElement = document.createElement("img");
        var dateElement = document.createElement("small");
        imgElement.width = 250;
        var obj = JSON.parse(event.data);
        var eventFrom = obj.From;
        var eventMessage = obj.NotificationMessage;
        var eventImg = obj.ImgUrl;
        var eventDate = "sent: " + obj.Date;
        divElement.classList.add("notification");
        titleElement.textContent = eventFrom;
        pElement.textContent = eventMessage;
        imgElement.src = eventImg;
        dateElement.textContent = eventDate;
        pElement.appendChild(document.createElement("br"));
        pElement.appendChild(dateElement);
        divElement.appendChild(titleElement);
        divElement.appendChild(pElement);
        divElement.appendChild(imgElement);
        eventList.appendChild(divElement);
    };
}
// evtSource.addEventListener("notification", function(namedEvent)
// {
//     console.log("new Message Named Event");
// });
