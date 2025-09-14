import { GameController } from "GameController.lspkg/GameController";
import { ButtonStateKey } from "GameController.lspkg/Scripts/ButtonState";


@component
export class ControllerManager extends BaseScriptComponent {
    private gameController: GameController = GameController.getInstance();

    @input
    private leftHand: SceneObject;

    @input
    private rightHand: SceneObject;

    @input
    private Mesh: SceneObject;

    @input
    private Spell: SceneObject;

    @input
    private Spell1Mat: Material;

    @input
    private Spell2Mat: Material;

    @input
    private Spell3Mat: Material;

    @input
    private Spell4Mat: Material;

    @input
    private BlockMat: Material;



    // Global variable to keep track of blocking state
    private isBlocking: boolean = false;
    private lastSpellMat: Material = null;

    onAwake() {
        print("Awake");
        this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
        this.lastSpellMat = this.Spell1Mat;
    }

    onStart() {
        print("Prepping");
        this.gameController.scanForControllers();
        //register button presses
        this.gameController.onButtonStateChanged(
            ButtonStateKey.rt,
            this.Cast_Spell.bind(this)
        );
        // this.gameController.onButtonStateChanged(
        //     ButtonStateKey.dUp,
        //     this.Block.bind(this)
        // );
        this.gameController.onButtonStateChanged(
            ButtonStateKey.y,
            this.Change_Spell.bind(this,1)
        );
        this.gameController.onButtonStateChanged(
            ButtonStateKey.b,
            this.Change_Spell.bind(this,2)
        );
        this.gameController.onButtonStateChanged(
            ButtonStateKey.x,
            this.Change_Spell.bind(this,3)
        );
        this.gameController.onButtonStateChanged(
            ButtonStateKey.a,
            this.Change_Spell.bind(this, 4)
        );
        this.lastSpellMat = this.Spell1Mat;
    }
    
    private Cast_Spell(pressed: number) {
        if (pressed == 1 && !this.isBlocking) {
            // Haptics
            this.gameController.sendRumble(20, 10);

            const spellTransform = this.Spell.getTransform();
            const origin = spellTransform.getWorldPosition();
            // Get the local z direction in world space
            const direction = spellTransform.getWorldRotation().multiplyVec3(vec3.forward());
            // Set the ray end point (e.g., 100 units forward)
            const rayEnd = origin.add(direction.uniformScale(100));

            // Create a global probe and raycast
            let hitDistance = 100;
            const globalProbe = Physics.createGlobalProbe();
            globalProbe.rayCast(origin, rayEnd, function(hit) {
                if (hit) {
                    print("Raycast hit: " + hit.collider.getSceneObject().name);
                    print("Hit point: " + hit.position);
                    hitDistance = origin.distance(hit.position);

                } else {
                    print("No hit detected.");
                }
            });

            // Scale the z axis of the spell object to be the distance 
            this.Spell.enabled = true;
            const currentScale = spellTransform.getLocalScale();
            this.Spell.getTransform().setLocalScale(new vec3(currentScale.x, currentScale.y, hitDistance));
            // Wait 0.3 secs to reset
            const delayedEvent = this.createEvent("DelayedCallbackEvent");
            delayedEvent.bind(() => {
                this.Spell.getTransform().setLocalScale(new vec3(currentScale.x, currentScale.y, 0));
                this.Spell.enabled = false;
            });
            delayedEvent.reset(0.3);
        }
    }

    private Change_Spell(spell: number, pressed: boolean) {
        // Change the spell based on the input number

        // Block
        print("Changing to spell " + spell + " pressed: " + pressed);
        if (spell == 4){
            this.isBlocking = pressed;
            print("Blocking: " + this.isBlocking);
            if (this.isBlocking) {
                this.Spell.getComponent("Component.RenderMeshVisual").mainMaterial = this.BlockMat;
                this.Spell.enabled = true;
            } else {
                this.Spell.getComponent("Component.RenderMeshVisual").mainMaterial = this.lastSpellMat;
                this.Spell.enabled = false;
            }

            return;
        }

        // Colour Spells
        if (pressed && !this.isBlocking){
            switch (spell) {
                case 1:
                    this.Spell.getComponent("Component.RenderMeshVisual").mainMaterial = this.Spell1Mat;
                    this.lastSpellMat = this.Spell1Mat;
                    break;
                case 2:
                    this.Spell.getComponent("Component.RenderMeshVisual").mainMaterial = this.Spell2Mat;
                    this.lastSpellMat = this.Spell2Mat;
                    break;
                case 3:
                    this.Spell.getComponent("Component.RenderMeshVisual").mainMaterial = this.Spell3Mat;
                    this.lastSpellMat = this.Spell3Mat;
                    break;
                // case 4:
                //     this.Spell.getComponent("Component.RenderMeshVisual").mainMaterial = this.Spell4Mat;
                //     this.lastSpellMat = this.Spell4Mat;
                //     break;
                
                default:
                    break;
            }
        }
    }

    onUpdate() {
        // Get the world positions of the left and right hands
        const leftPos = this.leftHand.getTransform().getWorldPosition();
        const rightPos = this.rightHand.getTransform().getWorldPosition();

        // Only show the mesh if the hands are a certain distance apart
        const distance = leftPos.distance(rightPos);
        if (distance < 25) {
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