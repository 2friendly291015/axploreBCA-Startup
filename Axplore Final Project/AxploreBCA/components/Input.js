import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { COLORS, TYPOGRAPHY, SHADOWS, BORDER_RADIUS, SPACING } from '../theme';

export const Input = ({
  label,
  error,
  icon,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        error && styles.errorInput,
      ]}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          style={[styles.input, icon && styles.inputWithIcon]}
          placeholderTextColor={COLORS.text.tertiary}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.m,
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.m,
    borderWidth: 1,
    borderColor: COLORS.text.tertiary,
    ...SHADOWS.small,
  },
  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: SPACING.m,
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  inputWithIcon: {
    paddingLeft: SPACING.xs,
  },
  icon: {
    paddingLeft: SPACING.m,
  },
  errorInput: {
    borderColor: COLORS.error,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
}); 