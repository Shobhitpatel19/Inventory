import React, { useState } from "react";
import Menu from "./menu";

const Home = () => {
  const [items, setItems] = useState(Menu);

  const filterItem = (categItem) => {
    const updatedItems = Menu.filter((curElem) => {
      return curElem.category === categItem;
    });

    setItems(updatedItems);
  };

  return (
    <>
      <h1 className="mt-5 text-center main-heading">
        Order Your Favourite Dish
      </h1>
      <hr />

      <div className="menu-tabs container">
        <div className="menu-tab d-flex justify-content-around">
          <button
            className="btn btn-warning"
            onClick={() => filterItem("breakfast")}
          >
            Starters
          </button>
          <button
            className="btn btn-warning"
            onClick={() => filterItem("lunch")}
          >
            Food
          </button>
          <button
            className="btn btn-warning"
            onClick={() => filterItem("evening")}
          >
            Drinks
          </button>
          <button
            className="btn btn-warning"
            onClick={() => filterItem("dinner")}
          >
            Deserts
          </button>
          <button className="btn btn-warning" onClick={() => setItems(Menu)}>
            All
          </button>
        </div>
      </div>

      <div className="menu-items container mt-3">
        <div className="row">
          <div className="row my-3 mx-auto">
            {items.map((elem) => {
              const { name, image, description, price } = elem;

              return (
                <div className="item1 col-md-4 my-3 shadow-lg p-3 mb-5 bg-body rounded">
                  <div className="row Item-inside">
                    <div className="col-12 col-md-12 col-lg-4">
                      <img src={image} alt={name} className="img-fluid " />
                    </div>

                    <div className="col-12 col-md-12 col-lg-8">
                      <div className="main-title pt-4 pb-3">
                        <h1>{name}</h1>
                        <p>{description}</p>
                      </div>
                      <div className="menu-price-book">
                        <div className="price-book-divide d-flex justify-content-between ">
                          <h4>Price : {price}</h4>
                          <a href="...">
                            <button className="btn btn-primary">
                              Order Now
                            </button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
