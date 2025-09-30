import { AlertIcon } from "../icons"
import { cn } from "@/lib/utils"

export const FormMessageAlert = ({
  message,
  success = false,
}: {
  message: string;
  success?: boolean;
}) => (
  <div
    role="alert"
    className={cn(
      "relative w-full rounded-lg border p-4 text-foreground",
      success ? "bg-green-500/10 border-green-500" : "bg-red-500/10 border-red-500"
    )}
  >
    <div className={cn("flex items-center gap-2")}>
      <AlertIcon />
      <div className={cn("text-sm")}>{message}</div>
    </div>
  </div>
);
