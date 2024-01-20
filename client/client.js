console.log('client.js is running');

async function loadClothes() {
    try {
        console.log('Attempting to fetch data...');
        const response = await fetch('clothesData');
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        console.log('Fetching data successful.');

        const clothesData = await response.json();
        const clothesDiv = document.getElementById('clothesdiv');

        clothesData.forEach(clothing => {
            const name = clothing.name;
            const owner = clothing.owner;
            const filepath = clothing.filepath;

            const clothingInfoDiv = document.createElement('div');
            clothingInfoDiv.innerHTML = `<p>Name: ${name}</p><p>Owner: ${owner}</p><p>Filepath: ${filepath}</p>`;

            clothesDiv.appendChild(clothingInfoDiv);
        });

        console.log('Data loaded successfully.');

    } catch (error) {
        console.error('Error loading clothes:', error.message);
    }
}