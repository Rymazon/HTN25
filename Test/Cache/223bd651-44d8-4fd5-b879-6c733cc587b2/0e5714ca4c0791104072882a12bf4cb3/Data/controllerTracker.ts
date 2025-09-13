@component
export class controllerTracker extends BaseScriptComponent {

    @input
    private leftHand: SceneObject;

    @input
    private rightHand: SceneObject;

    onAwake():void {
        print("THIS THING JUST STARTED.")
    }

}
