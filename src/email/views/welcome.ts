export const EmailWelcome = (name: string) => {
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

      .logo {
        font-weight: 700;
        font-size: 24px;
        line-height: 31px;
        letter-spacing: 0.105em;
        color: #632FF5;
        margin: 0;
      }

      .capitalize{
        text-transform: capitalize;
      }

      .content {
        text-align: center;
        padding: 20px 10px;
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

      .next {
        width: 80%;
        margin: 0 auto;
      }

      .next .title {
        font-size: 18px;
        font-weight: bold;
      }

      .next .desc {
        color: #303030;
        font-size: 16px;
      }

      .footer {
        margin-top: 20px;
        box-sizing: border-box;
        padding: 10px 20px;
        background: #80808030;
        height: 60px;
      }

      .footer p {
        font-size: 15px;
      }

      .footer a {
        color: black;
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
        <h1>Hi, <span class='capitalize'>${name}</span></h1>
        <p style="font-size: 18px;">We're thrilled to see you here! 🎉</p>
        <a href="${
          process.env.CLIENT_URL + '/dashboard'
        }" class="btn" style="color: #fff;">Get Started Now</a>
      </div>
      <div class="content">
        <p class="title">Next steps:</p>
        <div class="next" style="text-align: left;">
          <div style="margin-bottom: 20px;">
            <p class="title">Build</p>
            <p class="desc">
              Create custom forms for surveys and questionnaires at no additional cost.
            </p>
          </div>
          <div style="margin-bottom: 20px;">
            <p class="title">Share</p>
            <p class="desc">
              It's easy to share forms with specific people or a wider audience by sharing them via Email, Facebook,
              Twitter, Telegram, Reddit and other options.
            </p>
          </div>
          <div style="margin-bottom: 20px;">
            <p class="title">Analyze the answers</p>
            <p class="desc">
              See all responses received and correct them.
            </p>
          </div>
        </div>
      </div>
      <div class="footer">
      </div>
    </div>
  </body>

  </html>
`;
};
