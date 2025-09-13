@component
export class NewScript extends BaseScriptComponent {

    @input("SceneObject")
    leftHand: SceneObject;

    @input("SceneObject")
    rightHand: SceneObject;

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
