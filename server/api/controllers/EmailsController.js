const Email = require('../../models/Email');
const EmailsController = {};

EmailsController.saveEmail = (req, res) => {
  const email = req.body.email;
  if (!!email) {
    Email.findOneAndUpdate(
      {
        email: email
      },
      {
        $inc: {
          downloadCount: 1
        }
      },
      function(err, response) {
        if (err || !response) {
          const emailInstance = new Email({
            email: email
          });
          emailInstance.save();
          res.end();
        } else {
          res.end();
        }
      }
    );
  }
};

module.exports = EmailsController;
