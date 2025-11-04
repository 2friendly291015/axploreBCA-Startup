import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, TYPOGRAPHY, SHADOWS, BORDER_RADIUS, SPACING } from '../theme';

export const Button = ({ 
  title, 
  onPress, 
  variant = 'filled', 
  size = 'medium',
  loading = false,
  disabled = false,
  style,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'outlined':
        return styles.outlinedButton;
      case 'text':
        return styles.textButton;
      default:
        return styles.filledButton;
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        getButtonSize(),
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'filled' ? COLORS.white : COLORS.primary} />
      ) : (
        <Text style={[
          styles.buttonText,
          variant !== 'filled' && styles.coloredText,
          disabled && styles.disabledText,
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.m,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  filledButton: {
    backgroundColor: COLORS.primary,
  },
  outlinedButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  textButton: {
    backgroundColor: 'transparent',
    ...SHADOWS.none,
  },
  smallButton: {
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
  },
  mediumButton: {
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.l,
  },
  largeButton: {
    paddingVertical: SPACING.l,
    paddingHorizontal: SPACING.xl,
  },
  buttonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    fontWeight: '600',
  },
  coloredText: {
    color: COLORS.primary,
  },
  disabledButton: {
    backgroundColor: COLORS.text.tertiary,
    borderColor: COLORS.text.tertiary,
  },
  disabledText: {
    color: COLORS.text.secondary,
  },
}); 