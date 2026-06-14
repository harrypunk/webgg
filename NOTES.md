# Project Notes

## AxisGizmo Labels — GUI vs DynamicTexture

**Problem (resolved)**
`AxisGizmo` text labels (X, Y, Z) were not visible when implemented with `@babylonjs/gui`.

**What was tried**

- `AdvancedDynamicTexture.CreateForMesh` on billboard planes inside the `UtilityLayerRenderer` scene — labels did not render.
- `AdvancedDynamicTexture.CreateFullscreenUI` in the main scene, projecting 3D arrow tip positions to 2D every frame — labels did not render reliably either.
- Tried different projection Y conventions and larger font/plane sizes; still no visible labels.

**Solution (branch `pingpong-axisgizmo-gui`)**

Switched the labels to a fullscreen `@babylonjs/gui` `AdvancedDynamicTexture` in the main scene:

1. Each arrow tip has an invisible `TransformNode` anchor parented to the gizmo root (inside the `UtilityLayerRenderer` scene).
2. A `TextBlock` is added to a fullscreen ADT, then linked to that anchor with `linkWithMesh(anchor)`.
3. `linkWithMesh` automatically projects the anchor's world position to screen space every frame, so the labels follow the arrow tips as the camera moves.

Key implementation details:

- `linkWithMesh` requires the control to be at root level, so `adt.addControl(text)` must be called **before** `text.linkWithMesh(anchor)`.
- `linkWithMesh` resets the control's alignment to left/top; restore `Control.HORIZONTAL_ALIGNMENT_CENTER` and `Control.VERTICAL_ALIGNMENT_CENTER` after linking if you want the label centered on the tip.
- Set `text.isHitTestVisible = false` so the fullscreen GUI does not block canvas pointer events.
- Toggle `adt.rootContainer.isVisible` together with the gizmo node to show/hide labels with the debug button.

**Why the previous attempts likely failed**

- `CreateForMesh` inside a `UtilityLayerRenderer` scene appears to conflict with the overlay scene rendering / camera setup.
- Manual `Vector3.Project` in a fullscreen ADT is error-prone (Y convention, viewport, camera matrices). Using `linkWithMesh` lets Babylon handle projection correctly.
- The silent failure of calling `linkWithMesh` before `addControl` may also have hidden labels in earlier attempts.

**Current implementation**

- Arrow geometry renders through `UtilityLayerRenderer`.
- X/Y/Z labels are crisp `TextBlock` controls with outline/shadow for readability, linked to arrow-tip anchors.
