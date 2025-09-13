@component
export class controllerTracker extends BaseScriptComponent {

    @input
    private leftHand: SceneObject;

    @input
    private rightHand: SceneObject;

    @input
    private Mesh: SceneObject;

    onAwake() {
        print("THIS THING JUST STARTED.")
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    }

    onUpdate() {
        // Get the world positions of the left and right hands
        const leftPos = this.leftHand.getTransform().getWorldPosition();
        const rightPos = this.rightHand.getTransform().getWorldPosition();
        print("Left Hand Position: " + leftPos);
        print("Right Hand Position: " + rightPos);

        // Only show the mesh if the hands are a certain distance apart
        const distance = leftPos.distance(rightPos);
        if (distance < 0.20) {
            this.Mesh.enabled = true;

            // Set the position of the Mesh to be the average of the two hand positions
            const midPoint = leftPos.add(rightPos).uniformScale(0.5);
            this.Mesh.getTransform().setWorldPosition(midPoint);

            // Set the rotation of the Mesh to be the average of the two hand rotations
            const leftRot = this.leftHand.getTransform().getWorldRotation();
            const rightRot = this.rightHand.getTransform().getWorldRotation();
            const midRot = quat.slerp(leftRot, rightRot, 0.5);
            this.Mesh.getTransform().setWorldRotation(midRot); 
        } else {
            this.Mesh.enabled = false;
            return;
        }
    }
}
