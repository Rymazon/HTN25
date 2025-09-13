"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllerTracker = void 0;
var __selfType = requireType("./controllerTracker");
function component(target) { target.getTypeName = function () { return __selfType; }; }
let controllerTracker = class controllerTracker extends BaseScriptComponent {
    OnAwake() {
        print("THIS THING JUST STARTED.");
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    }
    onUpdate() {
        const leftPos = this.leftHand.getTransform().getWorldPosition();
        const rightPos = this.rightHand.getTransform().getWorldPosition();
        print("Left Hand Position: " + leftPos);
        print("Right Hand Position: " + rightPos);
    }
};
exports.controllerTracker = controllerTracker;
exports.controllerTracker = controllerTracker = __decorate([
    component
], controllerTracker);
//# sourceMappingURL=controllerTracker.js.map