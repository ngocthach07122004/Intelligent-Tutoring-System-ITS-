import { SignUpLayout } from "@/components/layouts/SignUpLayout";
import { SignUpForm } from "@/components/widgets/auth/SignUpForm";
import ThemeSwitcher from "@/components/widgets/ThemeSwitcher/ThemeSwitcher";

const SignUpScreen = () => (
  <SignUpLayout>
    <SignUpForm />
    <ThemeSwitcher/>
  </SignUpLayout>
);

export default SignUpScreen;
