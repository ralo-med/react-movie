import "styled-components";
import { theme } from "./theme";

declare module "styled-components" {
  export interface DefaultTheme {
    red: typeof theme.red;
    black: typeof theme.black;
    white: typeof theme.white;
  }
}
