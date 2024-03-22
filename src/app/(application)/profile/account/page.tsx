import { Separator } from "@/components/ui/separator";

import { AccountForm } from "../_components/account-form";

export default function SettingsAccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings. Set your preferred platform language.
        </p>
      </div>
      <Separator />
      <AccountForm />
    </div>
  );
}
