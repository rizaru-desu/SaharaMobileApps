import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

const baseFontSize = hp(1.5);
export const Fonts = {
  family: {
    regular: 'Roboto-Regular',
    italic: 'Roboto-Italic',
    bold: 'Roboto-Bold',
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
