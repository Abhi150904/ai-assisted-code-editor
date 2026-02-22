
import Image from 'next/image'
import React from 'react'
import SignInFormClient from '@/features/auth/components/signin-form-client'

const SignInPage = () => {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col items-center justify-center gap-6">
        <Image src={"/login.svg"} alt="Login-Image" height={300} 
        width={300}
        className='object-cover'
        />
        <SignInFormClient />
      </div>
    </main>
  )
}

export default SignInPage
