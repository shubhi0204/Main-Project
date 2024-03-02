const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHander = require("../utils/errorhander");

//Create Product --Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

//get all product
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await apiFeatures.query;
  res.status(200).json({
    success: true,
    products,
  });
});

//Get Product Details

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
    productCount,
  });
});

//Update Product --Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }
  await Product.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Product successfully Deleted",
  });
});





// creating the review and updating the existing review


exports.createProductReview = async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const userId = req.user._id;

    const review = {
        user: userId,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    try {
        let product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: `Product not found with ID: ${productId}`,
            });
        }

        const existingReview = product.reviews.find(
            (rev) => rev.user.toString() === userId.toString()
        );

        if (existingReview) {
            await Product.findOneAndUpdate(
                {
                    _id: productId,
                    'reviews.user': userId,
                },
                {
                    $set: {
                        'reviews.$.rating': rating,
                        'reviews.$.comment': comment,
                    },
                },
                { new: true }
            );
        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }

        let totalRating = 0;
        product.reviews.forEach((rev) => {
            totalRating += rev.rating;
        });
        product.ratings = totalRating / product.reviews.length;

        product = await product.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

//Get All Reviews of a product
exports.getAllProductsReviews = catchAsyncErrors(async(req,res,next)=>{
const product = await Product.findById(req.query.id);

if(!product){
    return next(new ErrorHander("Product not found",404));
}
res.status(200).json({
    success:true,
    reviews: product.reviews,
});
});

//Delete Review
exports.deleteReview = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new ErrorHander("Product not found",404));
    }

    const reviews = product.reviews.filter(rev=>rev._id.toString()!==req.query.id.toString());

    let totalRating = 0;
        reviews.forEach((rev) => {
            totalRating += rev.rating;
        });
        const ratings = totalRating / reviews.length;

        const noOfReviews = reviews.length;
        await Product.findByIdAndUpdate(req.query.productId,{
            reviews,
            ratings,
            noOfReviews,

        },{
            new:true,
            runValidators:true,
            useFindAndModify:false,
        });

    res.status(200).json({
      
        success:true,
        reviews: product.reviews,
    });


})