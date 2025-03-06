import { FC, MouseEvent, PropsWithChildren, useMemo } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useAppSelector } from '../../../app/hooks';
import { selectTheme } from '../../themes/themeSlice';

import styles from './productItemBackground.module.scss';

const DEFAULT_LAYERS = 7;

const MotionBox = motion.div;

interface ProductItemBackgroundProps extends PropsWithChildren {
  layers?: number;
  wide?: boolean;
  backgroundColourOverride?: string;
  borderColourOverride?: string;
}

export const ProductItemBackground: FC<ProductItemBackgroundProps> = ({
  children,
  layers = DEFAULT_LAYERS,
  wide,
  backgroundColourOverride,
  borderColourOverride,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const layerList = useMemo(() => new Array(layers).fill(0), [layers]);

  const isDark = useAppSelector(selectTheme);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const gradientColor = isDark
    ? 'rgba(177, 123, 123, 0.03)'
    : 'rgba(0, 0, 0, 0.05)';

  const finalBackgroundColor =
    backgroundColourOverride ?? 'var(--product-item-background)';

  const gradient = useMotionTemplate`
    radial-gradient(
      200px circle at ${mouseX}px ${mouseY}px,
      ${gradientColor},
      transparent 80%
    )
  `;

  return (
    <div
      className={styles['product-item__background']}
      onMouseMove={handleMouseMove}
    >
      <MotionBox
        style={{
          position: 'absolute',
          inset: '-1px',
          borderRadius: 'xl',
          opacity: 0,
          zIndex: 0,
          background: gradient,
          transition: 'opacity 300ms',
        }}
      />
      <div className={styles['product-item__background-shadow']}></div>
      <div className={styles['product-item__background-opacity']}>
        <div
          className={styles['product-item__layer-container']}
          style={{ backgroundColor: finalBackgroundColor }}
        >
          {layerList.map((_, index) => (
            <div
              key={index}
              className={styles['product-item__background__layer']}
              style={{
                backgroundColor: 'transparent',
                borderColor: borderColourOverride ?? '',
                transform: `scale(${1 + index * 0.1}) translateY(-50%)`,
                width: wide ? '70%' : '',
                height: wide ? '100%' : '',
                top: wide ? '50%' : '',
              }}
            ></div>
          ))}
        </div>
        <div
          style={{
            zIndex: 1,
            width: '100%',
            height: '100%',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
