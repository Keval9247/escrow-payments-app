import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard.jsx';
import Success from './components/success.jsx';
import Payment from './components/Payment.jsx';
import Signup from './components/SignupForm';
import Login from './components/Login';
import Reauth from './components/Reauth.jsx';
import SuperadminRoutes from './superadmin/SuperadminRoutes.jsx';
import ManageProducts from './components/ManageProducts.jsx';
import ProductListing from './components/ProductListing.jsx';
import AddProduct from './components/AddProduct.jsx';
import BuyProduct from './components/stripe/BuyProduct.jsx';
import HomePage from './components/HomePage.jsx';
import SignupUser from './components/SignupUser.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register-seller" element={<Signup />} />
      <Route path="/register-user" element={<SignupUser />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/success" element={<Success />} />
      <Route path="/reauth" element={<Reauth />} />
      {/* <Route path="/superadmin/*" element={<SuperadminRoutes />} /> */}
      <Route path="/products" element={<ProductListing />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/buy/:productId" element={<BuyProduct />} />
      {/* <Route path="/manage-products" element={<ManageProducts />} /> */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
