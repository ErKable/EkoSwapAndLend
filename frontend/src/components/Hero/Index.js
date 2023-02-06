import React, {useEffect, useRef} from 'react'
import HeroImg from "../../assets/images/theHero.png"
import "./Styles.css"
import Button from "../Button/Index"
import lottie from "lottie-web"

function Index() {

  const container = useRef(null);

	useEffect(() => {
		const instance = lottie.loadAnimation({
		  container:container.current,
		  renderer: 'svg',
		  loop: true,
		  autoplay: true,
		  animationData: require('../../assets/Animations/Ekolance.json')
		});
		return () => instance.destroy();
	  }, []);


  return (

    
    <div className='heroContent bg-white dark:bg-black transition duration-300 text-primary dark:text-secondary-light flex justify-center items-center px-28'>

      <div className='heroMainContent'>

        <h2>Swap, Exchange and Lend EkoTokens.</h2>

        <div className='heroBtn'>
        <Button name={"Learn More"} className={"btn-1"} />
        </div>
       
      </div>    

      <div className='heroImg ml-24'>
      <div ref={container} className="animation"></div>
      {/* <img src={HeroImg} alt="" className=''/> */}
      </div>

      

    </div>
  )
}

export default Index