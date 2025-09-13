@component
export class NewScript extends BaseScriptComponent {
    onAwake() {
        // Find the left and right hand scene objects by name
        this.leftHand = Scene.getRoot().find("LeftHand");
        this.rightHand = Scene.getRoot().find("RightHand");
    }

    onUpdate() {
        if (this.leftHand && this.rightHand) {
            // Get world positions
            const leftPos = this.leftHand.getTransform().getWorldPosition();
            const rightPos = this.rightHand.getTransform().getWorldPosition();
            // Print positions
            print("Left Hand Position: " + leftPos);
            print("Right Hand Position: " + rightPos);
        }
    }
    }
}
