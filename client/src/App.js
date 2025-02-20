import { Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import ProductsPage from "./components/ProductsPage/ProductsPage";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import TestStripe from './pages/TestStripe';
import Return from './components/Return';
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import "bootstrap/dist/css/bootstrap.min.css";
import BottomNavBar from "./components/BottomNavBar";
import { PageNotFound } from "./pages/PageNotFound";
import ProductDetails from './pages/ProductDetails';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="*" element={ <PageNotFound/>} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path='/products/:id' element={<ProductDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path='/test-stripe' element={<TestStripe />} />
        <Route path='/return' element={<Return />} />
      </Routes>
      <BottomNavBar />
    </div>
  );
}

export default App;