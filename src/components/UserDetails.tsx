
import { User } from "@/lib/types/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

interface UserDetailsProps {
  user: User | null;
}

const UserDetails = ({ user }: UserDetailsProps) => {
  if (!user) return null;

  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback>
            <UserRound className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-medium">{user.name || 'User'}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDetails;
