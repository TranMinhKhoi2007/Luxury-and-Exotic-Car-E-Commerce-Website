/**
 * APEX MOTORS - Wishlist Manager
 * Client-side favorites and saved vehicles with localStorage persistence
 */

const Wishlist = {
  STORAGE_KEY: "apex_motors_wishlist",

  /**
   * Get list of saved car IDs
   * @returns {string[]}
   */
  getItems() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading wishlist", e);
      return [];
    }
  },

  /**
   * Save array of car IDs
   * @param {string[]} items 
   */
  saveItems(items) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new CustomEvent("apex:wishlistUpdated", { detail: { wishlist: items } }));
    } catch (e) {
      console.error("Error saving wishlist", e);
    }
  },

  /**
   * Check if a car is in wishlist
   * @param {string} carId 
   * @returns {boolean}
   */
  has(carId) {
    return this.getItems().includes(carId);
  },

  /**
   * Toggle item in wishlist
   * @param {string} carId 
   * @returns {{added: boolean, message: string}}
   */
  toggle(carId) {
    const car = APEX_DATA.cars.find(c => c.id === carId);
    let items = this.getItems();
    const index = items.indexOf(carId);

    if (index > -1) {
      items.splice(index, 1);
      this.saveItems(items);
      return {
        added: false,
        car,
        message: `${car ? car.model : "Vehicle"} removed from your wishlist.`
      };
    } else {
      items.push(carId);
      this.saveItems(items);
      return {
        added: true,
        car,
        message: `${car ? car.model : "Vehicle"} added to your wishlist.`
      };
    }
  },

  /**
   * Remove specific car
   * @param {string} carId 
   */
  remove(carId) {
    let items = this.getItems().filter(id => id !== carId);
    this.saveItems(items);
  },

  /**
   * Clear all items
   */
  clear() {
    this.saveItems([]);
  },

  /**
   * Get detailed car objects
   * @returns {Object[]}
   */
  getDetailedItems() {
    const ids = this.getItems();
    return ids
      .map(id => APEX_DATA.cars.find(c => c.id === id))
      .filter(Boolean);
  }
};
