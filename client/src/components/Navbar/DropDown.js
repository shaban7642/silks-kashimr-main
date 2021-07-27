import React, { Fragment } from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { Link } from 'react-router-dom';
import './assets/navbar.css';
import { useDispatch } from 'react-redux';
import { logout } from './../../actions/userActions';

const DropDown = () => {
	let dispatch = useDispatch();

	const logoutUser = () => {
		dispatch(logout());
	};
	const menu = (
		<Fragment>
			<Menu>
				<Menu.Item>
					<Link to="/shipping">Checkout</Link>
				</Menu.Item>
				<Menu.Item>
					<Link to="/cart">Cart</Link>
				</Menu.Item>
				<Menu.Item>
					<Link to="/profile">Profile</Link>
				</Menu.Item>
				<Menu.Item>
					<Link onClick={logoutUser}>Logout</Link>
				</Menu.Item>
			</Menu>
		</Fragment>
	);
	return (
		<Dropdown overlay={menu} placement="bottomCenter">
			<Button className="drop-down">MY ACCOUNT</Button>
		</Dropdown>
	);
};

export default DropDown;
