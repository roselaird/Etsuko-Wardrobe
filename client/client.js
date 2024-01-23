async function loadOwner(person) {
    console.log('load onwer called');
    try {
        const response = await fetch('ownerData');
        console.log('try');
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const ownerData = await response.json();
        const ownerDiv = document.getElementById('ownerdiv');

        ownerData.forEach(owner => {
            console.log(ownerData);
            if (owner.name === person) {
                ownerDiv.innerHTML = `
                <div class="card-body">
                    <p class="card-title">${owner.name}</p>
                    <p class="card-text">email: ${owner.email}</p>
                    <p class="card-text">room number: ${owner.room}</p>
                </div>
                `;
            }
        })
    }

    catch (error) {
        console.error('Error loading owner:', error.message);
    }
}


async function loadClothes(category) {
    try {
        const response = await fetch('clothesData');
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
    
        console.log('function called')
        const clothesData = await response.json();                      //getting json data from server
        const clothesDiv = document.getElementById('clothesdiv');       //getting clothes div which is a grid row
        const clothingGrid = document.createElement('div');             //creating a new div to store the cards/replace previous set of cards                            

        clothesData.forEach(clothing => {
            const type = clothing.type;

            if (type === category || category === 'all'){
                console.log('passed tag check')
                const name = clothing.name;
                const owner = clothing.owner;

                const filepath = clothing.image;
                const description = clothing.description;
                const size = clothing.size;
                
                const clothesCard = document.createElement('div'); 
                clothesCard.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-4'
            
                clothesCard.innerHTML = `
                    <div class="card">
                    <img src="${filepath}" class="card-img-top img-fluid" alt="${description}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${name}</h5>
                        <p class="card-text">${description}</p>
                        <p class="card-text">${size}</p>
                        <a href="#" class="btn btn-pink" onclick="loadOwner('${owner}')">${owner}</a>
                    </div>
                    </div>
                `;
                clothingGrid.appendChild(clothesCard);                
            }
        });

        clothesDiv.innerHTML = clothingGrid.innerHTML
    }

    catch (error) {
    console.error('Error loading clothes:', error.message);    
    }
}

async function addClothes() {
    console.log('add clothes called');
    const name = document.getElementById('name').value;
    const type = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const size = document.getElementById('size').value;
    const owner = document.getElementById('owner').value;
    const image = "empty.jpg";

    const newClothes = {
        name,
        owner,
        description,
        size,
        image,
        type
    };

    try {
        const response = await fetch('addClothesData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newClothes)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        //const result = await response.json();
        //console.log(result);
    }

    catch (error) {
        console.error('Error adding clothes:', error.message);
    }

    const imageFile = document.getElementById('image').files[0];
    console.log('boutta image', imageFile)

    try {
        const response = await fetch('uploadImage', {
            method: 'POST',
            body: imageFile
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
    }

    catch (error) {
        console.error('Error adding image:', error.message);
    }

}

function addClothes2() {
    // Get the form elements
    const name = document.getElementById('name').value;
    const image = document.getElementById('image').files[0];
    const owner = document.getElementById('owner').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const size = document.getElementById('size').value;

    // Create a FormData object to store the form data
    const formData = new FormData();

    // Append the non-file form data to the FormData object
    formData.append('name', name);
    formData.append('owner', owner);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('size', size);

    // Append the file to the FormData object
    formData.append('image', image);

    // First POST request for the file
    fetch('/uploadImage', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(fileResponse => {
        // Now you can make a second POST request for the rest of the data
        // Assuming there is an endpoint like '/addClothesData' for adding clothes data
        return fetch('/addClothesData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                owner,
                description,
                category,
                size,
                imageUrl: fileResponse.imageUrl, // Use the URL or any identifier returned from the file upload endpoint
            }),
        });
    })
    .then(response => response.json())
    .then(dataResponse => {
        // Handle the response for the second POST request
        console.log('Clothes data added successfully:', dataResponse);
    })
    .catch(error => {
        console.error('Error adding clothes:', error);
    });
}


//windowonload = loadClothes('all');