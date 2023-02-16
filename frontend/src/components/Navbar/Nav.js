import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import Button from "../Button/Index";
import Logo from "../../assets/images/thelogo.png";
import { FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi';
import useThemeSwitcher from '../../hooks/useThemeSwitcher';


 
const Nav = () => {

  const [activeTheme, setTheme] = useThemeSwitcher();

     // Properties

  const [walletAddress, setWalletAddress] = useState("");

// Helper Functions

  // Requests access to the user's META MASK WALLET
  // https://metamask.io

    async function requestAccount(){

        console.log('requesting account');

        // ❌ Check if Meta Mask Extension exists 

        if(window.ethereum){
            console.log('detected');


      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log('Error connecting...');
      }


        }else{
            alert('Metamask not detected');
        }
    }

     // Create a provider to interact with a smart contract
    async function connectWallet() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
    }
  }


  return (
    <div class="container mx-auto overflow-hidden sticky top-0 bg-white dark:bg-black z-10">

      <div class="flex items-center justify-between px-2 py-2">

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
                <li>
              <div
              onClick={() => setTheme(activeTheme)}
              aria-label="Theme Switcher"
              className="ml-3 bg-primary-light dark:bg-black p-3 shadow-sm rounded-xl cursor-pointer"
              >
              {activeTheme === 'dark' ? (
                <FiMoon className="text-ternary-dark hover:text-gray-400 dark:text-ternary-light dark:hover:text-primary-light text-xl" />
              ) : (
                <FiSun className="text-gray-200 hover:text-gray-50 text-xl" />
              )}
              </div>

              </li>
            </ul>

            </div>

            <div class="w-auto hidden lg:block">
            <div className="mt-3 space-y-2 lg:hidden md:inline-block">
                    <a
                        href="javascript:void(0)"
                        className="inline-block w-full px-4 py-2 text-center text-white bg-primary rounded-md shadow hover:bg-gray-800"
                        onClick={requestAccount}
                    >
                    {!!walletAddress ? walletAddress : "Connect Wallet"}
                    </a> 
                </div>
                <div className="hidden space-x-2 md:inline-block">
                    <a
                        href="javascript:void(0)"
                        className="px-5 py-5 text-white bg-primary rounded-md shadow hover:bg-gray-800"
                        onClick={requestAccount}
                    >
                      {!!walletAddress ? walletAddress : "Connect Wallet"}
                    </a>
                </div>
            </div>

      
          </div>
        </div>


        <div className="lg:hidden ">

        </div>

      </div>


    </div>
  );
}

export default Nav;
