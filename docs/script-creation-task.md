Create a NodeJS script which will extract the data found PDF document  @docs/fina.pdf found in tables on pages from page 4 to page 19.

The extraction schema is described in examples provided below (comments explain where each information was found in the PDF)

Let's have a look how data can be extracted for table "HR01" found on page 4 in the document:

```json
  // object name "HR01" from cell (column 0, row 1)
 "HR01": {
    // extracted from cell (column 1, row 1)-(column 4, row 4)
    "dijelovi": [
      // from table column 1
      {
        // from cell (column 1, row 1)
        "part": "(P1",
        // from cell (column 1, row 2)
        "sadrzajPodataka": "-",
        // from cell (column 1, row 3)
        "tip": "Varijabilno",
        // from cell (column 1, row 4)
        "duljinaPodataka": "Varijabilno Najviše do 12 znamenaka"
      },
      // from table column 2
      {
        // from cell (column 2, row 1)
        "part": "- P2",
        // from cell (column 2, row 2)
        "sadrzajPodataka": "-",
        // from cell (column 2, row 3)
        "tip": "Varijabilno",
        // from cell (column 2, row 4)
        "duljinaPodataka": "Varijabilno Najviše do 12 znamenaka"
      },
      // from table column 3
      {
        // from cell (column 3, row 1)
        "part": "- P3)K",
        // from cell (column 3, row 2)
        "sadrzajPodataka": "-",
        // from cell (column 3, row 3)
        "tip": "Varijabilno",
        // from cell (column 3, row 4)
        "duljinaPodataka": "Varijabilno Najviše do 12 znamenaka"
      },
      // from table column 4
      {
        // from cell (column 4, row 1)
        "part": "-",
        // from cell (column 4, row 2)
        "sadrzajPodataka": "-",
        // from cell (column 4, row 3)
        "tip": "-",
        // from cell (column 4, row 4)
        "duljinaPodataka": "-"
      }
    ],
    // extracted from row 5
    "modulZaIzracunKontrolnogBroja": [
        // from a cell which spans columns 1 to 3 at row 5 
      "MOD11INI-za inicijalne modele (jedan kontrolni broj odnosi se za sva tri podatka)",
      // from cell (column 4, row 5)
      "-"
    ]
  },
```

Let's have a look how data can be extracted for table "HR65" found on page 18 in the document:

```json
  // object name "HR65" from cell (column 0, row 1)
  "HR65": {
    // extracted from cell (column 1, row 1)-(column 4, row 4)
    "dijelovi": [
      {
        // from cell (column 1, row 1)
        "part": "P1(K)",
        // from cell (column 1, row 2)
        "sadrzajPodataka": "Vrsta prihoda iz Naputka",
        // from cell (column 1, row 3)
        "tip": "Fiksno",
        // from cell (column 1, row 4)
        "duljinaPodataka": "Ima 4 znamenke"
      },
      {
        // from cell (column 2, row 1)
        "part": "- (P2)K",
        // from cell (column 2, row 2)
        "sadrzajPodataka": "Podvrsta prihoda koji se plaća",
        // from cell (column 2, row 3)
        "tip": "Fiksno",
        // from cell (column 2, row 4)
        "duljinaPodataka": "Ima 3 znamenke",
      },
      {
        // from cell (column 3, row 1)
        "part": "- (P3)K",
        // from cell (column 3, row 2)
        "sadrzajPodataka": "Redni broj proračunskog korisnika iz RKP/identifikator korisnika/ OIB",
        // from cell (column 3, row 3)
        "tip": "Varijabilno",
        // from cell (column 3, row 4)
        "duljinaPodataka": "Najviše do 11 znamenaka",
      },
      {
        // from cell (column 4, row 1)
        "part": "- P4",
        // from cell (column 4, row 2)
        "sadrzajPodataka": "-",
        // from cell (column 4, row 3)
        "tip": "Varijabilno",
        // from cell (column 4, row 4)
        "duljinaPodataka": "Najviše do 10 znamenaka",
      },
    ],
    // extracted from row 5
    "modulZaIzracunKontrolnogBroja": [
      // from cell (column 1, row 5)
      "MOD11INI – za inicijalne modele",
      // from cell (column 2, row 5)
      "MOD11INI – za inicijalne modele",
      // from cell (column 3, row 5)
      "MOD11INI za inicijalne modele - od 6 do10 znamenaka; ISO 7064 (11,10) – 1983(E) do 5 i za 11 znamenaka",
      // from cell (column 4, row 5)
      "-"      
    ]
  }
```

Additional info:
- cell handling
  - row 0 can be ignored
  - column 0 can be ignored except for cell in row 1 (see the example)
  - in case of an empty cell store "" in JSON
  - in case cell contains only "-" store it as "-"
- store script in @docs/extract-fina-data.js file
- script should store outpit in @docs/fina.json file
- all tables have 6 rows and 5 columns
- output JSON should ne a flat object ({"HR01": {...}, "HR02": {...}})
- no special handling is needed for croatian characters - copy them as they are
- row 5 can contain spanned cells - treat spanned cell as a single cell
- you can install required NPM packages for working with PDF documents if none are available
- there are 47 tables in total: HR01,HR02,HR03,HR04,HR05,HR06,HR07,HR08,HR09,HR10,HR11,HR12,HR13,HR14,HR15,HR16,HR17,HR18,HR19,HR23,HR24,HR26,HR27,HR28,HR29,HR30,HR31,HR33,HR34,HR35,HR40,HR41,HR42,HR43,HR55,HR62,HR63,HR64,HR65,HR67,HR68,HR69,HR99,HR25,HR83,HR84,HR50
- there can be multiple tables per page (1 to 3)
- text flow in the document might not allign with the cells it is visually displayed in - script should take this into account