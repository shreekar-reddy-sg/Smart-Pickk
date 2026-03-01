import Order from '../models/order.model.js';

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if(req.user.role !== 'shop_owner') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const allowedTransitions = {
      pending: ["preparing", "cancelled"],
      preparing: ["ready"],
      ready: ["completed"],
      completed: [],
      cancelled: [],
    };

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!allowedTransitions[order.status].includes(status)) {
      return res.status(400).json({ message: `Invalid status transition from ${order.status} to ${status}` });
    }
    order.status = status;
    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};