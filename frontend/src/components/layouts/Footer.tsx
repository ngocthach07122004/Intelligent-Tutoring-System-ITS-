'use client'
import React from 'react'
import Link from 'next/link'
import { CustomButton } from '../ui/CustomButton'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='bg-[#1e1e2f] text-white border-t border-gray-700 py-10'>
      <div className='container mx-auto px-6'>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-10'>
          {/* Cột ABOUT US */}
          <div>
            <h3 className='mb-4 text-lg md:text-xl font-bold'>ABOUT US</h3>
            <ul className='space-y-2 text-gray-300 text-sm md:text-base'>
              <li>
                <Link href='/' className='transition-colors hover:text-blue-400'>
                  Home
                </Link>
              </li>
              <li>
                <Link href='/about' className='transition-colors hover:text-blue-400'>
                  About us
                </Link>
              </li>
              <li>
                <Link href='/privacy-policy' className='transition-colors hover:text-blue-400'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href='/terms' className='transition-colors hover:text-blue-400'>
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href='/disclaimer' className='transition-colors hover:text-blue-400'>
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột CONTACT US */}
          <div>
            <h3 className='mb-4 text-lg md:text-xl font-bold'>CONTACT US</h3>
            <ul className='space-y-3 text-gray-300 text-sm md:text-base'>
              <li className='flex items-center gap-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='w-5 h-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3'
                  />
                </svg>
                <span>Hotline</span>
              </li>
              <li className='flex items-center gap-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  fill='currentColor'
                  viewBox='0 0 16 16'
                >
                  <path d='M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z' />
                </svg>
                <span>Email</span>
              </li>
              <li className='flex items-center gap-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  fill='currentColor'
                  viewBox='0 0 16 16'
                >
                  <path d='M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951' />
                </svg>
                <span>Facebook</span>
              </li>
              <li className='flex items-center gap-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  fill='currentColor'
                  viewBox='0 0 16 16'
                >
                  <path d='M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6' />
                </svg>
                <span>Location</span>
              </li>
            </ul>
          </div>

          {/* Cột FEEDBACK */}
          <div className='col-span-2 md:col-span-1'>
            <h3 className='mb-4 text-lg md:text-xl font-bold'>FEEDBACK US HERE</h3>
            <div className='flex flex-col sm:flex-row gap-3'>
              <input
                type='email'
                placeholder='Your email'
                className='flex-grow rounded-lg border border-gray-400 px-4 py-2 text-gray-700 placeholder-gray-500 focus:outline-none w-full sm:w-auto'
              />
              <CustomButton className='border border-white py-2 h-[42px] w-full sm:w-auto'>
                Submit
              </CustomButton>
            </div>
          </div>
        </div>

        {/* Bản quyền */}
        <div className='mt-10 text-center text-sm text-gray-400'>
          <p>Copyright ©{currentYear}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
