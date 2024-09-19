import { Container, Row, Col } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import projectImg1 from "../assets/img/babble-img.png";
import projectImg2 from "../assets/img/cryptonaut-img.png";
import projectImg3 from "../assets/img/medimate-img.png";
import colorSharp2 from "../assets/img/color-sharp2.png";

export const Projects = () => {
  const projectsDetails = [
    {
      title: "Babble",
      description:
        "A MERN stack chat application allows user to create account, join chat rooms, and engage in real-time conversations with other.",
      imgURL: projectImg1,
      view: "https://github.com/ArchitKandu/Babble",
    },
    {
      title: "Cryptonaut",
      description:
        "A web application built using React that allows user to explore details of various cryptocurrencies.",
      imgURL: projectImg2,
      view: "https://github.com/ArchitKandu/Cryptonaut",
    },
    {
      title: "Medimate",
      description:
        "A medication management system designed to help users keep track of their medications and receive timely reminders for doses.",
      imgURL: projectImg3,
      view: "https://github.com/ArchitKandu/MediMate",
    },
  ];

  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col>
            <h2>Projects</h2>
            <p>
              In my projects, I have developed full-stack applications using
              technologies like ReactJS, NodeJS, and MongoDB. Each project
              emphasizes clean, scalable code, user-friendly interfaces, and
              seamless performance, reflecting my commitment to delivering
              functional and efficient solutions.
            </p>
            <Row>
              {projectsDetails.map((project, index) => (
                <ProjectCard
                  key={index}
                  title={project.title}
                  description={project.description}
                  imgURL={project.imgURL}
                  view={project.view}
                />
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
      <img
        src={colorSharp2}
        className="background-image-right"
        alt="BgImgRight"
      />
    </section>
  );
};
