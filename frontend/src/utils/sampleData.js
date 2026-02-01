// Sample data generators for flights and buses

const cities = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
    "Chandigarh",
    "Indore",
    "Surat",
];

const airlines = [
    "Air India",
    "IndiGo",
    "SpiceJet",
    "GoAir",
    "Vistara",
    "AirAsia",
];

const busOperators = [
    "Redbus",
    "MSRTC",
    "KSRTC",
    "FirstFlight",
    "TravelKing",
    "EasyGo",
    "SuperFast",
    "GoldBus",
];

function getRandomCity() {
    return cities[Math.floor(Math.random() * cities.length)];
}

function getRandomTime() {
    const hours = String(Math.floor(Math.random() * 24)).padStart(2, "0");
    const minutes = String(Math.floor(Math.random() * 60)).padStart(2, "0");
    return `${hours}:${minutes}`;
}

export function generateFlights(count = 100) {
    const flights = [];
    for (let i = 0; i < count; i++) {
        let from = getRandomCity();
        let to = getRandomCity();
        while (to === from) {
            to = getRandomCity();
        }
        flights.push({
            id: `flight-${i}`,
            airline: airlines[Math.floor(Math.random() * airlines.length)],
            from,
            to,
            time: getRandomTime(),
            price: Math.floor(Math.random() * (50000 - 5000)) + 5000,
        });
    }
    return flights;
}

export function generateBuses(count = 200) {
    const buses = [];
    for (let i = 0; i < count; i++) {
        let from = getRandomCity();
        let to = getRandomCity();
        while (to === from) {
            to = getRandomCity();
        }
        buses.push({
            id: `bus-${i}`,
            operator: busOperators[Math.floor(Math.random() * busOperators.length)],
            from,
            to,
            time: getRandomTime(),
            price: Math.floor(Math.random() * (5000 - 500)) + 500,
        });
    }
    return buses;
}