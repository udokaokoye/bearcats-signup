import {
  faImage,
  faImages,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import './Auth.css'
import { auth } from "./firebase";
import Cookies from 'js-cookie'
const Auth = () => {
  var today = new Date();
  const [authMode, setauthMode] = useState("signup");
  const [continueSignUp, setcontinueSignUp] = useState(false);
  const [previewImages, setpreviewImages] = useState(false);
  const [token, settoken] = useState('')
  const [alldone, setalldone] = useState(false)

  // ! SIGNUP STATES
  const [fName, setfName] = useState("");
  const [lName, setlName] = useState("");
  const [signupEmail, setsignupEmail] = useState("");
  const [signupUsername, setsignupUsername] = useState("");
  const [signupPassword, setsignupPassword] = useState("");
  const [signupPasswordConfirm, setsignupPasswordConfirm] = useState("");

  // ! Continue Signup States
  const [major, setmajor] = useState("");
  const [bio, setbio] = useState("");
  const [mobile, setmobile] = useState("");
  const [campus, setcampus] = useState("")
  const [profilePic, setprofilePic] = useState("");
  const [coverPic, setcoverPic] = useState("");
  const [userId, setuserId] = useState("")

  // ! LOGIN STATES
  const [loginEmailUsername, setloginEmailUsername] = useState("");
  const [loginPassword, setloginPassword] = useState("");

  // !Error States
  const [formError, setformError] = useState(false);
  const [confirmPasswordError, setconfirmPasswordError] = useState(false);
  const [passwordError, setpasswordError] = useState(false);
  // const [usernameError, setusernameError] = useState(false);
  // const [emailError, setemailError] = useState(false);
  const [invalidEmail, setinvalidEmail] = useState(false);
  const [emailFound, setemailFound] = useState(false)
  const [usernameFound, setusernameFound] = useState(false)
  const [emailUsernameExists, setemailUsernameExists] = useState([])
  const [dem, setdem] = useState([false, false])


  const server = 'https://bc.udokaokoye.com';

  const confirmPassword = (e) => {
    if (e !== signupPassword) {
      setconfirmPasswordError(true);
      return false;
    } else {
      setconfirmPasswordError(false);
      return true;
    }
    return false;
  };
  const handelRegister = (uid) => {
    auth
      .createUserWithEmailAndPassword(signupEmail, signupPassword)
      .then((authuser) => {
        authuser.user.update({
          displayname: fName + " " + lName,
          photoURL: `https://bc.udokaokoye.com/Images/profile_images/pp_${uid}_profile.jpg`
        });
      })
      .catch((error) => console.log(error.message));
  };

  const passswordAlgo = (password) => {
    if (password.length < 6 
      || !password.match(/[A-Z]+/) 
      || !password.match(/[0-9]+/)
      ) {
        console.log("password error")
      setpasswordError(true);
      return false;

    } else {
      setpasswordError(false);
      return true;
    }

    return false
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handelSigUp = () => {
    const formData = new FormData();
    if (
      fName == "" ||
      lName == "" ||
      signupEmail == "" ||
      signupUsername == "" ||
      signupPassword == "" ||
      !confirmPassword(signupPasswordConfirm) ||
      !validateEmail(signupEmail) ||
      !passswordAlgo(signupPassword)
    ) {
      if (!signupEmail.includes("@mail.uc.edu")) {
        setinvalidEmail(true);
        return false;
      }
      setformError(true);
      console.log("Form Error");
      return false;
    } else if (!signupEmail.includes("@mail.uc.edu")) {
      setinvalidEmail(true);
      return false;
    } else {
      
      formData.append("firstName", fName)
      formData.append("lastName", lName)
      formData.append("email", signupEmail)
      formData.append("username", signupUsername)
      formData.append("password", signupPassword)

      fetch(`${server}/helpers.php?helper=checkUsernamePassword`, {
      method: "POST", 
      body: formData
    }).then((res) => res.json()).then((data) => {
      console.log(data)
 
      if (data[0] !== true && data[1] !== true) {        
        fetch(`${server}/signup.php`, {
          method: "POST",
          body: formData
        }).then((res) => res.json()).then((data) => {
          if (data[0] == "SUCCESS") {
            setcontinueSignUp(true)
            setuserId(data[1])
            settoken(data[2])
            // Cookies.set("user-token", data[2], {expires: new Date(new Date().setDate(today.getDate() + 30))})
          }
          // console.log(data)
        })
      }
      setemailUsernameExists(data)
    })


    return;



    }
  };

  const handelContinueSignUp = () => {
   const formData = new FormData;
  //  console.log(userId)
   formData.append("userId", userId)
   formData.append("major", major)
   formData.append("bio", bio)
   formData.append("mobile", mobile)
   formData.append("campus", campus)
  //  formData.append("cover_picture", null)
  //  formData.append("profile_picture", null)

   if (typeof window !== "undefined") {
    if (document.getElementById("pp").files !==null) {
      formData.append("profile_picture", document.getElementById("pp").files[0])
    }

    if (document.getElementById("cc").files !==null) {
      formData.append("cover_picture", document.getElementById("cc").files[0])
    }
  }
   formData.append("cover_picture", null)

    fetch(`${server}/signup.php?continueSignUp=true`, {
      method: "POST",
      body: formData
    }).then((res) => res.json()).then((data) => {
      console.log(data)
      if (data[0] == "UPDATED") {
        if (Cookies.get('user-token')) {
          Cookies.remove('user-token')
        }
        handelRegister(userId)
        setalldone(true)
      }
    })
  }

  const imgprev = (ev, section) => {
    if (!ev.target.files) return; // Do nothing.
    setpreviewImages(true);
    var objectUrl = URL.createObjectURL(ev.target.files[0]);
    // setuploadedImageList((current) => [...current, objectUrl])
    console.log(objectUrl);
    if (section == "pp") {
      console.log("pp");
      setprofilePic(objectUrl);
      // URL.revokeObjectURL(objectUrl)
    } else {
      console.log("cc");
      setcoverPic(objectUrl);
    }
    setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 2000);

    // })
  };

  if (alldone) {
     return (
      <div>
        <h1>All Done!</h1>
        <h5>Your account was created Succefully</h5>
        <p>Close browser and return to app to login</p>
    </div>
     )
  }
  return (
    <div className="authContainer">

      <div className="authmain">
        <div className="artContainer">
          <div className="logoArt"></div>
          <div className="logoArtText"></div>
        </div>

        <div className="authForm">
          <h3>
            {continueSignUp
              ? "All done! Finish Setting Up Your Profile"
              : "Let's Get You Signed Up!"}
          </h3>

          {continueSignUp ? (
            <div data-aos-duration="1000" data-aos="fade-up">
              <label htmlFor={ coverPic ? '' : "cc"} className="addProfileImages">
                
                {coverPic !== "" ? (
                  <React.Fragment>
                    <label className="float_c_btn" htmlFor="cc"><FontAwesomeIcon icon={faImage} /> <span>Change</span></label>
                    <img className="cc" src={coverPic} alt="" />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <FontAwesomeIcon icon={faImages} />
                    <h3>Select a Cover Photo</h3>
                  </React.Fragment>
                )}
                {/* <img className="cc" src="" alt="" /> */}
                {profilePic !== "" ? (
                  <React.Fragment>
                    
                    <img className="pp" src={profilePic} alt="" />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <label htmlFor={profilePic ? "" : "pp"} className="pp">
                      <FontAwesomeIcon icon={faUserPlus} />
                      {/* <p>add +</p> */}
                    </label>
                  </React.Fragment>
                )}
                <input
                  accept="image/*"
                  type="file"
                  id="pp"
                  onChange={(e) => imgprev(e, "pp")}
                />
                <input
                  accept="image/*"
                  type="file"
                  id="cc"
                  onChange={(e) => imgprev(e, "cc")}
                />
              </label>
              <div className="fieldEntry textareaField">
                <label htmlFor="">Bio</label>
                <textarea onChange={(e) => setbio(e.target.value)} value={bio} placeholder="Discribe yourself..."></textarea>
              </div>
              <div className="fields ">
                <div className="fieldEntry">
                  <label htmlFor="">What's your major?</label>
                  <select onChange={(e) => setmajor(e.target.value)} defaultValue="hey" name="" id="">
                    <option value="defalult1">Select a major</option>
                    <option value="defalult2">Select a major2</option>
                    <option value="defalult3">Select a major3</option>
                  </select>
                </div>

                <div className="fieldEntry">
                  <label htmlFor="">Mobile Number</label>
                  <input onChange={(e) => setmobile(e.target.value)} value={mobile} type="tel" placeholder="mobile" />
                </div>
              </div>

              <div className="fieldEntry">
                  <label htmlFor="">What's your campus?</label>
                  <select onChange={(e) => setcampus(e.target.value)} defaultValue={null} name="" id="">
                    <option value="CLIF">{"Clifton Campus (main capus)"}</option>
                    <option value="UCBA">{"Blue Ash Campus (reg capus)"}</option>
                    <option value="CLEM">{"Cleremont Campus (reg capus)"}</option>
                  </select>
                </div>

                <br />

              <button onClick={() => handelContinueSignUp()}>Finish!</button>
            </div>
          ) : (
            <div data-aos-duration="1000" data-aos="fade-up">
              <div className="fields">
                <div className="fieldEntry">
                  <label>First Name</label>
                  <input
                    value={fName}
                    onChange={(e) => setfName(e.target.value)}
                    type="text"
                  />
                </div>

                <div className="fieldEntry">
                  <label>Last Name</label>
                  <input
                    value={lName}
                    onChange={(e) => setlName(e.target.value)}
                    type="text"
                  />
                </div>
              </div>

              <div className="fieldEntry">
                <label>Email</label>
                <input
                  value={signupEmail}
                  onChange={(e) => setsignupEmail(e.target.value)}
                  type="email"
                />
                <small>
                  {emailUsernameExists[0] == true ? "hmm...looks like that's taken" : ""}
                </small>
                <small>
                  {invalidEmail ? "please enter a vaild UC email" : ""}
                </small>
              </div>

              <div className="fieldEntry">
                <label>Username</label>
                <input
                  value={signupUsername}
                  onChange={(e) => setsignupUsername(e.target.value)}
                  type="text"
                />
                <small>
                  {emailUsernameExists[1] == true  ? "hmm...looks like that's taken" : ""}
                </small>
              </div>
              <div className="fields">
                <div className="fieldEntry">
                  <label>Password</label>
                  <input
                    style={{
                      outlineColor: passwordError ? "red" : "transparent",
                    }}
                    value={signupPassword}
                    onChange={(e) => setsignupPassword(e.target.value)}
                    type="password"
                  />
                  <small>
                    {passwordError ? (
                      <React.Fragment>
                        <span>please check password</span>
                        <br />
                        <span>
                          password must be greater than six characters and must
                          contain a capital letter and a number
                        </span>
                        
                        <br />
                        <br />
                        <br />
                        <br />
                      </React.Fragment>
                      ) : (
                      ""
                    )}
                  </small>
                </div>

                <div className="fieldEntry">
                  <label>Confirm Password</label>
                  <input
                    style={{
                      outlineColor: confirmPasswordError ? "red" : "green",
                    }}
                    value={signupPasswordConfirm}
                    onChange={(e) => {
                      setsignupPasswordConfirm(e.target.value);
                      confirmPassword(e.target.value);
                    }}
                    type="password"
                  />
                  <small>
                    {confirmPasswordError ? "password does not match" : null}
                  </small>
                </div>
              </div>

              <br />
              <br />
              <button onClick={() => handelSigUp()}>Sign Up!</button>
              <br />
              <br />
              <span>Have an account? <span onClick={() => setauthMode('signin')} style={{color: 'red', cursor: "pointer"}}>Sign In</span></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
