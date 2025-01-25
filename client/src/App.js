import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products'
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import 'bootstrap/dist/css/bootstrap.min.css';
import BottomNavBar from './components/BottomNavBar';
import ProductDetails from './components/ProductDetails';

function App() {
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/products' element={<Products />} />
                <Route path='/products/:id' element={<ProductDetails />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/cart' element={<Cart />} />
            </Routes>
            <BottomNavBar />
        </div>
    );
}

export default App;
