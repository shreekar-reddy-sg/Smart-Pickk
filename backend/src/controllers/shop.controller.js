import { Shop } from "../models/shop.model.js"

const createShop = async (req,res) => {
    try{
        if(req.user.role !== "shop_owner") {
            return res.status(403).json({ message: "Only shop owners can create shops" });
        }
        const { shopName, location } = req.body;
        const shop = await Shop.create({
            shopName,
            location,
            owner: req.user.userId
        });
        res.status(201).json({ message: "Shop created successfully", shop });
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

const getNearbyShops = async (req, res) => {
    try {
        const { lng, lat, distance } = req.query;

        if (!lng || !lat) {
            return res.status(400).json({
                message: "Please provide lng and lat"
            });
        }

        const shops = await Shop.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: distance ? parseInt(distance) : 5000
                }
            }
        });

        res.status(200).json(shops);

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getMyShops = async (req, res) => {
    try {
        if(req.user.role !== "shop_owner") {
            return res.status(403).json({ message: "Only shop owners can view their shops" });
        }
        const shops = await Shop.find({ owner: req.user.userId });
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export {
    createShop,
    fetchShops,
    getNearbyShops,
    getMyShops
};