﻿# Central BioHub Predictor Tool

## Getting Started

#### Starten der Entwicklungsumgebung

1. CBHPredictorWebAPI > CBHPredictorWebAPI.sln öffnen > mit Klick auf den Playbutton starten
	- Swagger Website kann geschlossen werden
	- Terminal *muss* geöffnet bleiben
2. cbh-app > Dateipfad im Explorer anklicken > *cmd* eintippen
	1. *code .* eingeben > Ordner öffnet sich in VS Code
	2. *npm start* eingeben > Website öffnet sich im Browser
		- Terminal *muss* geöffnet bleiben
		- Website sollte geöffnet bleiben > Änderungen im Code werden in Echtzeit ausgeführt

## Quickfixes

Grundsätzlich gibt es zwei Arten von potenziellen Fehlern:

#### 1. Http-Methoden geben Fehler zurück

Geben die Methoden nach dem Ausführen einen Fehler (in der Regel Code 500) zurück, liegt das daran, dass zwischenzeitlich die Struktur der Datenbank verändert wurde.

Zur Lösung des Problems  

1. SQL Server Management Studio (SSMS) öffnen
	- Unterpunkt Datenbanken > CBHDB
	- Rechtsklick > Löschen
2. WebAPI in Visual Studio öffnen
	- Tools(Extras) > NuGet Paket Manager > NuGet Paket Manager Console
	- Befehl *Update-Database* eingeben

#### 2. Die Website lässt sich nicht öffnen

Aufgrund eines Fehlers beim ersten Interface-Commit kann es sein, dass die Website beim Öffnen nur einen weißen Bildschirm zeigt. 

Zur Lösung des Problems
1. In den *cbh-app* Ordner navigieren
2. Klick in die Adresszeile > *cmd* eintippen
	- *npm install react-scripts* in Konsole eingeben

In den aktuellen Interface-Versionen sollte dieses Problem eigentlich behoben sein. Falls es doch noch auftreten sollte, bitte Bescheid geben.
