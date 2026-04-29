import Svg, { Path, Circle } from 'react-native-svg';

type CartIconProps = {
  color?: string;
  size?: number;
};

export function CartIcon({ color = '#111827', size = 22 }: CartIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 3h2l2.5 9h10l2.5-7H6.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="10" cy="20" r="1.5" fill={color} />
      <Circle cx="18" cy="20" r="1.5" fill={color} />
    </Svg>
  );
}