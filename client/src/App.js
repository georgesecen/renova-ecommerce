import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import Home from "./components/HomePage/Home";
import ProductsPage from "./components/ProductsPage/ProductsPage";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout/Checkout";
import Return from "./pages/Return/Return";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import "bootstrap/dist/css/bootstrap.min.css";
import BottomNavBar from "./components/BottomNavBar";
import { PageNotFound } from "./pages/PageNotFound";
import UserDashboard from "./components/UserDashboard/UserDashboard";
import Admin from "./pages/Admin/Admin";
import CartPage from "./components/CartPage/CartPage";

function App() {

  // Check if current route is the admin route
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';

  return (
    <div className="App">
      
      {/* Display header if not an admin route */}
      {!isAdminRoute && <Header />}

      <Routes>
        <Route path="*" element={ <PageNotFound/>} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path='/products/:id' element={<ProductDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/dashboard' element={<UserDashboard />} />
        <Route path='/return' element={<Return />} />
        <Route path='/admin' element={<Admin />} />
      </Routes>

      {/* Display footer is not an admin route */}
      {!isAdminRoute && <BottomNavBar />}
    </div>
  );
}

export default App;