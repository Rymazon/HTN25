@component
export class controllerTracker extends BaseScriptComponent {

    @input
    private leftHand: SceneObject;

    @input
    private rightHand: SceneObject;

    onAwake() {
        print("THIS THING JUST STARTED.")
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    }

    onUpdate() {
        const leftPos = this.leftHand.getTransform().getWorldPosition();
        const rightPos = this.rightHand.getTransform().getWorldPosition();
        print("Left Hand Position: " + leftPos);
        print("Right Hand Position: " + rightPos);
    }
}
