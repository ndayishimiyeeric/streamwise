import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AiData } from "@prisma/client";
import { getSubscription } from "@/lib/actions";
import { cn } from "@/lib/utils";

type Props = {
  aiData: AiData;
  subscriptionPlan: Awaited<ReturnType<typeof getSubscription>>;
  isNextMessageSamePerson: boolean;
};

function BotAvatar({
  aiData,
  subscriptionPlan,
  isNextMessageSamePerson,
}: Props) {
  return (
    <Avatar
      className={cn("rounded-md w-8 h-8", {
        invisible: isNextMessageSamePerson,
      })}
    >
      <AvatarImage src={aiData.imgUrl!} alt="ai" />
      <AvatarFallback>BT</AvatarFallback>
    </Avatar>
  );
}

export default BotAvatar;
