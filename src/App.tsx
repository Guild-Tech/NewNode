import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import PaymentOptions from "./components/payment/PaymentOptions";
import Success from "./components/payment/success";
import Canceled from "./components/payment/Canceled";

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
          <Route path="/" element={<PaymentOptions amount={20} onSuccess={() => {}} />} />
        <Route path="/success" element={<Success />} />
        <Route path="/canceled" element={<Canceled />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;