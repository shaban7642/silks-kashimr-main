import React, { Fragment, useState, useEffect } from 'react';
import Header from './components/Navbar/Navbar';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { auth } from './firebase';
import { Container } from 'react-bootstrap';
import LandingPage from './pages/landing page/Landing';
import CreateCategory from './pages/Categories/CreateCategory';
import SignUpScreen from './pages/SignUpScreen/SignUpScreen';
import LoginScreen from './pages/LoginScreen/LoginScreen';
import UserEditScreen from './pages/EditUserScreen/EditUserScreen';
import UserListScreen from './pages/UserListScreen/UserListScreen';
import ProductDetails from './pages/Products/Product Details/ProductDetails';
import Products from './pages/Products/Products/Products';
import AdminMenu from './components/Admin/Menu/AdminMenu';
import Create from './components/Admin/Forms/Category/Create';
import Cart from './pages/Cart/Cart';
import CreateProduct from './components/Admin/Forms/Product.js/Create';
import OrderScreen from './pages/Order/OrderScreen';
import ShippingScreen from './pages/Shipping/ShippingScreen';
import PaymentScreen from './pages/Payment/PaymentScreen';
import PlaceOrderScreen from './pages/Place Order/PlaceOrderScreen';
import OrderListScreen from './pages/Order List/OrderListScreen';
import Shop from './pages/Shop/Shop';
import UpdateProduct from './components/Admin/Forms/Product.js/Update';
import RegisterComplete from './pages/SignUpScreen/RegisterComplete';
import { currentUser } from './actions/userActions';
import ForgetPassword from './pages/Forget Password/ForgetPassword';
import PannerUpload from './components/Panner/PannerUpload';
import CategoriesDrawer from './pages/Categories/CategoriesDrawer.js';
import ProfileScreen from './pages/ProfileScreen/ProfileScreen';
const App = () => {
    const dispatch = useDispatch();
    // to check firebase auth state
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const idTokenResult = await user.getIdTokenResult();
                dispatch(currentUser(idTokenResult.token));
            }
        });
        // cleanup
        return () => unsubscribe();
    }, [dispatch]);

    const [productVisible, setProductVisible] = useState(false);
    const [productUpdateVisible, setProductUpdateVisible] = useState(false);
    const [catVisible, setCatVisible] = useState(false);
    const [pannerVisible, setPannerVisible] = useState(false);
    const [catsVisible, setCatsVisible] = useState(false);
    const showProductDrawer = () => {
        setProductVisible(true);
    };
    const showCatDrawer = () => {
        setCatVisible(true);
    };

    const onProductClose = () => {
        setProductVisible(false);
    };
    const onCatClose = () => {
        setCatVisible(false);
    };
    const showUpdateProductDrawer = () => {
        setProductUpdateVisible(true);
    };
    const closeUpdateProductDrawer = () => {
        setProductUpdateVisible(false);
    };

    const showPannerDrawer = () => {
        setPannerVisible(true);
    };
    const closePannerDrawer = () => {
        setPannerVisible(false);
    };
    const showCatsDrawer = () => {
        setCatsVisible(true);
    };
    const closeCatsDrawer = () => {
        setCatsVisible(false);
    };

    return (
        <Fragment>
            <Router>
                <Header />
                <PannerUpload
                    onClose={closePannerDrawer}
                    visible={pannerVisible}
                />
                <AdminMenu
                    showProductDrawer={showProductDrawer}
                    showCatDrawer={showCatDrawer}
                    showPannerDrawer={showPannerDrawer}
                    showCatsDrawer={showCatsDrawer}
                />
                <Create onCatClose={onCatClose} visible={catVisible} />
                <CreateProduct
                    onProductClose={onProductClose}
                    visible={productVisible}
                />
                <UpdateProduct
                    visible={productUpdateVisible}
                    closeDrawer={closeUpdateProductDrawer}
                />
                <CategoriesDrawer
                    onClose={closeCatsDrawer}
                    visible={catsVisible}
                />
                <Container className='mt-5'>
                    <Route path='/' component={LandingPage} exact />
                    <Route path='/signup' component={SignUpScreen} />
                    <Route
                        path='/register/complete'
                        component={RegisterComplete}
                        exact
                    />
                    <Route path='/signin' component={LoginScreen} />
                    <Route path='/forgetpassword' component={ForgetPassword} />
                    <Route
                        path='./admin/user/:id/edit'
                        component={UserEditScreen}
                    />
                    <Route path='/profile' component={ProfileScreen} />
                    <Route path='/admin/userlist' component={UserListScreen} />
                    <Route path='/createcat' component={CreateCategory} exact />
                    <Route
                        path='/:slug/products'
                        component={(routeProps) => (
                            <Products
                                showDrawer={showUpdateProductDrawer}
                                {...routeProps}
                            />
                        )}
                        exact
                    />
                    <Route
                        path='/:catSlug/:productSlug'
                        component={ProductDetails}
                        exact
                    />
                    <Route path='/shop' component={Shop} exact />

                    <Route path='/cart/:slug?' component={Cart} exact />
                    <Route path='/order/:id' component={OrderScreen} exact />
                    <Route path='/shipping' component={ShippingScreen} exact />
                    <Route path='/payment' component={PaymentScreen} exact />
                    <Route path='/placeorder' component={PlaceOrderScreen} />
                    <Route
                        path='/admin/orderlist'
                        component={OrderListScreen}
                    />
                </Container>
            </Router>
        </Fragment>
    );
};
export default App;
