import { AuthLayout } from "@/components/layouts/AuthLayout"; 
import { AuthForm } from "@/components/widgets/auth/AuthForm"; 
import ThemeSwitcher from "@/components/widgets/ThemeSwitcher/ThemeSwitcher";

const LoginScreen = () => (
  <AuthLayout>
    <AuthForm />
    <ThemeSwitcher/>
  </AuthLayout>
);

export default LoginScreen;
