import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { GraduationCap, UserRound } from "lucide-react";

interface RoleToggleProps {
  activeRole?: "needer" | "helper";
  onRoleChange?: (role: "needer" | "helper") => void;
}

const RoleToggle = ({
  activeRole = "needer",
  onRoleChange,
}: RoleToggleProps) => {
  const [role, setRole] = useState<"needer" | "helper">(activeRole);

  const handleRoleChange = (newRole: "needer" | "helper") => {
    setRole(newRole);
    if (onRoleChange) {
      onRoleChange(newRole);
    }
  };

  return (
    <div className="flex items-center justify-center bg-white rounded-lg p-1 shadow-sm border border-gray-200 max-w-[220px] max-w-[-230px-]">
      <div className="relative flex w-screen">
        <motion.div
          className={`absolute rounded-md h-full z-0 ${role === "helper" ? "bg-[#5E17EB]" : "bg-[#F37221]"}`}
          initial={false}
          animate={{
            x: role === "helper" ? 0 : "100%",
            width: "50%",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ translateX: role === "helper" ? "0%" : "0%" }}
        />

        <Button
          variant="ghost"
          className={`flex-1 z-10 flex items-center justify-center gap-2 ${role === "helper" ? "text-white" : "text-foreground"}`}
          onClick={() => handleRoleChange("helper")}
        >
          <UserRound size={16} />
          <span>Tutor</span>
        </Button>

        <Button
          variant="ghost"
          className={
            `flex-1 z-10 flex items-center justify-center gap-2 ${role === "needer" ? "text-white" : "text-foreground"}` +
            " w-[115.422px]"
          }
          onClick={() => handleRoleChange("needer")}
        >
          <GraduationCap size={16} />
          <span>Student</span>
        </Button>
      </div>
    </div>
  );
};

export default RoleToggle;
