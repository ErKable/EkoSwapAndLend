import React, {useState} from "react";
import "./Styles.css";
import Logo from "../../assets/images/logo.png";
import Button from "../Button/Index";
import {HiMenuAlt3} from "react-icons/hi"
import {ImCross} from "react-icons/im"
import useThemeSwitcher from '../../hooks/useThemeSwitcher';
import { FiMoon, FiSun } from 'react-icons/fi';
import Web3Modal from "web3modal";
import {ethers} from "ethers";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

const providerOptions = {

  

  coinbasewallet: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "web3modal", // Required
      infuraId: "INFURA_ID", // Required
      rpc: "", // Optional if `infuraId` is provided; otherwise it's required
      chainId: 1, // Optional. It defaults to 1 if not provided
      darkMode: false, // Optional. Use dark theme, defaults to false
    },
  },
};

// const web3Modal = new Web3Modal({
//   network: "mainnet", // optional
//   cacheProvider: true, // optional
//   providerOptions, // required
// });


function Index() {

  const [Mobile, setMobile] = useState(false)

  const [activeTheme, setTheme] = useThemeSwitcher();

  const {web3Provider, setWeb3Provider} = useState()


  async function connectWallet(){

    try{

      let web3modal = new Web3Modal ({
          cacheProvider:false,
          providerOptions,
      });

      const web3ModalInstance = await web3modal.connect();
      const web3ModalProvider = new ethers.providers(web3ModalInstance);

      if(web3ModalProvider){
        setWeb3Provider(web3ModalProvider);
      }
    } catch (error){
      console.error(error);
    }

  }


  return (
    
    <nav className="navbar flex justify-between align-center text-primary dark:text-secondary-light bg-white dark:bg-black">

    <ul className="flex justify-center items-start">

      <div className="logo">
        <a href="/" className="flex justify-center items-center mt-1">
          <img src={Logo} alt="" />
        </a>
      </div>


         <li>
            <a href="/ekoswap" className="dropbtn text-primary dark:text-secondary-light">
              Swap
              </a>
             
          </li>

          <li >
            <a href="/ekolend" >
              <p>Lend</p>
            </a>
          </li>

          <li>
            <a href="/exchange" >
              <p>P2P Exchange</p>
            </a>
          </li>

          </ul>


      <div className="desktop-nav">

        <ul className="flex justify-center items-center">

        </ul>

      </div>



      <div className="desktop-btn">

        <ul className="flex justify-center items-center">

        <li className="mr-5">
        <div
        onClick={() => setTheme(activeTheme)}
        aria-label="Theme Switcher"
        className="ml-3 bg-primary-light dark:bg-primary p-3 shadow-sm rounded-xl cursor-pointer"
        >
        {activeTheme === 'dark' ? (
          <FiMoon className="text-ternary-dark hover:text-gray-400 dark:text-ternary-light dark:hover:text-primary-light text-xl" />
        ) : (
          <FiSun className="text-gray-200 hover:text-gray-50 text-xl" />
        )}
        </div>
        </li>

        {/* <Button name={"Connect Wallet"} className={"btn-1"} onClick={connectWallet}/> */}

      <li>
        {
          web3Provider == null ? (
            <Button name={"Connect Wallet"} className={"btn-1"} onClick={connectWallet}/>

          ):(

            <p>{web3Provider.providers.selectedAddress}</p>
          )

        }
  

      </li>

        </ul>
   
    </div>
    

   
   
    <nav className="mobile-nav">


     <ul className={Mobile ? "nav-links-mobile " : "nav-links "} onClick={() => setMobile(false)}>


       
          <li className="mobile-btn">
            <a href="/">
              <Button name={"Get Started"} className={"btn-1"} />
            </a>
          </li>


          <li>
        <div
        onClick={() => setTheme(activeTheme)}
        aria-label="Theme Switcher"
        className="ml-3 bg-primary-light dark:bg-primary p-3 shadow-sm rounded-xl cursor-pointer"
        >
        {activeTheme === 'dark' ? (
          <FiMoon className="text-ternary-dark hover:text-gray-400 dark:text-ternary-light dark:hover:text-primary-light text-xl" />
        ) : (
          <FiSun className="text-gray-200 hover:text-gray-50 text-xl" />
        )}
        </div>
        </li>


        </ul>


      <div className='mobile-menu-icon' onClick={() => setMobile(!Mobile)}>
          {Mobile ? <ImCross className="bars  dark:text-secondary-light text-primary-dark" /> : <HiMenuAlt3 className="bars dark:text-secondary-light text-primary-dark" />}
      </div>


      </nav>



     
    </nav>
  );
}

export default Index;
