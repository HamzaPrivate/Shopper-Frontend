import React, { useEffect, useState } from "react"
import '../styles/Login.css';
import { Button, Modal } from "react-bootstrap";
import { useLoginContext } from "../LoginContext";
import { getLoginInfoFromJWT, removeJWT, storeJWT } from "../JWTManager";
import { login } from "../backend/shopperapi";


//erhält referenz auf eine Funktion, die einen State im Parent (in App, also loginpressed) ändert
export default function LoginDialog(props: {setLoginPressed: (val: boolean)=>void}) {

  const setLoginPressed: ((val: boolean) => void) = props.setLoginPressed;
  const { setLoginInfo } = useLoginContext();

  const [email, setEMail] = useState("john@some-host.de")
  const [password, setPassword] = useState("12abcAB!")
  const [msg, setMsg] = useState("")
  
  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const jwt = await login(email, password)
      console.log("Login: " + jwt)
      if (jwt) {
        // store JWT in local storage
        storeJWT(jwt);
        // sync react state
        const loginInfo = getLoginInfoFromJWT(jwt);
        setLoginInfo(loginInfo)
        setMsg("")
        setLoginPressed(false)
      } else {
        setMsg("Login failed")
      }
    } catch (err) {
      setMsg(String(err))
    } finally {
      setPassword("");
    }
  }


  return (
    <Modal backdrop="static" show={true} centered onHide={()=>setLoginPressed(false)}>
      <form onSubmit={doLogin}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>E-Mail: <input type="text" value={email} name="email" onChange={(e) => setEMail(e.target.value)} /></label>
          <div><label>Passwort: <input type="text" value={password} name="passwort" onChange={(e) => setPassword(e.target.value)} /></label></div>
          <small>{msg}</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setLoginPressed(false)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            OK
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}