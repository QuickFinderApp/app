import { ConfirmationData, ConfirmationFinishAction } from "@/components/spotter/types/others/confirmation";

type SetAlert = (options: ConfirmationData | null) => void;
let setAlert: SetAlert = () => {};

export function confirmAlert(options: Omit<ConfirmationData, "onFinish">): Promise<ConfirmationFinishAction> {
  return new Promise((resolve) => {
    setAlert({
      ...options,
      onFinish(finishAction) {
        resolve(finishAction);
      }
    });
  });
}

export function setAlertCallback(callback: SetAlert): void {
  setAlert = callback;
}
