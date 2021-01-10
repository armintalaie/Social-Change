import React from "react";
// import NavBar from "./NavBar";
import MovementCard from "./MovementCard";
import { Button, Form, FormGroup, Input, ListGroup } from "reactstrap";
import { FaTag } from "react-icons/fa";
import "../styles/CommunityPage.scss";

const movement1 = {
  name:
    "Enhancing sports ground accessibility in sports events in West Vancouver",
  community: "Medical",
  description:
    "Spectator enjoyment is more than the game--it is an immerse experience. Let’s strive for a fun fan experience without accessibility barrier in these venues!",
  votes: 9,
  goal: 900,
};

const movements = [movement1, movement1];

function CommunityPage() {
  return (
    <div className="community__wrapper">
      <div className="community__header">
        <div className="community__header__title">
          <div className="community__header__title--tag">
            <h3>
              <FaTag />
              Medical Community
            </h3>
            <Button color="secondary" className="community__header__title--tag">
              Cancel Join
            </Button>
          </div>
          <div className="community__header__title--donation">
            <h3> !!! DONATED $$ </h3>
            <Button color="primary" className="community__header__title--tag">
              Donate
            </Button>
          </div>
        </div>
        <Form className="community__header--search">
          <FormGroup>
            <Input
              type="search-bar"
              name="community__search-bar"
              id="community__search-bar"
              placeholder="Search movement"
            />
          </FormGroup>
        </Form>
      </div>
      <div className="community__content">
        <ListGroup
          className="community__content__cards"
          style={{ flexDirection: "row" }}
        >
          {movements.map(movement => (
            <MovementCard movement={movement} />
          ))}
        </ListGroup>
      </div>
    </div>
  );
}

export default CommunityPage;
