import AppLogo from "@/components/app-logo";

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <AppLogo />
      <p className="text-lg text-muted-foreground">{label}</p>
    </div>
  );
};
