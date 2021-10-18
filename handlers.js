module.exports = (client) => {
  const Discord = require('discord.js');
  const fs = require('fs');
  const { SlashCommandBuilder } = require('@discordjs/builders');
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v9');
  const rest = new REST({ version: '9' }).setToken(client.token);

  const eventFiles = fs
    .readdirSync("./events")
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) =>
        event.execute(...args, client, Discord)
      );
    } else {
      client.on(event.name, (...args) =>
        event.execute(...args, client, Discord)
      );
    }
  }

  const commandFiles = fs
    .readdirSync("./Commands")
    .filter((file) => file.endsWith(".js"));

  console.log(`${commandFiles.length} Komut Yüklenecek!`);

  commandFiles.forEach((file) => {
    const command = require(`./Commands/${file}`);
    console.log("Yüklenen komut: " + command.name);
    client.commands.set(command.name, command);
  });

  const slashCommandFiles = fs
    .readdirSync("./Slash-Commands")
    .filter((file) => file.endsWith(".js"));
  console.log(`${slashCommandFiles.length} Slash Komutu Yüklenecek!`);

  var data = []

  for (const file of slashCommandFiles) {
    const command = require(`./Slash-Commands/${file}`);
    console.log("Yüklenen slash komutu: " + command.name);
    client.slashCommmands.set(command.name, command);
    if (command.option) {
      if (command.option.string) {
        const string = command.option.string
        data.push(
          new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description)
            .addStringOption(
              option => option
                .setName(string.name)
                .setDescription(string.description)
                .setRequired(string.required)
            )
        )
      } else if (command.option.int) {
        const int = command.option.int
        data.push(
          new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(commmand.description)
            .addIntegerOption(
              option => option
                .setName(int.name)
                .setDescription(int.description)
                .setRequired(int.required)
            )
        )
      } else if (command.option.number) {
        const number = command.option.number
        data.push(
          new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(commmand.description)
            .addNumberOption(
              option => option
                .setName(number.name)
                .setDescription(number.description)
                .setRequired(number.required)
            )
        )
      } else if (command.option.boolean) {
        const boolean = command.option.boolean
        data.push(
          new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(commmand.description)
            .addBooleanOption(
              option => option
                .setName(boolean.name)
                .setDescription(boolean.description)
                .setRequired(boolean.required)
            )
        )
      } else if (command.option.user) {
        const user = command.option.user
        data.push(
          new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(commmand.description)
            .addUserOption(
              option => option
                .setName(user.name)
                .setDescription(user.description)
                .setRequired(user.required)
            )
        )
      } else if (command.option.channel) {
        const channel = command.option.channel
        data.push(
          new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(commmand.description)
            .addChannelOption(
              option => option
                .setName(channel.name)
                .setDescription(channel.description)
                .setRequired(channel.required)
            )
        )
      } else if (command.option.role) {
        const role = command.option.role
        data.push(
          new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(commmand.description)
            .addRoleOption(
              option => option
                .setName(role.name)
                .setDescription(role.description)
                .setRequired(role.required)
            )
        )
      } else if (command.option.mention) {
        const mention = command.option.mention
        data.push(
          new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(commmand.description)
            .addMentionableOption(
              option => option
                .setName(mention.name)
                .setDescription(mention.description)
                .setRequired(mention.required)
            )
        )
      }
    } else {
      data.push(
        new SlashCommandBuilder()
          .setName(command.name)
          .setDescription(command.description)
      )
    }
  }

  data.map(cmd => cmd.toJSON())

  setTimeout(async () => {
    rest.put(Routes.applicationCommands(client.user.id), { body: data })
      .catch(console.error);
  }, 500);
}
