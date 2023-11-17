const dragArea = document.querySelector(".dragArea"),
	  dragInput = dragArea.querySelector("#audioFile"),
	  dragDiv = $('#dragDiv'),
	  spinnerAreaDragDiv = $('#spinnerAreaDragDiv'),
	  spinnerAreaBottom = $('#spinnerAreaBottom'),
	  audioDiv = $('#audioDiv'),
	  originalAudioDiv = $('#originalAudioDiv'),
	  filteredAudioDiv = $('#filteredAudioDiv'),
	  browseBtn = $('#browseBtn'),
	  resetBtn = $('#resetBtn'),
	  audioExample1 = $('#audioExample1'),
	  audioExample2 = $('#audioExample2'),
	  audioExample3 = $('#audioExample3'),
	  mModal = $('#mModal'),
	  mModalTitle = $('#mModalTitle'),
	  mModalMsg = $('#mModalMsg'),
	  mModalErr = $('#mModalErr');

const lighterBackground = "lighter_background",
	  dNone = "d-none",
	  active = "active",
	  error = "Error",
	  dragNDropText = "Drag & Drop to Upload File",
	  audioSupportedText = "Only mpeg and wav files are supported.",
	  fileMissingText = "File missing.",
	  serverErrorText = "Server Internal Error. Please try again later.",
	  somethingWentWrongText = "Something went wrong. Please try again later.";

const mainDiv = $('#mainDiv'),
	  waveBtn = $('#waveBtn'),
	  specBtn = $('#specBtn'),
	  waveImgDiv = $('#waveImgDiv'),
	  specImgDiv = $('#specImgDiv'),
	  originalWaveImg = $('#originalWaveImg'),
	  filteredWaveImg = $('#filteredWaveImg'),
	  originalSpecImg = $('#originalSpecImg'),
	  filteredSpecImg = $('#filteredSpecImg'),
	  selectFilter = $('#selectFilter'),
	  applyFilterBtn = $('#applyFilterBtn');

let file;
let filterCode;

const ajax = {
	get: (url, successCallback, errorCallback) => {
		$.ajax({
			type: "GET",
			url: url,
			success: (result) => {
				if (successCallback) {
					successCallback(result);
				}
			},
			error: (err) => {
				if (errorCallback) errorCallback(err);
				else showModalError(err);
			}
		});
	},
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
				if (errorCallback) errorCallback(err);
				else showModalError(err);
			}
		});
	}
}

browseBtn.click(() => {
	dragInput.click();
});

dragInput.addEventListener("change", function () {
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
			spinnerAreaDragDiv.removeClass(dNone);
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
			spinnerAreaDragDiv.addClass(dNone);
			showOriginalAudioTag(fileURL, file.name);
			start();
		},
		(err) => {
			spinnerAreaDragDiv.addClass(dNone);
			showModalError(err);
		}
	);
}

function showOriginalAudioTag(fileURL, fileName) {
	dragDiv.addClass(dNone);
	audioDiv.removeClass(dNone);
	originalAudioDiv.html(createOriginalAudioTag(fileURL, fileName));
	start();
}

function createOriginalAudioTag(fileURL, fileName) {
	return `
		<h4 class="whitish text-center py-2">${fileName ? fileName : fileURL}</h4>
		<div class="d-flex justify-content-center pb-2">
			<audio controls>
				<source id="originalAudioSource" src="${fileURL}"/>
				Your browser does not suppor the audio element.
			</audio>
		</div>
		`;
}

audioExample1.click(() => {
	showOriginalAudioTag("static/audio/440.wav", "Sine Wave: 440 Hz");
});

audioExample2.click(() => {
	showOriginalAudioTag("static/audio/acousticguitar_c_chord.mp3", "Acoustic Guitar: C Chord");
});

audioExample3.click(() => {
	showOriginalAudioTag("static/audio/solo_trumpet.mp3", "Solo Trumpet");
});

resetBtn.click(() => {
	location.reload();
});

function start() {
	if (audioDiv.hasClass(dNone)) {
		showModalFileMissing();
	} else {
		const source = $('#originalAudioSource').attr('src');
		let staticSource;

		if (!source.startsWith("data")) {
			staticSource = source;
		}

		ajax.post(
			"/start",
			staticSource,
			() => {
				mainDiv.removeClass(dNone);
				waveBtn.click();
			}
		);

		ajax.get(
			"/filter_list",
			(result) => fillFilterSelect(result)
		);
	}
}

waveBtn.click(() => {
	if (!originalWaveImg.attr('src')) {
		ajax.post(
			"/waveshow",
			null,
			(result) => originalWaveImg.attr('src', result)
		);
	}

	waveImgDiv.removeClass(dNone);
	specImgDiv.addClass(dNone);

	waveBtn.addClass(active);
	specBtn.removeClass(active);
});

specBtn.click(() => {
	if (!originalSpecImg.attr('src')) {
		ajax.post(
			"/specshow",
			null,
			(result) => originalSpecImg.attr('src', result)
		);
	}

	waveImgDiv.addClass(dNone);
	specImgDiv.removeClass(dNone);

	specBtn.addClass(active);
	waveBtn.removeClass(active);
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

function showModalSomethingWentWrongError(err) {
	mModalTitle.text(error);
	mModalMsg.text(somethingWentWrongText);
	mModalErr.text(err.status + ' (' + err.statusText + ')');
	mModal.modal('show');
}

function showModalError(err) {
	if (err.status == 500) {
		showModalServerError();
	} else {
		showModalSomethingWentWrongError(err);
	}
}

function fillFilterSelect(filters) {
	selectFilter.empty();
	selectFilter.append(new Option('Select Filter', 0));

	filters.sort((a, b) => {
		let sa = a.name,
			sb = b.name;

		if (sa < sb) return -1;
		if (sa > sb) return 1;
		return 0;
	});

	filters.forEach(element => {
		const option = new Option(element.name, element.code);
		selectFilter.append(option);
	});

	filterCode = selectFilter.val();
}

selectFilter.change(() => {
	filterCode = selectFilter.val();
	if (filterCode != "0") {
		applyFilterBtn.attr('disabled', false);
		applyFilterBtn.addClass(lighterBackground);
	} else {
		applyFilterBtn.attr('disabled', true);
		applyFilterBtn.removeClass(lighterBackground);
	}
});

applyFilterBtn.click(() => {
	spinnerAreaBottom.removeClass(dNone);

	ajax.post(
		"/apply_filter",
		filterCode,
		(result) => {
			spinnerAreaBottom.addClass(dNone);
			
			filteredAudioDiv.removeClass('disabled');
			filteredAudioDiv.html(createFilteredAudioTag(result.audio));
			
			filteredWaveImg.attr('src', result.wave);
			filteredSpecImg.attr('src', result.spec);
		},
		(err) => {
			spinnerAreaBottom.addClass(dNone);
			showModalError(err);
		}
	);
});

function createFilteredAudioTag(audioSource) {
	return `
	<h4 class="whitish text-center py-2">Filtered Sound</h4>
	<div class="d-flex justify-content-center pb-2">
		<audio controls>
			<source id="filteredAudioSource" src="${audioSource}"/>
			Your browser does not suppor the audio element.
		</audio>
	</div>
	`;
}