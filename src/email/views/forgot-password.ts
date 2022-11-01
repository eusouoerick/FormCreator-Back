export const EmailForgotPassword = (name: string, token: string) => {
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
        td,
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

        .capitalize{
          text-transform: capitalize;
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
      </style>
    </head>

    <body>
      <div class="container">
        <div class="header">
          <p class="logo">LOGO</p>
        </div>
        <div class="content">
          <h2 style="font-size: 22px; ">Hi, <span class='capitalize'>${name}</span></h2>
          <p style="font-size: 18px;">
            We received a request to reset the password for the account associated with this email
            address. Click the link below to reset your password:
          </p>
        </div>
        <a href="${
          process.env.CLIENT_URL + '/auth/change-password?token=' + token
        }" class="btn">Change Password</a>
      </div>
    </body>
    </html>
  `;
};
