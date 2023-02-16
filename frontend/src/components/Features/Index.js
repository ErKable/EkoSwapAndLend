import React from "react";
import { TbCurrencyEthereum } from "react-icons/tb";
import { BsCurrencyBitcoin, BsCurrencyExchange } from "react-icons/bs";
import { RiExchangeDollarFill, RiExchangeCnyLine } from "react-icons/ri";
import { FaExchangeAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function File() {
  return (
    <div>
      <div class="mx-auto px-24 pb-16 dark:bg-black bg-white">
        <div>
          <div
            class="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3 pt-20 pb-10 lg:pt-40 lg:pb-20 container"
            style={{ cursor: "auto" }}
          >
            <Link to="/Ekoswap">
              <div class="p-6 bg-primary rounded-lg shadow-lg shadow-light-blue">
                <div class="mb-5">
                  <TbCurrencyEthereum className="w-10 h-10 text-white" />
                </div>

                <h3 class="text-lg font-bold mb-2 text-white text-center">
                  SWAP TOKENS
                </h3>

                <p class="text-sm leading-6 text-gray-300">
                  Buy, sell and explore the ekotokens and stables.
                </p>

                <div class="mb-5 flex justify-end">
                  <FaExchangeAlt className="w-10 h-10 text-white" />
                </div>
              </div>
            </Link>

            <Link to="/Exchange">
              <div class="p-6 bg-primary rounded-lg shadow-lg shadow-light-blue">
                <div class="mb-5">
                  <BsCurrencyBitcoin className="w-10 h-10 text-white" />
                </div>
                <h3 class="text-lg text-white font-bold mb-2 text-center">
                  EXCHANGE TOKENS
                </h3>

                <p class="text-sm leading-6 text-gray-300">
                  Exchange your ekotokens for stables and vice versa.
                </p>

                <div class="mb-5 flex justify-end">
                  <RiExchangeCnyLine className="w-10 h-10 text-white" />
                </div>
              </div>
            </Link>

            <Link to="/Ekolend">
              <div
                class="p-6 bg-primary rounded-lg shadow-lg shadow-light-blue"
                style={{ cursor: "auto" }}
              >
                <div class="mb-5" style={{ cursor: "auto" }}>
                  <div class="mb-5">
                    <RiExchangeDollarFill className="w-10 h-10 text-white" />
                  </div>
                </div>

                <h3 class="text-lg font-bold mb-2 text-white text-center">
                  LEND TOKENS
                </h3>

                <p class="text-sm leading-6 text-gray-300">
                  Lend your tokens and get an interest rate at the end of the
                  day.
                </p>

                <div class="mb-5 flex justify-end">
                  <BsCurrencyExchange className="w-10 h-10 text-white" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default File;
