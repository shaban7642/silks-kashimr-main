import React, { useEffect, useState } from 'react';
import {
	Drawer,
	Form,
	Button,
	Input,
	message,
	Upload,
	Alert,
	Select,
	InputNumber,
} from 'antd';

import { listCats } from '../../../../actions/catActions';
import { useDispatch, useSelector } from 'react-redux';
import ImgCrop from 'antd-img-crop';
import { AiOutlineInbox } from 'react-icons/ai';
import { productCreateAction } from '../../../../actions/productActions';

const { Dragger } = Upload;
const { Option } = Select;

const CreateProduct = ({ onProductClose, visible }) => {
	let url = `${process.env.REACT_APP_API}/uploadimages`;
	const props = {
		name: 'file',
		multiple: true,
		action: url,
		async onChange(info) {
			const { status } = info.file;
			if (status !== 'uploading') {
			}
			if (status === 'done') {
				message.success(`${info.files} file uploaded successfully.`);

				setImages(info.fileList.map((file) => `/uploads/${file.name}`));
			} else if (status === 'error') {
				message.error(`${info.file.name} file upload failed.`);
			}
		},
		onDrop(e) {
			e.preventDefault();
		},
	};

	const [name, setName] = useState();
	const [images, setImages] = useState();
	const [description, setDescription] = useState();
	const [originalPrice, setOriginalPrice] = useState();
	const [category, setCategory] = useState();
	const [qty, setQty] = useState();
	const [color, setColor] = useState();
	const [brand, setBrand] = useState();

	let dispatch = useDispatch();

	useEffect(() => {
		dispatch(listCats());
	}, [dispatch]);

	const { catList, productCreate } = useSelector((state) => ({ ...state }));
	const { cats } = catList;
	const { error, product } = productCreate;
	const err = error && error.err;

	const handleSubmit = (e) => {
		e.preventDefault();
		if (error) {
			message.error(err);
		}
		dispatch(
			productCreateAction({
				name,
				description,
				originalPrice,
				category,
				quantity: qty,
				color,
				brand,
				images,
			})
		);
	};
	return (
		<>
			<Drawer
				title="Create a new product"
				width={500}
				onClose={onProductClose}
				visible={visible}
				bodyStyle={{ paddingBottom: 80 }}
				footer={
					<div
						style={{
							textAlign: 'right',
						}}
					>
						<Button
							onClick={onProductClose}
							id="close"
							style={{ marginRight: 8 }}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit}
							id="submit-btn"
							type="primary"
						>
							Submit
						</Button>
					</div>
				}
			>
				<h3>Create Product</h3>
				{err ? (
					<Alert message={err} type="error" showIcon />
				) : (
					product &&
					product.name && (
						<Alert
							message="product has been created successfully"
							type="success"
							showIcon
						/>
					)
				)}

				<Form
					labelCol={{
						span: 4,
					}}
					wrapperCol={{
						span: 14,
					}}
					layout="horizontal"
				>
					<Form.Item>
						<Input
							placeholder="product name"
							onChange={(e) => setName(e.target.value)}
							value={name}
						/>
					</Form.Item>
					<Form.Item>
						<Input
							placeholder="product description"
							onChange={(e) => setDescription(e.target.value)}
							value={description}
						/>
					</Form.Item>
					<Form.Item>
						<InputNumber
							placeholder="price"
							defaultValue={originalPrice}
							onChange={(e) => setOriginalPrice(e)}
						/>
					</Form.Item>
					<Form.Item>
						<Select
							showSearch
							style={{ width: 200 }}
							placeholder="Select a category"
							optionFilterProp="children"
							value={category}
							onChange={(e) => setCategory(e)}
							filterOption={(input, option) =>
								option.children
									.toLowerCase()
									.indexOf(input.toLowerCase()) >= 0
							}
						>
							{cats &&
								cats.map((cat) => (
									<Option value={cat.slug} key={cat._id}>
										{cat.name}
									</Option>
								))}
						</Select>
					</Form.Item>
					<Form.Item>
						<InputNumber
							placeholder="quantity"
							min={1}
							max={100}
							defaultValue={qty}
							onChange={(e) => setQty(e)}
						/>
					</Form.Item>

					<Form.Item>
						<Input
							placeholder="brand"
							value={brand}
							onChange={(e) => setBrand(e.target.value)}
						/>
					</Form.Item>

					<Form.Item>
						<Input
							placeholder="color"
							value={color}
							onChange={(e) => setColor(e.target.value)}
						/>
					</Form.Item>

					<ImgCrop rotate>
						<Dragger {...props} listType="picture-card" required>
							<p className="ant-upload-drag-icon">
								<AiOutlineInbox />
							</p>
							<p className="ant-upload-text">
								Click or drag file to this area to upload
							</p>
						</Dragger>
					</ImgCrop>
				</Form>
			</Drawer>
		</>
	);
};

export default CreateProduct;
