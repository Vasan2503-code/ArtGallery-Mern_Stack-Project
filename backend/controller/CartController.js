const Cart = require("../models/Cart");

const addCart = async (req, res) => {
    try {
        const { artId, quantity } = req.body;

        if (!artId || !quantity) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const cart = await Cart.findOne({ user: req.user.id })

        if (!cart) {
            const newCart = new Cart({
                user: req.user.id,
                items: [{ art: artId, quantity: quantity }]
            })
            await newCart.save();
            return res.status(201).json({ message: "Cart created successfully" })
        }

        const isItemInCart = cart.items.find(item => item.art.toString() === artId)

        if (isItemInCart) {
            isItemInCart.quantity += quantity;
            await cart.save();
            return res.status(200).json({ message: "Item quantity updated successfully" })
        }

        cart.items.push({ art: artId, quantity: quantity })
        await cart.save();
        return res.status(200).json({ message: "Item added to cart successfully" })
    }
    catch (e) {
        res.status(500).json({ message: "Server side error" })
        console.log(e)
    }
}

const deleteCartItem = async (req, res) => {
    try {
        const { artId } = req.body;

        if (!artId) {
            return res.status(400).json({ message: "Art id is required" })
        }

        const cart = await Cart.findOne({ user: req.user.id })

        if (!cart) {
            return res.status(404).json({ message: "Items not found in carrt" })
        }

        const isItemInCart = cart.items.find(item => item.art.toString() === artId)

        if (!isItemInCart) {
            return res.status(404).json({ message: "Item not found in cart" })
        }

        cart.items = cart.items.filter(item => item.art.toString() !== artId)
        await cart.save();
        return res.status(200).json({ message: "Item removed from cart successfully" })
    } catch (e) {
        res.status(500).json({ message: "Server side error" })
    }
}

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate("items.art");

        if (!cart) {
            return res.status(404).json({ message: "Items not found in carrt" })
        }

        return res.status(200).json(cart)
    } catch (e) {
        res.status(500).json({ message: "Server side error" })
    }
}

module.exports = { addCart, deleteCartItem, getCart }