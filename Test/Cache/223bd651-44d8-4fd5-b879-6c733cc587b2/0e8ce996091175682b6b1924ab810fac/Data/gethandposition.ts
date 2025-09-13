@component
export class NewScript extends BaseScriptComponent {

    @input
    leftHand: SceneObject;

    @input
    rightHand: SceneObject;

    OnAwake() {
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
}
