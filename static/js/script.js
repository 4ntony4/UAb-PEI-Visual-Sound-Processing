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
	  selectMatrixSize = $('#selectMatrixSize'),
	  applyFilterBtn = $('#applyFilterBtn'),
	  changeKernelBtn = $('#changeKernelBtn'),
	  kernel = $('#kernel'),
	  filterToggleBtn = $('#filterToggleBtn');

let file;
let filters;
let currentFilterCode;
let currentFilterKernel = null;
let currentMatrixSize;
const ckx = 'CKX';
const mdn = 'MDN';
const minMatrixSize = 3;
const defaultColumns = 11;

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
	spinnerFooter.addClass(dNone);
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
		mainDiv.removeClass(dNone);
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
				waveBtn.click();
			}
		);

		fillMatrixSizeSelect();

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
			},
			(_) => spinnerFooter.addClass(dNone)
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

function fillMatrixSizeSelect() {
	selectMatrixSize.empty();

	const optionTitle = new Option('Kernel Size', 0);
	optionTitle.setAttribute("disabled", "disabled");
	selectMatrixSize.append(optionTitle);

	for (let i = minMatrixSize; i <= defaultColumns; i += 2) {
		const option = new Option(`${i} x ${i}`, i);
		selectMatrixSize.append(option);
	}

	currentMatrixSize = Number(selectMatrixSize.val());
}

selectFilter.change(() => {
	kernel.addClass(dNone);
	currentFilterCode = selectFilter.val();

	if (currentFilterCode == "0") {
		applyFilterBtn.attr('disabled', true);
		applyFilterBtn.removeClass(lighterBackground);
		selectMatrixSize.addClass(dNone);
	} else {
		applyFilterBtn.attr('disabled', false);
		applyFilterBtn.addClass(lighterBackground);
		if (currentFilterCode == mdn) {
			selectMatrixSize.addClass(dNone);
		}
		else selectMatrixSize.removeClass(dNone);
	}

	const currentFilter = filters.find((element) => element.code == currentFilterCode);
	if (currentFilter) {
		if (currentFilterCode == ckx) {
			selectMatrixSize.attr('disabled', false);
		} else {
			selectMatrixSize.attr('disabled', true);
		}

		if (currentFilter.kernel) {
			currentFilterKernel = currentFilter.kernel;
			currentMatrixSize = currentFilterKernel.length;
			selectMatrixSize.val(currentMatrixSize);
		}
	}
	else currentFilterKernel = null;

	fillKernelForm();
});

selectMatrixSize.change(() => {
	currentMatrixSize = Number(selectMatrixSize.val());
	fillKernelForm();

});

function fillKernelForm() {
	if (currentFilterKernel && currentFilterCode != mdn) {
		kernelMatrixSize = currentFilterKernel.length;

		buildMatrixForm(currentMatrixSize);
		kernel.removeClass(dNone);

		if (currentFilterCode != ckx) changeKernelBtn.removeClass(dNone);
		else changeKernelBtn.addClass(dNone);

		for (let i = 0; i < currentMatrixSize; i++) {
			for (let j = 0; j < currentMatrixSize; j++) {
				if (i < kernelMatrixSize && j < kernelMatrixSize && currentFilterKernel[i][j]) {
					$(`#kernel${i}${j}`).val(currentFilterKernel[i][j]);
				}
				else $(`#kernel${i}${j}`).val(0);

				if (currentFilterCode == ckx) $(`#kernel${i}${j}`).attr('disabled', false);
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
	if (size > defaultColumns) {
		for (let i = 0; i < size; i++) {
			gridTemplateColumns += "1fr "
		}
	} else {
		for (let i = 0; i < defaultColumns; i++) {
			gridTemplateColumns += "1fr "
		}
	}

	for (let i = 0; i < size; i++) {
		matrixDiv += `<div id="kernelRow${i}" class="d-grid" style="grid-template-columns: ${gridTemplateColumns};">`;
		for (let j = 0; j < size; j++) {
			matrixDiv += `<div class="small-p"><input class="form-control" type="text" id="kernel${i}${j}" name="kernel${i}${j}" disabled></div>`;
		}
		matrixDiv += `</div>`;
	}
	kernel.html(matrixDiv);
}

applyFilterBtn.click(() => {
	spinnerAreaBottom.removeClass(dNone);

	if (currentFilterCode == ckx) {
		let customArray = Array(currentMatrixSize);
		for (let i = 0; i < currentMatrixSize; i++) {
			customArray[i] = Array(currentMatrixSize);
			for (let j = 0; j < currentMatrixSize; j++) {
				customArray[i][j] = parseFloat($(`#kernel${i}${j}`).val());
			}
		}
		$.ajax({
			type: "POST",
			url: "/apply_custom_kernel",
			data: JSON.stringify(customArray),
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
	selectMatrixSize.attr('disabled', false);
	currentFilterCode = ckx;
	selectFilter.val(currentFilterCode);
	const matrixSize = currentFilterKernel.length;

	for (let i = 0; i < matrixSize; i++) {
		for (let j = 0; j < matrixSize; j++) {
			$(`#kernel${i}${j}`).attr('disabled', false);
		}
	}
});

filterToggleBtn.click(() => {
	$('#chevron').toggleClass('rotate180');
});