import 'styled-components'
import type { makeTheme } from './theme'

declare module 'styled-components' {
  export interface DefaultTheme extends ReturnType<typeof makeTheme> {}
}
