import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PROFILE_DISPLAY_NAME_MAX,
  PROFILE_USERNAME_MAX,
  PROFILE_USERNAME_MIN,
} from "@/db/limits";
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLoader2,
} from "@tabler/icons-react";
import { FC, useCallback, useState } from "react";
import { LimitDisplay } from "../ui/limit-display";
import { toast } from "sonner";

interface ProfileStepProps {
  username: string;
  usernameAvailable: boolean;
  displayName: string;
  onUsernameAvailableChange: (isAvailable: boolean) => void;
  onUsernameChange: (username: string) => void;
  onDisplayNameChange: (name: string) => void;
}

export const ProfileStep: FC<ProfileStepProps> = ({
  username,
  usernameAvailable,
  displayName,
  onUsernameAvailableChange,
  onUsernameChange,
  onDisplayNameChange,
}) => {
  const [loading, setLoading] = useState(false);

  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout | null;

    return (...args: any[]) => {
      const later = () => {
        if (timeout) clearTimeout(timeout);
        func(...args);
      };

      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const checkUsernameAvailability = useCallback(
    debounce(async (username: string) => {
      if (!username) return;

      if (username.length < PROFILE_USERNAME_MIN) {
        onUsernameAvailableChange(false);
        return;
      }

      if (username.length > PROFILE_USERNAME_MAX) {
        onUsernameAvailableChange(false);
        return;
      }

      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(username)) {
        onUsernameAvailableChange(false);
        toast.error(
          "يجب أن يتكون اسم المستخدم من أحرف انجليزية وأرقام وشرطات سفلية فقط - ولا يُسمح بأي رموز أخرى أو مسافات.",
        );
        return;
      }

      setLoading(true);

      const response = await fetch(`/api/username/available`, {
        method: "POST",
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      const isAvailable = data.isAvailable;

      onUsernameAvailableChange(isAvailable);

      setLoading(false);
    }, 500),
    [],
  );

  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center space-x-3">
          <Label>اسم المستخدم</Label>

          <div className="pr-3 text-xs">
            {usernameAvailable ? (
              <div className="text-green-500">متاح</div>
            ) : (
              <div className="text-red-500">غير متاح</div>
            )}
          </div>
        </div>

        <div className="relative">
          <Input
            className="pr-10"
            dir="ltr"
            placeholder="username"
            value={username}
            onChange={(e) => {
              onUsernameChange(e.target.value);
              checkUsernameAvailability(e.target.value);
            }}
            minLength={PROFILE_USERNAME_MIN}
            maxLength={PROFILE_USERNAME_MAX}
          />

          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {loading ? (
              <IconLoader2 className="animate-spin" />
            ) : usernameAvailable ? (
              <IconCircleCheckFilled className="text-green-500" />
            ) : (
              <IconCircleXFilled className="text-red-500" />
            )}
          </div>
        </div>

        <LimitDisplay used={username.length} limit={PROFILE_USERNAME_MAX} />
      </div>

      <div className="space-y-1">
        <Label>الاسم الظاهر في الدردشة</Label>

        <Input
          placeholder="Your Name"
          dir="ltr"
          value={displayName}
          onChange={(e) => onDisplayNameChange(e.target.value)}
          maxLength={PROFILE_DISPLAY_NAME_MAX}
        />

        <LimitDisplay
          used={displayName.length}
          limit={PROFILE_DISPLAY_NAME_MAX}
        />
      </div>
    </>
  );
};
