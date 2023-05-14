(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Прокинувся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if (this._dataValue !== "error") {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Йой, не заповнено атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && e.which == 9 && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Відкрив попап`);
                } else this.popupLogging(`Йой, такого попапу немає. Перевірте коректність введення. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрив попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            this.youTubeCode = buttons.getAttribute(this.options.youtubeAttribute) ? buttons.getAttribute(this.options.youtubeAttribute) : null;
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && focusedIndex === 0) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if (place === "last" || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if (place === "first") {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (parent.children[index] !== void 0) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if (this.type === "min") arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return -1;
                    if (a.place === "last" || b.place === "first") return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if (a.place === "first" || b.place === "last") return 1;
                        if (a.place === "last" || b.place === "first") return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    const currentUrl = "https://ipapi.co/json";
    const position = document.getElementById("position");
    async function getPosition() {
        const response = await fetch(currentUrl);
        const data = await response.json();
        data["regionName"];
        const cityName = data["city"];
        position.innerText = cityName;
        console.log(cityName);
    }
    getPosition();
    const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=49.80&longitude=24.78&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,weathercode,cloudcover_low,cloudcover_mid,cloudcover_high&models=best_match&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_hours,precipitation_probability_max&current_weather=true&timezone=auto";
    const currentWheatherinHtml = document.getElementById("current_wheather");
    const htmlCurrentTemp = document.getElementById("current_temp");
    const currentWheatherImageinHtml = document.getElementById("image_wheather");
    const htmlwindspeed = document.getElementById("wind");
    const htmlhum = document.getElementById("hum");
    const htmlrain = document.getElementById("rain");
    const htmlNumberDate = document.getElementById("number-date");
    const htmlMonthDate = document.getElementById("month-date");
    const htmlDayDate = document.getElementById("day-date");
    const htmlTimeDate = document.getElementById("time-date");
    async function getWeather() {
        const response = await fetch(apiUrl);
        const getData = await response.json();
        const currentWheather = getData["current_weather"]["weathercode"];
        const windspeed = getData["current_weather"]["windspeed"];
        htmlwindspeed.innerText = windspeed;
        const CurrentTemp = getData["current_weather"]["temperature"];
        htmlCurrentTemp.innerText = CurrentTemp;
        const precipitationProbability = getData["hourly"]["precipitation_probability"];
        let newPrecipitationProbability = [];
        for (let i = 0; i <= 24; i++) newPrecipitationProbability.push(precipitationProbability[i]);
        let sumPrecipitationProbability = 0;
        let averagePrecipitationProbability = 0;
        for (let j = 0; j < newPrecipitationProbability.length; j++) sumPrecipitationProbability += newPrecipitationProbability[j];
        averagePrecipitationProbability = sumPrecipitationProbability / newPrecipitationProbability.length;
        let precipitationProbabilityString = "-";
        if (averagePrecipitationProbability !== void 0 && !isNaN(averagePrecipitationProbability)) precipitationProbabilityString = averagePrecipitationProbability + "%";
        console.log(precipitationProbabilityString);
        htmlrain.innerText = precipitationProbabilityString;
        console.log(averagePrecipitationProbability);
        const humProbability = getData["hourly"]["relativehumidity_2m"];
        let newRelativehumidity = [];
        for (let i = 0; i <= 24; i++) newRelativehumidity.push(humProbability[i]);
        let sumRelativehumidity = 0;
        let aveRelativehumidity = 0;
        for (let j = 0; j < newRelativehumidity.length; j++) sumRelativehumidity += newRelativehumidity[j];
        aveRelativehumidity = sumRelativehumidity / newRelativehumidity.length;
        console.log(aveRelativehumidity);
        let humProbabilityString = "-";
        if (aveRelativehumidity !== void 0 && !isNaN(aveRelativehumidity)) humProbabilityString = aveRelativehumidity + "%";
        htmlhum.innerText = humProbabilityString;
        const currentDate = getData["current_weather"]["time"];
        const dateObj = new Date(currentDate);
        const daysOfWeek = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
        const monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        const dayOfWeek = daysOfWeek[dateObj.getDay()];
        const month = monthNames[dateObj.getMonth()];
        const dayOfMonth = dateObj.getDate();
        const now = new Date;
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, "0");
        console.log(hours);
        htmlNumberDate.innerText = dayOfMonth;
        htmlMonthDate.innerText = month;
        htmlDayDate.innerText = dayOfWeek;
        htmlTimeDate.innerText = `${hours}:${minutes}`;
        console.log(currentWheather);
        let weather_description = "";
        let weather_image = "";
        if (currentWheather === 0 || currentWheather === 1) {
            weather_description = "Clear sky";
            weather_image = "img/image/Sun.svg";
        } else if (currentWheather === 2) {
            if (hours >= 6 && hours < 21) {
                weather_description = "Partly cloudy";
                weather_image = "img/image/sun small-clouds.svg";
            }
            if (hours === 21 || hours === 22 || hours === 23 || hours === 24 || hours === 0 || hours === 1 || hours === 2 || hours === 3 || hours === 4 || hours === 5) {
                weather_description = "Moon cloudy";
                weather_image = "img/image/halfmoonclouds.svg";
            }
        } else if (currentWheather >= 3 && currentWheather <= 44) {
            weather_description = "Overcast";
            weather_image = "img/image/sun clouds.svg";
        } else if (currentWheather >= 45 && currentWheather <= 48) {
            weather_description = "Fog";
            weather_image = "img/image/Fog.png";
        } else if (currentWheather > 48 && currentWheather <= 55) {
            weather_description = "Drizzle: Light, moderate, and dense intensity";
            weather_image = "img/image/sun rain.svg";
        } else if (currentWheather > 55 && currentWheather <= 66) {
            weather_description = "Rain";
            weather_image = "img/image/rain.svg";
        } else {
            weather_description = "Thunder";
            weather_image = "img/image/Thunder.svg";
        }
        currentWheatherinHtml.innerText = weather_description;
        currentWheatherImageinHtml.setAttribute("src", weather_image);
        console.log(weather_description);
        const htmlSecondDay = document.getElementById("day2");
        const secondDay = getData["daily"]["time"][1];
        const getSecondDay = new Date(secondDay);
        const seconddayOfWeek = daysOfWeek[getSecondDay.getDay()];
        htmlSecondDay.innerText = seconddayOfWeek;
        const htmlSecondTemp = document.getElementById("temp2");
        const secondTemp = getData["daily"]["temperature_2m_max"][1];
        htmlSecondTemp.innerText = secondTemp;
        const htmlSecondImage = document.getElementById("image2");
        const secondImage = getData["daily"]["weathercode"][1];
        let weather_imageSecond = "";
        if (secondImage === 0 || secondImage === 1) weather_imageSecond = "img/image/Sun.svg"; else if (secondImage === 2) weather_imageSecond = "img/image/sun small-clouds.svg"; else if (secondImage >= 3 && secondImage <= 44) weather_imageSecond = "img/image/sun clouds.svg"; else if (secondImage >= 45 && secondImage <= 48) weather_imageSecond = "img/image/Fog.png"; else if (secondImage > 48 && secondImage <= 55) weather_imageSecond = "img/image/sun rain.svg"; else if (secondImage > 55 && secondImage <= 66) weather_imageSecond = "img/image/rain.svg"; else weather_imageSecond = "img/image/Thunder.svg";
        htmlSecondImage.setAttribute("src", weather_imageSecond);
        const htmlThirdDay = document.getElementById("day3");
        const thirdDay = getData["daily"]["time"][2];
        const getThirdDay = new Date(thirdDay);
        const ThirddayOfWeek = daysOfWeek[getThirdDay.getDay()];
        htmlThirdDay.innerText = ThirddayOfWeek;
        const htmlThirdTemp = document.getElementById("temp3");
        const thirdTemp = getData["daily"]["temperature_2m_max"][2];
        htmlThirdTemp.innerText = thirdTemp;
        const htmlThirdImage = document.getElementById("image3");
        const thirdImage = getData["daily"]["weathercode"][2];
        let weather_imageThird = "";
        if (thirdImage === 0 || thirdImage === 1) weather_imageThird = "img/image/Sun.svg"; else if (thirdImage === 2) weather_imageThird = "img/image/sun small-clouds.svg"; else if (thirdImage >= 3 && thirdImage <= 44) weather_imageThird = "img/image/sun clouds.svg"; else if (thirdImage >= 45 && thirdImage <= 48) weather_imageThird = "img/image/Fog.png"; else if (thirdImage > 48 && thirdImage <= 55) weather_imageThird = "img/image/sun rain.svg"; else if (thirdImage > 55 && thirdImage <= 66) weather_imageThird = "img/image/rain.svg"; else weather_imageThird = "img/image/Thunder.svg";
        htmlThirdImage.setAttribute("src", weather_imageThird);
        const htmlFourthDay = document.getElementById("day4");
        const fourthDay = getData["daily"]["time"][3];
        const getFourthDay = new Date(fourthDay);
        const FourthdayOfWeek = daysOfWeek[getFourthDay.getDay()];
        htmlFourthDay.innerText = FourthdayOfWeek;
        const htmlFourthTemp = document.getElementById("temp4");
        const fourthTemp = getData["daily"]["temperature_2m_max"][3];
        htmlFourthTemp.innerText = fourthTemp;
        const htmlFourthImage = document.getElementById("image4");
        const fourthImage = getData["daily"]["weathercode"][3];
        let weather_imageFourth = "";
        if (fourthImage === 0 || fourthImage === 1) weather_imageFourth = "img/image/Sun.svg"; else if (fourthImage === 2) weather_imageFourth = "img/image/sun small-clouds.svg"; else if (fourthImage >= 3 && fourthImage <= 44) weather_imageFourth = "img/image/sun clouds.svg"; else if (fourthImage >= 45 && fourthImage <= 48) weather_imageFourth = "img/image/Fog.png"; else if (fourthImage > 48 && fourthImage <= 55) weather_imageFourth = "img/image/sun rain.svg"; else if (fourthImage > 55 && fourthImage <= 66) weather_imageFourth = "img/image/rain.svg"; else weather_imageFourth = "img/image/Thunder.svg";
        htmlFourthImage.setAttribute("src", weather_imageFourth);
        const htmlFifthhDay = document.getElementById("day5");
        const fifthDay = getData["daily"]["time"][4];
        const getfifthDay = new Date(fifthDay);
        const FifthdayOfWeek = daysOfWeek[getfifthDay.getDay()];
        htmlFifthhDay.innerText = FifthdayOfWeek;
        console.log(FifthdayOfWeek + " this");
        const htmlFifthTemp = document.getElementById("temp5");
        const fifthTemp = getData["daily"]["temperature_2m_max"][4];
        htmlFifthTemp.innerText = fifthTemp;
        const htmlFifthImage = document.getElementById("image5");
        const fifthImage = getData["daily"]["weathercode"][4];
        let weather_imageFifth = "";
        if (fifthImage === 0 || fifthImage === 1) weather_imageFifth = "img/image/Sun.svg"; else if (fifthImage === 2) weather_imageFifth = "img/image/sun small-clouds.svg"; else if (fifthImage >= 3 && fifthImage <= 44) weather_imageFifth = "img/image/sun clouds.svg"; else if (fifthImage >= 45 && fifthImage <= 48) weather_imageFifth = "img/image/Fog.png"; else if (fifthImage > 48 && fifthImage <= 55) weather_imageFifth = "img/image/sun rain.svg"; else if (fifthImage > 55 && fifthImage <= 66) weather_imageFifth = "img/image/rain.svg"; else weather_imageFifth = "img/image/Thunder.svg";
        htmlFifthImage.setAttribute("src", weather_imageFifth);
        const htmlSixthDay = document.getElementById("day6");
        const sixthDay = getData["daily"]["time"][5];
        const getsixthDay = new Date(sixthDay);
        const SixthdayOfWeek = daysOfWeek[getsixthDay.getDay()];
        htmlSixthDay.innerText = SixthdayOfWeek;
        const htmlSixthTemp = document.getElementById("temp6");
        const sixthTemp = getData["daily"]["temperature_2m_max"][5];
        htmlSixthTemp.innerText = sixthTemp;
        const htmlSixthImage = document.getElementById("image6");
        const sixthImage = getData["daily"]["weathercode"][5];
        let weather_imageSixth = "";
        if (sixthImage === 0 || sixthImage === 1) weather_imageSixth = "img/image/Sun.svg"; else if (sixthImage === 2) weather_imageSixth = "img/image/sun small-clouds.svg"; else if (sixthImage >= 3 && sixthImage <= 44) weather_imageSixth = "img/image/sun clouds.svg"; else if (sixthImage >= 45 && sixthImage <= 48) weather_imageSixth = "img/image/Fog.png"; else if (sixthImage > 48 && sixthImage <= 55) weather_imageSixth = "img/image/sun rain.svg"; else if (sixthImage > 55 && sixthImage <= 66) weather_imageSixth = "img/image/rain.svg"; else weather_imageSixth = "img/image/Thunder.svg";
        htmlSixthImage.setAttribute("src", weather_imageSixth);
        const htmlSeventhDay = document.getElementById("day7");
        const seventhDay = getData["daily"]["time"][6];
        const getseventhDay = new Date(seventhDay);
        const SeventhdayOfWeek = daysOfWeek[getseventhDay.getDay()];
        htmlSeventhDay.innerText = SeventhdayOfWeek;
        const htmlSeventhTemp = document.getElementById("temp7");
        const seventhTemp = getData["daily"]["temperature_2m_max"][6];
        htmlSeventhTemp.innerText = seventhTemp;
        const htmlSeventhImage = document.getElementById("image7");
        const seventhImage = getData["daily"]["weathercode"][6];
        let weather_imageSeventh = "";
        if (seventhImage === 0 || seventhImage === 1) weather_imageSeventh = "img/image/Sun.svg"; else if (seventhImage === 2) weather_imageSeventh = "img/image/sun small-clouds.svg"; else if (seventhImage >= 3 && seventhImage <= 44) weather_imageSeventh = "img/image/sun clouds.svg"; else if (seventhImage >= 45 && seventhImage <= 48) weather_imageSeventh = "img/image/Fog.png"; else if (seventhImage > 48 && seventhImage <= 55) weather_imageSeventh = "img/image/sun rain.svg"; else if (seventhImage > 55 && seventhImage <= 66) weather_imageSeventh = "img/image/rain.svg"; else weather_imageSeventh = "img/image/Thunder.svg";
        htmlSeventhImage.setAttribute("src", weather_imageSeventh);
        console.log(seconddayOfWeek);
        const currentHourlyDate = getData["hourly"]["time"];
        const htmlHour1 = document.getElementById("hour1");
        const htmlHour2 = document.getElementById("hour2");
        const htmlHour3 = document.getElementById("hour3");
        const htmlHour4 = document.getElementById("hour4");
        const htmlHour5 = document.getElementById("hour5");
        const htmlHour6 = document.getElementById("hour6");
        const htmlHour7 = document.getElementById("hour7");
        const htmlHour8 = document.getElementById("hour8");
        const htmlHour9 = document.getElementById("hour9");
        const htmlHour10 = document.getElementById("hour10");
        const htmlHour11 = document.getElementById("hour11");
        const htmlHour12 = document.getElementById("hour12");
        let newcurrentHourlyDate = [];
        for (let i = 0; i <= 23; i++) newcurrentHourlyDate.push(currentHourlyDate[i]);
        const hour1 = newcurrentHourlyDate[0];
        const getDatehour = new Date(hour1);
        const hours1 = getDatehour.getHours();
        const minutes1 = getDatehour.getMinutes().toString().padStart(2, "0");
        const formattedDate1 = `${hours1}:${minutes1}`;
        htmlHour1.innerText = formattedDate1;
        const hour2 = newcurrentHourlyDate[2];
        const getDatehour2 = new Date(hour2);
        const hours2 = getDatehour2.getHours();
        const minutes2 = getDatehour2.getMinutes().toString().padStart(2, "0");
        const formattedDate2 = `${hours2}:${minutes2}`;
        htmlHour2.innerText = formattedDate2;
        const hour3 = newcurrentHourlyDate[4];
        const getDatehour3 = new Date(hour3);
        const hours3 = getDatehour3.getHours();
        const minutes3 = getDatehour3.getMinutes().toString().padStart(2, "0");
        const formattedDate3 = `${hours3}:${minutes3}`;
        htmlHour3.innerText = formattedDate3;
        const hour4 = newcurrentHourlyDate[6];
        const getDatehour4 = new Date(hour4);
        const hours4 = getDatehour4.getHours();
        const minutes4 = getDatehour4.getMinutes().toString().padStart(2, "0");
        const formattedDate4 = `${hours4}:${minutes4}`;
        htmlHour4.innerText = formattedDate4;
        const hour5 = newcurrentHourlyDate[8];
        const getDatehour5 = new Date(hour5);
        const hours5 = getDatehour5.getHours();
        const minutes5 = getDatehour5.getMinutes().toString().padStart(2, "0");
        const formattedDate5 = `${hours5}:${minutes5}`;
        htmlHour5.innerText = formattedDate5;
        const hour6 = newcurrentHourlyDate[10];
        const getDatehour6 = new Date(hour6);
        const hours6 = getDatehour6.getHours();
        const minutes6 = getDatehour6.getMinutes().toString().padStart(2, "0");
        const formattedDate6 = `${hours6}:${minutes6}`;
        htmlHour6.innerText = formattedDate6;
        const hour7 = newcurrentHourlyDate[12];
        const getDatehour7 = new Date(hour7);
        const hours7 = getDatehour7.getHours();
        const minutes7 = getDatehour7.getMinutes().toString().padStart(2, "0");
        const formattedDate7 = `${hours7}:${minutes7}`;
        htmlHour7.innerText = formattedDate7;
        const hour8 = newcurrentHourlyDate[14];
        const getDatehour8 = new Date(hour8);
        const hours8 = getDatehour8.getHours();
        const minutes8 = getDatehour8.getMinutes().toString().padStart(2, "0");
        const formattedDate8 = `${hours8}:${minutes8}`;
        htmlHour8.innerText = formattedDate8;
        const hour9 = newcurrentHourlyDate[16];
        const getDatehour9 = new Date(hour9);
        const hours9 = getDatehour9.getHours();
        const minutes9 = getDatehour9.getMinutes().toString().padStart(2, "0");
        const formattedDate9 = `${hours9}:${minutes9}`;
        htmlHour9.innerText = formattedDate9;
        const hour10 = newcurrentHourlyDate[18];
        const getDatehour10 = new Date(hour10);
        const hours10 = getDatehour10.getHours();
        const minutes10 = getDatehour10.getMinutes().toString().padStart(2, "0");
        const formattedDate10 = `${hours10}:${minutes10}`;
        htmlHour10.innerText = formattedDate10;
        const hour11 = newcurrentHourlyDate[20];
        const getDatehour11 = new Date(hour11);
        const hours11 = getDatehour11.getHours();
        const minutes11 = getDatehour11.getMinutes().toString().padStart(2, "0");
        const formattedDate11 = `${hours11}:${minutes11}`;
        htmlHour11.innerText = formattedDate11;
        const hour12 = newcurrentHourlyDate[22];
        const getDatehour12 = new Date(hour12);
        const hours12 = getDatehour12.getHours();
        const minutes12 = getDatehour12.getMinutes().toString().padStart(2, "0");
        const formattedDate12 = `${hours12}:${minutes12}`;
        htmlHour12.innerText = formattedDate12;
        const currentTempDate = getData["hourly"]["temperature_2m"];
        let newcurrentTempDate = [];
        for (let i = 0; i <= 23; i++) newcurrentTempDate.push(currentTempDate[i]);
        console.log(newcurrentTempDate);
        const HourTemp1 = newcurrentTempDate[0];
        const HourTemp2 = newcurrentTempDate[2];
        const HourTemp3 = newcurrentTempDate[4];
        const HourTemp4 = newcurrentTempDate[6];
        const HourTemp5 = newcurrentTempDate[8];
        const HourTemp6 = newcurrentTempDate[10];
        const HourTemp7 = newcurrentTempDate[12];
        const HourTemp8 = newcurrentTempDate[14];
        const HourTemp9 = newcurrentTempDate[16];
        const HourTemp10 = newcurrentTempDate[18];
        const HourTemp11 = newcurrentTempDate[20];
        const HourTemp12 = newcurrentTempDate[22];
        const HtmlHourTemp1 = document.getElementById("hourdeg1");
        const HtmlHourTemp2 = document.getElementById("hourdeg2");
        const HtmlHourTemp3 = document.getElementById("hourdeg3");
        const HtmlHourTemp4 = document.getElementById("hourdeg4");
        const HtmlHourTemp5 = document.getElementById("hourdeg5");
        const HtmlHourTemp6 = document.getElementById("hourdeg6");
        const HtmlHourTemp7 = document.getElementById("hourdeg7");
        const HtmlHourTemp8 = document.getElementById("hourdeg8");
        const HtmlHourTemp9 = document.getElementById("hourdeg9");
        const HtmlHourTemp10 = document.getElementById("hourdeg10");
        const HtmlHourTemp11 = document.getElementById("hourdeg11");
        const HtmlHourTemp12 = document.getElementById("hourdeg12");
        HtmlHourTemp1.innerText = HourTemp1;
        HtmlHourTemp2.innerText = HourTemp2;
        HtmlHourTemp3.innerText = HourTemp3;
        HtmlHourTemp4.innerText = HourTemp4;
        HtmlHourTemp5.innerText = HourTemp5;
        HtmlHourTemp6.innerText = HourTemp6;
        HtmlHourTemp7.innerText = HourTemp7;
        HtmlHourTemp8.innerText = HourTemp8;
        HtmlHourTemp9.innerText = HourTemp9;
        HtmlHourTemp10.innerText = HourTemp10;
        HtmlHourTemp11.innerText = HourTemp11;
        HtmlHourTemp12.innerText = HourTemp12;
        const currentRateDate = getData["hourly"]["temperature_2m"];
        let newcurrentRateDate = [];
        for (let i = 0; i <= 23; i++) newcurrentRateDate.push(currentRateDate[i]);
        const HtmlHourRate1 = document.getElementById("hourrat1");
        const HtmlHourRate2 = document.getElementById("hourrat2");
        const HtmlHourRate3 = document.getElementById("hourrat3");
        const HtmlHourRate4 = document.getElementById("hourrat4");
        const HtmlHourRate5 = document.getElementById("hourrat5");
        const HtmlHourRate6 = document.getElementById("hourrat6");
        const HtmlHourRate7 = document.getElementById("hourrat7");
        const HtmlHourRate8 = document.getElementById("hourrat8");
        const HtmlHourRate9 = document.getElementById("hourrat9");
        const HtmlHourRate10 = document.getElementById("hourrat10");
        const HtmlHourRate11 = document.getElementById("hourrat11");
        const HtmlHourRate12 = document.getElementById("hourrat12");
        const HourRate1 = newcurrentRateDate[0];
        const HourRate2 = newcurrentRateDate[2];
        const HourRate3 = newcurrentRateDate[4];
        const HourRate4 = newcurrentRateDate[6];
        const HourRate5 = newcurrentRateDate[8];
        const HourRate6 = newcurrentRateDate[10];
        const HourRate7 = newcurrentRateDate[12];
        const HourRate8 = newcurrentRateDate[14];
        const HourRate9 = newcurrentRateDate[16];
        const HourRate10 = newcurrentRateDate[18];
        const HourRate11 = newcurrentRateDate[20];
        const HourRate12 = newcurrentRateDate[22];
        HtmlHourRate1.innerText = HourRate1 + "%";
        HtmlHourRate2.innerText = HourRate2 + "%";
        HtmlHourRate3.innerText = HourRate3 + "%";
        HtmlHourRate4.innerText = HourRate4 + "%";
        HtmlHourRate5.innerText = HourRate5 + "%";
        HtmlHourRate6.innerText = HourRate6 + "%";
        HtmlHourRate7.innerText = HourRate7 + "%";
        HtmlHourRate8.innerText = HourRate8 + "%";
        HtmlHourRate9.innerText = HourRate9 + "%";
        HtmlHourRate10.innerText = HourRate10 + "%";
        HtmlHourRate11.innerText = HourRate11 + "%";
        HtmlHourRate12.innerText = HourRate12 + "%";
        console.log(HourRate1);
    }
    getWeather();
    window["FLS"] = true;
    isWebp();
})();