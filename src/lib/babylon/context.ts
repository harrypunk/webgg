import { createContext } from 'svelte';
import type { Nullable } from '@babylonjs/core/types';
import type { Engine } from '@babylonjs/core/Engines/engine';
import type { Scene } from '@babylonjs/core/scene';

export interface EngineContext {
	engine: Nullable<Engine>;
	canvas: Nullable<HTMLCanvasElement>;
}

export const [getEngineContext, setEngineContext] = createContext<EngineContext>();

export interface SceneContext {
	scene: Nullable<Scene>;
}

export const [getSceneContext, setSceneContext] = createContext<SceneContext>();
