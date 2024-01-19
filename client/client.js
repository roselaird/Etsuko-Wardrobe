async function loadClothes() {
    try {
        const response = await fetch('http://localhost:8000/clothes');
        
        // Check if the response is successful (status code 200)
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        // Parse the JSON data from the response
        const clothesData = await response.json();

        // Get the clothesdiv element from the HTML
        const clothesDiv = document.getElementById('clothesdiv');

        // Loop through the array of objects and extract relevant information
        clothesData.forEach(clothing => {
            const name = clothing.name;
            const owner = clothing.owner;
            const filepath = clothing.filepath;

            // Create a new div to display the information
            const clothingInfoDiv = document.createElement('div');
            clothingInfoDiv.innerHTML = `<p>Name: ${name}</p><p>Owner: ${owner}</p><p>Filepath: ${filepath}</p>`;

            // Append the new div to the clothesdiv
            clothesDiv.appendChild(clothingInfoDiv);
        });

    } catch (error) {
        console.error('Error loading clothes:', error.message);
    }
}

// Call the loadClothes function when the window has finished loading
window.onload = loadClothes;
