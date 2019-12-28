console.clear();

/**
 * Choose Your Own Adventure-style data structure.
 *
 * Works on the principle of 'entries'/'chapters', like the oldschool 'turn to 100'
 * style Fighting Fantasy gamebooks - this is *not* a proper text adventure engine 
 * with full location, inventory and state management. It could probably be adapted
 * to that quite easily, though.
 *
 * Definition format:
 *
 * Content:
 * - id: unique string ID for use in 'goto'/'next'.
 * - text: body text for this entry.
 * - extra: array of additional paragraphs:
 *      - text: text for this paragraph
 *      - requires: string/array of item(s) required for this paragraph
 *                  to be included.  Use '!itemname' to invert logic.
 *
 * Inventory / state:
 * - gives: string/array of item(s) gained when entry is visited
 * - takes: string/array of item(s) lost when entry is visited
 * - gameover: if 'win' or 'lose', changes game state when entry is visited
 *
 * Navigation (ONE of the following):
 * - next: id of next entry (will convert to a single 'Continue...' option)
 * - options: array of options for this entry:
 *      - text: text used for option
 *      - goto: id of entry this option leads to
 *      - requires: string/array of item(s) required for this option
 *                  to be available.  Use '!itemname' to invert logic.
 * 
 **/

var ENTRIES = [{
        // Begin
        id: 'e_begin',
        text: 'Je begint aan een nieuw verhaal. Je bureau is opgeruimd. In het midden staat je laptop met een leeg word-bestand. Je verhaal gaat over een familie. De familie in je verhaal bestaat uit twee zonen, een dochter, een vader, een moeder, een tante en een grootvader. De familie is:',
        options: [{
            text: 'Nederlands',
            goto: 'e_3',
        }, {
            text: 'Niet Nederlands',
            goto: 'e_4'

        }],
        start: true
    }, {
        // Nederlands
        id: 'e_3',
        text: 'Je schrijft over de familie Sanders. Opa Sanders is dementerende. Uit angst dat langbewaarde familiegeheimen verloren zullen gaan, besluit de jongste zoon tijdens het jaarlijkse familieweekend alle verhalen boven tafel te halen. Tijdens het traditiegetrouwe potje Monopoly op de zolder van het vakantiehuisje, sluit hij zichzelf en de rest op en slikt hij de sleutel in. ',
        options: [{
            text: 'Het verhaal gaat over tradities en hoe deze moeten worden bewaard',
            goto: 'e_11'
        }, {
            text: 'Het verhaal gaat over de de ziekte van opa Sanders en zijn belangrijke positie in de familie.',
            goto: 'e_5'
        }],
    }, {
        // Cultuur
        id: 'e_5',
        text: 'Het verhaal gaat dus over cultuur?',
        options: [{
            text: 'Ja, eigenlijk wel, maar dat is toch logisch? Het gaat over een familie en tradities, en dat is vaak cultureel gebonden.',
            goto: 'e_6'
        }, {
            text: 'Nee, het gaat over hoe de familie omgaat met hun opa en over het belang van zijn positie in de familie.',
            goto: 'e_7'
        }],
    }, {
        // Ja
        id: 'e_6',
        text: 'Dus je schrijft een verhaal over cultuur omdat je bicultureel bent. Dus dit is gebaseerd op je eigen ervaringen.',
        options: [{
            text: 'Nee, het leek je een interessant onderzoek om een verhaal te schrijven over een familie en hoe deze familie tradities bewaart. Het heeft niks te maken met je eigen biculturaliteit.',
            goto: 'e_7'
        }]
    }, {
        // Weet je het zeker?
        id: 'e_7',
        text: 'Weet je zeker dat het niet over je eigen culturele ervaringen als biculturele schrijver gaat?',
        options: [{
            text: 'Ja, dat weet je zeker.',
            goto: 'e_8'
        }]
    }, {
        // Echt zeker?
        id: 'e_8',
        text: 'Weet je het echt zeker?',
        options: [{
            text: 'Ja.',
            goto: 'e_9'
        }]
    },

    {
        // Ervaringen
        id: 'e_9',
        text: 'Dus je wil zeggen dat niks van wat je hebt geschreven is gebaseerd op je eigen ervaringen?',
        options: [{
            text: 'Nou, je denkt dat iedere schrijver schrijft vanuit eigen ervaringen. Het huis waar het verhaal zich afspeelt lijkt op het huisje waar je tijdens je groep acht kamp in sliep en opa heeft veel weg van de meneer die je elke dag in de supermarkt zag toen je nog vakken vulde, maar verder gaat het verhaal niet over jou of over je eigen ervaringen.',
            goto: 'e_10'
        }]
    }, {
        // Oke
        id: 'e_10',
        text: 'Oké, maar als ik het dus goed begrijp is het een verhaal wat gaat over een familie en het heeft te maken met cultuur, en jij hebt een biculturele achtergrond dus het verhaal heeft te maken met die biculturele achtergrond, omdat je het vanuit je eigen ervaringen hebt geschreven. Toch?',
        options: [{
            text: 'Nee.',
            goto: 'e_8'
        }, {
            text: 'Nee, dat klopt niet.',
            goto: 'e_8'
        }, { 
            text: 'Het is gewoon een verhaal over een familie. Niet jouw familie. Een familie.',
            goto: 'e_8'    
        }]
    }, {
        // Niet Nederlands
        id: 'e_4',
        text: 'Je schrijft over de familie Safar. De familie geeft een eindexamenfeest voor hun jongste zoon. Halverwege het feest valt de elektriciteit uit. Als het licht weer aan gaat, is alleen opa Safar, die slecht ter been is en daarom in een rolstoel zit, nog in de woonkamer. De rest van de gasten zijn nergens te bekennen.',
        options: [{
            text: 'Het verhaal gaat over hoe ouderen worden behandeld in onze maatschappij.',
            goto: 'e_5'
        }, {
            text: 'Het verhaal gaat over een familie die hun oude tradities achterlaat',
            goto: 'e_11'
        }]
    }, {
        // Tradities
        id: 'e_11',
        text: 'Het verhaal gaat dus over cultuur. Klopt het dat het is geschreven vanuit je eigen ervaringen als biculturele schrijver?',
        options: [{
            text: ' Ja, je eigen culturele achtergrond speelt een rol in het verhaal.',
            goto: 'e_12'
        }, {
            text: 'Nee. Je denkt dat een schrijver altijd vanuit een eigen ervaring schrijft, maar het verhaal wat je schrijft is gewoon fictie.',
            goto: 'e_12'
        }]
    }, {
        // Tradities
        id: 'e_12',
        text: 'Het verhaal is dus autobiografisch? Dus je zou het autofictie noemen? ',
        options: [{
            text: 'Ja, je denk het wel.',
            goto: 'e_13'
        }, {
            text: 'Nee, het is niet autobiografisch.',
            goto: 'e_10'
        }]
    }, {
        // Migranten
        id: 'e_13',
        text: 'Migrantenliteratuur?',
        options: [{
            text: 'Je zou het die naam niet geven omdat je zelf geen migrant bent. Het gaat wel over een familie met een migratie-achtergrond, maar dat is niet het focuspunt van het verhaal.',
            goto: 'e_14'
        }, {
            text: 'Nee.',
            goto: 'e_14'
        }]
    }, {
    // Hokje
        id: 'e_14',
        text: 'Maar als het geen migrantenliteratuur is, waarom gaat het dan over een migrantenfamilie?',
        options: [{
            text: 'Omdat de familie waarover je schrijft een familie is zoals je hem kent.',
            goto: 'e_15'
        }, {
            text: 'Omdat het je interessant leek om over deze familie te schrijven.',
            goto: 'e_15'
        }]
    }, {
    // Hokje 2
        id: 'e_15',
        text: 'Maar eigenlijk plaats je jezelf dus in een hokje door te schrijven over een migrantenfamilie, maar wil je niet dat het verhaal dan in het hokje migrantenliteratuur wordt geplaatst?',
        options: [{
            text: 'Je schrijft gewoon over iets wat je interesseert en probeert jezelf daarmee niet in een hokje te plaatsen.',
            goto: 'e_16'
        }]
    }, {
    // Hokje 2
        id: 'e_16',
        text: 'Maar als je niet wil dat mensen vragen stellen over de achtergrond van de familie, waarom maak je er dan niet een gewone Nederlandse familie van?',
        options: [{
            text: 'Je schrijft over iets wat dicht bij je licht en toevallig is dat dit verhaal. En hoe ziet een gewone Nederlandse familie er uit?',
            goto: 'e_17'
        }]
    }, {
    // Hokje 2
        id: 'e_16',
        text: 'Maar als je niet wil dat mensen vragen stellen over de achtergrond van de familie, waarom maak je er dan niet een gewone Nederlandse familie van?',
        options: [{
            text: 'Je schrijft over iets wat dicht bij je ligt en toevallig is dat dit verhaal. En hoe ziet een gewone Nederlandse familie er uit?',
            goto: 'e_17'
        }]
    }, {
    // Hokje 2
        id: 'e_17',
        text: 'Hoe zou je dan willen dat we het noemen?',
        options: [{
            text: 'Een verhaal.',
            goto: 'e_18'
        }]
    },
    {
        // Zeker
        id: 'e_18',
        text: 'Weet je het zeker?',
        options: [{
            text: 'Ja.',
            goto: 'e_19'
        }]
    },{
        // Migranten
        id: 'e_19',
        text: 'Dus het is niet belangrijk dat het een bicultureel verhaal is?',
        options: [{
            text: 'Het is wel belangrijk. Het is niet het enige belangrijke.',
            goto: 'e_20'
        }]
    },

    {
        // Migranten
        id: 'e_20',
        text: 'Maar hoe zou je het dan omschrijven?',
        options: [{
            text: 'Als gewoon een verhaal.',
            goto: 'e_18'
        }]
    },






               
];

