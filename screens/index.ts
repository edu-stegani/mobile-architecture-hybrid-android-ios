import LoginAndroid from './android/login.screen.js'
import HomeAndroid from './android/home.screen.js'
import ReceitaAndroid from './android/receitas.screen.js'
import ProfileAndroid from './android/profile.screen.js'
<<<<<<< HEAD
import BenefitAndroid from './android/benefits.screen.js'
import ReembolsoAndroid from './android/reembolso.screen.js'
import ProdutosAndroid from './android/products.screen.js'
import CardAndroid from './android/card.screen.js'
import ExtratoAndroid from './android/extrato.screen.js'
import RedeCredenciadaAndroid from './android/redeCredenciada.screen.js'
=======
>>>>>>> ce270225ab302744831f1e85ab4a8e3988109e0f

import LoginIOS from './ios/login.screen.js'
import HomeIOS from './ios/home.screen.js'
import ReceitaIOS from './ios/receitas.screen.js'
import ProfileIOS from './ios/profile.screen.js'
<<<<<<< HEAD
import BenefitIOS from './ios/benefits.screen.js'
import ReembolsoIOS from './ios/reembolso.screen.js'
import ProdutosIOS from './ios/products.screen.js'
import CardIOS from './ios/card.screen.js'
import ExtratoIOS from './ios/extrato.screen.js'
import RedeCredenciadaIOS from './ios/redeCredenciada.screen.js'
=======
>>>>>>> ce270225ab302744831f1e85ab4a8e3988109e0f

const platform = process.env.PLATFORM

export const loginScreen =
  platform === 'ios' ? LoginIOS : LoginAndroid

export const homeScreen =
  platform === 'ios' ? HomeIOS : HomeAndroid

export const receitaScreen =
  platform === 'ios' ? ReceitaIOS : ReceitaAndroid

export const profileScreen =
<<<<<<< HEAD
  platform === 'ios' ? ProfileIOS : ProfileAndroid

export const benefitsScreen =
  platform === 'ios' ? BenefitIOS : BenefitAndroid

export const reembolsoScreen =
  platform === 'ios' ? ReembolsoIOS : ReembolsoAndroid

export const produtosScreen =
  platform === 'ios' ? ProdutosIOS : ProdutosAndroid

export const cardScreen =
  platform === 'ios' ? CardIOS : CardAndroid

export const extratoScreen =
  platform === 'ios' ? ExtratoIOS : ExtratoAndroid

export const redeCredenciadaScreen =
  platform === 'ios' ? RedeCredenciadaIOS : RedeCredenciadaAndroid
=======
  platform === 'ios' ? ProfileIOS : ProfileAndroid
>>>>>>> ce270225ab302744831f1e85ab4a8e3988109e0f
