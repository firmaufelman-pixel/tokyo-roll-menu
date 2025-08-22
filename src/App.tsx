import "antd/dist/antd.less";
import "./App.css";

import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";

import "./assets/script/index.e515da3f";
import "./assets/script/vendor.d82aaa9c";
import MyOrderPage from "pages/MyOrderPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/my-order" element={<MyOrderPage />} />
      </Routes>
    </div>
  );
}

export default App;
