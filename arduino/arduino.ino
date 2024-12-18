#include <WiFi.h>
#include <HTTPClient.h>
#include <Servo.h>

const int trigPin = 7;
const int echoPin = 8;
Servo servoMotor;

const char* ssid = "S22+ de Gustavo";
const char* password = "12345678";
const String serverURL = "http://192.168.0.160:8000/logging";

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  servoMotor.attach(9);
  servoMotor.write(0);
  Serial.begin(115200);

  Serial.print("Conectando-se ao WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado ao WiFi.");
}

void loop() {
  int distanciaLimite = 20;

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duracao = pulseIn(echoPin, HIGH);
  int distancia = duracao * 0.034 / 2;

  Serial.print("Distancia: ");
  Serial.print(distancia);
  Serial.print(" cm | Limiar: ");
  Serial.print(distanciaLimite);
  Serial.println(" cm");

  if (distancia <= distanciaLimite) {
    servoMotor.write(90);
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;

      http.begin(serverURL);
      http.addHeader("Content-Type", "application/json");

      String payload = "{\"distancia\": " + String(distancia) + "}";
      int httpResponseCode = http.POST(payload);

      if (httpResponseCode > 0) {
        Serial.print("Resposta do servidor: ");
        Serial.println(httpResponseCode);
      } else {
        Serial.print("Erro ao enviar os dados: ");
        Serial.println(http.errorToString(httpResponseCode).c_str());
      }

      http.end();
    } else {
      Serial.println("Falha na conexão WiFi.");
    }
  } else if (distancia < 440) {
    servoMotor.write(0);
  }

  delay(500);
}
