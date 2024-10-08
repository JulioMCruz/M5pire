import { NextRequest, NextResponse } from 'next/server';
import { Telegraf } from 'telegraf'; // Import session from telegraf

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token
const bot = new Telegraf(process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN as string);
const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

// Define messages in JSON objects
const messages = {
  en: {
    welcome: 'Welcome to M5pire! . -- SLOGAN HERE -- \nPlease select an option:',
    m5pire_option_01: 'Learn About M5pire Option 1',
    m5pire_option_02: 'Learn About M5pire Option 2',
    m5pire_app: 'M5pire App',
  },
};

const imagePath = `${baseUrl}/images/M5pire.png`;
const replyMarkup = {
    inline_keyboard: [
        [{ text: messages.en.m5pire_app, callback_data: 'm5pire_app', url: process.env.NEXT_PUBLIC_TELEGRAM_APP_URL as string }],
        [{ text: messages.en.m5pire_option_01, callback_data: 'm5pire_option_01' }],
        [{ text: messages.en.m5pire_option_02, callback_data: 'm5pire_option_02' }],
    ],
};

// Handle '/start' command (initial interaction)
bot.start((ctx) => {
 
    ctx.replyWithPhoto(imagePath, {
        caption: messages.en.welcome,
        reply_markup: replyMarkup,
    });

});

// Handle callback queries
bot.on('callback_query', async (ctx) => {
  const callbackData = ctx.callbackQuery.data;
  //const userId = ctx.from.id;

  console.log(callbackData);

if (callbackData === 'm5pire_option_01') {
    await ctx.reply('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer aliquam aliquam justo quis pulvinar. Quisque interdum turpis sit amet condimentum sagittis. Nulla non nisi nec tortor tristique iaculis. Nullam dapibus nisl neque, ac placerat lorem tempus sit amet. Cras ac enim leo. In sit amet auctor dui, eu laoreet ante');
} else if (callbackData === 'm5pire_option_02') {
    await ctx.reply('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer aliquam aliquam justo quis pulvinar. Quisque interdum turpis sit amet condimentum sagittis. Nulla non nisi nec tortor tristique iaculis. Nullam dapibus nisl neque, ac placerat lorem tempus sit amet. Cras ac enim leo. In sit amet auctor dui, eu laoreet ante');
}
  // ... (Handle other callback queries)

  ctx.reply("\n");
  ctx.reply(messages.en.welcome, {
    reply_markup: replyMarkup,
  });

});

// Handle generic text messages
//bot.on('text', async (ctx) => {
  // const userMessage = ctx.message.text;
//});

// Handle other commands or messages
// ... (Implement logic to process user input, generate recommendations, etc.)
// Handle messages (integrate OpenAI)

export async function POST(request: NextRequest) {
  try {
    // Parse incoming webhook request from Telegram
    const body = await request.json();

    // Pass the update to Telegraf for processing
    await bot.handleUpdate(body);

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Error handling Telegram webhook:', error);
    return new NextResponse('Error', { status: 500 });
  }
}