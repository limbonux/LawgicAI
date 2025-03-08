import { FC } from "react";

interface FinishStepProps {
  displayName: string;
}

export const FinishStep: FC<FinishStepProps> = ({ displayName }) => {
  return (
    <div className="space-y-4">
      <div>
        {displayName.length > 0 ? ` ${displayName.split(" ")[0]}` : null}! ،
        مرحباً بكم في LawgicAI
      </div>

      <div>انقر فوق "التالي" لبدء الدردشة.</div>
    </div>
  );
};
