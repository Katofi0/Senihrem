const audio = document.getElementById("audio");
const lyricsContainer = document.getElementById("lyrics");
let lyrics = [];

// LRC dosyasını yükle
fetch("music/bahsetmem-lazim.lrc")
  .then((res) => res.text())
  .then((data) => {
    parseLRC(data);
  });

function parseLRC(data) {
  const lines = data.split("\n");
  lyrics = lines
    .map((line) => {
      const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
      if (match) {
        const min = parseInt(match[1]);
        const sec = parseFloat(match[2]);
        const time = min * 60 + sec;
        const text = match[3].trim();
        return { time, text };
      }
    })
    .filter(Boolean);

  lyrics.forEach((l) => {
    const p = document.createElement("p");
    p.textContent = l.text;
    lyricsContainer.appendChild(p);
  });
}

audio.addEventListener("timeupdate", () => {
  const currentTime = audio.currentTime;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time && (!lyrics[i + 1] || currentTime < lyrics[i + 1].time)) {
      const ps = lyricsContainer.querySelectorAll("p");
      ps.forEach((p) => p.classList.remove("active"));
      ps[i].classList.add("active");

      const activeLine = ps[i];
      lyricsContainer.scrollTo({
        top: activeLine.offsetTop - lyricsContainer.clientHeight / 2,
        behavior: "smooth",
      });
      break;
    }
  }
});
