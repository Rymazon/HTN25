@component
export class Labubu extends BaseScriptComponent {

    @input
    private GameText: SceneObject;

    onAwake() {
        this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
    }

    onStart() {
        const physicsBody = this.sceneObject.getComponent("Physics.BodyComponent" as any);
        if (physicsBody) {
            print("Found PhysicsBody component on LabubuObj");
            physicsBody.onCollisionEnter.add(this.onCollision.bind(this));
        }
        else {
            print("No PhysicsBody component found on LabubuObj");
        }
        this.sceneObject.enabled = true;
    }

    private onCollision()
    {
        print("Hit")
        const parentSceneObject = this.sceneObject.getParent();
        print(parentSceneObject.name)
        const labubuManager = parentSceneObject.getComponent("LabubuManager" as any);
        if (labubuManager) {
            labubuManager.SpawnLabubu();
            print("Spawning new Labubu");
        }
        else
        {
            print("No LabubuManager component found on parent");
        }

        this.destroy(); // Destroy this Labubu instance after spawning a new one

    }

}