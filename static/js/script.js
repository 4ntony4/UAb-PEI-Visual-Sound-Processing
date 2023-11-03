const dragArea = document.querySelector(".dragArea"),
      dragInput = dragArea.querySelector("#audioFile"),
      spinnerArea = $('#spinnerArea'),
      audioControlArea = $('#audioControlArea'),
      browseBtn = $('#browseBtn'),
      resetBtn = $('#resetBtn'),
      audioExample1 = $('#audioExample1'),
      audioExample2 = $('#audioExample2'),
      audioExample3 = $('#audioExample3'),
      mModal = $('#mModal'),
      mModalTitle = $('#mModalTitle'),
      mModalMsg = $('#mModalMsg');
      
const lighterBackground = "lighter_background",
      dNone = "d-none",
      error = "Error",
      dragNDropText = "Drag & Drop to Upload File",
      audioSupportedText = "Only mpeg and wav files are supported.",
      fileMissingText = "File missing.",
      serverErrorText = "Server Internal Error. Please try again later.";

const optionsDiv = $('#optionsDiv'),
      waveBtn = $('#waveBtn'),
      specBtn = $('#specBtn'),
      imgDiv = $('#imgDiv'),
      waveImg = $('#waveImg'),
      specImg = $('#specImg');

let file;

const ajax = {
    post: (url, data, successCallback, errorCallback) => {
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            processData: false,
            contentType: false,
            success: (result) => {
                if (successCallback) {
                    successCallback(result);
                }
            },
            error: (err) => {
                if (err.status == 500) {
                    showModalServerError();
                }
                if (errorCallback) {
                    errorCallback(err);
                }
            }
        });
    }
}

browseBtn.click(() => {
    dragInput.click();
});

dragInput.addEventListener("change", function() {
    file = this.files[0];
    loadAudioFile();
});

dragArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dragArea.classList.add(lighterBackground);
});

dragArea.addEventListener("dragleave", () => {
    dragArea.classList.remove(lighterBackground);
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
            dragArea.classList.remove(lighterBackground);
            spinnerArea.removeClass(dNone);
            cacheAndShowAudioFile(file, fileURL);
        }
        fileReader.readAsDataURL(file);
    } else {
        showModalAudioSupported();
        dragArea.classList.remove(lighterBackground);
    }
}

function cacheAndShowAudioFile(file, fileURL) {
    let formData = new FormData();
    formData.append('audio_file', file, file.name);
    
    ajax.post(
        "/cache_audio_file",
        formData,
        () => {
            spinnerArea.addClass(dNone);
            showAudioTag(fileURL, file.name);
            start();
        },
        () => spinnerArea.addClass(dNone)
    );
}

function showAudioTag(fileURL, fileName) {
    dragArea.classList.add(dNone);
    audioControlArea.removeClass(dNone);
    audioControlArea.html(createAudioTag(fileURL, fileName));
    start();
}

function createAudioTag(fileURL, fileName) {
    return `
        <h2 class="text-white text-center py-4">${fileName ? fileName : fileURL}</h2>
        <div class="d-flex justify-content-center">
            <audio controls class="pb-4">
                <source id="audioSource" src="${fileURL}"/>
                Your browser does not suppor the audio element.
            </audio>
        </div>
        `;
}

audioExample1.click(() => {
    showAudioTag("static/audio/440.wav", "Sine Wave: 440 Hz");
});

audioExample2.click(() => {
    showAudioTag("static/audio/acousticguitar_c_chord.mp3", "Acoustic Guitar: C Chord");
});

audioExample3.click(() => {
    showAudioTag("static/audio/solo_trumpet.mp3", "Solo Trumpet");
});

resetBtn.click(() => {
    location.reload();
});

function start() {
    if (audioControlArea.hasClass(dNone)) {
        showModalFileMissing();
    } else {
        const source = $('#audioSource').attr('src');
        let staticSource;
        
        if (!source.startsWith("data")) {
            staticSource = source;
        }
        
        ajax.post(
            "/start",
            staticSource,
            () => optionsDiv.removeClass(dNone)
        );
    }
}

waveBtn.click(() => {
    if (!waveImg.attr('src')) {
        ajax.post(
            "/waveshow",
            null,
            (result) => waveImg.attr('src', result)
        );
    }
    waveImg.removeClass(dNone);
    specImg.addClass(dNone);
});

specBtn.click(() => {
    if (!specImg.attr('src')) {
        ajax.post(
            "/specshow",
            null,
            (result) => specImg.attr('src', result)
        );
    }
    specImg.removeClass(dNone);
    waveImg.addClass(dNone);
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
