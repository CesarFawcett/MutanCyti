// View Controller
function showView(viewId) {
    document.querySelectorAll('main, section').forEach(el => {
        if (el.id) el.classList.add('hidden-view');
    });
    const target = document.getElementById(viewId);
    if (target) target.classList.remove('hidden-view');
}

// Login Logic
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const statusMessage = document.getElementById('statusMessage');
    const submitBtn = document.querySelector('.access-btn');
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    statusMessage.textContent = '> PROCESSING CREDENTIALS...';
    statusMessage.className = 'status-message';
    submitBtn.disabled = true;

    setTimeout(() => {
        if ((username.toLowerCase() === 'admin' || username.toLowerCase() === 'jugador') && password === '123') {
            statusMessage.textContent = `> ACCESS GRANTED: WELCOME ${username.toUpperCase()}`;
            statusMessage.classList.add('success');
            
            setTimeout(() => {
                if (username.toLowerCase() === 'admin') {
                    showView('adminView');
                } else {
                    showView('mapView');
                    loadIslands();
                }
            }, 1000);
        } else {
            statusMessage.textContent = '> ERROR: INVALID IDENTITY OR ACCESS CODE';
            statusMessage.classList.add('error');
            submitBtn.disabled = false;
        }
    }, 1500);
});

// Island Creation Logic
document.getElementById('islandForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const islandName = document.getElementById('islandName').value;
    const islandX = document.getElementById('islandX').value;
    const islandY = document.getElementById('islandY').value;
    const islandFile = document.getElementById('islandImage').files[0];

    if (!islandFile) return alert('Select island schematic.');

    const uploadData = new FormData();
    uploadData.append('name', islandName);
    uploadData.append('x', islandX);
    uploadData.append('y', islandY);
    uploadData.append('islandImage', islandFile);

    try {
        const response = await fetch('/api/islands', {
            method: 'POST',
            body: uploadData
        });

        if (response.ok) {
            alert('ISLA DESPLEGADA CON ÉXITO');
            this.reset();
            loadIslands();
        } else {
            alert('ERROR EN DESPLIEGUE');
        }
    } catch (err) {
        console.error(err);
        alert('CONNECTION LOST');
    }
});

// Load Islands from Server
async function loadIslands() {
    try {
        const response = await fetch('/api/islands');
        const islands = await response.json();
        renderIslands(islands);
    } catch (err) {
        console.error('Map sync error:', err);
    }
}

function renderIslands(islands) {
    const container = document.getElementById('islandContainer');
    if (!container) return;
    
    container.innerHTML = '';
    islands.forEach(isl => {
        const div = document.createElement('div');
        div.className = 'island';
        div.style.left = `${isl.x}px`;
        div.style.top = `${isl.y}px`;
        
        div.innerHTML = `
            <div class="island-label">${isl.name.toUpperCase()}</div>
            <img src="${isl.imageUrl}" alt="${isl.name}">
        `;
        container.appendChild(div);
    });
}

// Initial Map Load
if (document.getElementById('mapView')) {
    loadIslands();
}

console.log('%c [BUNK-OS] VIEW CONTROLLER INITIALIZED ', 'background: #000; color: #00ff41;');
