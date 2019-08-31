const fs = require('fs');
const Font = require('./models/Font');
const Frame = require('./models/Frame');
const mongoose = require('mongoose');
mongoose.connect(
  'mongodb+srv://admin:monogrampass@cluster0-2rxtt.mongodb.net/test?retryWrites=true'
);
mongoose.Promise = global.Promise;
const VIEWBOX_FRAMES_ID = [
  1,
  2,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  14,
  15,
  16,
  17,
  18,
  33,
  64,
  66,
  71,
  72,
  75,
  76,
  77,
  78,
  79,
  81,
  84,
  85,
  87,
  88,
  91,
  93,
  94,
  104,
  105,
  106,
  107,
  108,
  115,
  116,
  122,
  123,
  124,
  125,
  126,
  127,
  131,
  134,
  135,
  137,
  140,
  142,
  146,
  148,
  152,
  161,
  163,
  164,
  165,
  167,
  175,
  183,
  186,
  187,
  188,
  189,
  190,
  192
  //193
  // 197
  //199,
  //200
];
const seedFramesAndFonts = (req, res) => {
  const default_fonts = [
    { font_id: 1, font_family: 'ArtDecograms-Regular' },
    { font_id: 2, font_family: 'ArtMono-Regular' },
    { font_id: 3, font_family: 'Aunigramia-Regular' },
    { font_id: 4, font_family: 'AvenueMonograms-Regular' },
    { font_id: 5, font_family: 'Monograms-Regular' },
    { font_id: 6, font_family: 'Duograms-Regular' },
    { font_id: 7, font_family: 'FMMonograms-Regular' },
    { font_id: 8, font_family: 'InitialsD-Regular' },
    { font_id: 9, font_family: 'JasmineMonograms-Regular' },
    { font_id: 10, font_family: 'Marionograms-Regular' },
    { font_id: 11, font_family: 'Monogramia3-Regular' },
    { font_id: 12, font_family: 'Monogramia4-Regular' },
    { font_id: 13, font_family: 'SelinaMonograms-Regular' },
    { font_id: 14, font_family: 'STDMonograms-Regular' },
    { font_id: 15, font_family: 'Triograms-Regular' },
    { font_id: 16, font_family: 'WeLoveMonograms-Regular' },
    { font_id: 17, font_family: 'YAMMonograms-Regular' },
    { font_id: 18, font_family: 'Monogramia-Regular' },
    { font_id: 19, font_family: 'Monogramia2-Regular' }
  ];
  for (let index = 0; index < default_fonts.length; index++) {
    const element = default_fonts[index];
    new Font(element).save();
  }

  fs.readdirSync('../src/assets/frames').forEach(file => {
    new Frame({
      name: file.split('.')[0],
      hasViewBox: VIEWBOX_FRAMES_ID.includes(file.split('.')[0])
    }).save();
  });
};

seedFramesAndFonts();
