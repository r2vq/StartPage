// constants

const ATTR_HINT = "data-hint";
const ATTR_URL = "data-url";
const ATTR_SRC = "src";
const ATTR_STYLE = "style";
const CLASS_AUTHOR = "author";
const CLASS_BUTTON = "button";
const CLASS_BUTTONS = "buttons";
const CLASS_CLOCK = "clock";
const CLASS_CONTAINER = "container";
const CLASS_DATE = "date";
const CLASS_ERROR = "error";
const CLASS_FOREGROUND = "foreground";
const CLASS_HINT = "hintable";
const CLASS_QOTD = "qotd";
const CLASS_QUOTE = "quote";
const CONFIG_IMAGE_TYPE_ASSET = "asset";
const CONFIG_IMAGE_TYPE_AWESOME = "awesome";
const CONFIG_KEY_BUTTONS = "buttons";
const CONFIG_KEY_DATE = "date";
const CONFIG_KEY_QUOTE = "quote";
const CONFIG_KEY_TIME = "time";
const DATE_LOCALE = "en-CA";
const DATE_OPTIONS = {
	weekday: "long",
	month: "long",
	day: "numeric"
};
const ELEMENT_DIV = "div";
const ELEMENT_ICON = "i";
const ELEMENT_IMG = "img";
const ERROR_MESSAGE_QOTD = "Error retrieving Quote of the Day";
const EVENT_CLICK = "click";
const EVENT_KEYPRESS = "keypress";
const KEY_FIND = "f";
const KEY_REFRESH = "r";
const REFRESH_INTERVAL = 1000;
const REQUEST_URL_QOTD = "http://quotes.stormconsultancy.co.uk/random.json";
const REQUEST_TYPE_GET = "GET";
const RESPONSE_STATE_OK = 4;
const RESPONSE_STATUS_GOOD = 200;
const STORAGE_KEY_QOTD = "qotd";
const STYLE_KEY_BUTTON_COLOR = "--btn-color";
const TIME_LOCALE = "en-CA";
const TIME_OPTIONS = {
	timeStyle: "short",
	hour12: false
};

// global variables

let isHintEnabled = false;

// extension functions

Array.prototype.mapNotNull = function(mapper) {
	return this.map(mapper).filter(item => item !== null);
};

// functions

const getQotd = () => {
	let now = new Date(Date.now()).toDateString();
	let cached = JSON.parse(localStorage.getItem(STORAGE_KEY_QOTD));
	if (cached && cached.date === now) {
		return Promise.resolve(cached);
	} else {
		return new Promise((resolve, reject) => {
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == RESPONSE_STATE_OK) {
					if (this.status == RESPONSE_STATUS_GOOD) {
						let responseBody = JSON.parse(this.responseText);
						let qotd = {
							date: now,
							quote: responseBody.quote,
							author: responseBody.author
						};
						localStorage.setItem(STORAGE_KEY_QOTD, JSON.stringify(qotd));
						resolve(qotd);
					} else {
						reject(ERROR_MESSAGE_QOTD);
					}
				}
			};
			xhttp.open(REQUEST_TYPE_GET, REQUEST_URL_QOTD, true);
			xhttp.send();
		});
	}
};

const onItemSelected = (element) => {
	location.assign(element.dataset.url);
};

const onKeyPress = (event) => {
	if (event.key === KEY_FIND) {
		toggleAllHintables(!isHintEnabled);
		return;
	}

	if (isHintEnabled) {
		if (event.key === KEY_REFRESH) {
			location.reload();
			return;
		}

		document.querySelectorAll(`.${CLASS_BUTTON}`)
			.forEach((button) => {
				if (event.key === button.dataset.hint) {
					onItemSelected(button);
					return;
				}
			});
	} else {
		isHintEnabled = false;
	}


	toggleAllHintables(false);
	console.log(`Unmapped keypress: ${event.key}`);
};

const parseButton = (button) => {
	let div = document.createElement(ELEMENT_DIV);
	let image = parseButtonImage(button.image);
	if (image !== null) {
		div.appendChild(image);
	}
	div.classList.add(CLASS_BUTTON);
	div.setAttribute(ATTR_HINT, button.key);
	div.setAttribute(ATTR_URL, button.url);
	div.setAttribute(ATTR_STYLE, `${STYLE_KEY_BUTTON_COLOR}: ${button.color}`);
	return div;
};

