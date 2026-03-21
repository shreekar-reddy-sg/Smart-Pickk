import Cart from "../models/cart.model.js";
import { MenuItem } from "../models/menuitem.model.js";

const addToCart = async (req, res, next) => {
  const { menuItemId, quantity } = req.body;

  try {
    if (req.user.role !== "customer") {
      const err = new Error("Only customers can add to cart.");
      err.statusCode = 403;
      throw err;
    }
    const item = await MenuItem.findById(menuItemId);
    if (!item) {
      const err = new Error("Menu item not found.");
      err.statusCode = 404;
      throw err;
    }
    let cart = await Cart.findOne({user: req.user.userId});
    if (!cart) {
      cart = await Cart.create({ user: req.user.userId, items: [] });
    }
    let existingItem = cart.items.find(i => i.menuItem.toString() === menuItemId);
    if (existingItem) {
      existingItem.quantity += quantity || 1;
      await cart.save();
    } 
    else {
      cart.items.push({ menuItem: menuItemId, quantity });
      await cart.save();
    }    
    res.status(200).json({ success: true, data: { message: "Item added to cart successfully." } });

  } catch (error) {
     next(error);
  }
};

const getCart = async(req,res,next) => {
  try {
    if (req.user.role !== "customer") {
      const err = new Error("Only customers can view cart.");
      err.statusCode = 403;
      throw err;
    }
    let cart = await Cart.findOne({ user: req.user.userId }).populate("items.menuItem");
    if (!cart) {
      const err = new Error("Cart not found.");
      err.statusCode = 404;
      throw err;
    }
    let total = 0;
    cart.items.forEach(item => {
      total += item.menuItem.price * item.quantity;
    });
    cart = cart.toObject();
    cart.total = total;
    res.status(200).json({ success: true, data: cart });
  }
  catch (error) {
    next(error);
  }
}

const removeFromCart = async (req, res, next) => {
  const { menuItemId } = req.params;
  try {
    if (req.user.role !== "customer") {
      const err = new Error("Only customers can remove from cart.");
      err.statusCode = 403;
      throw err;
    }
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      const err = new Error("Cart not found.");
      err.statusCode = 404;
      throw err;
    }
    cart.items = cart.items.filter(item => item.menuItem.toString() !== menuItemId);
    await cart.save();
    res.status(200).json({ success: true, data: { message: "Item removed from cart successfully." } });
  } catch (error) {
    next(error);
  }
}

export { addToCart, getCart, removeFromCart };