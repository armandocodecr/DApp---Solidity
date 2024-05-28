import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from './Home';
import Footer from './Footer';

export const App = () =>  {
    
    return (
        <BrowserRouter>
            <div className="App">
                <div>
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </BrowserRouter>
    );

}

export default App;