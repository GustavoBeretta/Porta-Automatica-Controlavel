#include <Servo.h>
#include <SoftwareSerial.h>

const int trigPin = 7;
const int echoPin = 8;
Servo servoMotor;

SoftwareSerial espSerial(0, 1);

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  servoMotor.attach(9);
  servoMotor.write(0);
  Serial.begin(9600);
  espSerial.begin(115200);

  sendCommand("AT", 2000);

  String ssid = "S22+ de Gustavo"; 
  String password = "12345678";
  sendCommand("AT+CWJAP=\"" + ssid + "\",\"" + password + "\"", 5000);

  checkWiFiConnection();
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
    sendDistanceToBackend(distancia);
  } else if (distancia < 440) {
    servoMotor.write(0);
  }

  delay(500);
}

void sendCommand(String command, const int timeout) {
  String response = "";
  espSerial.println(command);
  unsigned long previousMillis = millis();
  
  while (millis() - previousMillis < timeout) {
    while (espSerial.available()) {
      char c = espSerial.read();
      response += c;
    }
  }
  
  Serial.println(response);
}

void checkWiFiConnection() {
  // Verifica a conexão Wi-Fi
  sendCommand("AT+CWJAP?", 5000);  // Envia o comando para verificar se o ESP está conectado à rede Wi-Fi
  sendCommand("AT+CIPSTATUS", 5000);  // Verifica o status da conexão de rede
  Serial.print("Estou aqui0");
}

void sendDistanceToBackend(int distancia) {
  String postData = "{\"distancia\": \"" + String(distancia) + "\"}";
  String url = "http://192.168.194.137:8000/controle";

  Serial.print("Estou aqui");

  sendCommand("AT+CIPSTART=\"TCP\",\"" + url + "\",80", 3000);
  delay(1000);

  Serial.print("Estou aqui2");
  
  String request = "POST /controle HTTP/1.1\r\n";
  request += "Host: IP_DO_SEU_SERVIDOR\r\n";
  request += "Content-Type: application/json\r\n";
  request += "Content-Length: " + String(postData.length()) + "\r\n";
  request += "\r\n";
  request += postData;

  sendCommand("AT+CIPSEND=" + String(request.length()), 2000);  // Enviar o tamanho da requisição
  sendCommand(request, 2000);  // Enviar a requisição POST

  Serial.print("Estou aqui3");
}