import { Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import TestStripe from './pages/TestStripe';
import Return from './components/Return';
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import "bootstrap/dist/css/bootstrap.min.css";
import BottomNavBar from "./components/BottomNavBar";
import { PageNotFound } from "./pages/PageNotFound";
import OrdersTable from "./components/OrdersTable/OrdersTable";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="*" element={ <PageNotFound/>} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path='/test-stripe' element={<TestStripe />} />
        <Route path='/orders' element={<OrdersTable />} />
        <Route path='/return' element={<Return />} />
      </Routes>
      <BottomNavBar />
    </div>
  );
}

export default App;