/**
 * Parser module for the data format.
 * Reads the data object format and creates an internal copy with required 
 * transformations and parsing. Exposes methods to start/reset the game,
 * advance the game via choices/actions, and read the currently active entry.
 *
 * The module is just data-driven, and returns objects from its methods; it
 * does no handling of game display or user input directly.  It needs a frontend
 * written for it in order for a player to interact with it.
 **/
var CYOA = (function() {

    var ENTRY_DATA,
        currentEntryId, currentEntryData,
        inventory;

    function _init(entryData) {
        // clear state
        ENTRY_DATA = {};
        currentEntryId = null;
        currentEntryData = {};
        inventory = [];

        var startEntryId = null;

        // Parse entry data into internal object
        entryData.forEach(function(entry) {
            ENTRY_DATA[entry.id] = Object.create(entry);

            // Track the starting entry and warn of duplicates
            if (entry.start === true) {
                if (startEntryId !== null) {
                    console.error('More than one starting state defined:', startEntryId, entry.id);
                } else {
                    startEntryId = entry.id;
                }
            }

            // Process extra paragraphs if present
            if (entry.extra) {
                entry.extra.forEach(function(ext) {
                    // convert string options to single-item arrays for easier parsing
                    if (ext.requires && (typeof ext.requires === 'string')) {
                        ext.requires = [ext.requires];
                    }
                });
            }

            // 'Next' overrides all other options
            if (entry.next) {
                entry.options = [{
                    text: 'Ga verder',
                    goto: entry.next
                }];
            }
            // Process and validate options
            if (entry.options) {
                entry.options.forEach(function(opt) {
                    // options must have a 'goto'
                    if (!opt.goto) console.error('Entry', entry.id, ' has option without a goto: ', opt.text);
                    // convert string options to single-item arrays for easier parsing
                    if (opt.requires && (typeof opt.requires === 'string')) {
                        opt.requires = [opt.requires];
                    }
                });
            }
        });

        // Set initial state from starting entry
        if (startEntryId === null) console.error('No start entry found');
        _setEntry(startEntryId);
    }

    // Inventory methods (accept string or array)

    function _addToInventory(items) {
        if (typeof items === 'string') items = [items];
        inventory = inventory.concat(items);
    }

    function _takeFromInventory(items) {
        if (typeof items === 'string') items = [items];
        var newInv = [];
        inventory.forEach(function(item) {
            if (items.indexOf(item) === -1) newInv.push(item);
        });
        inventory = newInv;
    }

    function _checkInventory(item) {
        return (inventory.indexOf(item) > -1);
    }

    // Utility method to check a 'requires'-format array against the current inventory
    function _hasRequirements(opt) {
        var isAvailable = true;
        if (opt.requires) {
            opt.requires.forEach(function(req) {
                if (req.charAt(0) === '!' && _checkInventory(req.substr(1))) isAvailable = false;
                if (req.charAt(0) !== '!' && !_checkInventory(req)) isAvailable = false;
            });
        }
        return isAvailable;
    }

    // Updates the current entry data to the given entry ID.
    // Composes the current entry data based on conditionals set in the entry data,
    // including required inventory to display options, etc.
    // Also makes changes to inventory and state based on the definition data.
    function _setEntry(id) {
        if (!id in ENTRY_DATA) console.error('Unable to change entry: invalid entry id', id);
        currentEntryId = id;

        var data = ENTRY_DATA[id];
        currentEntryData = {
            id: data.id,
            text: data.text,
            extra: []
        };

        // Add/remove inventory items in this entry
        if (data.gives) _addToInventory(data.gives);
        if (data.takes) _takeFromInventory(data.takes);

        // Update text with extras
        if (data.extra) {
            data.extra.forEach(function(ext) {
                if (_hasRequirements(ext)) currentEntryData.extra.push(ext.text);
            });
        }

        // State modifiers
        // TODO: make this more definitive and mutate options accordingly
        if (data.gameover) currentEntryData.gameover = data.gameover;

        // Define available options based on inventory requirements
        if (data.options) {
            currentEntryData.options = [];
            data.options.forEach(function(opt, idx) {
                if (_hasRequirements(opt)) {
                    currentEntryData.options.push({
                        text: opt.text,
                        goto: opt.goto
                    });
                }
            });
        }
        return currentEntryData;
    }

    function startGame(data) {
        _init(data);
    }

    function getCurrentEntry() {
        if (currentEntryData === {}) console.error('No current entry; has the game started?');
        return currentEntryData;
    }

    function getInventory() {
        return inventory;
    }

    // Changes the active entry according to the numeric ID of the option passed in,
    // if it is present in the current entry.
    function doOption(idx) {
        if (!currentEntryData.options) console.error('Can not complete option', idx);
        var opt = currentEntryData.options[idx];
        var newEntryId = opt.goto;
        if (!newEntryId in ENTRY_DATA) console.error('Cannot do option: invalid goto id', newEntryId);
        return _setEntry(newEntryId);
    }

    return {
        startGame: startGame,
        getCurrentEntry: getCurrentEntry,
        getInventory: getInventory,
        doOption: doOption
    };
})();

