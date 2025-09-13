@component
export class controllerTracker extends BaseScriptComponent {

    @input
    private leftHand: SceneObject;

    @input
    private rightHand: SceneObject;

    @input
    private Mesh: ;

    onAwake() {
        print("THIS THING JUST STARTED.")
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    }

    onUpdate() {
        const leftPos = this.leftHand.getTransform().getWorldPosition();
        const rightPos = this.rightHand.getTransform().getWorldPosition();
        print("Left Hand Position: " + leftPos);
        print("Right Hand Position: " + rightPos);
        // Set the position of the Mesh to be the average of the two hand positions
        const midPoint = leftPos.add(rightPos).uniformScale(0.5);
        this.Mesh.getTransform().setWorldPosition(midPoint);
    }
}
