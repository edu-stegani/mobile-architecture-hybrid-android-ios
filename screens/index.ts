import LoginAndroid from './android/login.screen.js'
import HomeAndroid from './android/home.screen.js'
import ReceitaAndroid from './android/receitas.screen.js'
import ProfileAndroid from './android/profile.screen.js'

import LoginIOS from './ios/login.screen.js'
import HomeIOS from './ios/home.screen.js'
import ReceitaIOS from './ios/receitas.screen.js'
import ProfileIOS from './ios/profile.screen.js'

const platform = process.env.PLATFORM

export const loginScreen =
  platform === 'ios' ? LoginIOS : LoginAndroid

export const homeScreen =
  platform === 'ios' ? HomeIOS : HomeAndroid

export const receitaScreen =
  platform === 'ios' ? ReceitaIOS : ReceitaAndroid

export const profileScreen =
  platform === 'ios' ? ProfileIOS : ProfileAndroid