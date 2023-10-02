const dragArea = document.querySelector(".dragArea"),
      dragInput = dragArea.querySelector("#audioFile"),
      browseBtn = $('#browseBtn'),
      startBtn = $('#startBtn'),
      resetBtn = $('#resetBtn'),
      audioExample1 = $('#audioExample1'),
      audioExample2 = $('#audioExample2'),
      audioExample3 = $('#audioExample3'),
      mModal = $('#mModal'),
      mModalTitle = $('#mModalTitle'),
      mModalMsg = $('#mModalMsg');
      
const active = "active",
      error = "Error",
      dragNDropText = "Drag & Drop to Upload File",
      audioSupportedText = "Only mpeg and wav files are supported.",
      fileMissingText = "File missing.",
      serverErrorText = "Server Internal Error. Please try again later.";

let file;

browseBtn.click(() => {
    dragInput.click();
});

dragInput.addEventListener("change", function() {
    file = this.files[0];
    dragArea.classList.add(active);
    const success = showFile();
    if(success == true) cacheFile(file);
});

dragArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dragArea.classList.add(active);
});

dragArea.addEventListener("dragleave", () => {
    dragArea.classList.remove(active);
});

dragArea.addEventListener("drop", (event) => {
    event.preventDefault();
    file = event.dataTransfer.files[0];
    const success = showFile();
    if(success == true) cacheFile(file);
});

function cacheFile(file) {
    let formData = new FormData();
    formData.append('audio_file', file, file.name);
    console.log(formData);
    $.ajax({
        type: "POST",
        url: "/api/audio",
        data: formData,
        processData: false,
        contentType: false,
        success: (result) => {
            console.debug(result);
        },
        error: (err) => {
            console.debug(err);
            showModalServerError();
        }
    });
}

function showFile() {
    let fileType = file.type;
    let validExtensions = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/ogg"];
    if (validExtensions.includes(fileType)) {
        let fileReader = new FileReader();
        fileReader.onload = () => {
            let fileURL = fileReader.result;
            dragArea.innerHTML = makeAudioTag(fileURL, file.name);
        }
        fileReader.readAsDataURL(file);
        return true;
    } else {
        showModalAudioSupported();
        dragArea.classList.remove(active);
        return false;
    }
}

function makeAudioTag(fileURL, fileName) {
    return `
        <h2 class="text-white text-center mt-2 mb-4">${fileName ? fileName : fileURL}</h2>
        <audio controls class="mb-2">
            <source id="audioSource" src="${fileURL}">
            Your browser does not suppor the audio element.
        </audio>
        `;
}

audioExample1.click(() => {
    dragArea.innerHTML = makeAudioTag("static/audio/440.wav", "Sine Wave: 440 Hz");
    dragArea.classList.add(active);
});

audioExample2.click(() => {
    dragArea.innerHTML = makeAudioTag("static/audio/acousticguitar-c-chord.mp3", "Acoustic Guitar: C Chord");
    dragArea.classList.add(active);
});

audioExample3.click(() => {
    dragArea.innerHTML = makeAudioTag("static/audio/solo-trumpet.mp3", "Solo Trumpet");
    dragArea.classList.add(active);
});

resetBtn.click(() => {
    location.reload();
});

startBtn.click(() => {
    if (!dragArea.classList.contains('active')) {
        showModalFileMissing();
    } else {
        const source = $('#audioSource').attr('src');
        if (source.startsWith("data")) {
            // TODO
        } else {
            // TODO
        }
    }
});

function showModalAudioSupported() {
    mModalTitle.text(error);
    mModalMsg.text(audioSupportedText);
    mModal.modal('show');
}

function showModalFileMissing() {
    mModalTitle.text(error);
    mModalMsg.text(fileMissingText);
    mModal.modal('show');
}

function showModalServerError() {
    mModalTitle.text(error);
    mModalMsg.text(serverErrorText);
    mModal.modal('show');
}
