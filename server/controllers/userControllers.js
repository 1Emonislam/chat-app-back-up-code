const User = require("../models/userModel");
const { mailSending } = require("../utils/func");
const { genToken_fourHours, genToken } = require("../utils/genToken");
module.exports.userLogin = async (req, res, next) => {
  let { email, phone, password } = req.body;
  email?.toLowerCase();
  const user = email ? await User.findOne({ email }) : await User.findOne({ phone });
  // console.log(user)
  try {
    if (!user) {
      return res.status(400).json({ error: { "email": "Could not find user" } })
    }
    // if (user?.phoneVerified === false) {
    //   const send = await sendOtpVia(user?.phone);
    //   // console.log(send)
    //   const data = await User.findOneAndUpdate({ _id: user._id }, {
    //     role: role
    //   }, { new: true });
    //   if (send?.sent === false) {
    //     return res.status(400).json({ error: { "phone": "Phone Number UnVerified! Verify Your Phone Number. Otp Sending failed! Please try again!" }, message: `Switch Mode ${data?.role}`, role: data?.role, token: genToken(data?._id), sent: false })
    //   }
    //   if (send?.sent === true) {
    //     return res.status(200).json({ message: "Phone Number UnVerified! Verify Your Phone Number. Otp Sending Successfully!", message: `Switch Mode ${data?.role}`, role: data?.role, token: genToken(user?._id), sent: true })
    //   }
    // }
    if (!(user && (await user.matchPassword(password)))) {
      return res.status(400).json({ error: { "password": "Password invalid! please provide valid password!" } });
    } else if (user && (await user.matchPassword(password))) {
      const userExists = await User.findOne({ _id: user?._id }).select("-password");
      return res.status(200).json({ message: "Login Successfully!", data: userExists, token: genToken(userExists._id) });
    }
  }
  catch (error) {
    next(error)
  }
}

