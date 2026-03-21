import { MenuItem } from "../models/menuitem.model.js";
import { Shop } from "../models/shop.model.js";

const item = async (req, res, next) => {
    const { name, description, price, available, shopId, photo } = req.body;
    try {
        if(req.user.role !== 'shop_owner') {
            const err = new Error("Only shop owners can add menu items");
            err.statusCode = 403;
            throw err;
        }
        const shop = await Shop.findById(shopId);
        if (!shop || shop.owner.toString() !== req.user.userId) {
            const err = new Error("Shop not found or you do not own this shop");
            err.statusCode = 404;
            throw err;
        }
        const menuItem = await MenuItem.create({ name, description, price, available, shopId, photo });
        res.status(201).json({ success: true, data: menuItem });
    }
    catch (error) {
        next(error);
    }
}

const fetchMenuItems = async (req, res, next) => {
    try {
        const { shopId } = req.params;  
        const menuItems = await MenuItem.find({ shopId });
        if(menuItems.length !== 0) res.status(200).json({ success: true, data: menuItems });
        else {
            const err = new Error("No menu items exist for this shop");
            err.statusCode = 404;
            throw err;
        }  
    }
    catch (error) {
        next(error);
    }
}

const searchMenuItems = async (req, res, next) => {
    try {
        const { search } = req.query;
        const menuItems = await MenuItem.find({ name: { $regex: search, $options: 'i' } });
        res.status(200).json({ success: true, data: menuItems });
    }
    catch (error) {
        next(error);
    }
}

export {
    item,fetchMenuItems,searchMenuItems
};