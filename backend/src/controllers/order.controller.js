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

export const getMyOrders = async (req, res) => {
  try {
    if(req.user.role !== 'customer') {
      return res.status(403).json({message: 'Only customers can view their orders'});
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalOrders = await Order.countDocuments({ user: req.user.userId });
    const totalPages = Math.ceil(totalOrders / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const orders = await Order.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("items.menuItem", "name price");
    res.status(200).json({ totalOrders, totalPages, hasNextPage, hasPrevPage, orders, page, limit });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};