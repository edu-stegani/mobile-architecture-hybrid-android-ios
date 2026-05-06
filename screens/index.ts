import LoginAndroid from './android/login.screen.js'
import HomeAndroid from './android/home.screen.js'
import ReceitaAndroid from './android/receitas.screen.js'
import ProfileAndroid from './android/profile.screen.js'
import BenefitAndroid from './android/benefits.screen.js'
import ReembolsoAndroid from './android/reembolso.screen.js'

import LoginIOS from './ios/login.screen.js'
import HomeIOS from './ios/home.screen.js'
import ReceitaIOS from './ios/receitas.screen.js'
import ProfileIOS from './ios/profile.screen.js'
import BenefitIOS from './ios/benefits.screen.js'
import ReembolsoIOS from './ios/reembolso.screen.js'

const platform = process.env.PLATFORM

export const loginScreen =
  platform === 'ios' ? LoginIOS : LoginAndroid

export const homeScreen =
  platform === 'ios' ? HomeIOS : HomeAndroid

export const receitaScreen =
  platform === 'ios' ? ReceitaIOS : ReceitaAndroid

export const profileScreen =
  platform === 'ios' ? ProfileIOS : ProfileAndroid

export const benefitsScreen =
  platform === 'ios' ? BenefitIOS : BenefitAndroid

export const reembolsoScreen =
  platform === 'ios' ? ReembolsoIOS : ReembolsoAndroid