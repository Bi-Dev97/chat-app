/* eslint-disable no-unused-vars */
import { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
/**Stack's component allow us to align items in vertically or
 * horizontally's position. By default it aligns items vertically */
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import appLogo from "../assets/chat-app_logo.png";
import Notification from "./chat/Notification";

const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <Navbar bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
      <Container>
        <h2>
          <img src={appLogo} alt="logo" width={50} className="mx-2 rounded" />
          <Link to="/" className="link-light text-decoration-none">
            ChatApp
          </Link>
        </h2>
        {user && (
          <span className="text-warning">Logged in as {user?.name}</span>
        )}
        <Nav>
          <Stack direction="horizontal" gap={3}>
            {user && (
              <>
                <Notification />
                <Link
                  onClick={() => logoutUser()}
                  to="/login"
                  className="link-light text-decoration-none"
                >
                  Logout
                </Link>
              </>
            )}

            {!user && (
              <>
                <Link to="/login" className="link-light text-decoration-none">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="link-light text-decoration-none"
                >
                  Register
                </Link>
              </>
            )}
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
