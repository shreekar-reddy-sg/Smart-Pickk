import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";

const checkout = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
        return res.status(403).json({ message: "Only customers can checkout." });
    }
    const cart = await Cart.findOne({ user: req.user.userId }).populate("items.menuItem");  
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }
    const orderItems = cart.items.map(item => ({
      menuItem: item.menuItem._id,
      name: item.menuItem.name,
        price: item.menuItem.price, 
        quantity: item.quantity,
    }));
    let total = 0;
    orderItems.forEach(item => {
      total += item.price * item.quantity;
    });
    const order = await Order.create({
      user: req.user.userId,
      items: orderItems,
      total: total,
    });
    await Cart.findOneAndDelete({ user: req.user.userId });
    res.status(200).json({ message: "Checkout successful.", orderId: order._id });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ message: "Internal server error" });
  } 
};

export { checkout };