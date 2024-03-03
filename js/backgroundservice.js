/**
 * @module showTitleScreen 
 * @description This is the main module of the application.
 * <b>The main goal is to build something with a specific height and width.</b>
 *
 * Some list here:
 *  - 1 item example here
 *  - <b>Bold again here</b>
 *  - Some other line
 *
 * @author sushant
 */
var BackgroundService = new (function() {
	var self = this,
			enabled = (window.Blob && window.Worker)? true : false,
			worker = null;

	if (Game.debug)
		console.log('BackgroundService:', enabled);
	
	function generateGridAndSolution(size) {
	  var d = new Date();
	  var grid = new Grid(size);
	  grid.generateFast();
	  var result = {};
	  result.size = size;
	  result.full = grid.getValues();
    var quality = 0,
	      qualityThreshold = {
	        4: 60,
	        6: 60,
	        8: 60,
	        10: 60
	      },
	      attempts = 0;
	  // quality control makes sure grids get proper 
    do {
      if (attempts > 0) {
        grid.clear();
        grid.state.restore('full')
      }
      grid.breakDown();
      quality = grid.quality;
    }
    while (quality < qualityThreshold[size] && attempts++ < 42);

	  //grid.breakDown();
	  var values = grid.getValues();
	  result.empty = grid.getValues();
	  result.quality = grid.quality;
	  result.ms = new Date() - d;
	  self.postMessage(JSON.stringify(result));
	}

	function createWorker() {
		var js = [
			Utility,State,Grid,Tile,generateGridAndSolution,
			'\nvar Utils = new Utility();',
			'\nfunction Hint() { this.active = false; }',
			'self.onmessage = function(e) {generateGridAndSolution(e.data.size)};'
		].join('');

		var blob = new Blob([js], { type: "text/javascript" });
		worker = new Worker(window.URL.createObjectURL(blob));
		worker.onmessage = function(e) {
			var puzzle = JSON.parse(e.data);			
			onPuzzleGenerated(puzzle);
		}
	}

	function onPuzzleGenerated(puzzle) {
		if (Game.debug)
			console.log('generated puzzle', puzzle);
		Levels.addSize(puzzle.size, puzzle);
	}

	function generatePuzzle(size) {
		if (!enabled) return;
		if (!worker) {
			createWorker();
		}
		worker.postMessage({'size':size});
	}

	function kick() {
		// todo: check levels for which to create...
		if (Levels.needs()) {
			generatePuzzle(Levels.needs());
		}
	}

	this.generatePuzzle = generatePuzzle;
	this.kick = kick;
	this.__defineGetter__('enabled', function() { return enabled; });
})();