/**
 * Prints the WhatsApp messages the site writes for a sample cart and a sample
 * cake build, plus their wa.me links, so the formatting can be reviewed.
 *   npm run whatsapp:sample
 */
import { site } from '../src/config/site';
import { cakeMessage, cartMessage, waLink } from '../src/lib/whatsapp';
import { sampleCakeMessage, sampleCartMessage } from '../tests/fixtures/whatsapp-samples';

const rule = '─'.repeat(60);
for (const [title, text] of [
  ['Sample cart order', cartMessage(sampleCartMessage)],
  ['Sample custom cake', cakeMessage(sampleCakeMessage)],
] as const) {
  console.log(
    `\n${rule}\n${title}\n${rule}\n${text}\n\nLink (${text.length} chars):\n${waLink(site.contact.whatsapp, text)}\n`,
  );
}
