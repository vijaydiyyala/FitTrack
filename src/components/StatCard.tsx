import { Txt } from "@/components/ui/Txt";
import { View } from "react-native";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
}

export function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <View className="flex-1 rounded-2xl border border-border bg-surface p-4">
      <View className="flex-row items-end gap-1">
        <Txt weight="bold" className="text-[26px]">
          {value}
        </Txt>
        {unit ? (
          <Txt className="mb-1 text-[13px] text-muted">{unit}</Txt>
        ) : null}
      </View>
      <Txt className="mt-1 text-[13px] text-muted">{label}</Txt>
    </View>
  );
}
