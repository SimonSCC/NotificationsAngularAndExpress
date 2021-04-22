"use strict";
console.log("Script");
var evtSource = new EventSource("http://localhost:3000/stream", {
    withCredentials: true,
});
evtSource.onmessage = function (event) {
    var divElement = document.createElement("div");
    var titleElement = document.createElement("h1");
    var pElement = document.createElement("p");
    var imgElement = document.createElement("img");
    var dateElement = document.createElement("small");
    imgElement.width = 250;
    var eventList = document.getElementById("list");
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
// evtSource.addEventListener("notification", function(namedEvent)
// {
//     console.log("new Message Named Event");
// });
