import RegisterComponent from "./components/signupComponent";

const SignUpPage = () => {
  return (
    <div className="h-full flex flex-col items-center">
        <div className="py-5 text-center">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Bienvenue sur ASERMPHARMA/IBA CRM
            </h1>
        </div>
        <div>
            <RegisterComponent />
        </div>
    </div>
  );
};

export default SignUpPage;