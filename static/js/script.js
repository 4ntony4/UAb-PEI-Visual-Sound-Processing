const dropArea = document.querySelector(".drag-area"),
      dragText = dropArea.querySelector("header"),
      button = dropArea.querySelector("button"),
      input = dropArea.querySelector("input"),
      active = "active",
      dragNDrop = "Drag & Drop to Upload File",
      resetBtn = document.querySelector("#reset-btn"),
      startBtn = document.querySelector("#start-btn"),
      audioExample1 = document.querySelector("#audio-example-1"),
      audioExample2 = document.querySelector("#audio-example-2"),
      audioExample3 = document.querySelector("#audio-example-3");
let file;

button.onclick = () => {
    input.click();
}

input.addEventListener("change", function() {
    file = this.files[0];
    dropArea.classList.add(active);
    showFile();
});

dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add(active);
});

dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove(active);
    dragText.textContent = dragNDrop;
});

dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    file = event.dataTransfer.files[0];
    showFile();
});

function showFile() {
    let fileType = file.type;
    let validExtensions = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/ogg"];
    if (validExtensions.includes(fileType)) {
        let fileReader = new FileReader();
        fileReader.onload = () => {
            let fileURL = fileReader.result;
            dropArea.innerHTML = makeAudioTag(fileURL, file.name);
        }
        fileReader.readAsDataURL(file);
    } else {
        alert("Only mpeg, and wav files are supported.");
        dropArea.classList.remove(active);
        dragText.textContent = dragNDrop;
    }
}

function makeAudioTag(fileURL, fileName) {
    return `
        <h2 class="text-white text-center mt-2 mb-4">${fileName ? fileName : fileURL}</h2>
        <audio controls>
            <source id="audio-source" src="${fileURL}">
            Your browser does not suppor the audio element.
        </audio>
        `;
}

audioExample1.onclick = () => {
    dropArea.innerHTML = makeAudioTag("static/audio/440.wav", "Sine Wave: 440 Hz");
    dropArea.classList.add(active);
}

audioExample2.onclick = () => {
    dropArea.innerHTML = makeAudioTag("static/audio/acousticguitar-c-chord.mp3", "Acoustic Guitar: C Chord");
    dropArea.classList.add(active);
}

audioExample3.onclick = () => {
    dropArea.innerHTML = makeAudioTag("static/audio/solo-trumpet.mp3", "Solo Trumpet");
    dropArea.classList.add(active);
}

resetBtn.onclick = () => {
    location.reload();
}

startBtn.onclick = async () => {
    let activePy = document.getElementsByClassName('active-py');

    if (!dropArea.classList.contains('active')) {
        alert("File missing.");
    }

    if (dropArea.classList.contains('active') && activePy.length === 0) {
        startBtn.classList.add('d-none');
    }
}