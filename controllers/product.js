const prisma = require("../config/prisma");

exports.create = async (req, res) => {
    try {
        const { title, description, price, category, quantity, images } = req.body;

        const product = await prisma.product.create({
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                categoryID: parseInt(category), // แก้จาก categoryID เป็น category
                quantity: parseInt(quantity),
                images: {
                    create: images.map((item) => ({
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url: item.url,
                        secure_url: item.secure_url,
                    })),
                },
            },
        });

        res.send("Create product success");
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.list = async (req, res) => {
    try {
        const count = parseInt(req.params.count); // แก้โค้ดที่ผิด
        const products = await prisma.product.findMany({
            take: count,
            orderBy: { createdAt: "desc" },
            include: {
                category: true,
                Images: true,
            },
        });

        res.json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.read = async (req, res) => {
    try {
        const id = parseInt(req.params.count); // แก้โค้ดที่ผิด
        const product = await prisma.product.findFirst({
            where: {
                id: id,
            },
            include: {
                category: true,
                Images: true,
            },
        });

        res.json(product);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.update = async (req, res) => {
    try {
        const { title, description, price, category, quantity, images } = req.body;

        await prisma.image.deleteMany({
            where: {
                productId: Number(req.params.id),
            },
        });

        const product = await prisma.product.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                categoryID: parseInt(category), // แก้จาก categoryID เป็น category
                quantity: parseInt(quantity),
                images: {
                    create: images.map((item) => ({
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url: item.url,
                        secure_url: item.secure_url,
                    })),
                },
            },
        });

        res.json({ message: "Product updated", product });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.remove = async (req, res) => {
    try {
        const id = Number(req.params.id);

        await prisma.product.delete({
            where: {
                id: id,
            },
        });

        res.send("Deleted success");
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.listby = async (req, res) => {
    try {
        const { sort, order, limit } = req.body;
        const products = await prisma.product.findMany({
            take: limit,
            orderBy: { [sort]: order },
            include: { category: true },
        });

        res.json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

const handleQuery = async (req, res, query) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                title: {
                    contains: query,
                },
            },
            include: {
                category: true,
                Images: true,
            },
        });
        res.json(products);
    } catch (err) {
        console.log(err);
        res.status(500).send("Search error");
    }
};

const handlePrice = async (req, res, priceRange) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                price: {
                    gte: priceRange[0],
                    lte: priceRange[1],
                },
            },
            include: {
                category: true,
                Images: true,
            },
        });

        res.json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

const handleCategory = async (req, res, categoryId) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                price: {
                    categoryID: {
                        in: categoryId.map((id) => number(id)),
                    }
                },
            },
            include: {
                category: true,
                Images: true,
            },
        });

        res.json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.searchFilters = async (req, res) => {
    try {
        const { query, category, price } = req.body;

        if (query) {
            console.log("Query:", query);
            return await handleQuery(req, res, query);
        }
        if (category) {
            console.log("Category-->:", category);
            return await handleCategory(req, res, category);
            await handleCategory(req, res, category);
        }
        if (price) {
            console.log("Price:", price);
            return await handlePrice(req, res, price);
        }

        res.json([]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};
