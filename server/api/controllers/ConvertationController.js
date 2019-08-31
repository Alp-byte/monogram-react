const http = require('http');
const FormData = require('form-data');
const axios = require('axios');
const Frame = require('../../models/Frame');
const Font = require('../../models/Font');
const ConvertationController = {};

ConvertationController.svgToEps = (req, res) => {
  const form = new FormData();
  form.append('file', req.file.buffer, {
    filepath: req.file.originalname
  });
  axios
    .post('http://192.241.143.162/svgToEps', form, {
      headers: form.getHeaders()
    })
    .then(response => {
      http.get(response.data.url, function(resp) {
        resp.pipe(res);
      });
    })
    .catch(err => {
      res.send(400, { error: 'Saving failed!' });
    });
};
ConvertationController.svgToDxf = (req, res) => {
  const form = new FormData();
  form.append('file', req.file.buffer, {
    filepath: req.file.originalname
  });
  axios
    .post('http://192.241.143.162/svgToDxf', form, {
      headers: form.getHeaders()
    })
    .then(response => {
      http.get(response.data.url, function(resp) {
        resp.pipe(res);
      });
    })
    .catch(err => {
      res.send(400, { error: 'Saving failed!' });
    });
};

ConvertationController.updateAssets = async (req, res) => {
  const layers = req.body;

  if (!layers || !layers.length) return res.status(404).send('Empty List');
  let frame_list = [];
  let font_list = [];
  for (let index = 0; index < layers.length; index++) {
    const element = layers[index];
    if (element.target === 'frame') {
      frame_list.push(element.frame._id);
    }
    if (element.target === 'text') {
      font_list.push(element.font._id);
    }
  }

  if (!!frame_list.length) {
    await Frame.updateMany(
      { _id: { $in: frame_list } },
      {
        $inc: {
          useQuantity: 1
        }
      }
    ).exec();
  }
  if (!!font_list.length) {
    await Font.updateMany(
      { _id: { $in: font_list } },
      {
        $inc: {
          useQuantity: 1
        }
      }
    ).exec();
  }

  res.status(200).send('Success');
};
module.exports = ConvertationController;
