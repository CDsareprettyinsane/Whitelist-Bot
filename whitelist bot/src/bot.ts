import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from "discord.js";
import fetch from "node-fetch";

const token = "bot token";
const clientId = "client id";
const webhookUrl = "http://localhost:3000/webhook";
const requiredRole = "Developers";

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const commands = [
    new SlashCommandBuilder()
        .setName("whitelist")
        .setDescription("Whitelist a Roblox user ID")
        .addStringOption(o =>
            o.setName("roblox_id")
             .setDescription("Roblox ID")
             .setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName("unwhitelist")
        .setDescription("Remove a Roblox ID from whitelist")
        .addStringOption(o =>
            o.setName("roblox_id")
             .setDescription("Roblox ID")
             .setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName("listwhitelist")
        .setDescription("List all whitelisted Roblox IDs")
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands }
    );
    console.log("Global commands registered");
})();

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.inGuild()) {
        return interaction.reply({
            content: "This command can only be used in servers.",
            ephemeral: true
        });
    }

    const member = await interaction.guild.members.fetch(interaction.user.id);
    if (!member.roles.cache.some(r => r.name === requiredRole)) {
        return interaction.reply({
            content: "You do not have permission.",
            ephemeral: true
        });
    }

    if (interaction.commandName === "listwhitelist") {
        const res = await fetch(webhookUrl + "/list");
        const data = await res.json();
        return interaction.reply({
            content: "Whitelist:\n" + data.join(", "),
            ephemeral: true
        });
    }

    const robloxId = interaction.options.getString("roblox_id", true);

    if (!/^[0-9]+$/.test(robloxId)) {
        return interaction.reply({
            content: "Invalid Roblox ID",
            ephemeral: true
        });
    }

    const api = await fetch(`https://users.roblox.com/v1/users/${robloxId}`);
    if (!api.ok) {
        return interaction.reply({
            content: "Roblox user does not exist",
            ephemeral: true
        });
    }

    await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: interaction.commandName,
            robloxId
        })
    });

    interaction.reply({ content: "Success.", ephemeral: true });
});

client.login(token);