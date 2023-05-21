import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

export function NavBar() {

    const user = useUser();

    const [showMenu, setShowMenu] = useState(false);

    const onClick = () => {
        setShowMenu(!showMenu);
    }

    return(

        
        <nav className="border-gray-200 bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Expense Tracker</span>
                <div className="flex  md:order-2">
                    <div>
                        {!user.isSignedIn && <SignInButton/>} 
                        {!!user.isSignedIn && <UserButton/>}
                    </div>

                    <button onClick={onClick} type="button" className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-400 hover:bg-gray-700 focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                    </button>
                </div>
                
                {showMenu &&

                    <div className="md:hidden w-full md:block md:w-auto" id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-gray-800 md:bg-gray-900 border-gray-700">
                            <li>
                                <Link href="/" className="block py-2 pl-3 pr-4  rounded md:bg-transparent md:text-blue-700 md:p-0 md:text-blue-500" aria-current="page">Home</Link>
                            </li>
                            <li>
                                <Link href="/create-household" className="block py-2 pl-3 pr-4 text-white rounded md:bg-transparent md:text-blue-700 md:p-0 text-white md:text-blue-500" aria-current="page">Create New Household</Link>
                            </li>
                        </ul>
                    </div>
                
                }

                    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-gray-800 md:bg-gray-900 border-gray-700">
                            <li>
                                <Link href="/" className="block py-2 pl-3 pr-4  rounded md:bg-transparent md:text-blue-700 md:p-0 md:text-blue-500" aria-current="page">Home</Link>
                            </li>
                            <li>
                                <Link href="/create-household" className="block py-2 pl-3 pr-4 text-white rounded md:bg-transparent md:text-blue-700 md:p-0 text-white md:text-blue-500" aria-current="page">Create New Household</Link>
                            </li>
                        </ul>
                    </div>
                
            </div>
        </nav>

    )

}
