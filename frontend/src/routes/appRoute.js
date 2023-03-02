import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { render } from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import LandingPage from "../pages";
import Home from "../pages/home";
import CreateDao from "../pages/createDao";
import Dao from "../pages/dao";
import CreateProposal from "../pages/createProposal";
import MarketPlace from "../pages/marketPlace";
import MyNFT from "../pages/myNFT";

const AppRoute = () => {

  return render(
    <BrowserRouter>
     <ChakraProvider theme={theme} resetCSS>
      <Routes>
        <Route index path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-dao" element={<CreateDao />} />
        <Route path="/create-proposal/:id" element={<CreateProposal />} />
        <Route path="/dao/:id" element={<Dao />} />
        <Route path="/nft" element={<MarketPlace />} />
        <Route path="/my-nfts" element={<MyNFT />} />
      </Routes>
     </ChakraProvider>
    </BrowserRouter>,
    document.getElementById("root")
  );
};

export default AppRoute;
