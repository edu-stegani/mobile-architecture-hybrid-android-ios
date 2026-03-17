import LoginAndroid from './android/login.screen.js'
import DashboardAndroid from './android/dashboard.screen.js'
import ReceitaAndroid from './android/receitas.screen.js'

import LoginIOS from './ios/login.screen.js'
import DashboardIOS from './ios/dashboard.screen.js'
import ReceitaIOS from './ios/receitas.screen.js'

const platform = process.env.PLATFORM

export const loginScreen =
  platform === 'ios' ? LoginIOS : LoginAndroid

export const dashboardScreen =
  platform === 'ios' ? DashboardIOS : DashboardAndroid

export const receitaScreen =
  platform === 'ios' ? ReceitaIOS : ReceitaAndroid