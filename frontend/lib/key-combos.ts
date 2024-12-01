import { getOS, KeyName } from "./keyboard";

export const CommonKeyCombos = {
  Enter: () => {
    const os = getOS();
    switch (os) {
      case "Mac":
        return [KeyName.Enter];
      case "Windows":
        return [KeyName.Enter];
      case "Linux":
        return [KeyName.Enter];
      default:
        return [];
    }
  },
  LeftPage: () => {
    const os = getOS();
    switch (os) {
      case "Mac":
        return [KeyName.ArrowLeft];
      case "Windows":
        return [KeyName.ArrowLeft];
      case "Linux":
        return [KeyName.ArrowLeft];
      default:
        return [];
    }
  },
  RightPage: () => {
    const os = getOS();
    switch (os) {
      case "Mac":
        return [KeyName.ArrowRight];
      case "Windows":
        return [KeyName.ArrowRight];
      case "Linux":
        return [KeyName.ArrowRight];
      default:
        return [];
    }
  }
};

export type CommonKeyComboNames = keyof typeof CommonKeyCombos;

// Other Key Combos
export const getPopKeyCombo = () => {
  const os = getOS();
  switch (os) {
    case "Mac":
      return [KeyName.Escape];
    case "Windows":
      return [KeyName.Escape];
    case "Linux":
      return [KeyName.Escape];
    default:
      return [];
  }
};

export const getPopToRootKeyCombo = () => {
  const os = getOS();
  switch (os) {
    case "Mac":
      return [KeyName.Command, KeyName.Escape];
    case "Windows":
      return [KeyName.Ctrl, KeyName.Escape];
    case "Linux":
      return [KeyName.Ctrl, KeyName.Escape];
    default:
      return [];
  }
};

export const getActionMenuKeyCombo = () => {
  const os = getOS();
  switch (os) {
    case "Mac":
      return [KeyName.Command, KeyName.K];
    case "Windows":
      return [KeyName.Ctrl, KeyName.K];
    case "Linux":
      return [KeyName.Ctrl, KeyName.K];
    default:
      return [];
  }
};
