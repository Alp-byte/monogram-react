const requestIp = require('request-ip');
const Monogram = require('../../models/Monogram');
const Tag = require('../../models/Tag');
const User = require('../../models/User');
const utils = require('../../utils');
const request = require('request');
const WebClient = require('@slack/web-api').WebClient;

const createOrUpdateTags = tagsNameArray => {
  const promises = tagsNameArray.map(async tagName => {
    const tagAlreadyExist = await Tag.findOne({ name: tagName }).exec();

    if (tagAlreadyExist) {
      const updatedTag = await Tag.findOneAndUpdate(
        { name: tagName },
        { $inc: { useQuantity: 1 } },
        { new: true }
      ).exec();
      return updatedTag._id;
    } else {
      const createdTag = await new Tag({ name: tagName });
      await createdTag.save();

      return createdTag._id;
    }
  });
  return Promise.all(promises);
};
const GalleryController = {};
GalleryController.saveMonogram = async (req, res) => {
  // Validate incoming data, Validate AUTH
  const monogramData = req.body.monogram;
  // Search for Tags -- create new document if it's new tag or add 1 to useQuantity if tag already exist ---- get tag id's
  const tags = await createOrUpdateTags(monogramData.tags);

  try {
    // Create Monogram instance -- replace tag names with tag Id's, generate nanoid monogramId, generate slug

    let monogram;

    monogramData.previewImage = Buffer(monogramData.previewImage, 'base64');
    try {
      monogram = await new Monogram({
        ...monogramData,
        monogramId: utils.generateId(),
        tags,
        slug: utils.generateSlug(monogramData.title),
        creator: req.user._id,
        privacy: monogramData.shareToPublic ? 'public' : 'private'
      });
      // Save Monogram in DB
      await monogram.save();
    } catch (error) {
      console.log(error);
    }

    res.status(200).json({
      success: true,
      monogramUrl: `${monogram.monogramId}/${monogram.slug}`,
      monogram
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

GalleryController.getPublicMonograms = async (req, res) => {
  let skip = 0;
  let sort = { upvotesLength: -1 };
  let limit = 10;
  let byUser = [];
  const filters = {
    privacy: 'public',
    title: { $regex: req.query.search || '', $options: '-i' }
  };

  if (parseFloat(req.query.skip)) {
    skip = parseFloat(req.query.skip);
  }

  if (parseFloat(req.query.limit)) {
    limit = parseFloat(req.query.limit);
  }
  if (parseFloat(req.query.sort) === 2) {
    sort = {
      creationDate: -1
    };
  }

  if (parseFloat(req.query.sort) === 1) {
    sort = { upvotesLength: -1 };
  }

  if (req.query.tag && req.query.tag !== 'undefined') {
    try {
      const tagByName = await Tag.findOne({
        name: req.query.tag
      }).exec();
      filters['tags'] = tagByName && tagByName._id;
    } catch (err) {
      res.json({ monograms: [], byUser: {} });
    }
  }

  if (req.query.user && req.query.user !== 'undefined') {
    try {
      byUser = await User.aggregate([
        {
          $match: {
            userId: req.query.user
          }
        },

        {
          $project: {
            _id: 1,
            name: 1
          }
        }
      ]).exec();

      filters['creator'] = byUser[0] && byUser[0]._id;
    } catch (err) {
      res.json({ monograms: [], byUser: {} });
    }
  }

  try {
    const monograms = await Monogram.aggregate([
      {
        $match: filters
      },

      {
        $addFields: {
          upvotesLength: {
            $size: '$upvotes'
          },
          order: {
            $cond: {
              if: { $eq: ['$isTopRated', true] },
              then: 1,
              else: 0
            }
          }
        }
      },
      { $sort: { ...sort, order: -1, _id: -1 } },
      { $skip: parseFloat(skip) },
      { $limit: parseFloat(limit) }
    ]).exec();

    res.json({ monograms, byUser: byUser[0] || {} });
  } catch (err) {
    res.json({ monograms: [], byUser: {} });
  }
};

GalleryController.getUserMonograms = async (req, res) => {
  let skip = 0;
  let limit = 10;

  if (parseFloat(req.query.skip)) {
    skip = parseFloat(req.query.skip);
  }

  if (parseFloat(req.query.limit)) {
    limit = parseFloat(req.query.limit);
  }

  const userMonograms = await Monogram.find({
    creator: req.user._id
  })
    .sort({
      creationDate: -1
    })
    .limit(parseFloat(limit))
    .skip(parseFloat(skip))
    .exec();
  const promises = userMonograms.map(async monogram => {
    let jsonMonogram = await monogram.toObject();
    const base64data = await Buffer.from(
      monogram.previewImage,
      'binary'
    ).toString('base64');

    return {
      ...jsonMonogram,
      previewImage: base64data
    };
  });

  const monograms = await Promise.all(promises);

  res.json({ monograms });
};

GalleryController.getMonogram = async (req, res) => {
  const id = req.params.id;
  if (id) {
    const monogram = await Monogram.findOne({
      monogramId: id
    })
      .populate('creator')
      .populate('tags')
      .exec();

    if (monogram) {
      const base64data = await Buffer.from(
        monogram.previewImage,
        'binary'
      ).toString('base64');
      if (monogram.privacy === 'private') {
        // CHECK AUTHOR
        if (req.user && req.user.userId === monogram.creator.userId) {
          res.json({
            monogram: { ...monogram.toJSON(), previewImage: base64data }
          });
        } else {
          res.status(403).json({
            error: {
              message: 'Not Found'
            }
          });
        }
      } else {
        res.json({
          monogram: { ...monogram.toJSON(), previewImage: base64data }
        });
      }
    } else {
      res.status(403).json({
        error: {
          message: 'Not Found'
        }
      });
    }
  }
};

GalleryController.deleteMonogram = async (req, res) => {
  const id = req.params.id;
  if (id) {
    const monogram = await Monogram.findOne({
      monogramId: id
    })
      .populate('creator')

      .exec();

    if (monogram && req.user && req.user.userId === monogram.creator.userId) {
      return monogram.remove(err => {
        return res.status(200).json({
          success: true,
          monogramId: id
        });
      });
    } else {
      res.status(404).send('Not Found');
    }
  } else {
    res.status(404).send('Not Found');
  }
};

GalleryController.performUpvoteOnMonogram = async (req, res) => {
  const id = req.params.id;

  if (id) {
    const monogram = await Monogram.findOne({
      monogramId: id
    });

    if (monogram) {
      const topMonograms = await Monogram.aggregate([
        {
          $addFields: {
            upvotesLength: {
              $size: '$upvotes'
            }
          }
        },
        {
          $project: {
            _id: 1,
            upvotesLength: 1,
            isTopRated: 1
          }
        },
        { $sort: { upvotesLength: -1, creationDate: -1 } },
        { $limit: 3 }
      ]).exec();

      let monogramUpvotes = monogram.toObject().upvotes;

      const userIP = requestIp.getClientIp(req);

      const alreadyLiked = monogramUpvotes.filter(
        m => String(m.ip) === String(userIP)
      );
      const rating =
        (topMonograms.length &&
          Math.min(...topMonograms.map(m => m.upvotesLength))) ||
        0;

      if (!alreadyLiked.length) {
        monogram.upvotes.push({
          ip: userIP
        });

        if (!monogram.isTopRated && rating <= monogram.upvotes.length) {
          const allIsTop = topMonograms.every(m => m.isTopRated);
          if (!allIsTop || rating < monogram.upvotes.length) {
            monogram.isTopRated = true;

            if (allIsTop) {
              const removeTop = await Monogram.aggregate([
                {
                  $addFields: {
                    upvotesLength: {
                      $size: '$upvotes'
                    }
                  }
                },

                {
                  $match: { isTopRated: true, upvotesLength: { $lte: rating } }
                },
                { $limit: 1 }
              ]).exec();

              if (!!removeTop.length) {
                await Monogram.updateOne(
                  { _id: removeTop[0]._id },
                  { isTopRated: false }
                ).exec();
              }
            }
          }
        }

        monogram.save();
        res.status(200).json({
          monogramId: monogram._id,
          monogramUpvotes: monogram.upvotes
        });
      } else {
        const clearLikeArray = monogramUpvotes.filter(
          m => String(m.ip) !== String(userIP)
        );
        monogram.upvotes = clearLikeArray;
        if (monogram.isTopRated && rating > monogram.upvotes.length) {
          const addTop = await Monogram.aggregate([
            {
              $addFields: {
                upvotesLength: {
                  $size: '$upvotes'
                }
              }
            },

            { $match: { isTopRated: false, upvotesLength: { $gte: rating } } },
            // {
            //   $project: {
            //     _id: 1
            //   }
            // },
            { $sort: { creationDate: -1 } },
            { $limit: 1 }
          ]).exec();

          if (
            !!addTop.length &&
            addTop[0].upvotesLength > monogram.upvotes.length
          ) {
            monogram.isTopRated = false;

            await Monogram.updateOne(
              { _id: addTop[0]._id },
              { isTopRated: true }
            ).exec();
          }
        }
        monogram.save();
        res.status(200).json({
          monogramId: monogram._id,
          monogramUpvotes: monogram.upvotes
        });
      }
    } else {
      res.status(403).json({
        error: {
          message: 'Not Found'
        }
      });
    }
  }
};

GalleryController.changeMonogramStatus = async (req, res) => {
  const id = req.params.id;

  if (id) {
    const monogram = await Monogram.findOne({
      monogramId: id
    }).populate('creator');

    if (monogram && req.user && req.user.userId === monogram.creator.userId) {
      monogram.privacy = monogram.privacy === 'public' ? 'private' : 'public';
      monogram.save();
      res.status(200).json({
        monogramId: monogram._id,
        monogramPrivacy: monogram.privacy
      });
    } else {
      res.status(403).json({
        error: {
          message: 'Not Found'
        }
      });
    }
  }
};
GalleryController.getTopTags = async (req, res) => {
  try {
    const tags = await Tag.find()
      .sort({ useQuantity: -1 })
      .limit(15)
      .exec();
    res.json({ tags });
  } catch (error) {
    res.end();
  }
};
function sendMessageToSlackResponseURL(responseURL, JSONmessage) {
  var postOptions = {
    uri: responseURL,
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    json: JSONmessage
  };
  request(postOptions, (error, response, body) => {
    if (error) {
      // handle errors as you see fit
    }
  });
}
GalleryController.slackResponse = async (req, res) => {
  res.status(200).end(); // best practice to respond with 200 status

  if (req.headers['x-slack-signature']) {
    const actionJSONPayload = JSON.parse(req.body.payload);

    // parse URL-encoded payload JSON string
    const value = JSON.parse(actionJSONPayload.actions[0].value);
    Monogram.deleteOne({
      monogramId: value.id
    }).exec();

    const message = {
      text: `*${value.title}* Monogram Has Been Deleted From Application.`,
      replace_original: true
    };
    sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
  }
};

GalleryController.monogramReport = async (req, res) => {
  const id = req.params.id;

  if (id) {
    const monogram = await Monogram.findOne({
      monogramId: id
    })
      .populate('creator')
      .exec();

    if (monogram) {
      // Production key 'xoxp-24471169923-446126701633-735277427889-ed6a1da5b5b5e3725b5d11096ef615d2'
      const web = new WebClient(
        'xoxp-24471169923-446126701633-735277427889-ed6a1da5b5b5e3725b5d11096ef615d2'
      );
      (async () => {
        // Use the `auth.test` method to find information about the installing user
        const res = await web.auth.test();

        // Find your user id to know where to send messages to
        const userId = res.user_id;

        // Use the `chat.postMessage` method to send a message from this app
        const message = await web.chat.postMessage({
          channel: userId,
          text: `${
            req.hostname === 'mmaker-staging.herokuapp.com'
              ? '[FROM STAGING]'
              : ''
          }Report was made for monogram
          *Title*: \`${monogram.title}\`,
          *Description*: \`${monogram.description ||
            'No Description Provided'}\`,
          *Creator Email*: \`${monogram.creator.email}\`,
          *Creator Name*: \`${monogram.creator.name}\`,
          *Upvotes*: \`${monogram.upvotes.length}\`,
          *Created*: \`${monogram.creationDate}\`,
          
          `,
          attachments: [
            {
              text: 'Choose what to do',
              fallback: 'You are unable to choose',
              callback_id: 'monogram_report',
              color: '#3AA3E3',
              attachment_type: 'default',
              actions: [
                {
                  type: 'button',
                  text: 'Open It',
                  url: `${req.protocol}://${req.hostname}${
                    process.env.NODE_ENV === 'development' ? ':3000' : ''
                  }/g/${id}/${monogram.slug}`
                },

                {
                  name: 'delete',
                  text: 'Delete It',
                  style: 'danger',
                  type: 'button',
                  value: JSON.stringify({
                    id,
                    title: monogram.title,
                    description: monogram.description,
                    creator: monogram.creator
                  }),
                  confirm: {
                    title: 'Are you sure?',
                    text:
                      'This actions will delete this monogram from application',
                    ok_text: 'Yes',
                    dismiss_text: 'No'
                  }
                }
              ]
            }
          ]
        });
        await web.files.upload({
          channels: userId,
          title: 'Image',
          file: monogram.previewImage,
          filename: 'image.png',
          filetype: 'auto',
          thread_ts: message.ts,
          initial_comment: 'PREVIEW:'
        });
      })();
    }
    res.status(200).end();
  }
  res.status(404).end();
};

GalleryController.handleUpvote = async (req, res) => {};
module.exports = GalleryController;
