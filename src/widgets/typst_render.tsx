import {
	renderWidget,
	useTracker,
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

async function compileTypstToSvg(
	source: string
): Promise<string> {
	return $typst.svg({ mainContent: source });
}

export const TypstRenderWidget = () => {
	const [svg, setSvg] = useState('');
	const [err, setErr] = useState('');

	const source = useTracker(async (rp) => {
		const context = await rp.widget.getWidgetContext();

		if (!context || !('remId' in context)) return '';

		const rem = await rp.rem.findOne(context.remId);
		if (!rem) return '';
		return rp.richText.toString(await rem.text);
	});

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

	if (err) {
		return <div className="typst-error">{err}</div>;
	}
	return (
		<div
			className="typst-output"
			dangerouslySetInnerHTML={{ __html: svg }}
		/>
	);
};

renderWidget(TypstRenderWidget);
