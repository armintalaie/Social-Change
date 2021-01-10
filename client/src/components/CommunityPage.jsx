import React from "react";
// import NavBar from "./NavBar";
import MomentumCard from "./MomentumCard";
import { Button, Form, FormGroup, Input, ListGroup } from "reactstrap";
import { FaTag } from "react-icons/fa";
import "../styles/CommunityPage.scss";

function CommunityPage({ momentum }) {
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
              placeholder="Search Momentum"
            />
          </FormGroup>
        </Form>
      </div>
      <div className="community__content">
        {/* <ListGroup>
          {momentums.map(momentum => (
            <MomentumCard key={momentum.id} momentum={momentum} />
          ))}
        </ListGroup> */}
      </div>
    </div>
  );
}

export default CommunityPage;
