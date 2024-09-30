import { Col, Container, Row } from "react-bootstrap";
import { ArrowRightCircle } from "react-bootstrap-icons";
import headerImg from "../assets/img/header-img.svg";
import { useEffect, useState } from "react";
import TrackVisibility from "react-on-screen";
import "animate.css";

export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const toRotate = [
    "Web Developer",
    "Software Engineer",
    "MERN Stack Developer",
  ];
  const period = 2000;

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta((prevDelta) => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setDelta(period);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setDelta(500);
    }
  };

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  });

  return (
    <section className="banner" id="home">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} md={6} xl={7}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__fadeIn" : ""
                  }
                >
                  <span className="tagline">Welcome to my Porfolio</span>
                  <h1>
                    {"Hi! I'm Archit"}
                    <br />
                    <span
                      className="txt-rotate"
                      dataPeriod="1000"
                      data-rotate='[ "Web Developer", "Software Engineer", "MERN Stack Developer" ]'
                    >
                      <span className="wrap">{text}</span>
                    </span>
                  </h1>
                  <p>
                    A computer science graduate hoping to become a software
                    developer with practical knowledge of HTML, CSS, JavaScript,
                    and C++. Quick learner, enthusiastic solver of problems, and
                    always up for a challenge. I'm eager to contribute my
                    technical expertise, flexibility, and new viewpoint to a
                    dynamic software development team. Let's get in touch and
                    discuss how I can help create meaningful solutions and be an
                    invaluable member of your team!
                  </p>
                  <button onClick={() => window.location.replace("/#contact")}>
                    Let's Connect <ArrowRightCircle size={25} />{" "}
                  </button>
                </div>
              )}
            </TrackVisibility>
          </Col>
          <Col xs={12} md={6} xl={5}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__zoomIn" : ""
                  }
                >
                  <img src={headerImg} alt="Header Img" />
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
