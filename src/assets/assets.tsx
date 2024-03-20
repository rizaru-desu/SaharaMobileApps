import {verticalScale as h} from 'react-native-size-matters';

const baseFontSize = h(14);
export const Fonts = {
  family: {
    regular: 'CN-Regular',
    italic: 'CN-Italic',
    bold: 'CN-Bold',
  },
  size: {
    xs: baseFontSize * 0.5,
    sm: baseFontSize * 0.8,
    md: baseFontSize,
    lg: baseFontSize * 1.2,
    xl: baseFontSize * 1.5,
  },
};

export const Colors = {
  primary: '#ff6900',
  secondary: '#fcb900',
  button: '#eb9c00',
  text: '#000000',
};

export const Images = {
  logoMan: require('./images/loginMan.png'),
  logoLogin: require('./images/loginHeader.png'),
  logoSignUp: require('./images/signup.png'),
  logoForgot: require('./images/loginForgotPassword.png'),
  logoSahara: require('./images/logoSahara.png'),
};
