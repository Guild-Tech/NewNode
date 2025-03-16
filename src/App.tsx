import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import DashboardHome from "./pages//dashboard/Products";
import Success from "./components/payment/success";
import Canceled from "./components/payment/Canceled";
import Dashboard from './pages/dashboard/Dashboard';
import NewProduct from './pages/dashboard/NewProduct';
import EditProduct from './pages/dashboard/EditProduct';
import Orders from './pages/dashboard/Orders';
import NotFound from './pages/dashboard/NotFound';
// import PaymentOptions from './components/payment/PaymentOptions';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard-home" element={<DashboardHome />} />
          <Route path="/products/new" element={<NewProduct />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="*" element={<NotFound />} />
          {/* <Route path="/" element={<PaymentOptions amount={20} onSuccess={() => { }} />} /> */}
          <Route path="/success" element={<Success />} />
          <Route path="/canceled" element={<Canceled />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;