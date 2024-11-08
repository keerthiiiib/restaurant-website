// menu.js

function loadMenu() {
    // Create a main container for the menu content
    const menuContainer = document.createElement("div");
    menuContainer.classList.add("menu");

    // Sample menu items
    const menuItems = [
        { name: "Spaghetti", description: "Delicious pasta with tomato sauce", price: "$12" },
        { name: "Margherita Pizza", description: "Classic pizza with fresh mozzarella and basil", price: "$15" },
        { name: "Caesar Salad", description: "Crisp romaine with Caesar dressing and croutons", price: "$10" }
    ];

    // Loop through each menu item and create elements for them
    menuItems.forEach(item => {
        const itemContainer = document.createElement("div");
        itemContainer.classList.add("menu-item");

        const itemName = document.createElement("h3");
        itemName.textContent = item.name;

        const itemDescription = document.createElement("p");
        itemDescription.textContent = item.description;

        const itemPrice = document.createElement("p");
        itemPrice.classList.add("price");
        itemPrice.textContent = item.price;

        // Append each detail to the item container
        itemContainer.appendChild(itemName);
        itemContainer.appendChild(itemDescription);
        itemContainer.appendChild(itemPrice);

        // Add item container to the main menu container
        menuContainer.appendChild(itemContainer);
    });

    return menuContainer;
}

// Export the function so it can be used in other files
export default loadMenu;
