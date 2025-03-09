
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserAvatarProps {
  name?: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ name, src, size = "md" }: UserAvatarProps) {
  const { user } = useAuth();
  
  // Use provided values or fallback to auth context user
  const imageSrc = src || user?.photoUrl;
  const userName = name || user?.name || "User";
  
  // Generate initials from name
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
  
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };
  
  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={imageSrc} alt={userName} />
      <AvatarFallback className="bg-todo-purple/30 text-todo-purple">
        {initials || <User className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
}
