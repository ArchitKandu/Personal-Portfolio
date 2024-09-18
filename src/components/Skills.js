import { Container, Row, Col } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import colorSharp from "../assets/img/color-sharp.png";
import nodeJs from "../assets/icons/nodejs-plain-wordmark.svg";
import reactJs from "../assets/icons/react-original.svg";
import expressJs from "../assets/icons/express-original.svg";
import mongoDb from "../assets/icons/mongodb-original.svg";
import oracle from "../assets/icons/sqldeveloper-original.svg";
import git from "../assets/icons/git-plain.svg";
import npm from "../assets/icons/npm-original-wordmark.svg";
import materialUi from "../assets/icons/materialui-plain.svg";
import postman from "../assets/icons/postman-original.svg";
import putty from "../assets/icons/putty-original.svg";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export const Skills = () => {
  return (
    <section className="skill" id="skills">
      <Container>
        <Row>
          <Col>
            <div className="skill-bx">
              <h2>Skills</h2>
              <p>
                Here are some of the skills I have developed over time:
                proficiency in full-stack web development using JavaScript,
                ReactJS, NodeJS, and MongoDB. I possess strong
                problem-solving abilities, team collaboration skills, and
                expertise in optimizing application performance.
              </p>
              <Carousel
                responsive={responsive}
                infinite={true}
                className="skill-slider"
              >
                <div className="item">
                  <img src={nodeJs} alt="Nodejs" />
                  <h5>Node.js</h5>
                </div>
                <div className="item">
                  <img src={reactJs} alt="Reactjs" />
                  <h5>React.js</h5>
                </div>
                <div className="item">
                  <img src={expressJs} alt="Expressjs" />
                  <h5>Express.js</h5>
                </div>
                <div className="item">
                  <img src={mongoDb} alt="Mongodb" />
                  <h5>MongoDB</h5>
                </div>
                <div className="item">
                  <img src={oracle} alt="Oracle" />
                  <h5>OracleDB</h5>
                </div>
                <div className="item">
                  <img src={git} alt="Git" />
                  <h5>Git</h5>
                </div>
                <div className="item">
                  <img src={npm} alt="NPM" />
                  <h5>NPM</h5>
                </div>
                <div className="item">
                  <img src={materialUi} alt="Material UI" />
                  <h5>Material UI</h5>
                </div>
                <div className="item">
                  <img src={postman} alt="Postman" />
                  <h5>Postman</h5>
                </div>
                <div className="item">
                  <img src={putty} alt="PuTTY" />
                  <h5>PuTTY</h5>
                </div>
              </Carousel>
            </div>
          </Col>
        </Row>
      </Container>
      <img src={colorSharp} alt="BgImgLft" className="backgroung-image-left" />
    </section>
  );
};
