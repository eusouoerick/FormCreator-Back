import { TypesNewAnswer } from '../dto';

export const EmailNewAnswer = ({ from, to, form }: TypesNewAnswer) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <meta name="x-apple-disable-message-reformatting">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
      <title>Email</title>

      <style>
        body {
          margin: 0;
          padding: 0;
        }

        table,
        td,B
        div,
        h1,
        p {
          font-family: 'Roboto', sans-serif;
        }

        h1 {
          font-size: 28px;
        }

        .container {
          width: 100%;
          max-width: 600px;
          border-collapse: collapse;
          border: none;
          border-spacing: 0;
          background: #ffffff;
          max-width: 600px;
          margin: 0 auto;
        }

        .header {
          padding: 10px;
          border-bottom: solid 1px #80808030
        }

        .logo {
          display: block;
          margin: 0 auto;
          width: max-content;
          font-weight: 700;
          font-size: 24px;
          line-height: 31px;
          letter-spacing: 0.105em;
          color: #632FF5;
        }

        .capitalize{
          text-transform: capitalize;
        }

        .content {
          padding: 20px 10px 0px;
        }

        .btn {
          display: block;
          width: max-content;
          margin: 30px auto 0;
          font-size: 14px;
          padding: 8px 10px;
          background: #632FF5;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
          box-shadow: 0px 3px 10px #b5b5b5;
        }

        .title {
          font-size: 22px;
        }

        .form {
          width: 80%;
          margin: 0 auto;
          background-color: #f0f0f0;
          padding: 10px 15px;
          border-radius: 5px;
        }

        .form .title {
          margin: 0;
          font-size: 16px;
        }

        .form .desc {
          color: #303030;
          font-size: 16px;
        }

        .footer {
          text-align: center;
          margin-top: 100px;
          box-sizing: border-box;
          padding: 10px 20px;
          height: 60px;
        }

        .footer p {
          font-size: 15px;
        }

        .footer a {
          color: #632FF5;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <p class="logo">LOGO</p>
        </div>
        <div class="content">
          <h2 style="font-size: 22px; ">Hi, <span class='capitalize'>${
            to.name
          }</span></h2>
          <p style="font-size: 18px;"><span class='capitalize'>${from}</span> replied to your form:</p>
        </div>
        <div class="form">
          <p class="title">${form.title}</p>
        </div>
        <a href="${
          process.env.CLIENT_URL + '/forms/' + form.hash + '/answers'
        }" class="btn">
          See answers
        </a>
        <div class="footer">
          <p>If you prefer not to receive emails, 
            <a href="${process.env.CLIENT_URL + '/dashboard/edit-user'}">
              unsubscribe here.
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