module.exports.userRegister = async (req, res, next) => {
  try {
    const { email, firstName, lastName, phone, birthDate, gender, password } = req.body;
    const username = (firstName + lastName)?.toString();
    function checkPassword(password) {
      var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      return re.test(password);
    }
    if (!(checkPassword(password))) {
      return res.status(400).json({ error: { "passowrd": "Password should contain min 8 letter password, with at least a symbol, upper and lower case" } })
    }
    function validateEmail(elementValue) {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return emailPattern.test(elementValue);
    }
    if (!(validateEmail(email))) {
      return res.status(400).json({ error: { "email": "Email Invalid! Please provide a valid Email!" } })
    }
    const userExist = await User.findOne({ email });
    const phoneExist = await User.findOne({ phone });
    if (userExist) {
      return res.status(400).json({ error: { "email": "Email Already exists!" } })
    }
    if (phoneExist) {
      return res.status(400).json({ error: { "phone": "This phone number is linked to another account, please enter another number." } })
    }
    async function generateUniqueAccountName(proposedName) {
      return User.findOne({ username: proposedName })
        .then(function (username) {
          if (username) {
            // console.log('no can do try again: ' + proposedName);
            proposedName += Math.floor((Math.random() * 100) + 1);
            return generateUniqueAccountName(proposedName); // <== return statement here
          }
          // console.log('proposed name is unique' + proposedName);
          return proposedName;
        })
        .catch(function (err) {
          next(err)
        });
    }
    const userName = await generateUniqueAccountName(username);
    if (!(phoneExist || userExist)) {
      const user = await User.create({
        email,
        username: userName,
        password,
        birthDate,
        gender,
        firstName,
        lastName,
        phone
      });
      const resData = await User.findOne({ _id: user._id }).select("-password")
      const data = {
        resData,
        token: genToken(resData?._id)
      }
      const options = {
        expires: new Date(new Date().getTime() + process.env.COOKIE_EXPIRES * 60 * 1000)
      }
      return res.status(201).cookie('user', data, options).json({
        message: 'Registration Successfully',
        data
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.changedPassword = async (req, res) => {
  // console.log(req.body)
  const { oldPassword, password, password2 } = req.body;
  const user = await User.findOne({ _id: req?.user?._id });
  if (!(oldPassword && (await user?.matchPassword(oldPassword)))) {
    return res.status(400).json({ error: { password: "old password does not match!" } });
  }
  if (!(password === password2)) {
    return res.status(403).json({ error: { password: "New Password and Confirm Password are not the same!" } });
  }
  function checkPassword(password) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
  }
  if (!(checkPassword(password))) {
    return res.status(400).json({ error: { password: "Password should contain min 8 letter password, with at least a symbol, upper and lower case" } })
  }
  if (oldPassword && (await user.matchPassword(oldPassword))) {
    user.password = password;
    const updatedPassword = await user.save();
    if (!updatedPassword) {
      return res.status(400).json({ error: "Password change failed, please try again!" });
    } else {
      const resData = await User.findOne({ _id: user._id }).select("-password")
      const mailInfo = {
        subject: `Check your account privacy. You have recently changed your password`,
        msg: `Check your account privacy. You have recently changed your password`,
        user: user,
        date: moment().format(),
        link: `https://collaball.netlify.app`
      }
      const htmlMSG = `<!DOCTYPE html>
  <html lang="en-US">
  <head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Change Password</title>
    <meta name="description" content="${mailInfo?.subject}" />
  </head>
  <body
    marginheight="0"
    topmargin="0"
    marginwidth="0"
    style="margin: 0px; background-color: #f2f3f8"
    leftmargin="0"
  >
    <table
      cellspacing="0"
      border="0"
      cellpadding="0"
      width="100%"
      bgcolor="#f2f3f8"
      style="
        @import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700);
        font-family: 'Open Sans', sans-serif;
      "
    >
      <tr>
        <td>
          <table
            style="background-color: #f2f3f8; max-width: 670px; margin: 0 auto"
            width="100%"
            border="0"
            align="center"
            cellpadding="0"
            cellspacing="0"
          >
            <tr>
              <td style="height: 80px">&nbsp;</td>
            </tr>
            <tr>
              <td style="text-align: center">
                <a
                  href="https://collaball.netlify.app/"
                  title="logo"
                  target="_blank"
                >
                  <img
                    src="https://collaball.github.io/images/collaball_logo.png"
                    width="60px"
                    height="60px"
                    title="logo"
                    alt="logo"
                  />
                </a>
              </td>
            </tr>
            <tr>
              <td style="height: 20px">&nbsp;</td>
            </tr>
            <tr>
              <td>
                <table
                  width="95%"
                  border="0"
                  align="center"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    max-width: 670px;
                    background: #fff;
                    border-radius: 3px;
                    text-align: center;
                    -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                    -moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                    box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                  "
                >
                  <tr>
                    <td style="height: 40px">&nbsp;</td>
                  </tr>
                  <tr>
                    <td style="padding: 0 35px">
                      <p
                        style="
                          color: #455056;
                          font-size: 15px;
                          line-height: 24px;
                          margin: 0;
                        "
                      >
                        Changes Password Date ${mailInfo?.date}
                      </p>
                      <h5>Hello Dear,${mailInfo?.user?.firstName}</h5>
                      <h4
                        style="
                          color: #1e1e2d;
                          font-weight: 500;
                          margin: 0;
                          font-size: 32px;
                          font-family: 'Rubik', sans-serif;
                        "
                      >
                        ${mailInfo?.msg}
                      </h4>
                      <span
                        style="
                          display: inline-block;
                          vertical-align: middle;
                          margin: 29px 0 26px;
                          border-bottom: 1px solid #cecece;
                          width: 100px;
                        "
                      ></span>
                      <a
                        href="${mailInfo?.link}"
                        style="
                          background: #20e277;
                          text-decoration: none !important;
                          font-weight: 500;
                          margin-top: 35px;
                          color: #fff;
                          text-transform: uppercase;
                          font-size: 14px;
                          padding: 10px 24px;
                          display: inline-block;
                          border-radius: 50px;
                        "
                        >Back Collaball</a
                      >
                    </td>
                  </tr>
                  <tr>
                    <td style="height: 40px">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="height: 20px">&nbsp;</td>
            </tr>
            <tr>
              <td style="text-align: center">
                <p
                  style="
                    font-size: 14px;
                    color: rgba(69, 80, 86, 0.7411764705882353);
                    line-height: 18px;
                    margin: 0 0 0;
                  "
                >
                  &copy; <strong>Collaball.com</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td style="height: 80px">&nbsp;</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

      // `https://wesoftin.com/user/verify-email/${(genToken_fourHours(userExist._id?.toString())}
      await mailSending(user?.email, mailInfo, htmlMSG);
      const data = {
        resData,
        token: genToken(resData?._id)
      }
      const options = {
        expires: new Date(new Date().getTime() + process.env.COOKIE_EXPIRES * 60 * 1000)
      }
      return res.status(200).cookie('user', data, options).json({
        message: "Password has been successfully changed",
        data
      });
    }
  }
}

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ message: "user credentials invalid! please login!" });
    // onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};