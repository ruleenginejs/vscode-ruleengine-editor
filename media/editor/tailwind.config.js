module.exports = {
  purge: false,
  darkMode: false,
  theme: {
    extend: {
      spacing: {
        "5sp": "0.3125rem",
        "13sp": "0.8125rem"
      },
      fontSize: {
        "13sp": ['0.8125rem', { lineHeight: '1.1375rem' }]
      },
      fontFamily: {
        vscode: "var(--vscode-font-family)"
      }
    }
  },
  variants: {},
  plugins: []
}
