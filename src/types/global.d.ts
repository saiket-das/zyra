declare const process: {
  env: Record<string, string | undefined>;
};

declare module "@react-native-picker/picker" {
  import type { ComponentType } from "react";
  import type { ViewProps } from "react-native";

  export interface PickerProps extends ViewProps {
    selectedValue?: string | number;
    onValueChange?: (itemValue: string | number, itemIndex: number) => void;
    children?: React.ReactNode;
  }

  export interface PickerItemProps {
    label: string;
    value: string | number;
  }

  export const Picker: ComponentType<PickerProps> & {
    Item: ComponentType<PickerItemProps>;
  };
}
