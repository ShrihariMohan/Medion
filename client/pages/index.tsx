import React from "react";
import Button from '@material-ui/core/Button';


export default function LandingPage() {
  return (
    <div className="landingpage">
      <p className="bigtext"> Medion </p>
      <p className="smalltext"> Its not Medium + Notion </p>
      <Button color="primary" variant="contained" href="http://localhost:3000/auth/google"> login </Button>
    </div>
  )
}
