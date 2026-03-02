const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const express = require("express");

const app = express();

// مهم لـ Render
app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(process.env.PORT || 3000);

// إنشاء البوت
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const YOUR_ID = "1236994594634469498";       
const FRIEND_ID = "1268881277864640522";   
const alreadySent = new Set();

client.on('voiceStateUpdate', async (oldState, newState) => {

  if (!oldState.channel && newState.channel) {

    const username = newState.member?.user?.username || "User";

    if (newState.id === YOUR_ID && !alreadySent.has(YOUR_ID)) {
      const friend = await client.users.fetch(FRIEND_ID);

      const embed = new EmbedBuilder()
        .setTitle('🎧 Voice Channel Notification')
        .setColor(0x00FF00)
        .setDescription(`Hey <@${FRIEND_ID}>!\n${username} joined ${newState.channel.name}`)
        .setTimestamp();

      await friend.send({ embeds: [embed] });
      alreadySent.add(YOUR_ID);
    }

    if (newState.id === FRIEND_ID && !alreadySent.has(FRIEND_ID)) {
      const me = await client.users.fetch(YOUR_ID);

      const embed = new EmbedBuilder()
        .setTitle('🎧 Voice Channel Notification')
        .setColor(0x00FF00)
        .setDescription(`Hey <@${YOUR_ID}>!\n${username} joined ${newState.channel.name}`)
        .setTimestamp();

      await me.send({ embeds: [embed] });
      alreadySent.add(FRIEND_ID);
    }
  }

  if (oldState.channel && !newState.channel) {
    if (oldState.id === YOUR_ID) alreadySent.delete(YOUR_ID);
    if (oldState.id === FRIEND_ID) alreadySent.delete(FRIEND_ID);
  }
});

client.login(process.env.TOKEN);