import { LoginComponent } from "./components/LoginComponent";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';



const SignInPage = () => {
  return (
    <div className="h-full flex flex-col items-center">
        <div className="py-5 text-center">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Bienvenue sur CRM
            </h1>
        </div>
        <div>
            <LoginComponent />
        </div>
    </div>
  );
};

export default SignInPage;