import Image from "next/image";
import {Button} from "@/components/ui/button";
import UserButton from "@/features/auth/components/user-button";

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Hello, World!</h1>
      <UserButton/>
    </div>
  );
}
