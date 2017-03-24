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


export const stickerImages = [
  require('../../assets/imgs/stickers/animals.png'),
  require('../../assets/imgs/stickers/baby.png'),
  require('../../assets/imgs/stickers/beauty.png'),
  require('../../assets/imgs/stickers/bicycles.png'),
  require('../../assets/imgs/stickers/civic.png'),
  require('../../assets/imgs/stickers/coffee.png'),
  require('../../assets/imgs/stickers/community.png'),
  require('../../assets/imgs/stickers/construction.png'),
  require('../../assets/imgs/stickers/dining.png'),
  require('../../assets/imgs/stickers/drinks.png'),
  require('../../assets/imgs/stickers/education.png'),
  require('../../assets/imgs/stickers/energy.png'),
  require('../../assets/imgs/stickers/fashion.png'),
  require('../../assets/imgs/stickers/finance.png'),
  require('../../assets/imgs/stickers/food.png'),
  require('../../assets/imgs/stickers/garden.png'),
  require('../../assets/imgs/stickers/green-space.png'),
  require('../../assets/imgs/stickers/health-wellness.png'),
  require('../../assets/imgs/stickers/home-office.png'),
  require('../../assets/imgs/stickers/media-communications.png'),
  require('../../assets/imgs/stickers/products.png'),
  require('../../assets/imgs/stickers/services.png'),
  require('../../assets/imgs/stickers/special-events.png'),
  require('../../assets/imgs/stickers/tourism-hospitality.png'),
  require('../../assets/imgs/stickers/transit.png'),
  require('../../assets/imgs/stickers/waste.png'),
];