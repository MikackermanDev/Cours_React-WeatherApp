import "./style.css";
import { getWeather } from "./weather";
import { ICON_MAP } from "./iconMap";

getWeather(50.633333, 3.066667, Intl.DateTimeFormat().resolvedOptions().timeZone)
	.then(renderWeather)
	.catch((e) => {
		console.error(e);
		alert("Erreur d'acquisition de la méteo");
	});

function renderWeather({ current, daily, hourly }) {
	renderCurrentWeather(current);
	renderDailyWeather(daily);
	renderHourlyWeather(hourly);
}

function setValue(selector, value, { parent = document } = {}) {
	parent.querySelector(`[data-${selector}]`).textContent = value;
}

// helper function
function getIconUrl(iconCode) {
	return `icons/${ICON_MAP.get(iconCode)}.svg`;
}

const currentIcon = document.querySelector("[data-current-icon]");

function renderCurrentWeather(current) {
	currentIcon.src = getIconUrl(current.iconCode);
	setValue("current-temp", current.currentTemp);
	setValue("current-high", current.highTemp);
	setValue("current-low", current.lowTemp);
	setValue("current-fl-high", current.highFeelsLike);
	setValue("current-fl-low", current.lowFeelsLike);
	setValue("current-wind", current.windSpeed);
	setValue("current-precip", current.precip);
}

const DAY_FORMATTER = Intl.DateTimeFormat(undefined, { weekday: "long" });
const dailySection = document.querySelector("[data-day-section]");
const dayCardTemplate = document.getElementById("day-card-template");

function renderDailyWeather(daily) {
	dailySection.innerHTML = "";
	daily.forEach((day) => {
		const elt = dayCardTemplate.content.cloneNode(true);
		setValue("temp", day.maxTemp, { parent: elt });
		setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: elt });
		elt.querySelector("[data-icon]").src = getIconUrl(day.iconCode);
		dailySection.append(elt);
	});
}

const HOUR_FORMATTER = Intl.DateTimeFormat(undefined, { hour: "numeric" });
const hourlySection = document.querySelector("[data-hour-section]");
const hourRowTemplate = document.getElementById("hour-row-template");

function renderHourlyWeather(hourly) {
	hourlySection.innerHTML = "";
	hourly.forEach((hour) => {
		const elt = hourRowTemplate.content.cloneNode(true);
		setValue("temp", hour.temp, { parent: elt });
		setValue("fl-temp", hour.feelsLike, { parent: elt });
		setValue("vent", hour.windSpeed, { parent: elt });
		setValue("pluie", hour.precip, { parent: elt });
		setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: elt });
		setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: elt });
		elt.querySelector("[data-icon]").src = getIconUrl(hour.iconCode);
		hourlySection.append(elt);
	});
}
