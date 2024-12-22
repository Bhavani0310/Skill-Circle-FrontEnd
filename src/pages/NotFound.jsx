import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link ,useNavigate} from 'react-router-dom';
const NotFound = () => {

 


  return (
    <div>
     

<main class="flex items-center justify-center w-full min-h-screen py-8 text-gray-900 page md:py-16 ">
    <div class="relative flex flex-col items-center w-full gap-8 px-8 md:px-18 xl:px-40 md:gap-16">
        <h1 class="text-9xl md:text-[300px] w-full select-none  text-center font-black  text-gray-400">
            404</h1>
        <p class="text-3xl font-bold capitalize">You have discovered a secret place</p>
        <p class="text-2xl font-medium break-words text-dull">Unfortunately, this is only a 404 page. You may have
            mistyped the address, or the page has been moved to another URL.</p>
        <div class="flex flex-col justify-between w-full gap-8 md:flex-row md:gap-32 xl:px-16">
            <Link to="/"
                class="flex items-center justify-center w-full gap-4 p-3 font-semibold capitalize border-2 border-blue-500 rounded shadow-lg md:w-fit hover:bg-blue-500 md:p-6 focus:outline-none hover:scale-105 active:scale-90 hover:shadow-xl ">
               <FontAwesomeIcon icon={faArrowLeft} />
                Go back to Previous Page
            </Link>
            <Link to="/"
                class="rounded flex w-full md:w-fit group items-center gap-4 justify-center border-2 border-green-500 font-semibold hover:bg-green-500 p-3 md:p-6 capitalize focus:outline-none hover:scale-105 active:scale-90 shadow-lg hover:shadow-xl ">
                 <FontAwesomeIcon icon={faHome} /> 
                Go back to Home Page
            </Link>
        </div>
    </div>
</main>
    </div>
  )
}

export default NotFound
