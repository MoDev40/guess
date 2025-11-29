import { ReactNode } from 'react';
import { GestureResponderEvent, Pressable } from 'react-native';

type Props = {
  onPress: (event: GestureResponderEvent) => void;
  children: Readonly<ReactNode>;
};
const Button = ({ onPress, children }: Props) => {
  return <Pressable onPress={onPress}>{children}</Pressable>;
};

export default Button;
