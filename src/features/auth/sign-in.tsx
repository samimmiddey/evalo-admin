"use client";

import AuthForm from './components/auth-form';
import AuthBrand from './components/auth-brand';

const SignIn = () => {
   return (
      <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col lg:grid lg:grid-cols-[5fr_7fr]">

         {/* Left Side: Sign-in Form */}
         <AuthForm />

         {/* Right Side: Showcase */}
         <AuthBrand />
      </div>
   );
};

export default SignIn;