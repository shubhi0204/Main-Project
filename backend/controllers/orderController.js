const Order = require("../models/orderModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../models/productModel");
const User = require("../models/userModel");

const ErrorHander = require("../utils/errorhander");




//Create New Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    order,
  });
});





//Get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});






//Get logged in user Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    orders,
  });
});







//Get All Orders --Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    orders,
  });
});



exports.updateOrders = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHander("Order not found with this Id", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHander("You have already delivered this order", 400));
    }

    for (const orderItem of order.orderItems) {
        await updateStock(orderItem.product, orderItem.quantity);
    }

    order.orderStatus = "Delivered";
    order.delieveredAt = Date.now();

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        order
    });
});

async function updateStock(productId, quantity) {
    console.log(quantity,"quantity");
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error("Product not found");
    }
    if(product.stock < quantity){
        throw new Error("Insufficient Stock")
    }
    product.stock = product.stock - quantity; 
    console.log(product.stock,"stock");
    await product.save({ validateBeforeSave: false });
}


 ///Delete Order
  exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorHander("Order not found with this Id", 404));
    }
    await order.deleteOne(); 
    res.status(200).json({
      success: true,
    });
  });



  