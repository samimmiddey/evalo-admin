import Logo from '@/components/common/logo';
import AuthBrand from './auth-brand';
import PrimaryTitle from '@/components/common/primary-title';
import PrimaryBody from '@/components/common/primary-body';

interface AuthHeaderProps {
   title: string;
   description: string;
   children: React.ReactElement;
}

const AuthContainer = ({ title, description, children }: AuthHeaderProps) => {
   return (
      <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col lg:grid lg:grid-cols-[5fr_7fr]">

         {/* Left Side - Form */}
         <div className="flex flex-col justify-center p-6 lg:p-8 2xl:p-10 w-full max-w-lg mx-auto lg:max-w-none max-lg:min-h-screen">
            <div className="w-full max-w-md mx-auto">
               <div className="mb-8 text-center flex flex-col items-center">
                  <Logo containerClassName='2xl:scale-110' />
                  <PrimaryTitle text={title} className='text-[28px] lg:text-3xl 2xl:text-4xl mt-2.5 2xl:mt-4' />
                  <PrimaryBody
                     text={description}
                     className="mt-2 2xl:mt-3 text-sm! 2xl:text-[15px]!"
                  />
               </div>
               {children}
            </div>
         </div>

         {/* Right Side - Auth Brand */}
         <AuthBrand />

      </div>
   );
};

export default AuthContainer;