import {Avatar, AvatarImage} from "@/components/ui/avatar";

export default function SpacePage() {
  return (
    <div>
      <div className={"flex flex-col justify-center items-center gap-3 w-full"}>
        <Avatar className={'h-36 w-36 shadow-lg border-2'}>
          <AvatarImage src="/famille.jpg" alt="Image de famille" />
        </Avatar>
          <h3>Ma famille</h3>
      </div>
    </div>
  );
}
