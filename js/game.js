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
var Game = new (function() {
  var self = this,
      debug = Config.debug,
      tweet = Config.tweet,
      startedTutorial = false,
      
      endGameTOH1,
      endGameTOH2,
      endGameTOH3,
      onHomeScreen = true,
      
      gameEnded = false;

  function init() {
    $('#scorenr').html(getScore());
    $('#tweeturl').hide();
    
    if (Utils.isTouch())
      $('html').addClass('touch');
    
    $('[data-size]').each(function(i,el){
      var $el = $(el),
          size = $el.attr('data-size') * 1,
          label = sizes[size - 1];
      $el.html(label)
      $el.on('touchstart mousedown', function(evt){
        if (Utils.isDoubleTapBug(evt)) return false;
        var size = sizes[$(evt.target).closest('[data-size]').attr('data-size') * 1 - 1];
        loadGame(size);
      })
    })
    resize();
    $(window).on('resize', resize);
    $(window).on('orientationchange', resize);

    showTitleScreen();
    resize();
    
    var colors = ['#a7327c', '#c24b31', '#c0cd31']
    Utils.setColorScheme(colors[1]);
  }

  function start() {
    // kick in the bgservice in a few ms (fixes non-working iOS5)
    setTimeout(function() {
      
    }, 100);
    if (debug) {
      addEventListeners();
      showMenu();
      return;
    }
    setTimeout(function(){$('.hide0').removeClass('hide0')}, 300);
    setTimeout(function(){$('.hide1').removeClass('hide1')}, 1300);
    setTimeout(function(){$('.show01').removeClass('hidehs')}, 2300);
    setTimeout(function(){$('.show01').removeClass('show01').addClass('hidehs'); addEventListeners();}, 4200);
  }

  function resize() {
    var desired = {
          width: 320,
          height: 480
        },
        aspectRatio = desired.width / desired.height,
        viewport = {
          width: $('#feelsize').width(),
          height: $('#feelsize').height()
        },
        sizeToWidth = ((viewport.width / viewport.height) < aspectRatio)

    var box = {
      width: Math.floor(sizeToWidth? viewport.width : (viewport.height/desired.height) * desired.width),
      height: Math.floor(sizeToWidth? (viewport.width/desired.width) * desired.height : viewport.height)
    }

    $('#container').css({'width': box.width + 'px', 'height': box.height + 'px'});

    var containerSize = box.width;

    $('h1').css('font-size', Math.round(containerSize * .24) + 'px')
    $('h2').css('font-size', Math.round(containerSize * .18) + 'px')
    $('h3').css('font-size', Math.round(containerSize * .15) + 'px')
    $('p').css('font-size', Math.round(containerSize * .07) + 'px')
    $('#menu h2').css('font-size', Math.round(containerSize * .24) + 'px')
    $('#menu p').css('font-size', Math.round(containerSize * .1) + 'px')
    $('#menu p').css('padding', Math.round(containerSize * .05) + 'px 0')
    $('#menu p').css('line-height', Math.round(containerSize * .1) + 'px')
    $('#menu1 h2').css('font-size', Math.round(containerSize * .24) + 'px')
    $('#menu1 p').css('font-size', Math.round(containerSize * .1) + 'px')
    $('#menu1 p').css('padding', Math.round(containerSize * .05) + 'px 0')
    $('#menu1 p').css('line-height', Math.round(containerSize * .1) + 'px')
    var scoreSize = Math.round(containerSize * .1);
    $('#score').css({'font-size': scoreSize + 'px', 'line-height': (scoreSize * 0.85) + 'px', 'height': scoreSize + 'px'});

    var iconSize = Math.floor((22/320) * containerSize);
    $('.icon').css({width:iconSize,height:iconSize,marginLeft:iconSize,marginRight:iconSize});

    $('.board table').each(function(i,el){
      var $el = $(el),
          id = $el.attr('data-grid'),
          w = $el.width(),
          size = $el.find('tr').first().children('td').length;
      
      var tileSize = Math.floor(w / size);
      
      if (!tileSize) return;

      $el.find('.tile').css({width:tileSize,height:tileSize,'line-height':Math.round(tileSize * 0.85) + 'px','font-size':Math.round(tileSize * 0.5) + 'px'});
      var radius = Math.round(tileSize * 0.1);
      var radiusCss = '#' + id + ' .tile .inner { border-radius: ' + radius + 'px; }' +
        '#' + id + ' .tile-1 .inner:after, #' + id + ' .tile-2 .inner:after { border-radius: ' + radius + 'px; }';
      
      Utils.createCSS(radiusCss, id + 'radius');
      Utils.createCSS('.tile.marked .inner { border-width: ' + Math.floor(tileSize / 24)+ 'px }', 'tileSize');
    });
    $('#digits').width($('#titlegrid table').width()).height($('#titlegrid table').height())
    $('#digits').css({'line-height':Math.round($('#titlegrid table').height() * 0.92) + 'px','font-size':$('#titlegrid table').height() * .5 + 'px'});

    var topVSpace = Math.floor($('#container').height() / 2 - $('#board').height() / 2);
    $('#hintMsg').height(topVSpace + 'px');
  }

  // 
  function showTitleScreen() {
    onHomeScreen = true;
    $('.screen').hide().removeClass('show');
    $('#title').show();
    setTimeout(function() { $('#title').addClass('show'); },0);
  }

  function showGame() {
    onHomeScreen = true;
    clearTimeouts();
    $('.screen').hide().removeClass('show');
    $('#tutorial').show();
    setTimeout(function() { $('#tutorial').addClass('show'); },0);
    resize();
  }

  // Display the login screen
  function showMenu() {
    onHomeScreen = true;
    clearTimeouts();
    $('.screen').hide().removeClass('show');
    $('#menu').show();
    $('#scorenr').html(getScore());
    setTimeout(function() { $('#menu').addClass('show'); },0);
    resize();
  }
// Display the main menu screen
  function showMenu1() {
    onHomeScreen = true;
    clearTimeouts();
    $('.screen').hide().removeClass('show');
    $('#menu1').show();
    setTimeout(function() { $('#menu1').addClass('show'); },0);
    resize();
  }

  // Loads and display the main game
  function showgame() {
    onHomeScreen = true;
    clearTimeouts();
    $('.screen').hide().removeClass('show');
    $('#play').show();
    setTimeout(function() { $('#play').addClass('show'); },0);
    resize();
  }

  // Display the about section
  function showAbout() {
    onHomeScreen = true;
    clearTimeouts();
    $('.screen').hide().removeClass('show');
    $('#about').show();
    setTimeout(function() { $('#about').addClass('show'); },0);
    resize();
  }

  // Logs Out current user
  function logoutUser() {
    
    onHomeScreen = true;
          clearTimeouts();  
          $('.screen').hide().removeClass('show');
          $('#out').show();
          setTimeout(function() { $('#out').addClass('show'); },0);
          resize();
    
    
  }

  function startGame(puzzle) {
    onHomeScreen = false;
    if (!puzzle || !puzzle.size || !puzzle.full)
      throw 'no proper game object received'
    
    
    clearTimeouts();
    if (window.STOPPED) return;
    startedl = false;
    $('#undo').closest('.iconcon').css('display', 'inline-block');
    $('#menugrid').addClass('hidden');
    $('#board').removeClass('hidden');
    $('#bar [data-action]').show();
    $('#tweeturl').hide();
    $('#chooseSize').removeClass('show');
    $('#score').removeClass('show').hide();
    $('#bar [data-action="help"]').removeClass('hidden wiggle');
    $('#boardsize').html('<span>' + puzzle.size + ' x ' + puzzle.size + '</span>');
    grid = new Grid(puzzle.size, puzzle.size);
    lastSize = puzzle.size;

    grid.load(puzzle.empty, puzzle.full);
    // set system tiles manually
    grid.each(function(){
      this.value = this.value; // yes, do so
      if (this.value > 0)
        this.system = true;
    });
    grid.state.save('empty');


    currentPuzzle = puzzle;
    grid.hint.active = true;
    grid.activateDomRenderer();
    grid.render();
    undoStack = [];
    undone = false;
    gameEnded = false;

    setTimeout(showGame, 0);
  }

  

  

  function addEventListeners() {
    document.addEventListener("backbutton", backButtonPressed, false);

    $(document).on('keydown', function(evt){
      if (evt.keyCode == 27 /* escape */) { backButtonPressed(); return false; }
      if (evt.keyCode == 32 /* space */) { doAction('help'); return false; }
      if (evt.keyCode == 90 /* Z */ && (evt.metaKey || evt.ctrlKey)) {
        doAction('undo');
        return false;
      }
    });
    $(document).on('touchend mouseup', click);
    $(document).on('touchstart mousedown', '#grid td', function(e) {
      if (Utils.isDoubleTapBug(e)) return false;
      var $el = $(e.target).closest('td'),
          x = $el.attr('data-x') * 1,
          y = $el.attr('data-y') * 1,
          tile = grid.tile(x, y);

      clearTimeout(checkTOH);

    
      
      if (Tutorial.active) {
        Tutorial.tapTile(tile);
        return false;
      }
      
      if (grid && grid.hint)
        grid.hint.clear();

      
    });
  }

  // Function for click event
  function click(evt) {
    if (Utils.isDoubleTapBug(evt)) return false;
    var $el = $(evt.target).closest('*[data-action]'),
        action = $(evt.target).closest('*[data-action]').attr('data-action'),
        value = $el.attr('data-value');
    if (action) {
      doAction(action, value);
      return false;
    }
  }

  // Calls the function(s) when click event occurs at respective button IDs
  function doAction(action, value) {
    switch (action) {
      case 'close-titleScreen':
        
          showMenu();
        break;
      
      case 'show-menu1':
        
        showMenu1();
        break;  
      case 'back':
        if (gameEnded) 
          return doAction('show-menu1');
        clearTimeout(checkTOH);
        Tutorial.end();
        quitCurrentGame();
        break;
      case 's':
        clearTimeout(checkTOH);
        Tutorial.end();
        if (grid)
          grid.hint.clear();
        loadGame(lastSize);
        break;
      case 'play':
        showgame();
        nextq();
        break;
      case 'tutorial':
        startTutorial();
        break;
      case 'about':
        showAbout();
        break;
      case 'out':  
        logoutUser();
        break;
    }
  }

 
  

  function checkForLevelComplete() {
    if (grid.emptyTileCount > 0)
      return;

    if (grid.wrongTiles.length > 0) {
      grid.hint.next();
      return;
    }

    endGame();
  }

  
// Display the tutorial 
  function startTutorial() {
    onHomeScreen = true;
    clearTimeouts();
    $('.screen').hide().removeClass('show');
    $('#tutorial').show();
    setTimeout(function() { $('#tutorial').addClass('show'); },0);
    resize();
  }

  // Go to the menu
  function backButtonPressed() {
    if (onHomeScreen)
      navigator.app.exitApp()
    else 
      doAction('back');
  }

  

  function getScore() {
    return (window.localStorage.getItem('score') * 1);
  }

  function undo() {
    
    clearTimeout(checkTOH);
    checkTOH = setTimeout(function(){checkForLevelComplete();}, 700);
  }

  function clearTimeouts() {
    clearTimeout(endGameTOH1);
    clearTimeout(endGameTOH2);
    clearTimeout(endGameTOH3);
  }


  this.start = start;
  this.init = init;
  this.startGame = startGame;
  this.showTitleScreen = showTitleScreen;
  this.showGame = showGame;
  this.showMenu = showMenu;
  this.showMenu1 = showMenu1;
  this.resize = resize;
  this.showAbout = showAbout;
  this.startTutorial = startTutorial;
  this.logoutUser = logoutUser;
  this.checkForLevelComplete = checkForLevelComplete;
  this.undo = undo;
  
  window.__defineGetter__('tile', function() { return grid.tile; });
  this.__defineGetter__('grid', function() { return grid; });
  this.__defineGetter__('debug', function() { return debug; });
})();

