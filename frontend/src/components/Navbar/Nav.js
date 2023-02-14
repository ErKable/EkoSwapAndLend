import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import Button from "../Button/Index";
import Logo from "../../assets/images/thelogo.png";


 
const Nav = () => {



  return (
    <div class="container mx-auto overflow-hidden sticky top-0 bg-white z-10">
      <div class="flex items-center justify-between px-2 py-2 bg-blueGray-50">
        <div class="w-auto">
          <div class="flex flex-wrap items-center">
            <div class="">
              <Link to="/">
                <img
                  src={Logo}
                  alt="logo"
                  className=" mr-28 object-contain h-16 w-16"
                />
              </Link>
            </div>
          </div>
        </div>
        <div class="w-auto">
          <div class="flex flex-wrap items-center ">
            <div class="w-auto hidden lg:block">
              <ul class="flex items-center mr-16 text-primary">
                <li class="mr-9 font-medium text-lg hover:text-gray-700">
                  <Link to="/Ekoswap">Swap</Link>
                </li>
                <li class="mr-9 font-medium text-lg hover:text-gray-700">
                  <Link to="Ekolend">Lend</Link>
                </li>
                <li class="mr-9 font-medium text-lg hover:text-gray-700">
                  <Link to="/Exchange">P2P</Link>
                </li>
              </ul>
            </div>
            <div class="w-auto hidden lg:block">
              <div class="inline-block">
                {/* {requestAccount == null ? (
                  <Button
                    name={"Connect Wallet"}
                    className="py-3 px-5 w-full text-white font-semibold border border-primary rounded-xl focus:ring focus:ring-indigo-300 bg-primary hover:bg-primary transition ease-in-out duration-200"
                    onClick={requestAccount}
                  />
                ) : (
                  <h3> {walletAddress} </h3>
                )} */}
             
              </div>
            </div>

            {/* <div class="w-auto lg:hidden">
              <a href="#">
                <svg
                  class="navbar-burger text-indigo-600"
                  width="51"
                  height="51"
                  viewbox="0 0 56 56"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="56"
                    height="56"
                    rx="28"
                    fill="currentColor"
                  ></rect>
                  <path
                    d="M37 32H19M37 24H19"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </a>
            </div> */}
          </div>
        </div>
      </div>
      {/* <div class="hidden navbar-menu fixed top-0 left-0 bottom-0 w-4/6 sm:max-w-xs z-50">
        <div class="navbar-backdrop fixed inset-0 bg-gray-800 opacity-80"></div>
        <nav class="relative z-10 px-9 pt-8 bg-white h-full overflow-y-auto">
          <div class="flex flex-wrap justify-between h-full">
            <div class="w-full">
              <div class="flex items-center justify-between -m-2">
                <div class="w-auto p-2"></div>
                <div class="w-auto p-2">
                  <a class="navbar-burger" href="#">
                    <svg
                      width="24"
                      height="24"
                      viewbox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 18L18 6M6 6L18 18"
                        stroke="#111827"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div class="flex flex-col justify-center py-16 w-full">
              <ul>
                <li class="mb-12">
                  <Link
                    to="/Ekoswap"
                    class="font-medium hover:text-gray-700"
                    href="#"
                  >
                    Swap
                  </Link>
                </li>
                <li class="mb-12">
                  <Link
                    to="/Ekolend"
                    class="font-medium hover:text-gray-700"
                    href="#"
                  >
                    Lend
                  </Link>
                </li>
                <li class="mb-12">
                  <Link
                    to="/Exchange"
                    class="font-medium hover:text-gray-700"
                    href="#"
                  >
                    P2P
                  </Link>
                </li>
              </ul>
            </div>
            <div class="flex flex-col justify-end w-full pb-8">
              <div class="flex flex-wrap">
                <div class="w-full">
                  <div class="block">
                    <button
                      class="py-3 px-5 w-full text-white font-semibold border border-indigo-700 rounded-xl focus:ring focus:ring-indigo-300 bg-indigo-600 hover:bg-indigo-700 transition ease-in-out duration-200"
                      type="button"
                    >
                      <li>
                        {web3Provider == null ? (
                          <Button
                            name={"Connect Wallet"}
                            className={"btn-1"}
                            onClick={connectWallet}
                          />
                        ) : (
                          <p>{web3Provider.providers.selectedAddress}</p>
                        )}
                      </li>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div> */}
    </div>
  );
}

export default Nav;
