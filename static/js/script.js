const dragArea = document.querySelector(".dragArea"),
	  dragInput = dragArea.querySelector("#audioFile"),
	  spinnerArea = $('#spinnerArea'),
	  spinnerArea2 = $('#spinnerArea2'),
	  audioControlArea = $('#audioControlArea'),
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

const optionsDiv = $('#optionsDiv'),
	  waveBtn = $('#waveBtn'),
	  specBtn = $('#specBtn'),
	  imgDiv = $('#imgDiv'),
	  waveImg = $('#waveImg'),
	  specImg = $('#specImg'),
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
		(err) => {
			spinnerArea.addClass(dNone);
			showModalError(err);
		}
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
		<h4 class="text-white text-center py-2">${fileName ? fileName : fileURL}</h4>
		<div class="d-flex justify-content-center">
			<audio controls class="pb-2">
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
			() => {
				optionsDiv.removeClass(dNone);
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
	if (!waveImg.attr('src')) {
		ajax.post(
			"/waveshow",
			null,
			(result) => waveImg.attr('src', result)
		);
	}
	waveImg.removeClass(dNone);
	specImg.addClass(dNone);

	waveBtn.addClass(active);
	specBtn.removeClass(active);
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
		applyFilterBtn.html(
			'<i class="fa-solid fa-bolt fa-beat"></i>'
			+ ' Apply Filter '
			+ '<i class="fa-solid fa-bolt fa-beat"></i>'
		);
		applyFilterBtn.attr('disabled', false);
	} else {
		applyFilterBtn.html('Apply Filter');
		applyFilterBtn.attr('disabled', true);
	}
});

applyFilterBtn.click(() => {
	spinnerArea2.removeClass(dNone);

	ajax.post(
		"/apply_filter",
		filterCode,
		(result) => {
			spinnerArea2.addClass(dNone);
			$('#filteredWaveImg').attr('src', result.wave);
			$('#filteredSpecImg').attr('src', result.spec);
			$('#filteredDiv').removeClass(dNone);
			$('#filteredAudioDiv').html(createFilteredAudioTag(result.audio));
		},
		(err) => {
			spinnerArea2.addClass(dNone);
			showModalError(err);
		}
	);

	// if (!specImg.attr('src')) {
	// }
	// specImg.removeClass(dNone);
	// waveImg.addClass(dNone);

	// specBtn.addClass(active);
	// waveBtn.removeClass(active);
});

function createFilteredAudioTag(audioSource) {
	return `
	<h4 class="text-white text-center py-2">Filtered Sound</h4>
	<div class="d-flex justify-content-center">
		<audio controls class="pb-2">
			<source id="filteredAudioSource" src="${audioSource}"/>
			Your browser does not suppor the audio element.
		</audio>
	</div>
	`;
}