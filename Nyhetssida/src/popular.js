const popularPodcasts = [
  {
    title: "P3 Dokumentär",
    description: "Sveriges största dokumentärpodd om verkliga händelser."
  },
  {
    title: "Sommar & Vinter i P1",
    description: "Kända personer delar personliga berättelser och erfarenheter."
  },
  {
    title: "Rättegångspodden",
    description: "Följ riktiga brottsfall och rättegångar från svenska domstolar."
  }
];

const list = document.getElementById("podcast-list");

popularPodcasts.forEach(podcast => {
  const li = document.createElement("li");
  li.className = "p-4  bg-white bg-opacity-20 rounded shadow";

  li.innerHTML = `
      <h2 class="text-lg font-semibold">${podcast.title}</h2>
      <p class="text-sm text-gray-300">${podcast.description}</p>
    `;

  list.appendChild(li);
});
