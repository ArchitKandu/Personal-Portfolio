import { Col, Container, Row } from "react-bootstrap";
import navIcon1 from "../assets/img/nav-icon1.svg";
import navIcon2 from "../assets/img/nav-icon2.svg";

export const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center">
          <Col size={12} sm={6} className="footer-brand">
            <span className="navbar-brand">ARCHIT</span>
          </Col>
          <Col size={12} sm={6} className="text-center text-sm-end">
            <div className="social-icon">
              <a
                href="https://www.linkedin.com/in/architkandu/"
                target={"_blank"}
                rel={"noopener noreferrer"}
              >
                <img src={navIcon1} alt="Icon" />
              </a>
              <a
                href="https://github.com/ArchitKandu"
                target={"_blank"}
                rel={"noopener noreferrer"}
              >
                <img src={navIcon2} alt="Icon" />
              </a>
            </div>
            <p>Copyright 2024. All Rights Reserved</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
