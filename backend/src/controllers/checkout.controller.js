import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";

const checkout = async (req, res, next) => {
  try {
    if (req.user.role !== "customer") {
        const err = new Error("Only customers can perform checkout");
        err.statusCode = 403;
        throw err;
    }
    const cart = await Cart.findOne({ user: req.user.userId }).populate("items.menuItem");  
    if (!cart || cart.items.length === 0) {
      const err = new Error("Cart is empty.");
      err.statusCode = 400;
      throw err;
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
    res.status(200).json({ success: true, data: { message: "Checkout successful.", orderId: order._id } });
  } catch (error) {
    next(error);
  } 
};

export { checkout };