import { CustomButton } from "../ui/CustomButton";

type Props = {
  icon: React.ReactNode;
  provider: string;
};

export const SocialAuthButton = ({ icon, provider }: Props) => (
  <CustomButton className="justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 flex w-full flex-row items-center gap-2">
    <span className="flex items-center justify-center gap-2">
      {icon}
      <span>{provider}</span>
    </span>
  </CustomButton>
);
