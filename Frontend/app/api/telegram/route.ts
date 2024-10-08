import { NextRequest, NextResponse } from 'next/server';
import { Telegraf } from 'telegraf'; // Import session from telegraf

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token
const bot = new Telegraf(process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN as string);
const baseUrl = process.env.NEXT_PUBLIC_APP_URL;


// Question	Answer
// What is this rental platform about?	This platform allows users to rent personal items from each other using blockchain technology for secure transactions.
// How does blockchain technology enhance security?	Blockchain ensures all transactions are recorded and immutable, which reduces the risk of fraud.
// What cryptocurrencies are accepted for payments?	We accept Bitcoin (BTC) and XRP as payment options, in addition to traditional fiat currencies.
// How does the AR validation process work?	AR technology with AI reviews the condition of items upon return to ensure they meet specified requirements.
// What happens in case of a dispute?	Disputes will be resolved through the platform, with a structured system in place for fairness.
// How does the rating system work?	Both renters and item owners will rate each other based on the transaction experience.
// Are there fees for using the platform?	There are minimal fees associated with transactions, which will be detailed in your user agreement.
// How does the deposit system function?	A good review history will lower the deposit required for future rentals.
// Is my crypto payment safe?	Yes, all crypto transactions are secured through our blockchain framework.
// Can I rent any item or are there restrictions?	Users can rent most items, but certain categories may have restrictions based on local regulations.

// Define messages in JSON objects
const messages = {
  en: {
    welcome: 'Welcome to M5pire! . Rent Local, Explore Mighty.\nPlease select an option:',
    welcome_reply: '\nPlease select an option:',
    m5pire_option_01: 'What is this rental platform about?',
    m5pire_option_01_reply: 'This platform allows users to rent personal items from each other using blockchain technology for secure transactions.',
    m5pire_option_02: 'How does blockchain technology enhance security?',
    m5pire_option_02_reply: 'Blockchain ensures all transactions are recorded and immutable, which reduces the risk of fraud.',
    m5pire_option_03: 'What cryptocurrencies are accepted for payments?',
    m5pire_option_03_reply: 'We accept Bitcoin (BTC) and XRP as payment options, in addition to traditional fiat currencies.',
    m5pire_option_04: 'How does the AR validation process work?',
    m5pire_option_04_reply: 'AR technology with AI reviews the condition of items upon return to ensure they meet specified requirements.',
    m5pire_option_05: 'What happens in case of a dispute?',
    m5pire_option_05_reply: 'Disputes will be resolved through the platform, with a structured system in place for fairness.',
    m5pire_option_06: 'How does the rating system work?',
    m5pire_option_06_reply: 'Both renters and item owners will rate each other based on the transaction experience.',
    m5pire_option_07: 'Are there fees for using the platform?',
    m5pire_option_07_reply: 'There are minimal fees associated with transactions, which will be detailed in your user agreement.',
    m5pire_option_08: 'How does the deposit system function?',
    m5pire_option_08_reply: 'A good review history will lower the deposit required for future rentals.',
    m5pire_option_09: 'Is my crypto payment safe?',
    m5pire_option_09_reply: 'Yes, all crypto transactions are secured through our blockchain framework.',
    m5pire_option_10: 'Can I rent any item or are there restrictions?',
    m5pire_option_10_reply: 'Users can rent most items, but certain categories may have restrictions based on local regulations.',
    m5pire_app: 'M5pire App',
  },
};

const imagePath = `${baseUrl}/images/M5pire.png`;
const replyMarkup = {
    inline_keyboard: [
        [{ text: messages.en.m5pire_app, callback_data: 'm5pire_app', url: process.env.NEXT_PUBLIC_TELEGRAM_APP_URL as string }],
        [{ text: messages.en.m5pire_option_01, callback_data: 'm5pire_option_01' }],
        [{ text: messages.en.m5pire_option_02, callback_data: 'm5pire_option_02' }],
        [{ text: messages.en.m5pire_option_03, callback_data: 'm5pire_option_03' }],
        [{ text: messages.en.m5pire_option_04, callback_data: 'm5pire_option_04' }],
        [{ text: messages.en.m5pire_option_05, callback_data: 'm5pire_option_05' }],
        [{ text: messages.en.m5pire_option_06, callback_data: 'm5pire_option_06' }],
        [{ text: messages.en.m5pire_option_07, callback_data: 'm5pire_option_07' }],
        [{ text: messages.en.m5pire_option_08, callback_data: 'm5pire_option_08' }],
        [{ text: messages.en.m5pire_option_09, callback_data: 'm5pire_option_09' }],
        [{ text: messages.en.m5pire_option_10, callback_data: 'm5pire_option_10' }],
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
  await ctx.reply(messages.en.m5pire_option_01_reply);
} else if (callbackData === 'm5pire_option_02') {
  await ctx.reply(messages.en.m5pire_option_01_reply);
}
  // ... (Handle other callback queries)

  ctx.reply(messages.en.welcome_reply, {
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