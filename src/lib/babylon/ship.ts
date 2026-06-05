import type { Scene } from '@babylonjs/core/scene';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';

export function createShipMesh(scene: Scene, name = 'ship'): Mesh {
	const mesh = new Mesh(name, scene);

	const vertexData = new VertexData();
	vertexData.positions = [
		0,
		0,
		-1, // nose (facing -Z / screen up)
		-0.5,
		0,
		0.6, // left wing
		0.5,
		0,
		0.6 // right wing
	];
	vertexData.indices = [0, 2, 1]; // counter-clockwise when viewed from above
	vertexData.normals = [0, 1, 0, 0, 1, 0, 0, 1, 0];
	vertexData.applyToMesh(mesh);

	const mat = new StandardMaterial(name + 'Mat', scene);
	mat.diffuseColor = new Color3(0, 0.85, 1);
	mat.emissiveColor = new Color3(0, 0.3, 0.4);
	mesh.material = mat;

	return mesh;
}