// Clears the input
function clearInput() {
  // Get the input element by its ID
  var inputElement = document.getElementById("userid-1");

  // Set the value of the input element to an empty string
  inputElement.value = "";
}
  



  
    let trophy1 = 0; 
    
    // Fetch and Display the API
    // Reloads the API image
    
    function nextq() {
    const apiUrl = 'https://marcconrad.com/uob/tomato/api.php'; // URL of the API
 
    fetch(apiUrl)
      .then(response => {
        if (response.ok) {
          return response.json(); // Parsing the response in JSON
        } 
        else {
          console.error('Error:', response.status);
        }
      })
      
      .then(data => {
        // Handling the data from the API
        console.log("api solution " + data.solution);
        const apinumber = data.solution;
        document.getElementById("solution").value=apinumber;
        displayImage(data);
        displayAnswer(data);
        clearInput();
        clearResult(); 
        resetTimer();
        startTimer();

      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  
  // Display the API image  
  function displayImage(data) {
    const imageElement = document.getElementById('image');
    if (data.question) {
      imageElement.src = data.question; // The JSON structure has an "imageURL" property
    }
  }

  // Obtain the solution for the API question
  function displayAnswer(data) {
    const answerElement = document.getElementById('answerElement');
    if (data.solution) {
      answerElement.innerHTML = data.solution;  
    }
  }

  // Update the HTML element with the current score 
  function updateScoreDisplay() {
    
    const scoreElement = document.getElementById("trophy1");
    scoreElement.textContent = trophy1;
    
  
}

// Clears the input
function clearResult() {
  // Get the input element by its ID
  var inputElement = document.getElementById("result");

  // Set the value of the input element to an empty string
  inputElement.textContent = "";
}
   
// Display if the user input matches the API solution  
function displayResult() {
  const resultElement = document.getElementById('result');  
    const userinput = parseInt(document.getElementById('userid-1').value,10);
    console.log(userinput);
    const soln = parseInt(document.getElementById('solution').value,10);
    console.log(soln);   
    
    resultElement.style.color= "red";
    
    
      if (userinput === soln) {
          
        resultElement.textContent = 'You Win!';
        // Increases the score by 1 each time the condition is correct
        trophy1 +=1; 
        updateScoreDisplay();
        
        console.log("Correct! Score increased to " + trophy1); 
        
        
        
          
        
      }
      else {
        // Display the message on the browser  
        resultElement.textContent = 'Please try again!'; 
      }
    
      
    
  

  }

  // Calls the function when the button with the ID is clicked.
  document.getElementById('Signin-2').addEventListener('click', function() {
    displayResult()
    });


    let timerId;
    let timerSeconds = 61;
    
    // Update the HTML element with the current timer value 
    function updateTimerDisplay() {
      document.getElementById('timer').textContent = `Time remaining: ${timerSeconds} seconds`;
    }

    // Start the timer countdown
    function startTimer() {
      // Clears any existing timer
      clearTimeout(timerId);
      // Start decreasing the contdown value
      function incrementTimer() {
        timerSeconds--;
        updateTimerDisplay();
        timerId = setTimeout(incrementTimer, 1000);
        
        const resultElement = document.getElementById('result');
        resultElement.style.color= "red";
      // Display message, next API image, reset and start timer countdown
        if (timerSeconds <= 0) {
          // Clear the interval to stop the countdown
          clearInterval(timerId); 
          resultElement.textContent = 'Time Out!';
          nextq();
      }
        
  }
  incrementTimer(); // Calling the function
}

// Reset the timer countdown
    function resetTimer() {
      // Clear the timer and reset seconds
      clearTimeout(timerId);
      timerSeconds = 61;
      updateTimerDisplay();
    }

    
    
    
    
   