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
  <div class="container mx-auto overflow-hidden">
    <div class="flex items-center justify-between px-4 py-5 bg-blueGray-50">
      <div class="w-auto">
        <div class="flex flex-wrap items-center">
          <div class="w-auto mr-14">

          {/* <div ref={container} className="animation h-64"></div> */}
            {/* <a href="#">
              <img src="flaro-assets/logos/flaro-logo-black.svg" alt="">
            </a> */}
          </div>
        </div>
      </div>
      <div class="w-auto">
        <div class="flex flex-wrap items-center">
          <div class="w-auto hidden lg:block">
            <ul class="flex items-center mr-16">
              <li class="mr-9 font-medium hover:text-gray-700"><a href="#">Features</a></li>
              <li class="mr-9 font-medium hover:text-gray-700"><a href="#">Solutions</a></li>
              <li class="mr-9 font-medium hover:text-gray-700"><a href="#">Resources</a></li>
              <li class="font-medium hover:text-gray-700"><a href="#">Pricing</a></li>
            </ul>
          </div>
          <div class="w-auto hidden lg:block">
            <div class="inline-block">
              <button class="py-3 px-5 w-full text-white font-semibold border border-indigo-700 rounded-xl focus:ring focus:ring-indigo-300 bg-indigo-600 hover:bg-indigo-700 transition ease-in-out duration-200" type="button">Try 14 Days Free Trial</button>
            </div>
          </div>
          <div class="w-auto lg:hidden">
            <a href="#">
              <svg class="navbar-burger text-indigo-600" width="51" height="51" viewbox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="56" height="56" rx="28" fill="currentColor"></rect>
                <path d="M37 32H19M37 24H19" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="hidden navbar-menu fixed top-0 left-0 bottom-0 w-4/6 sm:max-w-xs z-50">
      <div class="navbar-backdrop fixed inset-0 bg-gray-800 opacity-80"></div>
      <nav class="relative z-10 px-9 pt-8 bg-white h-full overflow-y-auto">
        <div class="flex flex-wrap justify-between h-full">
          <div class="w-full">
            <div class="flex items-center justify-between -m-2">
              <div class="w-auto p-2">

              {/* <div ref={container} className="animation h-64"></div> */}
                {/* <a class="inline-block" href="#">
                  <img src="flaro-assets/logos/flaro-logo-black.svg" alt="">

                </a> */}
              </div>
              <div class="w-auto p-2">
                <a class="navbar-burger" href="#">
                  <svg width="24" height="24" viewbox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6L18 18" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div class="flex flex-col justify-center py-16 w-full">
            <ul>
              <li class="mb-12"><a class="font-medium hover:text-gray-700" href="#">Features</a></li>
              <li class="mb-12"><a class="font-medium hover:text-gray-700" href="#">Solutions</a></li>
              <li class="mb-12"><a class="font-medium hover:text-gray-700" href="#">Resources</a></li>
              <li><a class="font-medium hover:text-gray-700" href="#">Pricing</a></li>
            </ul>
          </div>
          <div class="flex flex-col justify-end w-full pb-8">
            <div class="flex flex-wrap">
              <div class="w-full">
                <div class="block">
                  <button class="py-3 px-5 w-full text-white font-semibold border border-indigo-700 rounded-xl focus:ring focus:ring-indigo-300 bg-indigo-600 hover:bg-indigo-700 transition ease-in-out duration-200" type="button">Try 14 Days Free Trial</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>
  <div class="overflow-hidden pt-16">
    <div class="container px-4 mx-auto">
      <div class="flex flex-wrap -m-8">
        <div class="w-full md:w-1/2 p-8">
          <div class="inline-block mb-6 px-2 py-1 font-semibold bg-green-100 rounded-full">
            <div class="flex flex-wrap items-center -m-1">
              <div class="w-auto p-1"><a class="text-sm" href="">&#x1F44B; We are hiring! View open roles</a></div>
              <div class="w-auto p-1">
                <svg width="15" height="15" viewbox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.66667 3.41675L12.75 7.50008M12.75 7.50008L8.66667 11.5834M12.75 7.50008L2.25 7.50008" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </div>
            </div>
          </div>
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
          <p class="mb-6 text-sm text-gray-500 font-semibold uppercase">Trusted and loved by 100+ tech first teams</p>
          <div class="flex flex-wrap -m-3">
            {/* <div class="w-auto p-3">
              <img src="flaro-assets/logos/brands/brand.png" alt="">
            </div> */}
            {/* <div class="w-auto p-3">
              <img src="flaro-assets/logos/brands/brand2.png" alt="">
            </div> */}
            {/* <div class="w-auto p-3">
              <img src="flaro-assets/logos/brands/brand3.png" alt="">
            </div> */}
          </div>
        </div>
        {/* <div class="w-full md:w-1/2 p-8">
          <img class="transform hover:-translate-y-16 transition ease-in-out duration-1000" src="flaro-assets/images/headers/header.png" alt="">
        </div> */}
        <div ref={container} className="animation"></div>
      </div>
    </div>
  </div>
</section>
</div>


  )
}

export default FirstSection