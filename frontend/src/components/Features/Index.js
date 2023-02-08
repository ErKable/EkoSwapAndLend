import React from "react";
import {TbCurrencyEthereum} from "react-icons/tb"
import {BsCurrencyBitcoin, BsCurrencyExchange} from "react-icons/bs"
import {RiExchangeDollarFill, RiExchangeCnyLine} from "react-icons/ri"
import {FaExchangeAlt} from "react-icons/fa"


function File() {
  
  return (
    <div>
      <div class="container mx-auto px-6">
        <div 
            style={{ backgroundColor: "#ffffff" }}
        >
          <div
            class="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3 pt-20 pb-10 lg:pt-40 lg:pb-20"
            style={{ cursor: "auto" }}
          >
            <div class="p-6 bg-primary rounded-lg shadow-lg shadow-light-blue">

              <div class="mb-5">

                <TbCurrencyEthereum className="w-12 h-12 text-white"/>
               
              </div>

              <h3 class="text-lg font-bold mb-2 text-white text-center">SWAP TOKENS</h3>

              <p class="text-sm leading-6 text-gray-300">
                Metus potenti velit sollicitudin porttitor magnis elit lacinia
                tempor varius, ut cras orci vitae parturient id nisi vulputate
                consectetur, primis venenatis cursus tristique malesuada viverra
                congue risus.
              </p>

              <div class="mb-5 flex justify-end">

            <FaExchangeAlt className="w-12 h-12 text-white"/>

            </div>
            </div>

            <div class="p-6 bg-primary rounded-lg shadow-lg shadow-light-blue">
              
            <div class="mb-5">

            <BsCurrencyBitcoin className="w-12 h-12 text-white"/>

            </div>
              <h3 class="text-lg text-white font-bold mb-2 text-center">EXCHANGE TOKENS</h3>

              <p class="text-sm leading-6 text-gray-300">
                Metus potenti velit sollicitudin porttitor magnis elit lacinia
                tempor varius, ut cras orci vitae parturient id nisi vulputate
                consectetur, primis venenatis cursus tristique malesuada viverra
                congue risus.
              </p>


              <div class="mb-5 flex justify-end">

                <RiExchangeCnyLine className="w-12 h-12 text-white"/>
               
              </div>

            </div>

            <div class="p-6 bg-primary rounded-lg shadow-lg shadow-light-blue"
             style={{ cursor: "auto" }}
             >
              <div class="mb-5" 
              style={{ cursor: "auto" }}
              >

              <div class="mb-5">

                <RiExchangeDollarFill className="w-12 h-12 text-white"/>

                </div>
              </div>

              <h3 class="text-lg font-bold mb-2 text-white text-center">LEND TOKENS</h3>

              <p class="text-sm leading-6 text-gray-300">
                Metus potenti velit sollicitudin porttitor magnis elit lacinia
                tempor varius, ut cras orci vitae parturient id nisi vulputate
                consectetur, primis venenatis cursus tristique malesuada viverra
                congue risus.
              </p>


              <div class="mb-5 flex justify-end">

                <BsCurrencyExchange className="w-12 h-12 text-white"/>
               
              </div>
            </div>

         
          </div>
        </div>
      </div>
    </div>
  );
}

export default File;
