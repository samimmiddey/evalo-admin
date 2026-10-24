import Logo from '@/components/common/logo';
import PrimaryBody from '@/components/common/primary-body';
import PrimaryTitle from '@/components/common/primary-title';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authData } from '@/data/auth/auth.data';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const AuthForm = () => {
   const [showPassword, setShowPassword] = useState(false);
   const { form } = authData;

   return (
      <div className="flex flex-col justify-center p-6 lg:p-8 2xl:p-10 w-full max-w-lg mx-auto lg:max-w-none max-lg:min-h-screen">

         {/* Form Section */}
         <div className="w-full max-w-md mx-auto flex flex-col items-center">
            <Logo containerClassName='2xl:scale-110' />
            <div className="mb-8 mt-4 text-center">
               <PrimaryTitle text={form.title} className='text-2xl lg:text-3xl 2xl:text-4xl' />
               <PrimaryBody
                  text={form.description}
                  className="mt-2 2xl:mt-3 text-sm! 2xl:text-[15px]!"
               />
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4 w-full">
               {/* Email Field */}
               <div className="space-y-1.5">
                  <label
                     htmlFor={form.emailInput.name}
                     className="block text-sm font-medium text-zinc-200"
                  >
                     {form.emailInput.label}
                  </label>
                  <Input
                     name={form.emailInput.name}
                     type={form.emailInput.type}
                     placeholder={form.emailInput.placeholder}
                  />
               </div>

               {/* Password Field */}
               <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                     <label
                        htmlFor={form.passwordInput.name}
                        className="block text-sm font-medium text-zinc-200"
                     >
                        {form.passwordInput.label}
                     </label>
                     <a
                        href="#forgot"
                        onClick={(e) => e.preventDefault()}
                        className="text-xs text-violet-300 hover:text-violet-400 transition-colors font-medium"
                     >
                        {form.forgotPassword}
                     </a>
                  </div>
                  <div className="relative">
                     <Input
                        name={form.passwordInput.name}
                        type={showPassword ? 'text' : form.passwordInput.type}
                        placeholder={form.passwordInput.placeholder}
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 p-0.5 cursor-pointer"
                     >
                        {showPassword ? (
                           <EyeOff className="w-4 h-4" />
                        ) : (
                           <Eye className="w-4 h-4" />
                        )}
                     </button>
                  </div>
               </div>

               {/* Submit Button */}
               <Button
                  type="submit"
                  size='xxl'
                  className="w-full mt-3 bg-violet-600 hover:bg-violet-500 text-white"
               >
                  {form.submitButtonText}
               </Button>
            </form>
         </div>
      </div>
   );
};

export default AuthForm;