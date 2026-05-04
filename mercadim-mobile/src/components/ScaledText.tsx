import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';

export const ScaledText: React.FC<RNTextProps> = ({ style, ...props }) => {
  const { fontScale } = useSettings();
  
  const scaledStyle = React.useMemo(() => {
    const styles = StyleSheet.flatten(style);
    if (styles && typeof styles === 'object' && styles.fontSize) {
      return { ...styles, fontSize: styles.fontSize * fontScale };
    }
    return style;
  }, [style, fontScale]);

  return <RNText {...props} style={scaledStyle} allowFontScaling={false} />;
};
