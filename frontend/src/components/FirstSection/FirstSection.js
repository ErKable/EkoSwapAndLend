import React,{useEffect, useRef} from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import lottie from "lottie-web"


function FirstSection() {

  const container = useRef(null);

	useEffect(() => {
		const instance = lottie.loadAnimation({
		  container:container.current,
		  renderer: 'svg',
		  loop: true,
		  autoplay: true,
		  animationData: require('../../assets/Animations/hero.json')
		});
		return () => instance.destroy();
	  }, []);

  
  return (
    
  <div>


     
   
  

  <section class="bg-blueGray-50">
  <div class="overflow-hidden pt-16">
    <div class="container px-2 mx-auto">
      <div class="flex flex-wrap justify-center">

        <div class="w-full md:w-1/2 px-8 pt-10 pb-5">


        <div class="inline-block mb-6 px-2 py-1 font-semibold bg-green-100 rounded-full">
            <div class="flex flex-wrap items-center -m-1">
              <div class="w-auto p-1"><a class="text-sm" href="">&#x1F44B; Lend, Swap and Exchange </a></div>
              <div class="w-auto p-1">
                <svg width="15" height="15" viewbox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.66667 3.41675L12.75 7.50008M12.75 7.50008L8.66667 11.5834M12.75 7.50008L2.25 7.50008" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </div>
            </div>
          </div>

          <h1 class="mb-10 text-6xl md:text-8xl lg:text-6xl font-bold font-heading md:max-w-xl leading-none text-primary">SWAP, LEND & EXCHANGE EKOTOKENS.</h1>
          <p class="mb-11 text-lg text-gray-900 font-medium md:max-w-md">As a member of the Ekolance community, you can swap, lend and exchange your ekostables for ekotokens without hassles. </p>
          <div class="flex flex-wrap -m-2.5 mb-20">
            <div class="w-full md:w-auto p-2.5">
              <div class="block">
                <button class="py-4 px-6 w-full text-white font-semibold border border-primary rounded-xl focus:ring focus:ring-indigo-300 bg-primary hover:bg-primary transition ease-in-out duration-200" type="button">Get Started</button>
              </div>
            </div>
           
          </div>
        </div>
        <div className=''>
        <div ref={container} className="animation "></div>
        </div>
     
      </div>
    </div>
  </div>
</section>
</div>


  )
}

export default FirstSection