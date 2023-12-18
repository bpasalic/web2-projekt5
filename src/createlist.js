document.addEventListener('DOMContentLoaded', function () {
    const shoppingListForm = document.getElementById('shoppingListForm');
    const itemsList = document.getElementById('itemsList');
    const itemNameInput = document.getElementById('itemName');
    const addItemButton = document.getElementById('addItem');
    const createdList = document.getElementById('createdList');
    const displayedTitle = document.getElementById('displayedTitle');
    const displayedItems = document.getElementById('displayedItems');
    const openCameraButton = document.getElementById('openCamera');

    addItemButton.addEventListener('click', function () {
        const itemName = itemNameInput.value.trim();
        if (itemName !== '') {
            const listItem = document.createElement('li');
            listItem.textContent = itemName;
            itemsList.appendChild(listItem);
            itemNameInput.value = '';
        }
    });

    shoppingListForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const listTitle = document.getElementById('listTitle').value;
        const listItems = Array.from(itemsList.children).map(item => item.textContent);

        saveShoppingList({ title: listTitle, items: listItems });

        // Redirect to the home page after creating the list
        window.location.replace('index.html');
    });

    function saveShoppingList(list) {
        const request = indexedDB.open('ShoppingListsDB', 1);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            const objectStore = db.createObjectStore('shoppingLists', { keyPath: 'id', autoIncrement: true });
            objectStore.add(list);
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction(['shoppingLists'], 'readwrite');
            const objectStore = transaction.objectStore('shoppingLists');
            objectStore.add(list);
        };

        request.onerror = function (event) {
            console.error('Error opening IndexedDB:', event.target.error);
        };
    }

    openCameraButton.addEventListener('click', () => {
        openCamera();
    });

    function openCamera() {
        const constraints = { video: true };
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                const videoElement = document.getElementById('cameraStream');
                videoElement.srcObject = stream;
                videoElement.hidden = false;

                setTimeout(captureImage, 3000); // Capture image after 3 seconds
            })
            .catch((error) => {
                console.error('Error accessing the camera: ', error);
            });
    }

    function captureImage() {
        const videoElement = document.getElementById('cameraStream');
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        canvas.getContext('2d').drawImage(videoElement, 0, 0);

        const capturedImage = document.getElementById('capturedImage');
        capturedImage.src = canvas.toDataURL('image/png');
        capturedImage.hidden = false;
        videoElement.hidden = true;
    }
});