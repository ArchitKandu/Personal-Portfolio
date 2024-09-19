import { Col } from "react-bootstrap";

export const ProjectCard = ({ title, description, imgURL, view }) => {
  return (
    <Col sm={6} md={4}>
      <div className="proj-imgbx">
        <img src={imgURL} alt={title} />
        <div className="proj-txtx">
          <h4>{title}</h4>
          <div className="description">{description}</div>
          <a href={view} target="_blank">
            <button>View Project</button>
          </a>
        </div>
      </div>
    </Col>
  );
};
