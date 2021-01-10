import React from "react";
import { ListGroupItem, Card, CardText, CardTitle, Button } from "reactstrap";

function MomentumCard({ movement }) {
  return (
    <div>
      <Card body>
        <CardTitle tag="h5">{movement.name}</CardTitle>
        <CardText>{movement.description}</CardText>
        <Button>Learn More</Button>
      </Card>
    </div>
  );
}

export default MomentumCard;
