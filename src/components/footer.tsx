import React from "react";
import { BiCameraMovie } from "react-icons/bi";
import { AiFillHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import "./footer.css";
import { Link } from 'react-router-dom';

const Under: React.FC = () => {
  return (
    <div className="footer">
      <div className="left">
        <Link to="/anime">
          <BiCameraMovie size={55} />
        </Link>
      </div>
      <div className="center">
        <Link to="/">
          <AiFillHome size={55}/>
        </Link>
      </div>
      <div className="right">
        <Link to ='/profile'>
          <CgProfile size={55}/>
        </Link>
        
      </div>
    </div>
  );
};

export default Under;
