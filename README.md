# Individuell uppgift u02 - Egen portfoliosida
[Uppgiften live på Netlify](https://idaohlen-u02.netlify.app)

## Sammanfattning av projekt

Jag har byggt en personlig portfolio-sida med HTML, CSS samt använt JavaScript för att skapa interaktiva inslag och dynamiskt skapa innehåll utifrån lokala JSON-filer samt extern data hämtad genom GitHubs API.

Eftersom portfolio5 innehåller relativt lite innehåll valde jag att bygga den som en single page, med en navigationsmeny som scrollar ner till innehållet i respektive sektion. Detta behöver man inte nödvändigtvis lösa med JavaScript, men jag var tvungen att göra det för att CSS-only lösningen inte funkade ihop med en annan scroll-baserad funktion jag använder på sidan. Navigationen är responsiv och kan i mobilvy väljas att öppnas eller stängas, vilket är implementerat med JavaScript. Den första “intro”-sektionen har en 100vh höjd tills att man scrollar ner, då krymper den ihop. Det har jag implementerat med hjälp av intersection observer API:n, som ska vara mer prestandavänlig än att lägga en eventlyssnare med “scroll” på body, vilket jag testade först.

I sektionen “Projects” laddar jag in några repos genom GitHubs API för detta med `fetch()`. Jag hämtar namn + description, plus att jag kör en extra fetch efter använda "languages" att visa i mina cards för projekten. Bilderna finns lokalt i portfoliot, och jag använder `fetch()` för att se om det existerar en bild med ett filnamn som överensstämmer med namnet på projektet, annars visas ingen bild (detta för att försöka undvika HTTP-errors ifall det inte går att hitta någon bild). Klickar man på ett card poppar det också up en modulruta. Popup-modalen är ganska värdelös innehållsmässigt då det inte tillför något att klicka fram den, utan den är mest där för att jag ville testa att använda det inbyggda `<dialog>` HTML-elementet och lösa lite problem som att stänga den när man klickar utanför modalen, och att stoppa att man kan fortsätta scrolla på sidan när den är öppnad.

Innehållet i “about me” sektionen laddar jag in från JSON-filer som ligger lokalt i portfolio-projektet.

I de sektioner där jag fetch:ar innehåll så har jag byggt in en animerad loader som snurrar medan innehållet laddas in. Eftersom mitt internet var för snabbt blev det lite svårt att felsöka ifall de faktiskt funkade, men med hjälp av webläsarens devtools kunde jag simulera långsamt internet och se till att det fungerade som det skulle.

Överlag så har jag fått till de funktioner jag ville ha på sidan, och gjorde en enkel och stilren design som ser bra ut både på desktop och mobil. Det är lagom mycket animationer för att ge ett lite mjukare intryck när man scrollar och hovrar över element. Det hade varit kul att göra en lite mer kreativ design, men samtidigt föredrar jag portfoliosidor som är enklare och lätta att läsa.

## Teoretiska frågor
### Vad kan man utveckla m.h.a av Javascript inom frontend?
I teorin kan man utveckla i stort sett vad som helst med JavaScript, vilket många utvecklare också har gjort. JavaScripts huvudsakliga uppgift som ett programmeringsspråk är att skapa interaktivitet på hemsidor, vilket innebär att det är uppbyggt med detta i åtanke. Att skriva kod till frontend innebär att man kommer att använda sig av JavaScript, då det i stort sett är det enda språket som är integrerat att kunna kommunicera direkt med webbläsaren.

En stor del av frontendutveckling med JavaScript handlar om att kunna manipulera DOM:en, en hierarkisk struktur av ett HTML-dokument som renderas på en hemsida. Genom DOM-manipulation kan man skapa, ta bort och flytta runt HTML element, samt att ändra deras utseende genom CSS som även det går att manipulera via JavaScript. En annan stor del av JavaScript är att kunna lyssna efter händelser som användare utför på sidan, och därefter exekutera kod utefter det. Det finns också ett flertal webb-API:er som ger JavaScript tillgång till många olika sätt att kontrollera saker i webbläsaren och till och med komma åt information från användarens maskin.

JavaScript innehåller samma grundläggande programmeringskoncept som andra programmeringsspråk så som variabler, funktioner, loopar och matematiska räknesätt, vilket innebär att man kan göra beräkningar, återanvända kod och utföra repetetiva uppgifter mer effektivt. JavaScript kan även hämta in data från externa eller interna API:er och använda det till att skapa dynamiskt innehåll, eller för att visa information som sparas på serversidan eller i externa databaser.

### Vad är JSON och hur används det inom frontend?
JSON står för “JavaScript Object Notation” och är ett dataformat med ett syntax som efterliknar JavaScript-objekt, vilket gör det lätt att konvertera data från JSON-filer till något som kan bearbetas i JavaScript. Detta innebär att JSON framförallt används inom webbutveckling, men man kan även stöta på det i andra applikationer där utvecklaren ansett att JSON bra för att representera data.

Att använda JSON i praktiken inom frontend innebär att man kan spara data i separata filer frånskilt från sina JS-dokument för bättre organisation, och när man jobbar med API:er är det vanligt att den informationen man skickar/tar emot ges i JSON-format på grund av den enkla konverteringen till JavaScript-objekt.

XML är ett annat typ av format som är populärt vars syntax liknar HTML, och är delvis en föregångare till JSON då det släpptes många år tidigare, och JSON blev inte formellt en rekommendation inom internetstandarden förrän år 2013. Beroende på vad man har för behov kan ett format vara mer lämpligt än ett annat, men för just API:er på webben är JSON edn utbredd standard.

### Vad är HTTP och varför bör man som frontendutvecklare ha kunskap om det och dess protokoll?

HTTP är ett protokoll för att skicka data över webben mellan t.ex. en webbläsare och en webbserver. HTTP är byggt på att man skickar förfrågningar mellan enheter och sedan får svar som innehåller det man frågat efter, vilket kan bestå av HTML-sidor, CSS, bilder, JavaScript-filer, data i form av JSON eller XML, m.m.

Som frontendutvecklare behöver man inte nödvändigtvis ha en djupgående teknisk förståelse för hur HTTP-protokollet fungerar, men man behövber ändå ha en grundlig förståelse av det för att kunna utföra vissa frontenduppgifter så som att skicka data via formulär, eller för att skicka och ta emot data via API:er. Det är också nödvändigt att veta vad felmeddelanden betyder när något inte gått till som man tänkt sig, då blir det lättare att felsöka vart någonstans det har blivit fel; en felstavning i frontend-koden som gör att HTTP-requesten inte kommer iväg dit den ska är lätt att åtgärda, men dålig internetuppkoppling eller ett fel på servern är svårare att fixa, men då vet man i varje fall vad problemet är och behöver inte slösa tid på att försöka fixa fel orsak.


## Resurser

- [Icons generated from iconify.design](https://iconify.design)
- [Animated hamburger menu](https://codepen.io/designcouch/pen/ExvwPY)
- [Scrolling text marquee](https://getbutterfly.com/javascript-marquee-a-collection-of-scrolling-text-snippets/)
