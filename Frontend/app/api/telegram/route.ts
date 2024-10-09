import { NextRequest, NextResponse } from 'next/server';
import { Telegraf } from 'telegraf'; // Import session from telegraf
import jwt from "jsonwebtoken";
import nodeCrypto from "crypto";
import OpenAI from "openai";


// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token
const bot = new Telegraf(process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN as string);
const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// Define messages in JSON objects
const messages = {
  en: {
    welcome: 'Welcome to M5pire! . Rent Local, Explore Mighty.\nPlease select an option or type your favorite outdoor sport:',
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
    m5pire_option_ai_chat: 'M5pire AI Recomendations',
  },
};

const imagePath = `${baseUrl}/images/M5pireApp.png`;


// Handle '/start' command (initial interaction)
bot.start((ctx) => {

  console.log("****************");
  console.log(ctx.update);
  console.log("****************");

  const userData = {
    authDate: Math.floor(new Date().getTime()),
    firstName: ctx.update.message.from.first_name,
    lastName: "",
    username: ctx.update.message.from.username,
    id: ctx.update.message.from.id,
    photoURL: "",
  }; 

  const hash = generateTelegramHash(userData);

  // Create JWT with user data and hash
  const telegramAuthToken = jwt.sign(
    {
        ...userData,
        hash,
    },
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN as string, // Use the bot token to sign the JWT
    { algorithm: "HS256" }
  );

  // URL-encode the generated JWT for safe usage in a URL
  const encodedTelegramAuthToken = encodeURIComponent(telegramAuthToken);     

  const appURL = `${process.env.NEXT_PUBLIC_APP_URL}/?telegramAuthToken=${encodedTelegramAuthToken}`;

  console.log("****************");
  console.log(appURL);
  console.log("****************");

  const replyMarkup = {
    inline_keyboard: [
      [{ text: messages.en.m5pire_app, web_app: { url: appURL } }],
      [{ text: messages.en.m5pire_option_01, callback_data: 'm5pire_option_01' }],
      [{ text: messages.en.m5pire_option_02, callback_data: 'm5pire_option_02' }],
      [{ text: messages.en.m5pire_option_03, callback_data: 'm5pire_option_03' }],
      [{ text: messages.en.m5pire_option_04, callback_data: 'm5pire_option_04' }],
      [{ text: messages.en.m5pire_option_05, callback_data: 'm5pire_option_05' }],
      [{ text: messages.en.m5pire_option_ai_chat, callback_data: 'm5pire_option_ai_chat' }],
    ],
  };
  
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
  await ctx.reply(messages.en.m5pire_option_01 + "\n" + messages.en.m5pire_option_01_reply);
} else if (callbackData === 'm5pire_option_02') {
  await ctx.reply(messages.en.m5pire_option_02 + "\n" + messages.en.m5pire_option_02_reply);
} else if (callbackData === 'm5pire_option_03') {
  await ctx.reply(messages.en.m5pire_option_03 + "\n" + messages.en.m5pire_option_03_reply);
} else if (callbackData === 'm5pire_option_04') {
  await ctx.reply(messages.en.m5pire_option_04 + "\n" + messages.en.m5pire_option_04_reply);
} else if (callbackData === 'm5pire_option_05') {
  await ctx.reply(messages.en.m5pire_option_05 + "\n" + messages.en.m5pire_option_05_reply);
} else if (callbackData === 'm5pire_option_ai_chat') {
  await ctx.reply("Type your favorite outdoor sport:");
}
  // ... (Handle other callback queries)

  const userData = {
    authDate: Math.floor(new Date().getTime()),
    firstName: ctx.update.callback_query.from.first_name,
    lastName: "",
    username: ctx.update.callback_query.from.username,
    id: ctx.update.callback_query.from.id,
    photoURL: "",
  }; 

  const hash = generateTelegramHash(userData);

  // Create JWT with user data and hash
  const telegramAuthToken = jwt.sign(
    {
        ...userData,
        hash,
    },
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN as string, // Use the bot token to sign the JWT
    { algorithm: "HS256" }
  );

  // URL-encode the generated JWT for safe usage in a URL
  const encodedTelegramAuthToken = encodeURIComponent(telegramAuthToken);     

  const appURL = `${process.env.NEXT_PUBLIC_APP_URL}/?telegramAuthToken=${encodedTelegramAuthToken}`;

  console.log("****************");
  console.log(appURL);
  console.log("****************");

  const replyMarkup = {
    inline_keyboard: [
        [{ text: messages.en.m5pire_app, web_app: { url: appURL } }],
        [{ text: messages.en.m5pire_option_01, callback_data: 'm5pire_option_01' }],
        [{ text: messages.en.m5pire_option_02, callback_data: 'm5pire_option_02' }],
        [{ text: messages.en.m5pire_option_03, callback_data: 'm5pire_option_03' }],
        [{ text: messages.en.m5pire_option_04, callback_data: 'm5pire_option_04' }],
        [{ text: messages.en.m5pire_option_05, callback_data: 'm5pire_option_05' }],
    ],
  };

  ctx.reply(messages.en.welcome_reply, {
    reply_markup: replyMarkup,
  });

});

// Handle generic text messages
bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;
  const lang = ctx.session.lang || 'es';

  try {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a web3 defi expert." },
            {
                role: "user",
                content: `I'm in Utah now and I like ${userMessage}. Suggest a suitable thinks to do, and tell me what are the best places to do my sport.`,
            },
        ],        
    });

    console.log(response);

    const answer = response.choices[0].message?.content ?? '';
    await ctx.reply(answer);
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    await ctx.reply('Sorry, I am having trouble answering your question right now.');
  }
});

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

/**
 * Function to generate HMAC hash for Telegram authentication
 * @param {Object} data - User data to be hashed
 * @returns {string} - Generated HMAC hash
 */
const generateTelegramHash = (data): string => {
  // Prepare the data object with required fields
  const userData = {
      auth_date: String(data.authDate),
      first_name: data.firstName,
      id: String(data.id),
      last_name: data.lastName,
      photo_url: data.photoURL,
      username: data.username,
  };

  // Filter out undefined or empty values from the data object
  const filteredUseData = Object.entries(userData).reduce(
      (acc: { [key: string]: string }, [key, value]) => {
          if (value) acc[key] = value;
          return acc;
      },
      {} as { [key: string]: string }
  );

  // Sort the entries and create the data check string
  const dataCheckArr = Object.entries(filteredUseData)
      .map(([key, value]) => `${key}=${String(value)}`)
      .sort((a, b) => a.localeCompare(b))
      .join("\n");

  // Create SHA-256 hash from the bot token
  const TELEGRAM_SECRET = nodeCrypto
      .createHash("sha256")
      .update(process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN as string)
      .digest();

  // Generate HMAC-SHA256 hash from the data check string
  return nodeCrypto
      .createHmac("sha256", TELEGRAM_SECRET)
      .update(dataCheckArr)
      .digest("hex");
};