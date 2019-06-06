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
        text: 'Je staat in je achtertuin op de aangelegde grasmat. Je hebt teenslippers aan en een pleister op je wreef omdat je een glas op je voet kapot hebt laten vallen en het niet wil stoppen met bloeden. De zon schijnt. Je hebt een pet op. Je voelt dat je schouders aan het verbranden zijn en had beter een t-shirt aan kunnen doen. Er kruipt een mier over je grote teen.',
        options: [{
            text: 'Het gras is net gemaaid',
            goto: 'e_gemaaid',
        }, {
            text: 'Je staat tot je knieën in het gras',
            goto: 'e_knie'
        }],
        start: true
    }, {
        // Het gras is net gemaaid
        id: 'e_gemaaid',
        text: 'Je schopt je teenslippers uit en zet je voeten in het korte gras. Meer mieren verzamelen zich op je voet, lopen heen en weer terwijl je tenen zich om grassprieten heen klemmen en je plukjes uit de grond trekt. ',
        options: [{
            text: 'Je gaat naar binnen',
            goto: 'e_binnen'
        }, {
            text: 'Je blijft staan',
            goto: 'e_staan'
        }]
    }, {
        // Je staat tot je knieën in het gras
        id: 'e_knie',
        text: 'Het gras kriebelt tegen je knieholtes aan. De mieren lopen van je enkel naar je bovenbeen toe. ',
        options: [{
            text: 'Je maait het gras',
            goto: 'e_maaien'
        }, {
            text: 'Je laat het gras groeien',
            goto: 'e_groeien'
        }],
    }, {
        // Je gaat naar binnen
        id: 'e_binnen',
        text: 'Het is later. Je staat in je achtertuin op de aangelegde grasmat. Je hebt dezelfde teenslippers aan als eerst. De pleister op je wreef is weg: er zit een litteken. Klein, dun. Als het licht in de juiste hoek op je voet valt, lijkt het litteken te glinsteren. Er zit waarschijnlijk nog glas in je voet. Je schouders zijn aan het vervellen. Het gras prikt tegen je kuiten aan.',
        options: [{
            text: 'Je maait het gras',
            goto: 'e_maaien'
        }, {
            text: 'Je laat het gras groeien',
            goto: 'e_groeien'
        }],
    }, {
        // Je blijft staan
        id: 'e_staan',
        text: 'Het gras groeit',
        next: 'e_knie'
    }, {
        // Je maait het gras
        id: 'e_maaien',
        text: 'De enige grasmaaier die je kan vinden is een niet-elektrische. Je zet hem in het gras, pakt beide handvaten stevig vast en duwt hard vooruit. Grassprieten vliegen de lucht in. Je doet je mond open en vangt de sprieten op. Je kauwt en slikt door.',
        
    }, {
        // Je laat het gras groeien
        id: 'e_groeien',
        text: 'Het gras groeit. De mieren kunnen nu al bij je handen, kruipen over je vingers. Je schat dat het gras één meter hoog is. ',
        options: [
            {
                text: 'Je gaat zitten',
                goto: 'e_zitten'
            },
            {
                text: 'Je blijft staan',
                goto: 'e_staan_twee'
            },
        ]
    }, {
        // Je gaat zitten
        id: 'e_zitten',
        text: 'Het gras steekt boven je hoofd uit. De wind waait. Je wordt bedolven onder grassprieten die zich over je hoofd heen buigen als een rieten dak. Je beeldt je in dat je in de jungle zit en palmbladeren gebruikt om je tegen stortregen te beschermen. Je ziet niks meer.',
        
    }, {
        // Je blijft staan
        id: 'e_staan_twee',
        text: 'Het gras groeit. De sprieten kriebelen onder je kin. Je lacht.',
        options: [
            {
                text: 'Je laat het gras groeien',
                goto: 'e_zitten'
            },
            {
                text: 'Je maait het gras',
                goto: 'e_maaien'
            },
        ]
    }, {
        
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
