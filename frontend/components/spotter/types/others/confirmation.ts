import { IconSource } from "../../elements/icon";

type ConfirmationAction = {
  title: string;
  style: "Default" | "Destructive" | "Cancel";
};

export type ConfirmationFinishAction = "Primary" | "Secondary" | "Cancelled";

export type ConfirmationData = {
  title: string;
  icon?: IconSource;
  message?: string;
  primaryAction?: ConfirmationAction;
  secondaryAction?: ConfirmationAction;

  /* Confirmed Parameter:
  - picked primary - "Primary"
  - picked secondary - "Secondary"
  - cancelled - "Cancelled"
  */
  onFinish: (finishAction: ConfirmationFinishAction) => void;
};
