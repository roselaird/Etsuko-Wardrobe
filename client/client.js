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
        const clothingGrid = document.createElement('div'); 

        clothesData.forEach(clothing => {
            const name = clothing.name;
            const owner = clothing.owner;
            const filepath = clothing.image;
            const description = clothing.description;

            const clothesCard = document.createElement('div'); 
           
            clothesCard.innerHTML = `
                <div class="card" style="width: 18rem;">
                    <img src="${filepath}" class="card-img-top" alt="${description}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${name}</h5>
                        <p class="card-text">${description}</p>
                        <a href="#" class="btn btn-primary" onclick="loadOwner(${owner})">${owner}</a>
                    </div>
                </div>
            `;
            clothingGrid.appendChild(clothesCard);
            
        });
    
        clothesDiv.innerHTML = clothingGrid.innerHTML
    

        console.log(clothingGrid, 'Data loaded successfully.');

    } catch (error) {
        console.error('Error loading clothes:', error.message);
    }
}