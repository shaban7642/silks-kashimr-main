import React, { Fragment, useState } from 'react';
import {
	Drawer,
	Form,
	Button,
	Col,
	Row,
	Input,
	message,
	Upload,
	Alert,
} from 'antd';
import { createCatAction } from '../../../../actions/catActions';
import { useDispatch, useSelector } from 'react-redux';
import ImgCrop from 'antd-img-crop';
import { AiOutlineInbox } from 'react-icons/ai';
import './Create.css';
const { Dragger } = Upload;

const Create = ({ onCatClose, visible }) => {
	const [name, setName] = useState('');
	const [image, setImage] = useState('');

	let url = `${process.env.REACT_APP_API}/uploadimages`;
	const { createCat } = useSelector((state) => ({ ...state }));
	const { cat } = createCat;
	const { err } = cat;

	const props = {
		name: 'file',
		multiple: true,
		action: url,
		onChange(info) {
			const { status } = info.file;

			if (status === 'done') {
				message.success(
					`${info.file.name} file uploaded successfully.`
				);
				setImage(`/uploads/${info.file.name}`);
			} else if (status === 'error') {
				message.error(`${info.file.name} file upload failed.`);
			}
		},
		onDrop(e) {
			e.preventDefault();
		},
	};

	let dispatch = useDispatch();
	const handleSubmit = (e) => {
		e.preventDefault();
		if (err) {
			message.error(err);
		}
		dispatch(createCatAction(name, image));
	};

	return (
		<>
			<Drawer
				title="Create a new category"
				width={400}
				onClose={onCatClose}
				visible={visible}
				bodyStyle={{ paddingBottom: 80 }}
				className="drawer"
				footer={
					<div
						style={{
							textAlign: 'right',
						}}
					>
						<Button
							onClick={onCatClose}
							style={{ marginRight: 8 }}
							id="close"
						>
							Cancel
						</Button>
						<Button
							type="primary"
							onClick={handleSubmit}
							id="submit-btn"
						>
							Create Category
						</Button>
					</div>
				}
			>
				<Form layout="vertical" hideRequiredMark className="pt-5">
					<Row gutter={16}>
						<Col>
							<h3>Create Category</h3>
							{err ? (
								<Alert message={err} type="error" showIcon />
							) : (
								cat &&
								cat.name && (
									<Alert
										message="category has been created successfully"
										type="success"
										showIcon
									/>
								)
							)}
							<Form.Item
								name="name"
								label="Category Name"
								rules={[
									{
										required: true,
										message: 'Category name is required',
									},
								]}
							>
								<Input
									placeholder="Please enter category name"
									onChange={(e) => setName(e.target.value)}
									required
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col>
							<ImgCrop rotate>
								<Dragger
									{...props}
									listType="picture-card"
									required
								>
									<p className="ant-upload-drag-icon">
										<AiOutlineInbox />
									</p>
									<p className="ant-upload-text">
										Click or drag file to this area to
										upload
									</p>
								</Dragger>
							</ImgCrop>
						</Col>
					</Row>
				</Form>
			</Drawer>
		</>
	);
};

export default Create;
