/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'orange-primary': '#FF662A',  // FAB, aba ativa, ActivityIndicator base
        'orange':         '#FF8C3A',  // botões, card resumo 1, ActivityIndicator padrão
        'orange-light':   '#FCA53A',  // card resumo 2
      },
    },
  },
  plugins: [],
}
