"use client";
import Header from "@/components/Header";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [productform, setProductform] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [dropdown, setDropdown] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingaction, setLoadingAction] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("api/products");
      let rjson = await response.json();
      setProducts(rjson.allProducts);

      // console.log(rjson.products);
    };

    fetchProducts();
  }, []);

  const buttonAction = async (action, slug, initialQuantity) => {
    // immediately changes reflection of quantity
    let index = products.findIndex((item)=> item.slug == slug)
    let newProducts = JSON.parse(JSON.stringify(products))
    if(action == "plus"){
      
      newProducts[index].quantity = parseInt(initialQuantity) +1;
    }
    else{
      newProducts[index].quantity = parseInt(initialQuantity) -1;
      
    }
    setProducts(newProducts)
    
    
    // immediately changes reflection of quantity

    let indexdrop = dropdown.findIndex((item)=> item.slug == slug)
    let newDropdown = JSON.parse(JSON.stringify(dropdown))
    if(action == "plus"){

      newDropdown[indexdrop].quantity = parseInt(initialQuantity) +1;
    }
    else{
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) -1;

    }
    setDropdown(newDropdown)


    setLoadingAction(true);
    const response = await fetch("/api/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, slug, initialQuantity }),
    });
    let r = await response.json();
    console.log(r);
    setLoadingAction(false);
  };
 
  const dropDownEdit = async (e) => {

    let value = e.target.value;
    setQuery(value);
    if (value.length > 3) {
      setLoading(true);
      setDropdown([])
      const response = await fetch("/api/search?query=" + query);
      let rjson = await response.json();
      setDropdown(rjson.allProducts);
      setLoading(false);
    }
    else{
      setDropdown([])
    }
  };
  const handleAddProduct = async (e) => {
    const response = await fetch("api/products");
    let rjson = await response.json();
    setProducts(rjson.allProducts);
    e.preventDefault();
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productform),
      });

      if (response.ok) {
        // Product added successfully, you can update your UI or perform any necessary actions.
        console.log("Product added successfully");
        setAlert("Product Added Successfully");
        setProductform({});
      } else {
        // Handle error scenario
        console.error("Error adding product");
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };
  const handleChange = (e) => {
    setProductform({ ...productform, [e.target.name]: e.target.value });
  };
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="text-green-800 text-center">{alert} </div>
      <div className="p-8">
        <h1 className="text-lg font-semibold mb-4">Search a product</h1>
        <div className="flex">
          <input
            onChange={dropDownEdit}
            // onBlur={()=>{setDropdown([])}}
            type="text"
            className="border rounded-l px-2 py-1 w-full"
            placeholder="Search for a product..."
          />
        </div>
        <div className="container">
          {loading && (
            <div className="container flex justify-center">
              <svg
                width="60px"
                height="60px"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="20"
                  strokeWidth="3"
                  stroke="#0a0a0a"
                  stroke-dasharray="31.41592653589793 31.41592653589793"
                  fill="none"
                  stroke-linecap="round"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    dur="1.7543859649122806s"
                    repeatCount="indefinite"
                    keyTimes="0;1"
                    values="0 50 50;360 50 50"
                  ></animateTransform>
                </circle>
                <circle
                  cx="50"
                  cy="50"
                  r="16"
                  strokeWidth="3"
                  stroke="#28292f"
                  stroke-dasharray="25.132741228718345 25.132741228718345"
                  strokeDashoffset="25.132741228718345"
                  fill="none"
                  stroke-linecap="round"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    dur="1.7543859649122806s"
                    repeatCount="indefinite"
                    keyTimes="0;1"
                    values="0 50 50;-360 50 50"
                  ></animateTransform>
                </circle>
              </svg>
            </div>
          )}
          <div className="dropcontainer absolute w-[72vw] border border-1">
            {dropdown.map((item) => {
              return (
                <div
                  key={item.slug}
                  className="flex bg-red-200 py-1 border border-b2 px-1 rounded-lg container justify-between"
                >
                  <span className="slug">
                    {item.slug} ({item.quantity} available for ${item.price})
                  </span>
                  <div className="mx-5">
                    <button
                      onClick={() => {
                        buttonAction("minus", item.slug, item.quantity);
                      }}
                      disabled={loadingaction}
                      className="subtract inline-block px-3 py-1 bg-red-500 text-white font-semibold rounded-lg shadow-md cursor-pointer disabled:bg-red-200"
                    >
                      {" "}
                      -{" "}
                    </button>
                    <span className="quantity mx-2">{item.quantity}</span>
                    <button
                      onClick={() => {
                        buttonAction("plus", item.slug, item.quantity);
                      }}
                      disabled={loadingaction}
                      className="subtract inline-block px-3 py-1 bg-red-500 text-white font-semibold rounded-lg shadow-md cursor-pointer disabled:bg-red-200"
                    >
                      {" "}
                      +{" "}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-8">
        <h1 className="text-lg font-semibold mb-4">Add a product</h1>
        <div className="flex space-x-2">
          <input
            onChange={handleChange}
            name="slug"
            value={productform?.slug || ""}
            type="text"
            placeholder="Product Name"
            className="border rounded px-2 py-1 w-full"
          />
          <input
            onChange={handleChange}
            name="quantity"
            value={productform?.quantity || ""}
            type="number"
            placeholder="Quantity"
            className="border rounded px-2 py-1 w-full"
          />
          <input
            onChange={handleChange}
            name="price"
            value={productform?.price || ""}
            type="number"
            placeholder="Price"
            className="border rounded px-2 py-1 w-full"
          />
          <button
            onClick={handleAddProduct}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Add
          </button>
        </div>
      </div>

      <div className="p-8">
        <h1 className="text-lg font-semibold mb-4">Display the products</h1>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-1">Product Name</th>
              <th className="border p-1">Quantity</th>
              <th className="border p-1">Price</th>
            </tr>
          </thead>

          <tbody>
            {products &&
              products.map((item) => {
                return (
                  <tr key={item.slug} className="bg-white">
                    <td className="border p-1">{item.slug}</td>
                    <td className="border p-1">{item.quantity}</td>
                    <td className="border p-1">${item.price}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
