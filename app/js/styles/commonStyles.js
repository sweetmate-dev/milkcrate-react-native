import {
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';

export const { width: screenWidth, height: screenHiehgt } = Dimensions.get('window');

export function wp (percentage) {
  const value = (percentage * screenWidth) / 100;
  return Math.round(value);
}

export function hp (percentage) {
  const value = (percentage * screenHiehgt) / 100;
  return Math.round(value);
}

export const carouselHeight = screenHiehgt * 0.3;
export const carouselWidth = wp(88);
export const carouselerWidth = screenWidth;
export const carouselItemHorizontalPadding = wp(1);
export const carouselItemWidth = carouselWidth + carouselItemHorizontalPadding * 2;

export const activityCellSize = screenWidth * 0.22;
export const categoryCellSize = screenWidth / 4;

export const NavNoneButton = 0;
export const NavBackButton = 1;
export const NavFilterButton = 2;
export const NavSettingButton = 4;