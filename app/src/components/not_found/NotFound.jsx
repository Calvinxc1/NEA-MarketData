import React from 'react';
import {Link} from "react-router-dom";

const NotFound = () => <div>
  <h3>Path not found (404)</h3>
  <p><Link to="/">Return Home</Link></p>
</div>;

export default NotFound;
