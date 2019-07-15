function attachEvents() {
    const WEATHER_SYMBOLS = {
        SUNNY: '&#x2600',
        PARTLY_SUNNY: '&#x26C5',
        OVERCAST: '&#x2601',
        RAIN: '&#x2614',
        DEGREES: '&#176'
    }

    const btn = document.getElementById('submit');
    const forecastDiv = document.getElementById('forecast');
    const currentCondition = document.getElementById('current');
    const upcomingCondition = document.getElementById('upcoming');

    const basicUrl = 'https://judgetests.firebaseio.com/';
    const locationAddition = 'locations.json';

    const getLocationCode = async () => {
        const locationName = document.getElementById('location').value;

        const response = await fetch(basicUrl + locationAddition);

        if (response.status !== 200) {
            throw new Error();
        }

        const locations = await response.json();
        const location = locations.filter(l => l.name === locationName)[0];
        return location.code;
    }

    const getForecast = async (url) => {
        const response = await fetch(url);
        if (response.status !== 200) {
            throw new Error();
        }

        const conditionData = await response.json();
        return conditionData;
    }

    const createNewSpanElement = (className, text = '') => {
        const span = document.createElement('span');
        span.className = className;
        span.innerHTML = text;
        return span;
    }

    const loadCurrentForecast = (data) => {
        currentCondition.innerHTML = '<div class="label">Current conditions</div>';
        const div = document.createElement('div');
        div.className = 'forecasts';

        const condition = data.forecast.condition.split(' ').map(x => x.toUpperCase()).join('_');
        const symbol = WEATHER_SYMBOLS[condition];
        const symbolSpan = createNewSpanElement('condition symbol', symbol);

        const conditionSpan = createNewSpanElement('condition');
        const nameSpan = createNewSpanElement('forecast-data', data.name);
        conditionSpan.appendChild(nameSpan);

        const degreeSpanText = `${data.forecast.low}${WEATHER_SYMBOLS.DEGREES}/${data.forecast.high}${WEATHER_SYMBOLS.DEGREES}`;
        const degreeSpan = createNewSpanElement('forecast-data', degreeSpanText);
        conditionSpan.appendChild(degreeSpan);

        const descriptionSpan = createNewSpanElement('forecast-data', data.forecast.condition);
        conditionSpan.appendChild(descriptionSpan);

        div.appendChild(symbolSpan);
        div.appendChild(conditionSpan);
        currentCondition.appendChild(div);
    }

    const loadUpcomingForecast = (data) => {
        upcomingCondition.innerHTML = '<div class="label">Three-day forecast</div>';
        const div = document.createElement('div');
        div.className = 'forecast-info';


        data.forecast.forEach(f => {
            const upcomingSpan = createNewSpanElement('upcoming');

            const condition = f.condition.split(' ').map(x => x.toUpperCase()).join('_');
            const symbol = WEATHER_SYMBOLS[condition];
            const symbolSpan = createNewSpanElement('symbol', symbol);
            upcomingSpan.appendChild(symbolSpan);

            const degreeSpanText = `${f.low}${WEATHER_SYMBOLS.DEGREES}/${f.high}${WEATHER_SYMBOLS.DEGREES}`;
            const degreeSpan = createNewSpanElement('forecast-data', degreeSpanText);
            upcomingSpan.appendChild(degreeSpan);


            const descriptionSpan = createNewSpanElement('forecast-data', f.condition);
            upcomingSpan.appendChild(descriptionSpan);
            div.appendChild(upcomingSpan);
        })

        upcomingCondition.appendChild(div);

    }

    const loadForecast = (currentConditionData, upcomingConditionData) => {
        forecastDiv.style.display = 'block';
        document.querySelector('.label').textContent = 'Current conditions';
        document.getElementById('upcoming').style.display = 'block';

        loadCurrentForecast(currentConditionData);
        loadUpcomingForecast(upcomingConditionData);
    }

    const loadErrorMessage = () => {
        forecastDiv.style.display = 'block';
        document.querySelector('.label').textContent = 'Error';
        upcomingCondition.style.display = 'none';
        const currentConditionLastChild = currentCondition.lastChild;
        const upcomingConditionChild = upcomingCondition.firstChild;
        currentConditionLastChild.remove();
        upcomingConditionChild.remove();
    }

    const handleEvent = async () => {
        try {
            const code = await getLocationCode();
            const currentConditionUrlAddition = `forecast/today/${code}.json`;
            const upcomingConditionUrlAddition = `forecast/upcoming/${code}.json`;
            const currentConditionData = await getForecast(basicUrl + currentConditionUrlAddition);
            const upcomingConditionData = await getForecast(basicUrl + upcomingConditionUrlAddition);

            loadForecast(currentConditionData, upcomingConditionData);
        } catch (error) {
           loadErrorMessage();
        }
    }

    btn.addEventListener('click', handleEvent)
}

attachEvents();