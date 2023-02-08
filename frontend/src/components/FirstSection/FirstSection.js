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
    <div class="container px-4 mx-auto">
      <div class="flex flex-wrap px-12 py-5">
        <div class="w-full md:w-1/2 p-8">
          <h1 class="mb-6 text-6xl md:text-8xl lg:text-6xl font-bold font-heading md:max-w-xl leading-none">Discover mentors that helps you grow</h1>
          <p class="mb-11 text-lg text-gray-900 font-medium md:max-w-md">Get the best-in-class group mentoring plans and professional benefits for your team</p>
          <div class="flex flex-wrap -m-2.5 mb-20">
            <div class="w-full md:w-auto p-2.5">
              <div class="block">
                <button class="py-4 px-6 w-full text-white font-semibold border border-indigo-700 rounded-xl focus:ring focus:ring-indigo-300 bg-indigo-600 hover:bg-indigo-700 transition ease-in-out duration-200" type="button">Join Free for 30 Days</button>
              </div>
            </div>
            <div class="w-full md:w-auto p-2.5">
              <div class="block">
                <button class="py-4 px-9 w-full font-semibold border border-gray-300 hover:border-gray-400 rounded-xl focus:ring focus:ring-gray-50 bg-transparent hover:bg-gray-100 transition ease-in-out duration-200" type="button">
                  <div class="flex flex-wrap justify-center items-center -m-1">
                    <div class="w-auto p-1">
                      <svg width="19" height="18" viewbox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.75 3.75C2.75 2.92157 3.42157 2.25 4.25 2.25H6.70943C7.03225 2.25 7.31886 2.45657 7.42094 2.76283L8.5443 6.13291C8.66233 6.48699 8.50203 6.87398 8.1682 7.0409L6.47525 7.88737C7.30194 9.72091 8.77909 11.1981 10.6126 12.0247L11.4591 10.3318C11.626 9.99796 12.013 9.83767 12.3671 9.9557L15.7372 11.0791C16.0434 11.1811 16.25 11.4677 16.25 11.7906V14.25C16.25 15.0784 15.5784 15.75 14.75 15.75H14C7.7868 15.75 2.75 10.7132 2.75 4.5V3.75Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                      </svg>
                    </div>
                    <div class="w-auto p-1">
                      <span>Book a call</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className=''>
        <div ref={container} className="animation"></div>
        </div>
     
      </div>
    </div>
  </div>
</section>
</div>


  )
}

export default FirstSection