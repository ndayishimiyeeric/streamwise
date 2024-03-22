import { Separator } from "@/components/ui/separator";

import { ImageForm } from "./_components/image-form";
import { ProfileForm } from "./_components/profile-form";

export default async function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ImageForm />
      <ProfileForm />
    </div>
  );
}
