import  { useState, FormEvent } from "react";
import axios from "axios";
import {  useNavigate } from "react-router-dom";
import { PiGhost } from "react-icons/pi";
import './login.css'

interface User {
  userid: string;
  name: string;
  // add other fields if necessary
}

const Login = () => {
  const [userid, setuserid] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    axios.post("http://127.0.0.1:8000/accounts/login/", {
      userid: userid,
      password: password,
    })
    .then((response) => {
      console.log(response.data);
      localStorage.setItem('isLoggedIn', 'true'); // Set flag in localStorage
      localStorage.setItem('UserID', response.data.userid); // Save userid in localStorage
      navigate("/");
    })
    .catch((error) => {
      console.error(error);
    });
  };

  return (
    <div className="Login">
        <div className="Icon">
            <PiGhost size={250}/>
        </div>
        <div className="text">
          <h2>Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="form">
                <input
                    type="userid"
                    placeholder="userid"
                    value={userid}
                    onChange={(e) => setuserid(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            <button type="submit">Login</button>
        </form>
    </div>
  );
};

export default Login;
