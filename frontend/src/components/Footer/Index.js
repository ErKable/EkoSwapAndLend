import React from 'react'
import Logo from "../../assets/images/thelogo.png"

function Index() {
  return (
   
<footer class="p-4 bg-gray-100 dark:bg-black shadow md:px-6 md:py-8 ">
    <div class="sm:flex sm:items-center sm:justify-between">
        <a href="https://flowbite.com/" class="flex items-center mb-4 sm:mb-0">
            <img src={Logo} class="h-8 mr-3" alt="Flowbite Logo" />
        </a>
        <ul class="flex flex-wrap items-center mb-6 text-lg text-primary sm:mb-0 d">
            <li>
                <a href="#" class="mr-4 hover:underline md:mr-6 ">Swap</a>
            </li>
            <li>
                <a href="#" class="mr-4 hover:underline md:mr-6">Lend</a>
            </li>
            <li>
                <a href="#" class="mr-4 hover:underline md:mr-6 ">Exchange</a>
            </li>
            <li>
                <a href="#" class="hover:underline">Contact</a>
            </li>
        </ul>
    </div>
    <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
    <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" class="hover:underline">Eko™</a>. All Rights Reserved.
    </span>
</footer>

  )
}

export default Index