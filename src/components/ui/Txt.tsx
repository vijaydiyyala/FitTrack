import { Text, type TextProps } from "react-native";

const WEIGHT = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semibold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extrabold: "PlusJakartaSans_800ExtraBold",
} as const;

export interface TxtProps extends TextProps {
  weight?: keyof typeof WEIGHT;
  className?: string;
}

export function Txt({ weight = "regular", className, style, ...rest }: TxtProps) {
  return (
    <Text
      className={`text-fg ${className ?? ""}`}
      style={[{ fontFamily: WEIGHT[weight] }, style]}
      {...rest}
    />
  );
}
