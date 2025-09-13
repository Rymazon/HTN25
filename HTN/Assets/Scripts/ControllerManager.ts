import { GameController } from "GameController.lspkg/GameController";
import { ButtonStateKey } from "GameController.lspkg/Scripts/ButtonState";

@component
export class testScript extends BaseScriptComponent {
    private gameController: GameController = GameController.getInstance();

    onAwake() {
        this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
    }

    onStart() {
        this.gameController.scanForControllers();
        //register button presses
        this.gameController.onButtonStateChanged(
            ButtonStateKey.a,
            this.A_Func.bind(this)
        );
    }
    
    private A_Func(pressed: boolean) {
        if (pressed) {
            print("A BUTTON PRESSED");
        }
    }
}