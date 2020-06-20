const { ipcRenderer } = require('electron');

const ul = document.querySelector('ul');

// Catch add item
ipcRenderer.on('item:add', (event, item) => {
    const li = document.createElement('li');
    const itemText = document.createTextNode(item);
    ul.className = 'collection';
    li.className = 'collection-item';
    li.appendChild(itemText);
    ul.appendChild(li);
});

// Catch clear items
ipcRenderer.on('item:clear', () => {
    ul.innerHTML = '';
    ul.className = ''
});

// Remove single item
ul.addEventListener('dblclick', removeItem);

function removeItem (event) {
    event.target.remove();
    if (ul.children.length == 0) {
        ul.className = '';
    }
}