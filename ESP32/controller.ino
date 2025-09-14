#include <Wire.h>
#include <MPU6050_light.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

MPU6050 mpu(Wire);

// thresholds
const float GYRO_THRESH = 280;        // deg/s for flicks
const unsigned long EVENT_COOLDOWN = 200; // ms
const unsigned long COMBO_TIMEOUT = 2000; // ms between actions

const int MAX_SPELLS = 4;

// action buffer
struct Action {
  String name;
  unsigned long timestamp;
};

const int MAX_ACTIONS = 5;
Action actionBuffer[MAX_ACTIONS];
int actionCount = 0;

unsigned long lastEvent = 0;
int current_selection = 1;

// BLE
BLEServer* pServer;
BLECharacteristic* pCharacteristic;

#define SERVICE_UUID        "0000ffe5-0000-1000-8000-00805f9b34fb"
#define CHARACTERISTIC_UUID "0000ffe6-0000-1000-8000-00805f9b34fb"

void setup() {
  Serial.begin(115200);
  Wire.begin();

  // Init MPU
  byte status = mpu.begin();
  Serial.print("MPU status: "); Serial.println(status);
  while (status != 0) {} // stop if not connected

  Serial.println("Calibrating... keep still");
  delay(1000);
  mpu.calcOffsets();
  Serial.println("Calibration done");

  // Init BLE
  BLEDevice::init("MPU6050_Logger");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);

  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ |
                      BLECharacteristic::PROPERTY_WRITE |
                      BLECharacteristic::PROPERTY_NOTIFY
                    );

  pCharacteristic->setValue("READY");
  pService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  BLEDevice::startAdvertising();

  Serial.println("BLE ready, advertising...");
}

void loop() {
  mpu.update();

  float gx = mpu.getGyroX();
  float gy = mpu.getGyroY();
  float gz = mpu.getGyroZ();

  unsigned long now = millis();
  if (now - lastEvent > EVENT_COOLDOWN) {
    if (gx > GYRO_THRESH) { addAction("PITCH_UP"); } // pitch up
    else if (gx < -GYRO_THRESH) { addAction("PITCH_DOWN"); } // pitch down
    else if (gy > GYRO_THRESH) { addAction("ROLL_RIGHT"); } // roll right
    else if (gy < -GYRO_THRESH) { addAction("ROLL_LEFT"); } // roll left
    else if (gz > GYRO_THRESH) { addAction("YAW_LEFT"); } // yaw left
    else if (gz < -GYRO_THRESH) { addAction("YAW_RIGHT"); } // yaw right
  }
}

// -------------------- Action Buffer --------------------

void addAction(String act) {
  unsigned long now = millis();
  lastEvent = now;

  // shift buffer if full
  if (actionCount >= MAX_ACTIONS) {
    for (int i = 1; i < MAX_ACTIONS; i++) {
      actionBuffer[i - 1] = actionBuffer[i];
    }
    actionCount--;
  }

  actionBuffer[actionCount++] = {act, now};

  Serial.print("Action detected: ");
  Serial.println(act);

  sendBLE(act); // notify BLE client
  checkCombos();
}

void checkCombos() {
  Action prev1_action = actionBuffer[actionCount - 1];

  if (actionCount >= 2) {
    Action prev2_action = actionBuffer[actionCount - 2];
    unsigned long dt = prev2_action.timestamp - prev1_action.timestamp;

    if (prev2_action.name == "PITCH_UP" && prev1_action.name == "PITCH_DOWN") {
      String combo = "C";
      Serial.println(">>> " + combo);
      sendBLE(combo);
      actionCount = 0;
    };
  };

  if (prev1_action.name == "ROLL_RIGHT" || prev1_action.name == "YAW_RIGHT"){
    current_selection ++;
    if(current_selection > MAX_SPELLS) current_selection = 1;
    String combo = String(current_selection);
    Serial.println(">>> " + combo);
    sendBLE(combo);
    actionCount = 0;
  };
  
  if (prev1_action.name == "ROLL_LEFT" || prev1_action.name == "YAW_LEFT"){
    current_selection --;
    if(current_selection < 1) current_selection = MAX_SPELLS;
    String combo = String(current_selection);
      Serial.println(">>> " + combo);
      sendBLE(combo);
      actionCount = 0;
  };
}

// -------------------- BLE helper --------------------

void sendBLE(String msg) {
  pCharacteristic->setValue(msg.c_str());
  pCharacteristic->notify();
}
