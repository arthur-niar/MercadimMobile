import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';

export const Text: React.FC<TextProps> = (props) => {
  const { fontScale } = useSettings();
  const { style, ...otherProps } = props;

  const scaledStyle = React.useMemo(() => {
    if (!style) return style;
    
    const flatStyle = StyleSheet.flatten(style);
    if (flatStyle && typeof flatStyle === 'object' && flatStyle.fontSize) {
      return { ...flatStyle, fontSize: flatStyle.fontSize * fontScale };
    }
    return style;
  }, [style, fontScale]);

  return <RNText {...otherProps} style={scaledStyle} allowFontScaling={false} />;
};

export default Text;
