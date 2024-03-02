const ErrorHandler = require("../utils/errorhander.js"); // Corrected import
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js")
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
  
const ErrorHander = require("../utils/errorhander.js");

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is a simple id",
      url: "profilepicUrl",
    },
  });
  sendToken(user, 201, res);
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  const resetPasswordToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetPasswordToken}`;

  const message = `Your password reset token is:\n\n${resetPasswordUrl}\n\nIf you have not requested this email, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});








//REST PASSWORD
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
 //CREATING TOKEN HASH
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {$gt:Date.now()},
    });
    if (!user) {
      return next(new ErrorHandler("Invalid resetpassword token or it has been expired", 404));
    }
    if(req.body.password !==req.body.confirmPassword){
      return next(new ErrorHandler("Password does not matched",400));

    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

await user.save();
sendToken(user,200,res);
});







//GET USER DETAILS
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success:true,
    user,
  });
});








//UPDATE USER PASSWORD
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

 

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

if(req.body.newPassword !==req.body.confirmPassword){
  return next(new ErrorHandler("Password does not Matched",400));
}
user.password = req.body.newPassword;
await user.save();
sendToken(user,200,res);
});










//UPDATE USER PROFILE
exports.updateProfile = catchAsyncErrors(async(req, res, next) => {
  
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // We will add the Cloudinary update later

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

 
  res.status(200).json({
    success: true,
    data: user,
  });


});






//Get all users(admin)
exports.getAllUser = catchAsyncErrors(async(req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success:true,
    users,
  });


});

//Get single users(admin)
exports.getSingleUser = catchAsyncErrors(async(req, res, next) => {
  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHander(`User does not exist with Id: ${req.params.id}`))
  }

  res.status(200).json({
    success:true,
    user,
  });


});



// Update user role
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  try {
    const newUserData = {
      $set: {
        role: req.body.role
      }
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    // Pass the error to the global error handling middleware
    next(error);
  }
});



// DELETE USER (ADMIN)
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    // Find the user by ID
    const user = await User.findByIdAndDelete(req.params.id);

    // If user does not exist, return an error
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with ID: ${req.params.id}`,
      });
    }
  res.status(200).json({
      success: true,
      message: `User with ID: ${req.params.id} has been deleted successfully`,
    });
  
});
