const dragArea = document.querySelector(".dragArea"),
      dragInput = dragArea.querySelector("#audioFile"),
      spinnerArea = $('#spinnerArea'),
      audioControlArea = $('#audioControlArea'),
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
      dNone = "d-none",
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
    loadAudioFile();
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
    loadAudioFile();
});

function loadAudioFile() {
    let fileType = file.type;
    let validExtensions = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/ogg"];
    if (validExtensions.includes(fileType)) {
        let fileReader = new FileReader();
        fileReader.onload = () => {
            let fileURL = fileReader.result;
            dragArea.classList.remove(active);
            spinnerArea.removeClass(dNone);
            cacheAndShowAudioFile(file, fileURL);
        }
        fileReader.readAsDataURL(file);
    } else {
        showModalAudioSupported();
        dragArea.classList.remove(active);
    }
}
function cacheAndShowAudioFile(file, fileURL) {
    let formData = new FormData();
    formData.append('audio_file', file, file.name);
    $.ajax({
        type: "POST",
        url: "/cache_audio_file",
        data: formData,
        processData: false,
        contentType: false,
        success: (result) => {
            console.debug(result);
            dragArea.classList.add(dNone);
            spinnerArea.addClass(dNone);
            showAudioTag(fileURL, file.name);
        },
        error: (err) => {
            console.debug(err);
            showModalServerError();
        }
    });
}

function showAudioTag(fileURL, fileName) {
    audioControlArea.removeClass(dNone);
    audioControlArea.html(createAudioTag(fileURL, fileName));
}

function createAudioTag(fileURL, fileName) {
    return `
        <h2 class="text-white text-center my-4">${fileName ? fileName : fileURL}</h2>
        <div class="d-flex justify-content-center">
            <audio controls class="mb-4">
                <source id="audioSource" src="${fileURL}"/>
                Your browser does not suppor the audio element.
            </audio>
        </div>
        `;
}

audioExample1.click(() => {
    dragArea.innerHTML = createAudioTag("static/audio/440.wav", "Sine Wave: 440 Hz");
    dragArea.classList.add(active);
});

audioExample2.click(() => {
    dragArea.innerHTML = createAudioTag("static/audio/acousticguitar-c-chord.mp3", "Acoustic Guitar: C Chord");
    dragArea.classList.add(active);
});

audioExample3.click(() => {
    dragArea.innerHTML = createAudioTag("static/audio/solo-trumpet.mp3", "Solo Trumpet");
    dragArea.classList.add(active);
});

resetBtn.click(() => {
    location.reload();
});

startBtn.click(() => {
    if (audioControlArea.hasClass(dNone)) {
        showModalFileMissing();
    } else {
        const source = $('#audioSource').attr('src');
        if (source.startsWith("data")) {
            // TODO
        } else {
            // TODO
        }
        $.ajax({
            type: "POST",
            url: "/start",
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
