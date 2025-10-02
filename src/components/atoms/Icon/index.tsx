import { ICON_PATHS } from '@/constants/icons';
import { SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: keyof typeof ICON_PATHS;
  size?: number;
}

export const Icon = ({
  name,
  size = 24,
  width,
  height,
  ...props
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || size}
      height={height || size}
      fill="currentColor"
      viewBox="0 0 256 256"
      {...props}
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
};

export default Icon;
