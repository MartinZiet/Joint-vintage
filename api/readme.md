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



POST /structure/objects/:ID ['name','alias_id'...]
  update obiektu

/structure/objects/:ID/contents [empty]
  pobiera content dla obiektu

POST /structure/objects/:ID/contents/:ID ['name','content',...]
  update contentu

POST /structure/objects/:ID/searches/:ID/friendship
  dodaje przyjaciela na podstawie znalezionego obiektu


GET /friends/:ID/objects/:ID/contents [empty]
  pobiera content obiektu przyjaciela