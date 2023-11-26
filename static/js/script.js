const dragArea = document.querySelector(".dragArea"),
	  dragInput = dragArea.querySelector("#audioFile"),
	  dragDiv = $('#dragDiv'),
	  spinnerAreaDragDiv = $('#spinnerAreaDragDiv'),
	  spinnerAreaBottom = $('#spinnerAreaBottom'),
	  spinnerFooter = $('#spinnerFooter'),
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
	  applyFilterBtn = $('#applyFilterBtn'),
	  changeKernelBtn = $('#changeKernelBtn'),
	  kernel = $('#kernel');

let file;
let filters;
let currentFilterCode;
let currentFilterKernel = null;

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
		(_) => {
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
	spinnerFooter.removeClass(dNone);
	dragDiv.addClass(dNone);
	audioDiv.removeClass(dNone);
	originalAudioDiv.html(createOriginalAudioTag(fileURL, fileName));
	start();
	spinnerFooter.addClass(dNone);
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
		spinnerFooter.removeClass(dNone);

		const source = $('#originalAudioSource').attr('src');
		let staticSource;

		if (!source.startsWith("data")) {
			staticSource = source;
		}

		ajax.post(
			"/start",
			staticSource,
			(_) => {
				mainDiv.removeClass(dNone);
				waveBtn.click();
			}
		);

		ajax.get(
			"/filter_list",
			(result) => {
				filters = result;
				filters.sort((a, b) => {
					let sa = a.name,
						sb = b.name;
			
					if (sa < sb) return -1;
					if (sa > sb) return 1;
					return 0;
				});
				fillFilterSelect();
				spinnerFooter.addClass(dNone);
			}
		);
	}
}

waveBtn.click(() => {
	if (!originalWaveImg.attr('src')) {
		spinnerFooter.removeClass(dNone);
		ajax.post(
			"/waveshow",
			null,
			(result) => {
				originalWaveImg.attr('src', result);
				spinnerFooter.addClass(dNone);
			}
		);
	}

	waveImgDiv.removeClass(dNone);
	specImgDiv.addClass(dNone);

	waveBtn.addClass(active);
	specBtn.removeClass(active);
});

specBtn.click(() => {
	if (!originalSpecImg.attr('src')) {
		spinnerFooter.removeClass(dNone);
		ajax.post(
			"/specshow",
			null,
			(result) => {
				originalSpecImg.attr('src', result);
				spinnerFooter.addClass(dNone);
			}
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

function fillFilterSelect() {
	selectFilter.empty();
	selectFilter.append(new Option('Select Filter', 0));

	filters.forEach(element => {
		const option = new Option(element.name, element.code);
		selectFilter.append(option);
	});

	currentFilterCode = selectFilter.val();
}

selectFilter.change(() => {
	kernel.addClass(dNone);
	currentFilterCode = selectFilter.val();

	if (currentFilterCode != "0") {
		applyFilterBtn.attr('disabled', false);
		applyFilterBtn.addClass(lighterBackground);
	} else {
		applyFilterBtn.attr('disabled', true);
		applyFilterBtn.removeClass(lighterBackground);
	}

	const currentFilter = filters.find((element) => element.code == currentFilterCode);
	if (currentFilter) currentFilterKernel = currentFilter.kernel;
	else currentFilterKernel = null;
	fillKernelForm();
});

function fillKernelForm() {
	if (currentFilterKernel) {
		const matrixSize = currentFilterKernel.length;
		buildMatrixForm(matrixSize);
		kernel.removeClass(dNone);

		if (currentFilterCode != 'CK3') changeKernelBtn.removeClass(dNone);
		else changeKernelBtn.addClass(dNone);

		for (let i = 0; i < matrixSize; i++) {
			for (let j = 0; j < matrixSize; j++) {
				$(`#kernel${i}${j}`).val(currentFilterKernel[i][j]);
				if (currentFilterCode == 'CK3') $(`#kernel${i}${j}`).attr('disabled', false);
				else $(`#kernel${i}${j}`).attr('disabled', true);
			}
		}
	} else {
		changeKernelBtn.addClass(dNone);
		kernel.html("");
	}
}

function buildMatrixForm(size) {
	let matrixDiv = "";

	let gridTemplateColumns = "";
	for (let i = 0; i < size; i++) {
		gridTemplateColumns += "1fr "
	}

	for (let i = 0; i < size; i++) {
		matrixDiv += `<div id="kernelRow${i}" class="d-grid" style="grid-template-columns: ${gridTemplateColumns};">`;
		for (let j = 0; j < size; j++) {
			matrixDiv += `<div><input class="form-control" type="text" id="kernel${i}${j}" name="kernel${i}${j}" disabled></div>`;
		}
		matrixDiv += `</div>`;
	}
	kernel.html(matrixDiv);
}

applyFilterBtn.click(() => {
	spinnerAreaBottom.removeClass(dNone);

	if (currentFilterCode == 'CK3') {
		const matrixSize = currentFilterKernel.length;
		for (let i = 0; i < matrixSize; i++) {
			for (let j = 0; j < matrixSize; j++) {
				currentFilterKernel[i][j] = parseFloat($(`#kernel${i}${j}`).val());
			}
		}
		$.ajax({
			type: "POST",
			url: "/apply_custom_kernel",
			data: JSON.stringify(currentFilterKernel),
			contentType: "application/json; charset=utf-8",
			success: (result) => applyFilterSuccess(result),
			error: (err) => applyFilterError(err)
		});
	} else {
		ajax.post(
			"/apply_filter",
			currentFilterCode,
			(result) => applyFilterSuccess(result),
			(err) => applyFilterError(err)
		);
	}
});

function applyFilterSuccess(result) {
	spinnerAreaBottom.addClass(dNone);
	
	filteredAudioDiv.removeClass('disabled');
	filteredAudioDiv.html(createFilteredAudioTag(result.audio));
	
	filteredWaveImg.attr('src', result.wave);
	filteredSpecImg.attr('src', result.spec);
}

function applyFilterError(err) {
	spinnerAreaBottom.addClass(dNone);
	showModalError(err);
}

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

changeKernelBtn.click(() => {
	currentFilterCode = 'CK3';
	selectFilter.val(currentFilterCode);

	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			$(`#kernel${i}${j}`).attr('disabled', false);
		}
	}
});


// https://stackoverflow.com/questions/23575218/convert-decimal-number-to-fraction-in-javascript-or-closest-fraction
// function gcd(a, b) {
// 	// Since there is a limited precision we need to limit the value.
// 	if (b < 0.0000001) return a;

// 	// Discard any fractions due to limitations in precision.
// 	return gcd(b, Math.floor(a % b));
// }
// function getFraction(decimal) {
// 	const len = decimal.toString().length - 2;
// 	let denominator = Math.pow(10, len);
// 	let numerator = decimal * denominator;
// 	const divisor = gcd(numerator, denominator);

// 	numerator /= divisor;
// 	denominator /= divisor;

// 	return Math.floor(numerator) + '/' + Math.floor(denominator);
// }