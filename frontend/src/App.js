import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

import {Navbar, Decode, Encode} from "./components"

const App = () => (
    <BrowserRouter>
        <Box sx={{ backgroundColor: 'rgb(30 41 59)' }}>
            <Navbar />
            <Routes>
                <Route path="/encode" element={<Encode />} />
                <Route path="/decode" element={<Decode />} />
            </Routes>
        </Box>
    </BrowserRouter>
);

export default App;
