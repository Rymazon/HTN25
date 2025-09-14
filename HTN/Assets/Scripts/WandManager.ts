
const SERVICE_UUID = "0000FFE5-0000-1000-8000-00805F9B34FB";
const CHARACTERISTIC_UUID = "0000FFE6-0000-1000-8000-00805F9B34FB";

@component
export class BLEArduino extends BaseScriptComponent {

  @input
  private Spell: SceneObject;

  @input
  private Spell1Mat: Material;

  @input
  private Spell2Mat: Material;

  @input
  private Spell3Mat: Material;

  @input bluetoothModule: Bluetooth.BluetoothCentralModule;

  private scanFilter = new Bluetooth.ScanFilter();
  private scanSetting = new Bluetooth.ScanSettings();

  onAwake() {
    this.scanFilter.serviceUUID = SERVICE_UUID;
    this.scanSetting.uniqueDevices = true;
    this.scanSetting.scanMode = Bluetooth.ScanMode.Balanced;
    this.scanSetting.timeoutSeconds = 1000;
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }

  private onStart() {
    this.startScan();
  }

  private startScan() {
    this.log("starting scan...");
    this.bluetoothModule
      .startScan(
        [this.scanFilter],
        this.scanSetting,
        (scanResult: Bluetooth.ScanResult) => {
          this.log("Found device: " + scanResult.deviceName);
          return true;
        }
      )
      .then((scanResult) => {
        print("Scan result: " + scanResult.deviceName);
        this.bluetoothModule.stopScan().then(() => {
          this.connectGATT(scanResult);
        });
      })
      .catch((error) => {
        this.log("Error during scan: " + error);
      });
  }

  private async connectGATT(scanResult: Bluetooth.ScanResult) {
    this.log("Attempting connection: " + scanResult.deviceAddress);
    var gatt = await this.bluetoothModule.connectGatt(scanResult.deviceAddress);
    this.log("Got connection result...");
    let desiredService = gatt.getService(SERVICE_UUID);
    let desiredChar = desiredService.getCharacteristic(CHARACTERISTIC_UUID);
    gatt.onConnectionStateChangedEvent.add(async (connectionState) => {
      this.log("Connection state changed: " + connectionState.state);
      if (connectionState.state == Bluetooth.ConnectionState.Disconnected) {
        this.log("Disconnected from: " + scanResult.deviceName);
      }
      if (connectionState.state == Bluetooth.ConnectionState.Connected) {
        this.log("Connected to device: " + scanResult.deviceName);
        //send example value to Arduino
        this.log("writing value...");
        await desiredChar.writeValue(this.str2bin("HI FROM Spectacles"));
        this.log("done write!");
        desiredChar
          .registerNotifications((value) => {
            var message = this.bin2str(value);
            print("Notification: " + message);
            if(message == "C")
            {
              // Cast Spell
              this.Cast_Spell();
            }
            else if(message == "1")
            {
              // Change to Spell 1
              this.Change_Spell(1);
            }
            else if(message == "2")
            {
              // Change to Spell 2
              this.Change_Spell(2);
            }
            else if(message == "3")
            {
              // Change to Spell 3
              this.Change_Spell(3);
            }
            else if(message == "4")
            {
              // Change to Spell 4 (Block?)
            }

            return message;
          })
          .then(() => {
            this.log("Notifications registered successfully.");
          })
          .catch((error) => {
            this.log("Error registering notifications: " + error);
          });
      }
    });
  }

  private bin2str(array: Uint8Array) {
    var result = "";
    for (var i = 0; i < array.length; i++) {
      result += String.fromCharCode(array[i]);
    }
    return result;
  }

  private str2bin(str: string) {
    const out = new Uint8Array(str.length);
    for (let i = 0; i < str.length; ++i) {
      out[i] = str.charCodeAt(i);
    }
    return out;
  }

  private log(message: string) {
    print("BLE TEST: " + message);
  }

  private Cast_Spell() {

          const spellTransform = this.Spell.getTransform();
          const origin = spellTransform.getWorldPosition();
          // Get the local z direction in world space
          const direction = spellTransform.getWorldRotation().multiplyVec3(vec3.forward());
          // Set the ray end point (e.g., 100 units forward)
          const rayEnd = origin.add(direction.uniformScale(100));
          print("Casting spell from " + origin + " to " + rayEnd);

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
          });
          delayedEvent.reset(0.3);
    }

    private Change_Spell(spell: number) {
        // Change the spell based on the input number

        // Colour Spells

            switch (spell) {
                case 1:
                    this.Spell.getComponent("Component.RenderMeshVisual").mainMaterial = this.Spell1Mat;
                    break;
                case 2:
                    this.Spell.getComponent("Component.RenderMeshVisual").mainMaterial = this.Spell2Mat;
                    break;
                case 3:
                    this.Spell.getComponent("Component.RenderMeshVisual").mainMaterial = this.Spell3Mat;
                    break;

                default:
                    break;
            }
    }
}