// -- UTILITY FUNCTIONS
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

String.prototype.trim == String.prototype.trim || function() {
	return this.replace(/^\s+|\s+$/g, '');
}

// pg = Poetry Generator
var pg = {

	// -- BEGIN CONFIG ------------------------------------------------------------
	numSentences: 1,
	numSentencePatterns: null,

	// hard-coded sentence patterns is the simpler way
	// TODO: make more flexible / less artificial
	sentencePatterns: [
		['een', 'x', 'schrijver',]
	],

	languageParts: {
		'vowel': 'aeiou'.split(''),
		'article': {
			'beforeVowel': 'the|an'.split('|'),
			'beforeConsonant': 'the|a'.split('|')
		},
		'een': 'een'.split('|'),
		'x': 'goede|grote|kleine|biculturele|vrouwelijke|crossmediale|multimediale|digitale|analoge|transmediale|innovatieve|nieuwe|controversiele|traditionele|jonge|oude|mannelijke|androgyne|politieke|activistische|apolitieke|verbindende|isolerende|vervreemde|vervremende|beeldende|typische|echte|soort van|bijna|realistische|fantasievolle|uitdagende|'.split('|'),
		'schrijver': 'schrijver'.split('|'),
		
	},
	// -- END CONFIG --------------------------------------------------------------

	init: function() {
		this.numSentencePatterns = this.sentencePatterns.length;
	},

	generateSentences: function(numSentences, markupBefore, markupAfter) {
		var numSentences = numSentences || this.numSentences;
		var markupBefore = markupBefore || '';
		var markupAfter = markupAfter || '';
		var sentences = [];

		while (numSentences--) {
			var sentence = '';
			var sentencePattern = this.sentencePatterns[ randomInt(0, this.numSentencePatterns - 1) ];
			
			// loop through sentence pattern array
			for (var i = 0, length = sentencePattern.length; i < length; i++) {
				var languagePartArray;
				var articleType;
				var nextWord = null;

				// if this word is an article, need to determine if next word starts with a vowel or consonant
				if (sentencePattern[i] === 'article') {
					// get next word
					var nextWordLanguagePartArray = this.languageParts[ sentencePattern[i + 1] ];
					var nextWord = nextWordLanguagePartArray[ randomInt(0, nextWordLanguagePartArray.length - 1) ];

					// set article type based on whether next word starts with vowel or consonant
					if (this.languageParts['vowel'].indexOf(nextWord[0]) !== -1) {
						articleType = 'beforeVowel';
					} else {
						articleType = 'beforeConsonant';
					}

					languagePartArray = this.languageParts[ sentencePattern[i] ][ articleType ];
				} else {
					languagePartArray = this.languageParts[ sentencePattern[i] ];
				}

				// add this word to sentence
				sentence += languagePartArray[ randomInt(0, languagePartArray.length - 1) ] + ' ';

				// if next word was gotten, also add next word to sentence and increment the i counter
				if (nextWord !== null) {
					sentence += nextWord + ' ';
					i++;
				}
			}

			sentences.push(markupBefore + sentence.trim() + markupAfter);
			// console.log(sentence);

		} // end while (numSentences--)

		return sentences;

	} // end generateSentences()
} // end poetryGenerator

// ----------------------------------------------------------------------------

$(document).ready(function() {
  
  // initialize poetry generator
  pg.init();
  
  $('.generate').on('click', function() {
    var sentences = pg.generateSentences( $('#num-sentences').val(), '<p>', '</p>' );
    $('#poetry-content').html( sentences.join('') );
  })
  
})