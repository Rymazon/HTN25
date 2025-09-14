@component
export class LabubuManager extends BaseScriptComponent {

    @input
    private cameraObj: SceneObject;

    @input
    LabubuPrefab: ObjectPrefab;

    onAwake() {

    }

    SpawnLabubu(){
        // Assume the player's camera is at the origin and looking along the world forward (z) axis
        // You may want to replace this with your actual camera position and forward direction
        const cameraTransform = this.cameraObj.getTransform();
        const camPos = cameraTransform.getWorldPosition();
        const camForward = cameraTransform.getWorldRotation().multiplyVec3(vec3.forward());

        // Random angle within [-25, 25] degrees (50 degree FOV)
        const angleDeg = (Math.random() * 50) - 25;
        const angleRad = angleDeg * Math.PI / 180;

        // Create a rotation around the camera's up axis
        const camUp = cameraTransform.getWorldRotation().multiplyVec3(vec3.up());
        const rot = quat.angleAxis(angleRad, camUp);
        const spawnDir = rot.multiplyVec3(camForward).normalize();

        // Choose a random distance from the camera (e.g., 3 to 6 units away)
        const distance = 20 + Math.random() * 70;
        const spawnPos = camPos.add(spawnDir.uniformScale(distance));
        
        // Make a copy of self
        print("Spawning Labubu at: " + spawnPos);
        const newLabubu = this.LabubuPrefab.instantiate(this.sceneObject);
        newLabubu.getTransform().setWorldPosition(spawnPos);

        //const newLabubu = this.LabubuObj.getParent().copySceneObject(this.LabubuObj);
        // newLabubu.getTransform().setWorldPosition(spawnPos);
        // newLabubu.enabled = true;

    }
}
