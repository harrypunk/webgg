// `as const` keeps the paths as route literals so `resolve()` accepts them.
export const games = [
	{
		id: 'hello',
		title: 'Hello Babylon',
		description: 'A simple Babylon.js playground with a sphere and ground.',
		path: '/hello'
	},
	{
		id: 'pingpong',
		title: 'Ping Pong',
		description: 'Classic paddle game. Work in progress.',
		path: '/pingpong'
	},
	{
		id: 'farmdungeon',
		title: 'Farm Dungeon',
		description: 'A sunny grassland with a cube hero. Work in progress.',
		path: '/farmdungeon'
	},
	{
		id: 'switch1',
		title: 'Scene Switcher',
		description: 'Cycle through cube, sphere, and cone scenes.',
		path: '/example/switch1'
	},
	{
		id: 'square',
		title: 'Square',
		description: 'A simple 2D square moving left and right.',
		path: '/example/square'
	}
] as const;
