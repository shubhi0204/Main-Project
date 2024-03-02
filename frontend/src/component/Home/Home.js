import React  from 'react'
import { CgMouse } from "react-icons/cg";
import "./home.css";
import Product from "./Product.js";
import MetaData from '../layout/MetaData.js';



const product = {
    name:"blueshirt",
    images:[{url:"https://cdn.pixabay.com/photo/2023/12/23/22/15/teen-photo-8466399_640.jpg"}], 
    _id:"abhishek",
};






const Home = () => {
  return <>
        <MetaData title="HOME PAGE IS WORKING"/>
    <div className = "banner">
        <p>Welcome to Ecommerce</p>
        <h1>FIND AMAZING PRODUCTS BELOW</h1>
         
         <a href="#container">
            <button>
                Scroll<CgMouse />
                </button>
         </a>
    </div>
      <h2 className = "homeHeading">Featured Products</h2>
      <div className='container' id="container">
    <Product product={product}/>
    <Product product={product}/>
    <Product product={product}/>
    <Product product={product}/>
    <Product product={product}/>
    <Product product={product}/>
    <Product product={product}/>
    <Product product={product}/>
      </div>
   
    </>
 
};

export default Home;
