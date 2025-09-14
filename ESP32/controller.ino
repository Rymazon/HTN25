#include <Wire.h>
#include <MPU6050_light.h>

MPU6050 mpu(Wire);

const float THRESH_VEL = 190;
const unsigned long EVENT_COOLDOWN = 500; // ms between logged actions

unsigned long lastEvent = 0;

void setup() {
  Serial.begin(115200);
  Wire.begin();

  byte status = mpu.begin();
  Serial.print("MPU status: ");
  Serial.println(status);
  while (status != 0) { } // stop if sensor not found

  Serial.println("Calibrating... keep device still");
  delay(1000);
  mpu.calcOffsets(); // gyro and accel offsets
  Serial.println("Calibration done");
}

void loop() {
  mpu.update();
  float angleX = mpu.getGyroX(); // pitch (up/down)
  float angleY = mpu.getGyroY(); // roll (bank right/bank left)
  float angleZ = mpu.getGyroZ(); // yaw (right/left)

  unsigned long now = millis();
  if (now - lastEvent > EVENT_COOLDOWN) {
    if (angleX > THRESH_VEL) {
      logAction("UP", angleX);
    } else if (angleX < -THRESH_VEL) {
      logAction("DOWN", angleX);
    } else if (angleY > THRESH_VEL) {
      logAction("BANK RIGHT", angleY);
    } else if (angleY < -THRESH_VEL) {
      logAction("BANK LEFT", angleY);
    } else if (angleZ > THRESH_VEL) {
      logAction("LEFT", angleZ);
    } else if (angleZ < -THRESH_VEL) {
      logAction("RIGHT", angleZ);
    }
  }
}

void logAction(const char* action, float value) {
  lastEvent = millis();
  Serial.print(lastEvent);
  Serial.print(",");
  Serial.print(action);
  Serial.print(",");
  Serial.println(value, 1); // log value with 1 decimal
}
