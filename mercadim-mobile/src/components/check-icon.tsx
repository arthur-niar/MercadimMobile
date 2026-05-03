import Svg, { Path } from 'react-native-svg';

type CheckIconProps = {
  color?: string;
  size?: number;
};

export function CheckIcon({ color = '#fff', size = 22 }: CheckIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 13l4 4L19 7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}