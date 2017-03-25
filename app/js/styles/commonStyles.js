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
  require('../../assets/imgs/category-stickers/animals.png'),
  require('../../assets/imgs/category-stickers/baby.png'),
  require('../../assets/imgs/category-stickers/beauty.png'),
  require('../../assets/imgs/category-stickers/bicycles.png'),
  require('../../assets/imgs/category-stickers/civic.png'),
  require('../../assets/imgs/category-stickers/coffee.png'),
  require('../../assets/imgs/category-stickers/community.png'),
  require('../../assets/imgs/category-stickers/construction.png'),
  require('../../assets/imgs/category-stickers/dining.png'),
  require('../../assets/imgs/category-stickers/drinks.png'),
  require('../../assets/imgs/category-stickers/education.png'),
  require('../../assets/imgs/category-stickers/energy.png'),
  require('../../assets/imgs/category-stickers/fashion.png'),
  require('../../assets/imgs/category-stickers/finance.png'),
  require('../../assets/imgs/category-stickers/food.png'),
  require('../../assets/imgs/category-stickers/garden.png'),
  require('../../assets/imgs/category-stickers/green-space.png'),
  require('../../assets/imgs/category-stickers/health-wellness.png'),
  require('../../assets/imgs/category-stickers/home-office.png'),
  require('../../assets/imgs/category-stickers/media-communications.png'),
  require('../../assets/imgs/category-stickers/products.png'),
  require('../../assets/imgs/category-stickers/services.png'),
  require('../../assets/imgs/category-stickers/special-events.png'),
  require('../../assets/imgs/category-stickers/tourism-hospitality.png'),
  require('../../assets/imgs/category-stickers/transit.png'),
  require('../../assets/imgs/category-stickers/waste.png'),
];
