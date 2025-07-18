import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    background-color: ${({ theme }) => theme.black.veryDark};
    color: ${({ theme }) => theme.white.lighter};
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    margin-bottom: 1rem;
  }

  a {
    color: ${({ theme }) => theme.white.lighter};
    text-decoration: none;
    
    &:hover {
      color: ${({ theme }) => theme.red};
    }
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
  }
`;
