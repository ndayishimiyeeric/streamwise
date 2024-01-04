import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  imageUrl?: string;
  userName?: string;
  isNextMessageSamePerson?: boolean;
};

function UserAvatar({ imageUrl, userName, isNextMessageSamePerson }: Props) {
  return (
    <Avatar
      className={cn({
        invisible: isNextMessageSamePerson,
      })}
    >
      <AvatarImage src={imageUrl} alt="user profile image" />
      <AvatarFallback>{userName?.[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
