import { Shop } from "../models/shop.model.js"

const createShop = async (req,res) => {
    try{
        if(req.user.role !== "shop_owner") {
            const err = new Error("Only shop owners can create shops");
            err.statusCode = 403;
            throw err;
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
        next(error);
    }
}

const fetchShops = async (req,res) => {
    try {
        const shops = await Shop.find();
        if(shops.length !== 0) res.status(200).json(shops);
        else res.json({message: "No shops exist!"})
    }
    catch(error) {
        next(error);
    }
}

const getNearbyShops = async (req, res) => {
    try {
        const { lng, lat, distance } = req.query;

        if (!lng || !lat) {
            const err = new Error("Longitude and latitude are required");
            err.statusCode = 400;
            throw err;
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
        next(error);
    }
}

const getMyShops = async (req, res) => {
    try {
        if(req.user.role !== "shop_owner") {
            const err = new Error("Only shop owners can view their shops");
            err.statusCode = 403;
            throw err;
        }
        const shops = await Shop.find({ owner: req.user.userId });
        res.status(200).json(shops);
    } catch (error) {
        next(error);
    }
}

export {
    createShop,
    fetchShops,
    getNearbyShops,
    getMyShops
};