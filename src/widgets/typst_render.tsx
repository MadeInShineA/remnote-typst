import {
	renderWidget,
	useTrackerPlugin,
} from '@remnote/plugin-sdk';

import { useEffect, useState } from 'react';

import { $typst } from '@myriaddreamin/typst.ts';

import '../typst_render.css';

// Initialize the typst compiler
$typst.setCompilerInitOptions({
	beforeBuild: [],
	getModule: () =>
		'https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-web-compiler@0.7.0/pkg/typst_ts_web_compiler_bg.wasm',
});

// Initialize the renderer
$typst.setRendererInitOptions({
	beforeBuild: [],
	getModule: () =>
		'https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-renderer@0.7.0/pkg/typst_ts_renderer_bg.wasm',
});

// Define the page style
const PAGE_PREAMBLE =
	'#set page(width: auto, height: auto, margin: 0pt)\n';

// Compile the Typst source to an SVG string
async function compileTypstToSvg(
	source: string
): Promise<string> {
	return $typst.svg({
		mainContent: PAGE_PREAMBLE + source,
	});
}

export const TypstRenderWidget = () => {
	// The rendered SVG markup
	const [svg, setSvg] = useState('');
	// The compilation error message, if any
	const [err, setErr] = useState('');

	// Read the Typst code from the rem's own text
	const source = useTrackerPlugin(async (rp) => {
		const context = await rp.widget.getWidgetContext();

		if (!context || !('remId' in context)) return '';

		const rem = await rp.rem.findOne(context.remId);
		if (!rem) return '';
		const text = await rem.text;
		if (!text) return '';
		return rp.richText.toString(text);
	});

	// Recompile 300ms after the code stops changing
	useEffect(() => {
		if (!source?.trim()) {
			setSvg('');
			setErr('');
			return;
		}
		const t = setTimeout(async () => {
			try {
				setErr('');
				setSvg(await compileTypstToSvg(source));
			} catch (e: any) {
				setSvg('');
				setErr(String(e?.message ?? e));
			}
		}, 300);
		return () => clearTimeout(t);
	}, [source]);

	// Empty code block
	// Prompt the user to type
	if (!source) {
		return (
			<div className="typst-hint">
				Type Typst code in this code block.
			</div>
		);
	}
	// Compilation failed
	// Show the error instead of the render
	if (err) {
		return <div className="typst-error">{err}</div>;
	}
	// Render the SVG
	return (
		<div
			className="typst-output"
			dangerouslySetInnerHTML={{ __html: svg }}
		/>
	);
};

renderWidget(TypstRenderWidget);