/**
 * Some simple jQuery DOM logic for demo purposes.
 * This could easily be expanded for better presentation,
 * per-location graphics, all kinds of stuff.
 **/
var Game = (function() {

    var DATA;

    // Container element to render into
    var $el = $('#output');

    // Text for game over scenarios
    var endMsgs = {
        win: 'You won! Play again...',
        lose: 'You failed.  Restart...'
    };

    // Reads the current entry data and puts DOM nodes
    // in the container to display the text and options
    function render(isStart) {
        var d = CYOA.getCurrentEntry();

        // Clear the container and write the body text
        $el.html('');
        if (isStart) $el.append('<p class="title"></p>');
        $el.append('<p>' + d.text + '</p>');

        d.extra.forEach(function(ext) {
            $el.append('<p>' + ext + '</p>');
        });

        // Write out a list of option or restart links in a list
        // (click handlers bound in init() will handle these)
        var $opts = $('<ul/>');
        if (d.gameover) {
            var $action = $('<li><a class="opt gameover ' + d.gameover + '" href="#">' +
                endMsgs[d.gameover] + '</a></li>');
            $opts.append($action);
        }
        if (d.options) {
            d.options.forEach(function(opt, idx) {
                var $opt = $('<li><a class="opt action" href="#" data-opt="' + idx + '">' +
                    opt.text + '</a></li>');
                $opts.append($opt);
            });
        }
        $el.append($opts);

        // Show current inventory
        if (!d.gameover) {
            var inv = CYOA.getInventory();
            if (inv.length) {
                $el.append('<p class="inv">You are carrying: ' + inv.join(', ') + '</p>');
            }
        }
    }

    function init(entryData) {

        DATA = entryData;

        // Click handlers for option links.  Bound to the document
        // as we destroy and rebuild the links per-entry.
        $(document).on('click', '.action', function(e) {
            e.preventDefault();
            var opt = $(this).attr('data-opt');
            console.log('do option', opt);
            if (CYOA.doOption(opt)) render();
        });

        // As above but for win/lose links.  Restart the game when used
        $(document).on('click', '.gameover', function(e) {
            e.preventDefault();
            _start();
        });

        _start();
    }

    function _start() {
        // Init the game and render the first entry
        CYOA.startGame(DATA);
        render(true);
    }

    return {
        init: init
    }

})();

// Kick off 
Game.init(ENTRIES);