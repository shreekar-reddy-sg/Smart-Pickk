import { MenuItem } from "../models/menuitem.model.js";
import { Shop } from "../models/shop.model.js";

const item = async (req, res) => {
    const { name, description, price, available, shopId, photo } = req.body;
    try {
        if(req.user.role !== 'shop_owner') {
            return res.status(403).json({ message: "You are not authorized to add menu items." });
        }
        const shop = await Shop.findById(shopId);
        if (!shop || shop.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You are not authorized to add menu items to this shop." });
        }
        const menuItem = await MenuItem.create({ name, description, price, available, shopId, photo });
        res.status(201).json({ message: "Menu item added successfully", menuItem });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const fetchMenuItems = async (req, res) => {
    try {
        const { shopId } = req.params;  
        const menuItems = await MenuItem.find({ shopId });
        if(menuItems.length !== 0) res.status(200).json(menuItems);
        else res.status(404).json({message: "No menu items exist for this shop!"})  
    }
    catch {
        res.status(500).json({message: "Internal Server Error"});
    }
}

export {
    item,fetchMenuItems
};