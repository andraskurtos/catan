import { render } from 'preact';
import preactLogo from './assets/preact.svg';
import './index.less';
import { Hex, HexGrid } from './Hex';

export function App() {
	return (
		<div className="app">
			<h1>Catan Map Generator</h1>
			<HexGrid radius={2} hexRadius={65} padding={2} />
		</div>
);
}


render(<App />, document.getElementById('app'));
