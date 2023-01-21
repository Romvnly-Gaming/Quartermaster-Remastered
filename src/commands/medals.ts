import { ActionRowBuilder, ApplicationCommandOptionType, Attachment, AttachmentBuilder, CommandInteraction, InteractionCollector, Message, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { ModalComponent, SimpleCommandMessage, SlashOption } from "discordx";
import {
  Discord,
  SimpleCommand,
  SimpleCommandOption,
  SimpleCommandOptionType,
  Slash,
} from "discordx";
import { createCanvas, loadImage, Image } from 'canvas';
import { fileURLToPath } from 'url';
import {join, dirname} from 'path';
import { createWorker, ImageLike, OEM, PSM } from "tesseract.js";
import parseMedalList from "../medalListParser.js";
import util from "util";
import generateMedalShirt from "../generateMedalShirt.js";
import { ModalBuilder } from "discord.js";
import noblox from "noblox.js";


function isNumeric(str: string | number) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

@Discord()
export class MedalzCommandHandler {
  @SimpleCommand({name: "medal"})
  async simple(interaction: SimpleCommandMessage): Promise<void> {

      const imageOfMedals = interaction.message.attachments.at(0)?.proxyURL || interaction.message.attachments.at(0)?.url
      if (!imageOfMedals) interaction.message.reply("you're exiled from irf");
      else {
      const worker = await createWorker({
        logger: (m: unknown) => console.log(m)
      });
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
      tessedit_char_whitelist: "0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'",
    });
    const { data: { text } } = await worker.recognize(imageOfMedals);
    await worker.terminate();
    const userMedals = await parseMedalList(text)
    const attachment = new AttachmentBuilder(await generateMedalShirt(userMedals), {name: 'tshirtromvnly.png'}) 
    interaction.message.reply({content: "Done!\n\n" + `\`\`\`${userMedals.map((m) => m.name + ` (x${m.quantity})${m.medals.length ? '' : ' (Not supported)'}`).join(", \n")}\`\`\``, files: [attachment]})
    // interaction.message.reply({content: `\`\`\`js\n${util.inspect(await parseMedalList(text), {showHidden: false, depth: null, colors: false})}\`\`\``})
  }
}
  @Slash({ description: "Generate Medals t-shirt from CL data, better than Quartermaster bot", name: "medal" })
  async slashy(command: CommandInteraction): Promise<void> {
		const modal = new ModalBuilder()
			.setCustomId('myModal')
			.setTitle('QUARTERMASTER SQUASHER >:)');
      

		// Create the text input components
		const robloxUsernameInput = new TextInputBuilder()
			.setCustomId('robloxUsernameInput')
      .setRequired(true)
      .setMaxLength(30)
		    // The label is the prompt the user sees for this input
			.setLabel("What's your ROBLOX username?")
      .setPlaceholder("Netherguy1450")
			.setStyle(TextInputStyle.Short);

      
      const medalsFromCL = new TextInputBuilder()
      .setRequired(true)
			.setCustomId('medalsFromCL')
      .setMaxLength(4000)
			.setLabel("Medals from the Clan Labs medal embed")
      .setPlaceholder(`:GoodConduct: Good Conduct Medal x3`)
			.setStyle(TextInputStyle.Paragraph);

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(robloxUsernameInput);
		const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(medalsFromCL);

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow);
    
		// Show the modal to the user
		await command.showModal(modal);
  }
  @ModalComponent({ id: 'myModal' })
  async handleModalSubmit(interaction: ModalSubmitInteraction): Promise<void> {
    try {
      const [robloxUsernameInput, medalsFromCL] = ["robloxUsernameInput", "medalsFromCL"].map((id) =>
      interaction.fields.getTextInputValue(id)
    );
    let id;
    try {
      id = await noblox.getIdFromUsername(robloxUsernameInput)
    }
    catch(err) {
      interaction.reply(err as string)
      return 
    }

    let veteranYear = Number((await noblox.getRankNameInGroup(Number(process.env.ROBLOX_VETS_GROUP as unknown as string), id)).trim().split(/(\s+)/)[0].trim())
    const userMedals = await parseMedalList(medalsFromCL)
    // const attachment = new AttachmentBuilder(await generateMedalShirt(userMedals), {name: 'tshirtromvnly.png'}) 
    interaction.reply({content: "Done!\n\n" + `\`\`\`${userMedals.map((m) => m.name + ` (x${m.quantity})${m.medals.length ? '' : ' (Not supported)'}`).join(", \n")}\`\`\``})
  
    }
    catch(err) {
      const errorMessage= `Sadly, the bot ran into an error whilst processing your request. Apologies.\n\nError: \`\`\`js\n${err}\`\`\``
      interaction.replied ? interaction.editReply(errorMessage) : interaction.reply(errorMessage)
    }
  }

}

