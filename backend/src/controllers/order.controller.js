import Order from '../models/order.model.js';

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if(req.user.role !== 'shop_owner') {
      const err = new Error("Only shop owners can update order status");
      err.statusCode = 403;
      throw err;
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
      const err = new Error("Order not found");
      err.statusCode = 404;
      throw err;
    }

    if (!allowedTransitions[order.status].includes(status)) {
      const err = new Error(`Invalid status transition from ${order.status} to ${status}`);
      err.statusCode = 400;
      throw err;
    }
    order.status = status;
    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    next(error);
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
    next(error);
  }
};

export const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "shop_owner") {
      const err = new Error("Only shop owners can view all orders");
      err.statusCode = 403;
      throw err;
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    let filter = { shop: req.user.shopId };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email")
      .populate("items.menuItem", "name price");

    res.status(200).json({
      totalOrders,
      totalPages,
      currentPage: page,
      hasNextPage,
      hasPrevPage,
      orders,
    });

  } catch (error) {
    next(error);
  }
};

export const analytics = async (req, res) => {
  try {
    if (req.user.role !== "shop_owner") {
      const err = new Error("Only shop owners can access analytics");
      err.statusCode = 403;
      throw err;
    }

    const analyticsData = await Order.aggregate([
      { $match: { shop: req.user.shopId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [
                { $eq: ["$status", "completed"] },
                "$total",
                0
              ]
            }
          }
        }
      }
    ]);

    let totalOrders = 0;
    let totalRevenue = 0;

    let pendingOrders = 0;
    let preparingOrders = 0;
    let readyOrders = 0;
    let completedOrders = 0;
    let cancelledOrders = 0;

    analyticsData.forEach(item => {
      totalOrders += item.count;

      if (item._id === "completed") {
        completedOrders = item.count;
        totalRevenue = item.totalRevenue;
      } else if (item._id === "pending") {
        pendingOrders = item.count;
      } else if (item._id === "preparing") {
        preparingOrders = item.count;
      } else if (item._id === "ready") {
        readyOrders = item.count;
      } else if (item._id === "cancelled") {
        cancelledOrders = item.count;
      }
    });

    res.status(200).json({
      totalOrders,
      pendingOrders,
      preparingOrders,
      readyOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue
    });

  } catch (error) {
    next(error);
  }
};

export const dailyAnalytics = async (req, res) => {
  try {
    if (req.user.role !== "shop_owner") {
      const err = new Error("Only shop owners can access analytics");
      err.statusCode = 403;
      throw err;
    }
    const dailyRevenue = await Order.aggregate([
  {
    $match: {
      shop: req.user.shopId,
      status: "completed"
    }
  },
  {
    $group: {
      _id: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$createdAt"
        }
      },
      revenue: { $sum: "$total" }
    }
  },
  {
    $sort: { _id: 1 }
  }
]);
   res.status(200).json({ dailyRevenue });
  } catch (error) {
    next(error);
  }
};

export const bestSellingItems = async (req, res) => {
  try {
    if (req.user.role !== "shop_owner") {
      const err = new Error("Only shop owners can access analytics");
      err.statusCode = 403;
      throw err;
    }

    const bestSellers = await Order.aggregate([
      { $match: { shop: req.user.shopId, status: "completed" } },

      { $unwind: "$items" },

      {
        $group: {
          _id: "$items.menuItem",
          quantity: { $sum: "$items.quantity" }
        }
      },

      { $sort: { quantity: -1 } },

      { $limit: 5 },

      {
        $lookup: {
          from: "menuitems",
          localField: "_id",
          foreignField: "_id",
          as: "menuItemDetails"
        }
      },

      { $unwind: "$menuItemDetails" }
    ]);

    res.status(200).json(bestSellers);

  } catch (error) {
    next(error);
  }
};
