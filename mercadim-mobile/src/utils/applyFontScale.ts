import { Text, TextProps } from 'react-native';

export const applyFontScale = (fontScale: number) => {
  const originalRender = (Text as any).render;
  
  (Text as any).render = function(props: TextProps, ref: any) {
    const style = Array.isArray(props.style) ? props.style : [props.style];
    const scaledStyle = style.map((s: any) => {
      if (s && typeof s === 'object' && s.fontSize) {
        return { ...s, fontSize: s.fontSize * fontScale };
      }
      return s;
    });
    
    return originalRender.call(this, { ...props, style: scaledStyle }, ref);
  };
};