const parseButtonImage = (image) => {
	switch(image.type) {
		case CONFIG_IMAGE_TYPE_AWESOME:
			let awesome = document.createElement(ELEMENT_ICON);
			image.classes.forEach(className => awesome.classList.add(className));
			return awesome;
		case CONFIG_IMAGE_TYPE_ASSET:
			let asset = document.createElement(ELEMENT_IMG);
			asset.src = image.url;
			return asset;
		default:
			return null;
	}
	return image;
};

const parseButtons = (module) => {
	let div = document.createElement(ELEMENT_DIV);
	let data = module.data || [];
	data
		.mapNotNull(parseButton)
		.forEach(button => div.appendChild(button));

	div.classList.add(CLASS_BUTTONS);
	return div;
};

const parseDate = (module) => {
	let div = document.createElement(ELEMENT_DIV);
	div.classList.add(CLASS_DATE);
	return div;
};

const parseForegroundImage = (image) => {
	let img = document.createElement(ELEMENT_IMG);
	img.classList.add(CLASS_FOREGROUND);
	img.setAttribute(ATTR_SRC, image);
	return img;
};

const parseQuote = (module) => {
	let div = document.createElement(ELEMENT_DIV);
	div.classList.add(CLASS_QOTD);
	getQotd()
		.then(qotd => {
			let quoteDiv = document.createElement(ELEMENT_DIV);
			quoteDiv.classList.add(CLASS_QUOTE);
			quoteDiv.textContent = qotd.quote;
			div.appendChild(quoteDiv);

			let authorDiv = document.createElement(ELEMENT_DIV);
			authorDiv.classList.add(CLASS_AUTHOR);
			authorDiv.textContent = `- ${qotd.author}`;
			div.appendChild(authorDiv);
		})
		.catch(err => {
			let errorDiv = document.createElement(ELEMENT_DIV);
			quoteDiv.classList.add(CLASS_ERROR);
			errorDiv.textContent = err;
			div.appendChild(errorDiv);
		});
	return div;
};

const parseTime = (module) => {
	let div = document.createElement(ELEMENT_DIV);
	div.classList.add(CLASS_CLOCK);
	return div;
};

const parseModule = (module) => {
	switch(module.type) {
		case CONFIG_KEY_DATE:
			return parseDate(module);
		case CONFIG_KEY_TIME:
			return parseTime(module);
		case CONFIG_KEY_BUTTONS:
			return parseButtons(module);
		case CONFIG_KEY_QUOTE:
			return parseQuote(module);
		default:
			return null;
	}
};

const setDateAndTime = (clockElements, dateElements) => {
	let now = new Date();
	let timeString = now.toLocaleTimeString(TIME_LOCALE, TIME_OPTIONS);
	let dateString = now.toLocaleDateString(DATE_LOCALE, DATE_OPTIONS);
	clockElements
		.forEach(element => element.textContent = timeString);
	dateElements
		.forEach(element => element.textContent = dateString);
	setInterval(() => setDateAndTime(clockElements, dateElements), REFRESH_INTERVAL);
};

const toggleAllHintables = (isEnabled) => {
	isHintEnabled = isEnabled;
	document
		.querySelectorAll(`.${CLASS_BUTTON}`)
		.forEach(element => isEnabled ? element.classList.add(CLASS_HINT) : element.classList.remove(CLASS_HINT));
};

// main method

let main = (() => {
	let body = document.body;
	let containers = body.querySelectorAll(`.${CLASS_CONTAINER}`);

	body.appendChild(parseForegroundImage(config.foreground));
	body.style.backgroundImage = `url(${config.background})`;

	config
		.modules
		.mapNotNull(parseModule)
		.forEach(module => containers.forEach(container => container.appendChild(module)));

	document.querySelectorAll(`.${CLASS_BUTTON}`)
		.forEach(element => element.addEventListener(EVENT_CLICK, () => onItemSelected(element)));

	document
		.addEventListener(EVENT_KEYPRESS, onKeyPress);

	let clockElements = document
		.querySelectorAll(`.${CLASS_CLOCK}`);
	let dateElements = document
		.querySelectorAll(`.${CLASS_DATE}`);
	setDateAndTime(clockElements, dateElements);
})();
