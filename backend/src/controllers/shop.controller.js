import mongoose from "mongoose";
import { Shop } from "../models/shop.model.js"

const createShop = async (req,res) => {
    try{
        const shop = await Shop.create(req.body);
        res.status(201).json({ message: "Shop created successfully"});
    }
    catch(error) {
        res.status(500).json({ message: "Internal server error"});
    }
}

const fetchShops = async (req,res) => {
    try {
        const shops = await Shop.find();
        if(shops.length !== 0) res.status(200).json(shops);
        else res.json({message: "No shops exist!"})
    }
    catch {
        res.status(500).json({message: "Internal Server Error"});
    }
}

export {
    createShop,
    fetchShops
};