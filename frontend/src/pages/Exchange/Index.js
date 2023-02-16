import React, { useState } from "react";
import "./style.css";
import Exchange from "./Exchange";

function Index() {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <div className="exchange">
      <div className="thebg">
        <h1>
          Buy and Sell TetherUS (USDT) with Your Preferred Payment Methods
        </h1>
        <p>Buy and sell TetherUS safely and easily on Binance P2P.</p>
        <p>
          Find the best offer below and buy and sell USDT with Your Preferred
          Payment Methods today.
        </p>
      </div>

      <div className="msRGContainer">
        <div className="mSRG-Btn">
          <button
            id="Gallery1"
            className={
              toggleState === 1 ? " mSRG-btn  active-tabs " : "mSRG-btn"
            }
            onClick={() => toggleTab(1)}
          >
            {" "}
            Buy
          </button>

          <button
            id="Gallery2"
            className={toggleState === 2 ? " mSRG-btn active-tabs" : "mSRG-btn"}
            onClick={() => toggleTab(2)}
          >
            Sell
          </button>
        </div>

        <div id="mSRG-container">

          <div className="block mx-auto">

          <form className="flex justify-around">

            <div>
              <h3>Amount</h3>

              <div className="amount">
              <input placeholder="Enter Amount" />
              <button>Search</button>
              </div>

            </div>

            <div>
              <h3>Fiat</h3>
              <select>
                <option>EKOUSDT</option>
                <option>EKOTOKEN</option>
              </select>
            </div>

            <div>
              <h3>Payment</h3>
              <select>
                <option>EKOUSDT</option>
                <option>EKOTOKEN</option>
              </select>
            </div>
          </form>

          </div>

          <div
            id="Gallery1"
            className={
              toggleState === 1
                ? "mSRG-container-inner  active-content"
                : "mSRG-container-inner"
            }
          >
            {/* Buy */}
            {/* <Exchange /> */}
          </div>
        </div>

        <div id="mSRG-container">
          <div
            id="Gallery2"
            className={
              toggleState === 2
                ? "mSRG-container-inner  active-content"
                : "mSRG-container-inner"
            }
          >
            {/* Sell */}
            {/* <Exchange /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
