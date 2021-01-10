import React from "react";
import { FaVoteYea } from "react-icons/fa";
import { ListGroupItem, Card, CardText, CardTitle, Button } from "reactstrap";

function MomentumCard({ movement }) {
  return (
    <div>
      <Card body>
        <CardTitle tag="h5">{movement.name}</CardTitle>
        <CardText>{movement.description}</CardText>
        <div>
          <FaVoteYea /> {"  "}
          {movement.votes}
        </div>
        <Button>Learn More</Button>
      </Card>
    </div>
  );
}

export default MomentumCard;
