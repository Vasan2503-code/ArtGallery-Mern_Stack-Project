const express = require("express")
const Art = require('../models/Art');

const uploadArt = async (req, res) => {
    try {
        if (req.user.role !== "artist") {
            return res.status(403).json({ message: "Only artists can upload art" });
        }

        const { title, description, price, category } = req.body;

        if (!title || !description || !price || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" });
        }

        const imageList = req.files.map(f => ({
            url: f.path,
            public_id: f.filename
        }));

        const newArt = new Art({
            title,
            description,
            price,
            category,
            images: imageList,
            artist: req.user.id
        });

        await newArt.save();

        res.status(201).json({
            message: "Art uploaded successfully",
            art: newArt
        });
    } catch (e) {
        console.error("Upload Error:", e);
        res.status(500).json({ message: "Server side error", error: e.message });
    }
};

const updateArt = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, category } = req.body;

        const art = await Art.findOne({ _id: id, artist: req.user.id });

        if (!art) {
            return res.status(404).json({ message: "Art not found" });
        }

        if (title) art.title = title;
        if (description) art.description = description;
        if (price) art.price = price;
        if (category) art.category = category;

        if (req.files && req.files.length > 0) {
            art.images = req.files.map(f => ({
                url: f.path,
                public_id: f.filename
            }));
        }

        await art.save();
        res.status(200).json({ message: "Art updated successfully", art });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server side error" });
    }
};

const deleteArt = async (req, res) => {
    try {
        const { artId } = req.body;

        if (!artId) {
            return res.status(400).json({ message: "Art ID is required" });
        }

        const art = await Art.findOneAndDelete({
            _id: artId,
            artist: req.user.id
        });

        if (!art) {
            return res.status(404).json({ message: "Art not found" });
        }

        res.status(200).json({ message: "Art deleted successfully" });

    } catch (e) {
        res.status(500).json({ message: "Server side error" });
    }
};

const getArt = async (req, res) => {
    try {
        const arts = await Art.find({ artist: req.user.id });
        res.status(200).json(arts);
    } catch (e) {
        res.status(500).json({ message: "Server side error" });
    }
};


const getPublicArts = async (req, res) => {
    try {
        const { page = 1, limit = 9, category, sort } = req.query;

        const query = {
            $or: [{ isAvailable: true }, { isAvailable: { $exists: false } }]
        };
        if (category) query.category = category;

        let sortOption = {};
        if (sort === "price_asc") sortOption.price = 1;
        if (sort === "price_desc") sortOption.price = -1;

        const arts = await Art.find(query)
            .populate("artist", "name")
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort(sortOption);

        res.status(200).json(arts);
        // console.log(arts);

    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { uploadArt, updateArt, deleteArt, getArt, getPublicArts }