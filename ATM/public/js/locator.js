// OCBC Ids
const clientId = "wWNax1oxsNns8nhufRYRxzEZHC4a";
const clientSecret = "6BdGEfwqAneDOOmbfPenqUNqsxsa";

//Coordiantes
const clementiLat  = "1.3323982"; // NP Latitude
const clementiLng  = "103.7754072"; // NP Longitude
const radius = "1"; // 1km radius

// API Base URL
const apiUrl = "https://api.ocbc.com/atm_locator/1.1";



// Call function when the page loads
// getNearestATM();

// Function to get access token
async function getAccessToken() {
    const response = await fetch("https://api.ocbc.com/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            "grant_type": "client_credentials",
            "client_id": clientId,
            "client_secret": clientSecret
        })
    });

    const data = await response.json();
    
    if (response.ok) {
        // console.log("Access Token:", data.access_token);
        return data.access_token;
    } else {
        console.error("Error fetching access token:", data);
        return null;
    }
}

// Function to get the nearest ATM
async function getNearestATM(prompt) {
    const accessToken = await getAccessToken();
    if (!accessToken) return;

    // const url = `${apiUrl}?country=SG&latitude=${clementiLat}&longitude=${clementiLng}&radius=5&category=1&radius=${radius}`;
    const url = `${apiUrl}?latitude=${clementiLat}&longitude=${clementiLng}&radius=${radius}`;


    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log("Nearest ATM Data:", data);
            if (data.atmList.length > 0) {
                const nearestATM = getClosestATM(data.atmList); // Get the first ATM
                // const distance;
                
                console.log(`Nearest ATM: ${nearestATM.address}, Landmark: ${nearestATM.landmark}`);
                

                openModal(prompt, nearestATM.atm, nearestATM.distance);
            } else {
                console.log("No ATMs found nearby.");
            }
        } else {
            console.error("Error fetching ATMs:", data);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Function to Display the Modal

function openModal(header, atm, distance){
    // HTML Elements
    const modal = document.getElementById("locatorModal");
    const modalHeader = document.getElementById("modal-header");
    const modalAddress = document.getElementById("modal-address");
    const modalDistance = document.getElementById("modal-distance");
    const modalCode = document.getElementById("modal-code");
    const qrcode = document.getElementById("qr_code");


    //Input Data
    modalHeader.textContent = header;
    modalAddress.textContent = atm.address;
    modalDistance.textContent = Math.round(distance) + "m";
    modalCode.textContent = atm.postalCode;

    //Clear QR Code
    qrcode.innerHTML = "";

    // Generate QR Code for directions
    generateQRCode(atm.latitude, atm.longitude);

    //Show modal
    modal.classList.add("shownModal");
    modal.classList.remove("hiddenModal");    
}

function closeModal(){
    // HTML Elements
    const modal = document.getElementById("locatorModal");

    modal.classList.remove("shownModal");
    modal.classList.add("hiddenModal");
}

// Function to generate the QR code for Google Maps directions
function generateQRCode(atmLat, atmLng) {
    const mapsUrl = `https://www.google.com/maps/dir/${clementiLat},${clementiLng}/${atmLat},${atmLng}`;
    
    var qrcode = new QRCode("qr_code", {
	    text: mapsUrl,
	    width: 200,
	    height: 200,
	    colorDark : "#000000",
	    colorLight : "#ffffff",
	    correctLevel : QRCode.CorrectLevel.H
	});
}

function getClosestATM(atmList) {
    function haversine(lat1, lon1, lat2, lon2) {
        const toRad = angle => (Math.PI / 180) * angle;
        const R = 6371; // Radius of Earth in km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000; // Distance in km
    }

    let closestATM = null;
    let minDistance = Infinity;

    for (let i = 0; i < atmList.length; i++) {
        const atm = atmList[i];        

        // Skip the current ATM based on latitude and longitude
        if (atm.latitude === Number(clementiLat) && atm.longitude === Number(clementiLng)) {
            continue; // Skip this ATM and move to the next one
        }

        const distance = haversine(clementiLat, clementiLng, atm.latitude, atm.longitude);
        if (distance < minDistance) {
            minDistance = distance;
            closestATM = atm;
        }
    }    
    const distance = haversine(closestATM.latitude, closestATM.longitude, Number(clementiLat), Number(clementiLng));
    console.log(distance);
    const result = {
        atm: closestATM,
        distance: distance
    };
    return result;
}

