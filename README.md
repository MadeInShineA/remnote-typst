# Remnote Typst

> Please note that this readme was written with the help of Opencode's DeepSeek V4.1 Flash Free

Render [Typst](https://typst.app/) inside RemNote: turn any Rem into a Typst code
block and see the compiled SVG rendered below it, updating as you type.

![Typst rendered inside a RemNote Rem](https://raw.githubusercontent.com/MadeInShineA/remnote-typst/main/images/example.png)

*Typst rendered inside a RemNote Rem*

## Usage

1. On a Rem, open the command palette (`Ctrl/Cmd + K`) and run **Toggle Typst on this Rem**.
2. Type your Typst source into the code block; the result renders as an SVG below.
3. Run the command again to remove it.

The code block collapses to one line when unfocused so the output stays visible,
click it to expand.The Typst WASM compiler/renderer is fetched from the jsDelivr CDN, so an internet
connection is required for now.

## Planned Features

- Configurable page setup (currently fixed to `width/height: auto`, `margin: 0pt`).
- Bundle the Typst WASM locally for offline use.
- Settings page and mobile support.

## Development

A Nix flake provides the toolchain (`nodejs` plus language servers/formatting).
Load it with `nix develop`. Without Nix, just
install **Node.js (>=18) and npm**.

```sh
npm install
npm run dev         # webpack dev server on http://localhost:8080
npm run build       # build PluginZip.zip
npm run check-types # tsc
```

To test in RemNote: `npm run dev`, then **Settings → Plugins → Build a plugin**
and point it at `http://localhost:8080`.
