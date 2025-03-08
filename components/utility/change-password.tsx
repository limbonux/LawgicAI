"use client";

import { supabase } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { toast } from "sonner";

interface ChangePasswordProps {}

export const ChangePassword: FC<ChangePasswordProps> = () => {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    if (!newPassword) return toast.info("من فضلك أدخل كلمة المرور الجديدة.");

    await supabase.auth.updateUser({ password: newPassword });

    toast.success("تم تغيير كلمة المرور بنجاح.");

    return router.push("/login");
  };

  return (
    <Dialog open={true}>
      <DialogContent className="h-[240px] w-[400px] p-4">
        <DialogHeader>
          <DialogTitle>تغيير كلمة المرور</DialogTitle>
        </DialogHeader>

        <Input
          id="password"
          placeholder="كلمة المرور الجديدة"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <Input
          id="confirmPassword"
          placeholder="تأكيد كلمة المرور الجديدة"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <DialogFooter>
          <Button onClick={handleResetPassword}>تأكيد التغيير</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
