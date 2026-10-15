import {
	declareIndexPlugin,
	type ReactRNPlugin,
	WidgetLocation,
} from '@remnote/plugin-sdk';
import '../style.css';
import '../index.css'; // import <widget-name>.css

async function onActivate(plugin: ReactRNPlugin) {
	// Register the typst Power-up
	await plugin.app.registerPowerup(
		'typst',
		'typst',
		'Render Typst in this note',
		{ slots: [] }
	);

	// Link the typst Power-up and the Widget
	await plugin.app.registerWidget(
		'typst_render',
		WidgetLocation.UnderRemEditor,
		{
			dimensions: { height: 'auto', width: '100%' },
			powerupFilter: 'typst',
		}
	);

	// Register the toggle typst Command
	await plugin.app.registerCommand({
		id: 'toggle-typst',
		name: 'Toggle Typst on this Rem',
		action: async () => {
			const rem = await plugin.focus.getFocusedRem();
			if (rem) {
				if (await rem.hasPowerup?.('typst')) {
					await rem.removePowerup?.('typst');
				} else {
					await rem.addPowerup?.('typst');
				}
			}
		},
	});
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
