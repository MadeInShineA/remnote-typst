import {
	declareIndexPlugin,
	type ReactRNPlugin,
	WidgetLocation,
} from '@remnote/plugin-sdk';
import '../style.css';
import '../index.css'; // import <widget-name>.css

const TYPST_POWERUP = 'typst';
const CODE_POWERUP = 'cd';

async function onActivate(plugin: ReactRNPlugin) {
	// Register the typst Power-up
	await plugin.app.registerPowerup(
		'typst',
		TYPST_POWERUP,
		'Render Typst in this note',
		{ slots: [] }
	);

	// Link the typst Power-up and the Widget
	await plugin.app.registerWidget(
		'typst_render',
		WidgetLocation.UnderRemEditor,
		{
			dimensions: { height: 'auto', width: '100%' },
			powerupFilter: TYPST_POWERUP,
		}
	);

	// Register the toggle typst Command
	await plugin.app.registerCommand({
		id: 'toggle-typst',
		name: 'Toggle Typst on this Rem',
		action: async () => {
			// Get the focused element
			const rem = await plugin.focus.getFocusedRem();
			if (!rem) return;

			// Add or remove the code and typst Power-ups
			if (await rem.hasPowerup(TYPST_POWERUP)) {
				await rem.removePowerup(TYPST_POWERUP);
				await rem.removePowerup(CODE_POWERUP);
			} else {
				await rem.addPowerup(CODE_POWERUP);
				await rem.addPowerup(TYPST_POWERUP);
			}
		},
	});
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
