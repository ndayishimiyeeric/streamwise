import { Separator } from "@/components/ui/separator";

import { VisibilityForm } from "../_components/visibility-form";

export default function SettingsDisplayPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Visibility</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account public visibility settings.
        </p>
      </div>
      <Separator />
      <VisibilityForm />
    </div>
  );
}
