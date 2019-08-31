const generate = require('nanoid/generate');

const fs = require('fs');
const slug = require('slug');
const handlebars = require('handlebars');
const juice = require('juice');
module.exports.generateId = () =>
  generate(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    10
  );

module.exports.generateToken = () =>
  generate(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    50
  );
module.exports.generateSlug = str => slug(str);

const nodeMailer = require('nodemailer');
const getPrivateFile = p =>
  fs.readFileSync(`${process.cwd()}/server/${p}`, 'utf8');
const templateToText = (handlebarsMarkup, context) => {
  if (handlebarsMarkup && context) {
    const template = handlebars.compile(handlebarsMarkup);
    return template(context);
  }

  throw new Error(
    'Please pass Handlebars markup to compile and a context object with data mapping to the Handlebars expressions used in your template.'
  );
};
const templateToHTML = (handlebarsMarkup, context, options) => {
  if (handlebarsMarkup && context) {
    const template = handlebars.compile(handlebarsMarkup);
    const content = template(context);

    if (options && options.noBaseTemplate) {
      // Use juice to inline CSS <style></style> styles from <head> unless disabled.
      return options && !options.inlineCss ? content : juice(content);
    }

    const layout = handlebars.compile(
      getPrivateFile('emailTemplates/layout.html')
    );

    const layoutContext = {
      ...context,
      content
    };

    return options && !options.inlineCss
      ? layout(layoutContext)
      : juice(layout(layoutContext));
  }

  throw new Error(
    ' Please pass Handlebars markup to compile and a context object with data mapping to the Handlebars expressions used in your template (e.g., {{expressionToReplace}}).'
  );
};

/*
    USAGE GUIDE:
    sendEmail({
        to: emailAddress, ------ EMAIL ADRESS RECIPIENT
        from: supportEmail, ------ SENDER ADRESS NODEMAILER API GOWORIT EXAMPLE - "Krunal Lathiya" <xx@gmail.com>
        subject: `[MONOGRAM-MAKER] Welcome, ${name}!`,
        template: 'verification',
        templateVars: {
            title: `Account verification!`,
            name: req.user.name,
            email: req.user.email,
            verifyUrl: ......
        },
  })
*/

const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'monogrammaker.info@gmail.com',
    pass: 'mmaker-admin'
  }
});

const sendEmail = (options, { resolve, reject }) => {
  try {
    transporter.sendMail(options, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log(info);
      return resolve();
    });
  } catch (exception) {
    reject(exception);
  }
};

module.exports.sendEmail = ({
  text,
  html,
  template,
  templateVars,
  ...rest
}) => {
  if (text || html || template) {
    return new Promise((resolve, reject) => {
      sendEmail(
        {
          ...rest,
          text: template
            ? templateToText(
                getPrivateFile(`emailTemplates/${template}.txt`),
                templateVars || {}
              )
            : text,
          html: template
            ? templateToHTML(
                getPrivateFile(`emailTemplates/${template}.html`),
                templateVars || {}
              )
            : html
        },
        { resolve, reject }
      );
    });
  }
  throw new Error(
    "Please pass an HTML string, text, or template name to compile for your message's body."
  );
};
