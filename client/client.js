async function checkReservations(clothesName) {
    var modal = new bootstrap.Modal(document.getElementById('reservationModal'));
    modal.show()
    document.getElementById('clothesName').innerHTML = clothesName;
    modal.show();
    console.log(clothesName);

    try {
        const response = await fetch(`reservationsFile/${clothesName}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const reservations = await response.json();
        const reservationsDiv = document.getElementById('reservationsDiv');

        reservationsDiv.innerHTML = `
            <p>This clothing item is unavailable on the following dates:</p>
        `;

        if (reservations.length === 0) {
            reservationsDiv.innerHTML = `
                <p>This clothing item is available on all dates!</p>
            `;
    }
        else{
            reservations.forEach(reservation => {
                reservationsDiv.innerHTML += `
                    <div class="card-body">
                        <p class="card-text">${reservation.date}</p>
                    </div>
                `;
            });
        }
    }
    catch (error) {
        console.error('Error loading reservations:', error.message);
    }
}

async function submitReservation(event) {
    event.preventDefault();
    const reservationDate = document.getElementById('reservationDate').value;
    const clothesName = document.getElementById('clothesName').innerHTML;
    const reservationData = {
        date: reservationDate,
        name: clothesName,
      };
      
      const reservationJSON = JSON.stringify(reservationData);

    try{
        const response = await fetch('addReservation', {
            method: 'POST',
            body: reservationJSON,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error adding reservation:', error.message);
    }
}

async function loadOwner(person) {
    try {
        const response = await fetch('ownerData');
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const ownerData = await response.json();
        const ownerDiv = document.getElementById('ownerdiv');

        ownerData.forEach(owner => {
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
    
        const clothesData = await response.json();                      //getting json data from server
        const clothesDiv = document.getElementById('clothesdiv');       //getting clothes div which is a grid row
        const clothingGrid = document.createElement('div');             //creating a new div to store the cards/replace previous set of cards                            

        clothesData.forEach(clothing => {
            const type = clothing.type;

            if (type === category || category === 'all'){
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
                    <div id="icon-overlay" onclick="checkReservations('${name}')">
                        <span>+</span>
                    </div>
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

async function addClothesText(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const type = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const size = document.getElementById('size').value;
    const owner = document.getElementById('owner').value;

    const newClothes = {
        name,
        owner,
        description,
        size,
        type
    };

    try {
        const response = await fetch('addClothesData', {
            method: 'POST',
            body: JSON.stringify(newClothes),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

    } catch (error) {
        console.error('Error adding clothes:', error.message);
    }
};

async function uploadSelectedImage(event) {
    event.preventDefault();
    const imageFile = document.getElementById('image').files[0];
    const formData = new FormData();
    formData.append('image', imageFile);
    console.log('formData', formData);

    try {
        console.log("trying to upload image", formData)
        const response = await fetch('uploadImage', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error adding image:', error.message);
    }
}

windowonload = loadClothes('all');