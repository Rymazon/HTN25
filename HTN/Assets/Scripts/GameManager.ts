@component
export class NewScript extends BaseScriptComponent {
    
    @input
    private SpellObject: SceneObject;

    @input
    private GameText: SceneObject;

    @input
    private cameraObj: SceneObject;

    @input
    private LabubuObj: SceneObject;

    private gameStarted = false;
    private score: number = 0;

    onAwake() {
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));

        // Bind Events
        const physicsCollider = this.GameText.getComponent("PhysicsCollider" as any);
        if (physicsCollider) {
            physicsCollider.onCollisionEnter.add(this.onGameStart.bind(this));
        }
    }

    private onGameStart() {
        if (!this.gameStarted)
        {
            print("Game Started!");
            this.gameStarted = true;
            this.GameText.getComponent("Text" as any).text = "Score: 0";
            
        }
        
    }

    onUpdate() {

        
    }

    

}
