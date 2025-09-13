@component
export class gethandposition extends BaseScriptComponent {

    @input
    private leftHand: SceneObject;

    @input
    private rightHand: SceneObject;

    OnAwake() {
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    }

    onUpdate() {
        if (this.leftHand && this.rightHand) {
            const leftPos = this.leftHand.getTransform().getWorldPosition();
            const rightPos = this.rightHand.getTransform().getWorldPosition();
            print("Left Hand Position: " + leftPos);
            print("Right Hand Position: " + rightPos);
        }
    }
}
