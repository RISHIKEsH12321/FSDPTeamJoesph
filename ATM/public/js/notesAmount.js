// Call the function with ATMID = 1
fetchATMDetails(1);

// Fetch ATM details by ATMID
async function fetchATMDetails(atmID) {
    try {
        const response = await fetch(`/ATM-details/${atmID}`);
        if (!response.ok) {
        throw new Error('Failed to fetch ATM details');
        }
        const data = await response.json();
        displayATMDetails(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Display ATM details
function displayATMDetails(details) {
const container = document.getElementById('atm-details');
const denominations = [
    { name: '5', count: details.numOf5 },
    { name: '10', count: details.numOf10 },
    { name: '50', count: details.numOf50 },
    { name: '100', count: details.numOf100 },
];

denominations.forEach(denom => {
    const element = document.createElement('div');
    element.className = 'denomination';

    const waterLevel = document.createElement('div');
    waterLevel.className = 'water-level';

    const text = document.createElement('div');
    text.className = 'text';

    const type = document.createElement('p');
    type.className = 'type';
    type.textContent = `$${denom.name}`;

    const amount = document.createElement('p');
    amount.className = 'amount';
    amount.textContent = `${denom.count} notes`;
    
    const water = document.createElement('div');
    water.className = 'water';
    water.style.height = `${(denom.count / 1000) * 100}%`;
    water.setAttribute('data-level', denom.count > 500 ? 'high' : 'low');

    text.appendChild(type);
    text.appendChild(amount);
    waterLevel.appendChild(water);
    waterLevel.appendChild(text);
    
    element.appendChild(waterLevel);

    container.appendChild(element);
});
}
