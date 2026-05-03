import { Text } from 'react-native';
import { getGlobalFontScale } from './applyGlobalFontScale';

const originalRender = (Text as any).render;

if (originalRender) {
  (Text as any).render = function (props: any, ref: any) {
    const { style, ...otherProps } = props;
    
    if (style && typeof style === 'object') {
      const styles = Array.isArray(style) ? style : [style];
      const scaledStyles = styles.map((s: any) => {
        if (s && typeof s === 'object' && s.fontSize) {
          const scale = getGlobalFontScale();
          return { ...s, fontSize: s.fontSize * scale };
        }
        return s;
      });
      
      return originalRender.call(this, { ...otherProps, style: scaledStyles, allowFontScaling: false }, ref);
    }
    
    return originalRender.call(this, { ...props, allowFontScaling: false }, ref);
  };
}

export {};
