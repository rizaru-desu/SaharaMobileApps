import {moderateScale} from 'react-native-size-matters';

export const Fonts = {
  family: {
    regular: 'Roboto-Regular',
    italic: 'Roboto-Italic',
    bold: 'Roboto-Bold',
  },
  size: {
    xs: moderateScale(10),
    sm: moderateScale(12),
    md: moderateScale(15),
    lg: moderateScale(17),
    xl: moderateScale(22),
  },
};

export const Colors = {
  primary: '#ff6900',
  secondary: '#fcb900',
  button: '#eb9c00',
  text: '#000000',
  error: '#B70701',
  placeholder: '#797676',
};

export const Images = {
  logoN: require('./images/logo.png'),
  logoNW: require('./images/logo-white.png'),
  logoTop: require('./images/top-loggo.png'),
  logoBG: require('./images/bg-s.png'),
  logoMan: require('./images/loginMan.png'),
  logoLogin: require('./images/loginHeader.png'),
  logoSignUp: require('./images/signup.png'),
  logoForgot: require('./images/loginForgotPassword.png'),
  logoSahara: require('./images/logoSahara.png'),
};
