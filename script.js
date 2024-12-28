console.log("Let's Write Some JS");
let currentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function Getsongs(){
    let a = await fetch(`/Songs/`);
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    console.log(as);
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/songs/`)[1]);
        }
    }
    return songs;
}

const playmusic = (track) => {
  // let audio = new Audio("/songs/" + track);
  currentSong.src = "/songs/" + track
  currentSong.play();
  document.querySelector(".songinfo").innerHTML = track
  document.querySelector(".songduration").innerHTML = "00:00/00:00"
}

async function playbar() {
  // Add an avent listner to play, pause and next
  play.addEventListener("click", ()=>{
    if(currentSong.paused){
      currentSong.play();
      play.src = "logo/pause.svg"
      
    }
    else{
      currentSong.pause();
      play.src = "logo/play.svg"
    }
  })

  //Listen for Timeupdate event

  currentSong.addEventListener("timeupdate", ()=>{
    console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector(".songduration").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  })

  //Add an Event listner to Seek bar

  document.querySelector(".seekbar").addEventListener("click", (e)=>{
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent * 100 + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100;
  })
}


async function main() {
    let currentSong;
    //Get the list of all the Songs
    let songs = await Getsongs();
    console.log(songs);

    let Songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];

  // Show all the Songs In the playlist

    for (const song of songs) {
        Songul.innerHTML = Songul.innerHTML + `<li> 
        <img src="logo/music.svg" alt="">
            <div class="info">
              <div>${song.replaceAll("%20", " ")}</div>
            </div>
            <div class="playnow">
              <img src="logo/playnow.svg" alt="">
            </div>
         </li>`;
    }

    // Attach an Event Listner to each Song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
      e.addEventListener("click", element =>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML);
        playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
      })
    })

    //Add an Event listner for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
      document.querySelector(".left").style.left = "0";

    })

    // Add event listner to close the hamburger
    document.querySelector(".close").addEventListener("click", ()=>{
      document.querySelector(".left").style.left = "-200%";
    })
}


main();
playbar();
