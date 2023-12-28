import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import NavBar from "./Components/NavBar";
import NotFound from "./Components/NotFound";
import UserLogin from "./Components/UserLogin";

function App() {
  // return <UserLogin />;
  return (
    <Router>
      <Routes>
        <Route exact path="*" element={<NotFound />} />

        <Route exact path="/" element={<UserLogin />} />
        <Route exact path="/sale-screen" element={<NavBar />} />
      </Routes>
    </Router>
  );
}

export default App;
