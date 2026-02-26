import { Cart } from "../models/cart.model.js";
import { MenuItem } from "../models/menuitem.model.js";

const addToCart = async (req, res) => {
  const { menuItemId, quantity } = req.body;

  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Only customers can add to cart." });
    }
    const item = await MenuItem.findById(menuItemId);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found." });
    }
    let cart = await Cart.findOne({user: req.user.userId});
    let existingItem = cart.items.find(i => i.menuItem.toString() === menuItemId);
    if (!cart) {
      cart = await Cart.create({ user: req.user.userId, products: [] });
    }
    else if (existingItem) {
      existingItem.quantity += quantity || 1;
      await cart.save();
    } 
    else {
      cart.items.push({ menuItem: menuItemId, quantity });
      await cart.save();
    }    
    res.status(200).json({ message: "Item added to cart successfully." });

  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCart = async(req,res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Only customers can view cart." });
    }
    const cart = await Cart.findOne({ user: req.user.userId }).populate("items.menuItem");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }
    res.status(200).json(cart);
  }
  catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export { addToCart, getCart };