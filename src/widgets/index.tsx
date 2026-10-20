import {
	declareIndexPlugin,
	type ReactRNPlugin,
	WidgetLocation,
} from '@remnote/plugin-sdk';
import '../style.css';
import '../index.css';
const TYPST_POWERUP = 'typst';
const CODE_POWERUP = 'cd';

const COLLAPSE_CSS = `
[data-rem-tags~="typst"] :is(.rn-code-node, #code-node):not(:focus-within),
[data-rem-container-tags~="typst"] :is(.rn-code-node, #code-node):not(:focus-within) {
	max-height: 1.5em !important;
	overflow: hidden !important;
}
`;

const HIDE_ANSWER_CSS = `
.rn-queue__content--answer-hidden [data-queue-rem-container-tags~="typst"]:not(.rn-question-rem) iframe,
.rn-queue__content--answer-hidden [data-rem-container-tags~="typst"]:not(.rn-question-rem) iframe,
.rn-queue__content--answer-hidden [data-queue-rem-container-tags]:not(.rn-question-rem) iframe.rn-plugin-root[src*="typst_render"],
.rn-queue__content--answer-hidden [data-queue-rem-container-tags]:not(.rn-question-rem) iframe[src*="widgetName=typst_render"],
.rn-queue__content--answer-hidden [data-queue-rem-container-tags]:not(.rn-question-rem) iframe[src*="typst_render-sandbox"] {
	display: none !important;
}
`;

async function onActivate(plugin: ReactRNPlugin) {
	// Register the collapse CSS
	await plugin.app.registerCSS(
		'typst-collapse-code',
		COLLAPSE_CSS
	);

	// Register the hide-answer CSS
	await plugin.app.registerCSS(
		'typst-hide-answer',
		HIDE_ANSWER_CSS
	);

	// Register the typst Power-up
	await plugin.app.registerPowerup({
		name: 'typst',
		code: TYPST_POWERUP,
		description: 'Render Typst in this note',
		options: { slots: [] },
	});

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
