Uwagi:

1. Wydaje mi się że ma sens konfiguracja dostępu do obiektów z 2 perspektyw:
   * obiekty zalogowanego użytkownika
   * dostęp do obiektów przyjaciół / wyników searchów itp
   
   Mimo że to są różne ścieżki to zapewne będą wołać te same metody w modelu.
   Myślę że podział może potem się przydać w ustalaniu uprawnień poza tym
   w ten spoób API jest semantycznie bardziej czytelne.
   Nie mniej jednak nie upieram się przy tym podziale, można to zmergować
   jako np /objects/:ID bez względu na to czyj jest obiekt

2. Nie mam pewności czy przyjaźć jest definiowana zawsze dla obiektów czy też może
   jakoś bardziej ogólnie pomiędzy userami.

3. Tam gdzie pobieramy zaprzyjaźnione obiekty, wyniki wyszukiwania i content
   być może trzeba dać możliwość przesłania parametru który określi czy pobieramy
   dane wyłącznie dla danego obiektu czy dane zagregowane z childów 
   (to chyba powinien być domyślny tryb).

4. W nawiasach kwadratowych dodałem przykładowe zmienne które będą przesyłane
   (te listy są tylko poglądowe)
   [empty] oznacza brak konieczności przesyłania czegokolwiek czyli wszystko mamy w ścieżce

POST /login ['username','password']
  autoryzuje sesję

POST /signup ['username','password','name']
  dodaje usera i autoryzuje sesję

GET /aliases [empty]
  pobiera listę aliasów

PUT /aliases ['name']
  dodaje alias

DELETE /aliases/:ID [empty]
  usuwa alias

GET /structure [empty]
  pobiera strukturę obiektów dla usera z sesji

PUT /structure/objects/:ID ['name','alias_id',...]
  dodaje nowy obiekt jako childa

POST /structure/objects/:ID ['name','alias_id'...]
  update obiektu

DELETE /structure/objects/:ID [empty]
  usuwa obiekt

/structure/objects/:ID/contents [empty]
  pobiera content dla obiektu

PUT /structure/objects/:ID/contents ['name','content',...]
  dodaje content dla obiektu

POST /structure/objects/:ID/contents/:ID ['name','content',...]
  update contentu

DELETE /structure/objects/:ID/contents/:ID [empty]
  usuwa content

GET /structure/objects/:ID/friends [empty]
  pobiera przyjaciol dla danego obiektu (razem z listą obiektów)

GET /structure/objects/:ID/searches [empty]
  pobiera wyniki wyszukiwania dla danego obiektu

POST /structure/objects/:ID/searches/:ID/friendship
  dodaje przyjaciela na podstawie znalezionego obiektu

GET /friends [empty]
  pobiera listę wszystkich przyjaciół dla usera z sesji

POST /friends/:ID/objects/:ID/friendship
  potwierdza przyjaźń

DELETE /friends/:ID/objects/:ID/friendship

GET /friends/:ID/objects/:ID [empty]
  pobiera obiekt przyjaciela

GET /friends/:ID/objects/:ID/contents [empty]
  pobiera content obiektu przyjaciela

GET /friends/:ID/objects/:ID/chat [empty]
  pobiera tresc chatu dla obiektu przyjaciela

PUT /friends/:ID/objects/:ID/chat ['message']
  dodaje wiadomosc do tresci chatu dla obiektu przyjaciela