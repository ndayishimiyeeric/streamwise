import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Props = {
  imageUrl?: string;
  userName?: string;
  isNextMessageSamePerson?: boolean;
};

function UserAvatar({ imageUrl, userName, isNextMessageSamePerson }: Props) {
  return (
    <Avatar
      className={cn("rounded-full border-2  w-8 h-8", {
        invisible: isNextMessageSamePerson,
      })}
    >
      <AvatarImage
        className="object-contain"
        src={imageUrl}
        alt="user profile image"
      />
      <AvatarFallback>{userName?.[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
