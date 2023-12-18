document.addEventListener('DOMContentLoaded', function () {
    const mainContent = document.getElementById('mainContent');

    const request = indexedDB.open('ShoppingListsDB', 1);

    request.onsuccess = function () {
        const db = request.result;
        if (db.objectStoreNames.contains('shoppingLists')) {
            // Database is initialized, proceed to retrieve and display shopping lists
            getShoppingLists().then(savedLists => {
                if (savedLists.length === 0) {
                    // If no lists, display a welcome message
                    mainContent.innerHTML = '<p>Welcome to the homepage!</p>';
                } else {
                    // If lists exist, display them
                    savedLists.forEach((list) => {
                        const shoppingListDiv = document.createElement('div');
                        shoppingListDiv.classList.add('shopping-list');

                        const listTitle = document.createElement('h2');
                        listTitle.textContent = list.title;
                        shoppingListDiv.appendChild(listTitle);

                        list.items.forEach((itemText) => {
                            // ... (your existing code)
                        });

                        mainContent.appendChild(shoppingListDiv);
                    });
                }
            });
        } else {
            // Database is not initialized, display a welcome message
            mainContent.innerHTML = '<p>Welcome to the homepage!</p>';
        }
    };

    request.onerror = function (event) {
        console.error('Error opening IndexedDB:', event.target.error);
    };


    function getShoppingLists() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('ShoppingListsDB', 1);

            request.onsuccess = function (event) {
                const db = event.target.result;
                console.log(db)
                const transaction = db.transaction(['shoppingLists'], 'readonly');
                const objectStore = transaction.objectStore('shoppingLists');
                const getAllRequest = objectStore.getAll();

                getAllRequest.onsuccess = function (event) {
                    resolve(event.target.result || []);
                };

                getAllRequest.onerror = function (event) {
                    reject(event.target.error);
                };
            };

            request.onerror = function (event) {
                console.error('Error opening IndexedDB:', event.target.error);
                reject(event.target.error);
            };
        });
    }
});
