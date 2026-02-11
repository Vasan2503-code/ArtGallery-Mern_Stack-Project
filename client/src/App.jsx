import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import UploadArt from "./pages/Artist/UploadArt";
import MyArts from "./pages/Artist/MyArts";
import Payment from "./pages/Payment";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/upload-art" element={<UploadArt />} />
        <Route path="/my-arts" element={<MyArts />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
