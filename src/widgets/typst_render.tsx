import {
	usePlugin,
	renderWidget,
	useTracker,
} from '@remnote/plugin-sdk';

export const TypstRenderWidget = () => {
	const plugin = usePlugin();

	return (
		<div className="p-2 m-2 rounded-lg rn-clr-background-light-positive rn-clr-content-positive">
			<h1 className="text-xl">Sample Plugin</h1>
			<div>Hello world!</div>
		</div>
	);
};

renderWidget(TypstRenderWidget);
