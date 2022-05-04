import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {getAuth , createUserWithEmailAndPassword , updateProfile} from 'firebase/auth'
import {db} from '../firebase.config'
import {setDoc,doc,serverTimestamp} from 'firebase/firestore'
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { toast } from "react-toastify";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name:'',
    email: "",
    password: "",
  });
  const { name,password, email } = formData;
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const handleSubmit = async (e)=>{
    e.preventDefault()
    try {
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(auth,email,password)
      const user=userCredential.user
      updateProfile(auth.currentUser,{
        displayName:name
      })
      const formDatacopy={...formData}
      // delete formDatacopy.password
      formDatacopy.timestamp=serverTimestamp()
      await setDoc(doc(db,'users',user.uid),formDatacopy)
      navigate('/')
    } catch (error) {
      toast.error('Unable to Signup')
    }
  }
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader"> Sign Up Page</p>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
        <input
            className="nameInput"
            type="text"
            placeholder="Enter User Name"
            value={name}
            id="name"
            onChange={handleChange}
          />
          <input
            className="emailInput"
            type="email"
            placeholder="Enter Email"
            value={email}
            id="email"
            onChange={handleChange}
          />
          <div className="passwordInputDiv">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              className="passwordInput"
              placeholder="Enter Password"
              onChange={handleChange}
            />
            <img
              src={visibilityIcon}
              alt="show password"
              className="showPassword"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          <div className="signUpBar">
            <p className="signUpText">Sign Up</p>
            <button className="signUpButton">
              <ArrowRightIcon fill="#ffffff" width="34px" />
            </button>
          </div>
        </form>

        {/* Google Authentication */}
        <Link to="/sign-in" className="registerLink">
          Already have an account?
        </Link>
      </main>
    </div>
  );
};

export default SignIn;
