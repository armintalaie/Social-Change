import React from "react";
// import NavBar from "./NavBar";
import { Button, Form, FormGroup, Input, Card } from "reactstrap";
import { FaTag } from "react-icons/fa";
import "../styles/CommunityPage.scss";

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
        <Form>
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
    </div>
  );
}

export default CommunityPage;
