import {
	renderWidget,
	useTracker,
} from '@remnote/plugin-sdk';

export const TypstRenderWidget = () => {
	const source = useTracker(async (rp) => {
		const context = await rp.widget.getWidgetContext();

		if (!context || !('remId' in context)) return '';

		const rem = await rp.rem.findOne(context.remId);
		if (!rem) return '';
		return rp.richText.toString(await rem.text);
	});

	return (
		<div style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>
			{source}
		</div>
	);
};

renderWidget(TypstRenderWidget);
