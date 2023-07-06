import  { useState, FormEvent } from "react";
import axios from "axios";
import {  useNavigate } from "react-router-dom";
import { PiGhost } from "react-icons/pi";
import './sighup.css'

const Sighup = () => {
    const [userid, setuserid] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const navigation = useNavigate();


    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        if (password !== passwordConfirmation) {
            console.error("Error: Passwords do not match.");
            return;
        }

        axios
        .post("http://127.0.0.1:8000/accounts/sighup/", {
            userid: userid,
            email: email,
            name: name,
            password: password,
            password_confirmation: passwordConfirmation,
        })
        .then((response) => {
            console.log(response.data);
            navigation("../login");
        })
        .catch((error) => {
            console.error(error);
        });
    };


  return (
    <div className="sighin">
        <div className="s-Icon">
            <PiGhost size={250}/>
           
        </div>
        <div className="s-text">
          <h2>Sigh</h2>
        </div>
       
        <form onSubmit={handleSubmit} className="Form">
            <input
                type="text"
                placeholder="User ID"
                value={userid}
                onChange={(e) => setuserid(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password Confirmation"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            <button type="submit">Register</button>
        </form>

    </div>
  );
};

export default Sighup;