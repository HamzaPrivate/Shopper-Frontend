import { Route, Routes } from "react-router-dom";
import PageShopper from "./components/PageShopper";
import PageShopList from "./components/PageShopList";
import PageShopItem from "./components/PageShopItem";
import PageAdmin from "./components/PageAdmin";
import PagePrefs from "./components/PagePrefs";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "./styles/App.css";
import { LinkContainer } from "react-router-bootstrap";
import LoginDialog from "./components/LoginDialog";
import { Button } from "react-bootstrap";
import { useState } from "react";
import { LoginContext } from "./LoginContext";
import { getLoginInfoFromJWT, removeJWT, retrieveJWT } from "./JWTManager";
import React from "react";

function App() {
  const [loginPressed, setLoginPressed] = useState(false);
  const [loginInfo, setLoginInfo] = React.useState(getLoginInfoFromJWT(retrieveJWT()));
  const doLogout = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginInfo(null);
    removeJWT();
  }

  return (
    <div>
      <LoginContext.Provider value={{ loginInfo, setLoginInfo }}>
          <Navbar bg="dark" data-bs-theme="dark" className="navbar">
            <Container>
              <LinkContainer to="/shopper" children={<Nav.Link>
                <Navbar.Brand>Shopper</Navbar.Brand>
              </Nav.Link>}></LinkContainer>
              <Nav className="me-auto">
                {loginInfo?.role == "a" ? <LinkContainer children={<Nav.Link>Admin</Nav.Link>} to="/admin"></LinkContainer> : null}
                {loginInfo?.userId ? <LinkContainer children={<Nav.Link>Prefs</Nav.Link>} to="/prefs"></LinkContainer> : null}
                {loginInfo?.userId ? <Button className="logout-button" onClick={(e) => { doLogout(e); setLoginPressed(false) }}>Logout</Button> : <Button className="login-button" onClick={() => setLoginPressed(true)}>Login</Button>}
                {loginPressed && <LoginDialog setLoginPressed={setLoginPressed}></LoginDialog>}
              </Nav>
            </Container>
          </Navbar>
          <div>
            <Routes>
              <Route path="/shopper" element={<PageShopper />}> </Route>
              <Route path="/" element={<PageShopper />}> </Route>
              <Route path="/shoplist/:shoplistID" element={<PageShopList />}></Route>
              <Route path="/shopitem/:shopitemID" element={<PageShopItem />}></Route>
              <Route path="/admin" element={<PageAdmin />}></Route>
              <Route path="/prefs" element={<PagePrefs />}></Route>
            </Routes>
          </div>
      </LoginContext.Provider>
    </div>
  );
}

export default App;
