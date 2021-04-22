console.log("Script");

const evtSource = new EventSource("http://localhost:3000/stream", {
  withCredentials: true,
});

evtSource.onmessage = function (event) {
  const divElement = document.createElement("div");
  const titleElement = document.createElement("h1");
  const pElement = document.createElement("p");
  const imgElement = document.createElement("img");
  const dateElement = document.createElement("small");
  imgElement.width = 250;

  const eventList: HTMLElement = document.getElementById("list")!;

  let obj = JSON.parse(event.data);

  let eventFrom = obj.From;
  let eventMessage = obj.NotificationMessage;
  let eventImg = obj.ImgUrl;
  let eventDate = "sent: " + obj.Date;

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
