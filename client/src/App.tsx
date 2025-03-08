import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Navbar />
      <Outlet />
    </Box>
  );
}

export default App;
