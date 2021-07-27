import {
	PRODUCT_LIST_REQUEST,
	PRODUCT_LIST_SUCCESS,
	PRODUCT_LIST_FAIL,
	PRODUCT_CREATE_REQUEST,
	PRODUCT_CREATE_SUCCESS,
	PRODUCT_CREATE_FAIL,
	PRODUCT_DETAILS_REQUEST,
	PRODUCT_DETAILS_SUCCESS,
	PRODUCT_DETAILS_FAIL,
	PRODUCT_CREATE_REVIEW_REQUEST,
	PRODUCT_CREATE_REVIEW_SUCCESS,
	PRODUCT_CREATE_REVIEW_FAIL,
} from '../constants/productConst';
import axios from 'axios';

let url = process.env.REACT_APP_API;

export const productListAction = () => async (dispatch) => {
	try {
		dispatch({ type: PRODUCT_LIST_REQUEST });

		const { data } = await axios.get(`${url}/product`);
		console.log('data from action', data);
		dispatch({
			type: PRODUCT_LIST_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: PRODUCT_LIST_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const productCreateAction = (product) => async (dispatch, getState) => {
	try {
		dispatch({ type: PRODUCT_CREATE_REQUEST });
		const {
			userLogin: { userInfo },
		} = getState();
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		};
		const { data } = await axios.post(`${url}/product`, product, config);
		console.log('data from product create action', data);
		dispatch({
			type: PRODUCT_CREATE_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: PRODUCT_CREATE_FAIL,
			payload:
				error.response && error.response.data
					? error.response.data
					: error.data,
		});
	}
};

export const productUpdateAction =
	(slug, product) => async (dispatch, getState) => {
		try {
			// dispatch({ type: ' PRODUCT_UPDATE_REQUEST' });

			// const {
			// 	userLogin: { userInfo },
			// } = getState();
			// const config = {
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 		Authorization: `Bearer ${userInfo.token}`,
			// 	},
			// };

			const { data } = await axios.put(
				`${url}/product/${slug}`,
				product
				// config
			);
			console.log('data from product update action', data);
			dispatch({
				type: 'PRODUCT_UPDATE_SUCCESS',
				payload: data,
			});
		} catch (error) {
			console.log(error);
			dispatch({
				type: 'PRODUCT_UPDATE_FAIL',
				payload:
					error.response && error.response.message
						? error.response.message
						: error.message,
			});
		}
	};

export const productDetailsAction = (slug) => async (dispatch) => {
	try {
		dispatch({ type: PRODUCT_DETAILS_REQUEST });

		const { data } = await axios.get(`${url}/product/${slug}`);
		dispatch({
			type: PRODUCT_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: PRODUCT_DETAILS_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const createProductReview =
	(productSlug, review) => async (dispatch, getState) => {
		try {
			dispatch({
				type: PRODUCT_CREATE_REVIEW_REQUEST,
			});

			const {
				userLogin: { userInfo },
			} = getState();

			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userInfo.token}`,
				},
			};

			await axios.post(
				`${url}/product/${productSlug}/reviews`,
				review,
				config
			);

			dispatch({
				type: PRODUCT_CREATE_REVIEW_SUCCESS,
			});
		} catch (error) {
			const message =
				error.response && error.response.data.message
					? error.response.data.message
					: error.message;
			if (message === 'Not authorized, token failed') {
				// dispatch(logout());
			}
			dispatch({
				type: PRODUCT_CREATE_REVIEW_FAIL,
				payload: message,
			});
		}
	};
