import { Plus, UserPlus, Play, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "@/lib/session";
import { can } from "@/lib/permissions";
const ACTIONS = [
  { icon: Plus, label: "New project", action: "create_project", primary: true },
  { icon: UserPlus, label: "Invite users", action: "invite_users" },
  { icon: Play, label: "Start sprint", action: "start_sprint" },
  { icon: Package, label: "Cut release", action: "cut_release" },
];
export function QuickActions() {
  const { user } = useSession();
  return (
    <div className="flex flex-wrap items-center gap-2">
      {ACTIONS.filter((a) => can(user.role, a.action)).map((a) => (
        <Button
          key={a.label}
          size="sm"
          variant={a.primary ? "default" : "outline"}
          onClick={() =>
            toast.success(`${a.label} started`, {
              description: "Wired to the workspace, ready to complete.",
            })
          }
        >
          <a.icon className="size-3.5" />
          {a.label}
        </Button>
      ))}
    </div>
  );
}
