(function () {
    const content = document.getElementById('venue-info');
    const dateSelector = document.getElementById('venueDate');
    const getVenuesBtn = document.getElementById('getVenues');
    const venuesIdsUrl = 'https://baas.kinvey.com/rpc/kid_BJ_Ke8hZg/custom/calendar?query=';
    const venuesUrl = 'https://baas.kinvey.com/appdata/kid_BJ_Ke8hZg/venues/';

    getVenuesBtn.addEventListener('click', loadVenues);

    async function loadVenues() {
        content.innerHTML = '';
        const venueDate = dateSelector.options[dateSelector.selectedIndex].text;
        const venueIdCollection = await getVenueIdCollection(venueDate);

        venueIdCollection.forEach(async (id) => {
            const venue = await getVenue(id);
            displayVenue(venue);
        })
    }

    async function getVenue(id) {
        const url = venuesUrl + id;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic Z3Vlc3Q6cGFzcw=='
                }
            });

            const venue = await responseHandler(response);
            return venue;

        } catch (err) {
            alert(err.message);
        }
    }

    async function getVenueIdCollection(date) {
        const url = venuesIdsUrl + date;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic Z3Vlc3Q6cGFzcw=='
                }
            });

            const idCollection = await responseHandler(response);
            return idCollection;

        } catch (err) {
            alert(err.message);
        }
    }

    function displayVenue(venue) {
        const divWrapper = createElement('div', venue._id, 'venue');

        const nameSpan = createElement('span', null, 'venue-name');
        const spanTextContent = document.createTextNode(venue.name);

        const btnInfo = createElement('input', null, 'info');
        btnInfo.value = 'More info';
        btnInfo.type = 'button';
        btnInfo.addEventListener('click', displayInfo);
        parentAppendChildren(nameSpan, [btnInfo, spanTextContent]);

        const divDetails = createElement('div', null, 'venue-details');
        divDetails.style.display = 'none';
        const table = createElement('table');
        const thead = createElement('tr');
        const thPrice = createElement('th', null, null, 'Ticket Price');
        const thQuantity = createElement('th', null, null, 'Quantity');
        const thEmpty = createElement('th');
        parentAppendChildren(thead, [thPrice, thQuantity, thEmpty]);
        parentAppendChildren(table, [thead]);

        const tbody = createElement('tr');
        const tdVenuePrice = createElement('td', null, 'venue-price', (venue.price + ' lv'));
        const tdVenueQuantity = createElement('td');
        const select = createElement('select', null, 'quantity');

        for (let i = 1; i <= 5; i++) {
            const option = createElement('option', null, null, i);
            option.value = `${i}`;
            select.appendChild(option);
        }

        parentAppendChildren(tdVenueQuantity, [select]);

        const tdPurchase = createElement('td');
        const btnPurchase = createElement('input', null, 'purchase');
        btnPurchase.value = 'Purchase';
        btnPurchase.type = 'button';
        btnPurchase.addEventListener('click', () => {
            loadPurchaseConfirmation(venue);
        });

        parentAppendChildren(tdPurchase, [btnPurchase]);

        parentAppendChildren(tbody, [tdVenuePrice, tdVenueQuantity, tdPurchase]);
        parentAppendChildren(table, [tbody]);

        const spanVenueDescription = createElement('span', null, 'head', 'Venue description:');
        const pDescription = createElement('p', null, 'description', venue.description);
        const pStartingHour = createElement('p', null, 'description', `Starting time: ${venue.startingHour}`);
        parentAppendChildren(divDetails, [table, spanVenueDescription, pDescription, pStartingHour]);


        parentAppendChildren(divWrapper, [nameSpan, divDetails]);
        parentAppendChildren(content, [divWrapper]);
    }

    function displayInfo() {
        const parent = this.parentNode.parentNode;
        const detailsDiv = parent.querySelector('div.venue-details');

        if (detailsDiv.style.display === 'none') {
            detailsDiv.style.display = 'block'
        } else {
            detailsDiv.style.display = 'none';
        }

    }

    function loadPurchaseConfirmation(venue) {
        const parentDiv = document.getElementById(venue._id);
        const quantity = parentDiv.querySelector('select.quantity').value;
        const totalPrice = quantity * venue.price;
        
        content.innerHTML = '';
        const spanHead = createElement('span', null, 'head', 'Confirm purchase');
        const divPurchaseInfo = createElement('div', null, "purchase-info");
        const spanName = createElement('span', null, null, venue.name);
        const spanPriceInfo = createElement('span', null, null, `${quantity} x ${venue.price}`);
        const spanPrice = createElement('span', null, null, `Total: ${totalPrice} lv`);
        const btnConfirm = createElement('input');
        btnConfirm.type = 'button';
        btnConfirm.value = 'Confirm';
        btnConfirm.addEventListener('click', () => {
            displayTicket(venue._id, quantity);
        });

        parentAppendChildren(divPurchaseInfo, [spanName, spanPriceInfo, spanPrice, btnConfirm]);
        parentAppendChildren(content, [spanHead, divPurchaseInfo]);
    }

    function displayTicket(id, quantity) {
        const url = `https://baas.kinvey.com/rpc/kid_BJ_Ke8hZg/custom/purchase?venue=${id}&qty=${quantity}`;

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic Z3Vlc3Q6cGFzcw=='
                }
            })
            .then(responseHandler)
            .then(htmlObj => {
                const html = Object.values(htmlObj)[0];
               content.innerHTML = 'You may print this page as your ticket' + html;
            }).
            catch (err => alert(err.message));
    }

    function responseHandler(response) {
        if (response.status > 400) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return response.json();
    }

    function parentAppendChildren(parentElement, childrenArray) {
        childrenArray.forEach(child => {
            parentElement.appendChild(child);
        });
    }

    function createElement(tagName, id, className, textContent) {
        const element = document.createElement(tagName);

        if (id) {
            element.id = id;
        }

        if (className) {
            element.className = className;
        }

        if (textContent) {
            element.textContent = textContent;
        }

        return element;
    }
})();

// "<div class=\"ticket\">
// <div class=\"left\">
// <span class=\"head\">Venuemaster</span>
// <span class=\"venue-name\">A Day In The Life Of...</span>
// <span class=\"bl\">20:00</span>
// <br>
// <span class=\"bl\">Admit 3</span>
// <span class=\"bl\">45.00 lv</span>
// </div><div class=\"right\"><span>Venue code</span><br><span>5832d213a5e4ab846b24fcc1</span>
// <span class=\"head\">Venuemaster</span>
// </div>
// </div>"

