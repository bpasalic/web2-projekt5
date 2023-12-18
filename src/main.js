import { keys, get } from "https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm";

document.addEventListener('DOMContentLoaded', function () {
    const mainContent = document.getElementById('mainContent');

    getShoppingLists().then(savedLists => {
        console.log(savedLists)
        if (savedLists.length === 0) {
            mainContent.innerHTML = '<p>Welcome to the homepage! No lists found.</p>';
        } else {
            savedLists.forEach((list) => {
                const shoppingListDiv = document.createElement('div');
                shoppingListDiv.classList.add('shopping-list');

                const listTitle = document.createElement('h2');
                listTitle.textContent = list.title;
                shoppingListDiv.appendChild(listTitle);

                const itemsList = document.createElement('ul');
                list.items.forEach((item) => {
                    const listItem = document.createElement('li');

                    if (item.image) {
                        const image = new Image();
                        image.src = item.image;
                        image.width = 200;
                        image.height = 200;
                        listItem.appendChild(image);
                    } else if (item.text) {
                        listItem.textContent = item.text;
                    }

                    itemsList.appendChild(listItem);
                });
                shoppingListDiv.appendChild(itemsList);

                mainContent.appendChild(shoppingListDiv);
            });
        }
    }).catch(error => {
        console.error('Error fetching lists:', error);
        mainContent.innerHTML = '<p>Error loading lists.</p>';
    });
});
function getShoppingLists() {
    return new Promise((resolve, reject) => {
        keys()
            .then(allKeys => {
                Promise.all(allKeys.map(key => get(key)))
                    .then(results => resolve(results.map((items, index) => ({ title: allKeys[index], items }))))
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}
