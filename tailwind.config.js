/** @type {import('tailwindcss').Config} */

module.exports = {
  plugins: [require('daisyui')],
  theme: {
    extend: {
      colors: {
        primary: '#FF6A13',
        'primary-hover': '#FF6A13',
        secondary: '#002B49',
        third: '#001A2C'
      },
      fontFamily: {
        anakotmai: ['Anakotmai', 'sans-serif'],
      },
    }
  },
  daisyui: {
    base: true,
    themes: [
      {
        mytheme: {
          "primary": "#FF6A13",
          "secondary": "#002B49",
          "third": "#001A2C",
          "accent": "#37cdbe",
          "neutral": "#3d4451",
          "base-100": "#ffffff",
          "base-200": "#f9f9f9", // เพิ่มสีพื้นหลังสำหรับโหมด light
          "base-300": "#e0e0e0", // เพิ่มสีพื้นหลังสำหรับโหมด light
        },
      },
    ]
    
  },
};
