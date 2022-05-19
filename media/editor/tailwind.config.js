module.exports = {
  content: ['./views/**/*.vue'],
  theme: {
    extend: {
      colors: {
        'text-link-foreground': 'var(--vscode-textLink-foreground)',
        'editor-hint-foreground': 'var(--editor-hint-foreground)'
      },
      spacing: {
        '5sp': '0.3125rem',
        '10sp': '0.625rem',
        '13sp': '0.8125rem'
      },
      fontSize: {
        '13sp': ['0.8125rem', { lineHeight: '1.1375rem' }]
      },
      fontFamily: {
        vscode: 'var(--vscode-font-family)'
      }
    }
  },
  plugins: []
};
