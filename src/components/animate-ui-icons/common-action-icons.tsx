import {
  DEFAULT_ICON_SIZE,
  RefreshCwIcon,
  SearchIcon,
  hoverAnimate,
} from '@/components/animate-ui-icons';

interface ReloadIconProps {
  isReloading?: boolean;
  size?: number;
}

export function ReloadIcon({ isReloading, size = DEFAULT_ICON_SIZE }: ReloadIconProps) {
  return (
    <RefreshCwIcon
      size={size}
      animation="rotate"
      animate={isReloading}
      loop={isReloading}
      {...hoverAnimate}
    />
  );
}

export function SearchActionIcon({ size = DEFAULT_ICON_SIZE }: { size?: number }) {
  return <SearchIcon size={size} {...hoverAnimate} />;
}
