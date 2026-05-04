import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';

let globalFontScale = 1;

export const setGlobalFontScale = (scale: number) => {
  globalFontScale = scale;
};

export const getGlobalFontScale = () => globalFontScale;

const OriginalText = RNText;

export const ScaledTextComponent = React.forwardRef<RNText, TextProps>((props, ref) => {
  const { style, ...otherProps } = props;
  
  const flatStyle = StyleSheet.flatten(style);
  let scaledStyle = style;
  
  if (flatStyle && typeof flatStyle === 'object' && flatStyle.fontSize) {
    scaledStyle = { ...flatStyle, fontSize: flatStyle.fontSize * globalFontScale };
  }
  
  return <OriginalText ref={ref} {...otherProps} style={scaledStyle} allowFontScaling={false} />;
});

ScaledTextComponent.displayName = 'ScaledText';
