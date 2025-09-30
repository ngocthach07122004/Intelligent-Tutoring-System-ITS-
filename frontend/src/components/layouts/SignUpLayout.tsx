import { LogoIcon } from "../icons"

export const SignUpLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center p-2 py-6 bg-background text-foreground">
    <div className="mx-auto w-full min-w-[360px] space-y-6 max-w-md">
      <div className="flex items-center space-x-2 justify-center">
        <div className="flex size-9 items-center justify-center p-1">
          <div className="flex size-7 items-center justify-center rounded-md border text-primary">
            <LogoIcon />
          </div>
        </div>
        <span className="font-extrabold">Acme</span>
      </div>
      <div className="rounded-xl border shadow">
        {children}
      </div>
    </div>
  </div>
);
