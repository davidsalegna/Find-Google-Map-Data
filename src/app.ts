import axios from 'axios';

const form = document.querySelector("form")!; //Will not be null
const addressInput = document.getElementById("address")! as HTMLInputElement; //Will not be null

const GOOGLE_API_KEY = "AIzaSyCIaAc2c5M3VpbCH6PPq_guwy9lHuowX0s";  //Key given with GOOGLE Geocoding Account


//This is a global variable injected from the GOOGLE map script, but make TS aware to it here
//Can also use a form of "npm install --save-dev @types/googlemaps" to have TS recognize google var
declare var google: any;


//Define return JSON type from Google Geocoding API
type GoogleGoecodingResponse = {
    results: { geometry: { location: { lat: number; lng: number } } }[];
    status: "OK" | "ZERO_RESULTS";
}

function searchAddressHandler(event: Event) {
    event.preventDefault();
    const enteredAddress = addressInput.value;

    axios
        .get<GoogleGoecodingResponse>(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}}`
        ).then(response => {
            if (response.data.status !== "OK") {
            throw new Error("Could not fetch location");
            }
            const coordinates = response.data.results[0].geometry.location;
            const map = new google.maps.Map(document.getElementById("map"), {
                center: coordinates,
                zoom: 8
            });
            new google.maps.Marker({ position: coordinates, map: map });
        }).catch(err => {
            alert(err.message);
            console.log(err);
        });
}

form.addEventListener("submit", searchAddressHandler);