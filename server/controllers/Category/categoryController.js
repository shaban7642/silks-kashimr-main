const Category = require('../../models/Category');
const Async = require('express-async-handler');
const slugify = require('slugify');

const createCategory = Async(async (req, res) => {
	const { name } = req.body;
	const image = req.body.image;

	if (await Category.findOne({ name }))
		res.json({ err: 'The category already exists' });
	res.json(await new Category({ name, image, slug: slugify(name) }).save());
});

const getCategories = Async(async (req, res) => {
	let categories = await Category.find().sort({ createdAt: -1 }).exec();
	res.json(categories);
});

const updateCategory = Async(async (req, res) => {
	const { name, image } = req.body;
	const updated = await Category.findOneAndUpdate(
		{
			slug: req.params.slug,
		},
		{ name, slug: slugify(name), image },
		{ new: true }
	);

	res.json(updated);
});

const removeCategory = Async(async (req, res) => {
	const deleted = await Category.findOneAndDelete({
		slug: req.params.slug,
	});

	if (deleted) res.json({ data: `${deleted.name} has been deleted` });
});

module.exports = {
	createCategory,
	getCategories,
	updateCategory,
	removeCategory,
};
