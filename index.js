const { Client, IntentsBitField } = require('discord.js');
const cron = require('node-cron');
const keepAlive = require("./server");
const { BitlyClient } = require('bitly');
require('dotenv').config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

const bitly = new BitlyClient(process.env.BITLY_ACCESS_TOKEN);

client.once('ready', async () => {
  console.log('Bot is ready!');

  try {
    const longUrl = 'https://act.hoyolab.com/bbs/event/signin/hkrpg/index.html?act_id=e202303301540311&hyl_auth_required=true&hyl_presentation_style=fullscreen&utm_source=launcher&utm_medium=banner&utm_id=6';
    const shortUrl = await bitly.shorten(longUrl);

    const embed = {
      color: 0x0099ff,
      title: 'Attention everyone!',
      description: 'Remember, consistent logins can lead to amazing rewards! So do not miss out on this opportunity and login now.',
      image: {
        url: 'https://upload-os-bbs.hoyolab.com/upload/2023/04/26/12c3c9e763465ea70330d6bc0891a300_829334094349192999.jpg?x-oss-process=image/resize,s_1000/quality,q_80/auto-orient,0/interlace,1/format,jpg',
      },
      fields: [
        {
          name: 'Event Link',
          value: shortUrl.link,
        },
      ],
    };

    cron.schedule('0 0,12 * * *', () => {
      const channel = client.channels.cache.get(process.env.CHANNEL_ID);
      channel.send(embed)
        .then(() => console.log('Message sent!'))
        .catch((error) =>
          console.error(`Error sending message: ${error.message}`)
        );
    });
  } catch (error) {
    console.error(`Error setting up scheduled message: ${error.message}`);
  }
});

keepAlive();
client.login(process.env.TOKEN);
