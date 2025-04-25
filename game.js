// Location class
class Location {
    constructor(name, description, options = {}, actions = {}) {
      this.name = name;
      this.description = description;
      this.options = options;
      this.actions = actions;
    }
  
    describe() {
      return `\n${this.name}\n${this.description}`;
    }
  
    getOption(command) {
      const lower = command.toLowerCase();
      return this.options[lower] || this.actions[lower];
    }
  }
  
  // Player class
  class Player {
    constructor(name, startingLocation) {
      this.name = name;
      this.currentLocation = startingLocation;
      this.streetLocation = startingLocation;
      this.drinks = 0;
      this.blackedOut = false;
      this.won = false;
    }
  
    move(command) {
      if (this.blackedOut) return "You’ve blacked out from too many drinks and passed out in an unknown location. You did not survive the night out. Game Over!";
      if (this.won) return "You’ve already gone home. Game over.";
  
      const lowerCommand = command.toLowerCase();
  
      // Allows player to go home
      if (lowerCommand === 'home') {
        this.won = true;
        return "You decide to head home and call a taxi. You’ve survived the night out in Liverpool. Congrats, you win... an enourmous hangover!";
      }
  
      // Allows player to leave
      if (lowerCommand === 'leave') {
        this.currentLocation = this.streetLocation;
        return this.currentLocation.describe();
      }
  
      const next = this.currentLocation.getOption(command);
      if (typeof next === 'function') {
        const result = next();
        if (lowerCommand === 'drink') {
          this.drinks++;
          updateDrinkCounter(this.drinks);
          if (this.drinks > 5) {
            this.blackedOut = true;
            return "You had one too many drinks and blacked out. Game over.";
          }
        }
        return result;
      } else if (next instanceof Location) {
        this.currentLocation = next;
        return this.currentLocation.describe();
      } else {
        return "You can't go that way or enter that place!";
      }
    }
  }
  
  // Game class 
  class Game {
    constructor() {
      this.locations = {};
      this.player = null;
      this.init();
    }
  
    init() {
      // The starting street
      const street = new Location("Concert Square", "You are standing in Concert Square, a popular nightlife spot in the heart of the city. It's bustling with people, laughter, and the sound of music. You can go north to the clubs or south to grab a bite.");
 
  
      // Final destination South
      const foodPlace = new Location("Pronto's Pizza", "You smell fresh pizza slices. Might be time for a greasy snack.", {}, {
        eat: () => "You chow down on a big greasy slice. Perfect end to the night. You'll thank yourself in the morning."
      });
  
      // The Razz interiors and actions
      const northBar1Bar = new Location("Razz Bar", "You approach the bar in The Razz. It's sticky but cheap.", {}, {
        drink: () => "You order the signature fat frog, are you sure that was a wise decision?"
      });
      const northBar1Dance = new Location("Razz Dancefloor", "You step onto the dance floor at The Razz. It's packed, humid, and quite dark.", {}, {
        dance: () => "You try to dance but end up just swaying awkwardly. The floor is sticky and the lights are flashing."
      });
      northBar1Bar.options.dancefloor = northBar1Dance;
      northBar1Dance.options.bar = northBar1Bar;
      const northBar1Interior = new Location("Inside The Razz", "You're inside The Razz. Loud music, and a mix of people who should have went home hours ago surround you.", {
        bar: northBar1Bar,
        dancefloor: northBar1Dance
      });
  
      // McCooley's interiors and actions
      const northBar2Bar = new Location("McCooley's Bar", "You approach the busy Irish bar.", {}, {
        drink: () => "You grab a Guinness and raise a toast with strangers."
      });
      const northBar2Dance = new Location("McCooley's Dancefloor", "The dance floor is bouncing with singalong hits.", {}, {
        dance: () => "You attempt to do an irish jig but end up just jumping around. You get some strange looks but mostly you're a hit, everyone is having a laugh."
      });
      northBar2Bar.options.dancefloor = northBar2Dance;
      northBar2Dance.options.bar = northBar2Bar;
      const northBar2Interior = new Location("Inside McCooley's", "You're in McCooley's. The energy is electric with Irish charm.", {
        bar: northBar2Bar,
        dancefloor: northBar2Dance
      });
  
      // Popworld interiors and actions
      const southBar1Bar = new Location("Popworld Bar", "You reach the colorful bar.", {}, {
        drink: () => "You sip a unknown-cocktail with a colourful little umbrella. It’s suspiciously strong."
      });
      const southBar1Dance = new Location("Popworld Dancefloor", "You look around to see people your parents' age dancing around poles and having a great time.", {}, {
        dance: () => "You dance like nobody's watching to pure 2000s cheese."
      });
      southBar1Bar.options.dancefloor = southBar1Dance;
      southBar1Dance.options.bar = southBar1Bar;
      const southBar1Interior = new Location("Inside Popworld", "You're inside Popworld with its neon lights and pop anthems.", {
        bar: southBar1Bar,
        dancefloor: southBar1Dance
      });
  
      // Electrik Warehouse interiors and actions
      const southBar2Bar = new Location("Electrik Bar", "The bar is packed but you manage to squeeze through the crowd and reach the front of the bar.", {}, {
        drink: () => "You grab a cheap double-vodka lemonade, a Jägerbomb and scan the dancefloor."
      });
      const southBar2Dance = new Location("Electrik Dancefloor", "The crowd bounces under flashing lights.", {}, {
        dance: () => "You throw your hands up and lose yourself in the beat and crowd."
      });
      southBar2Bar.options.dancefloor = southBar2Dance;
      southBar2Dance.options.bar = southBar2Bar;
      const southBar2Interior = new Location("Inside Electrik Warehouse", "You're in Electrik Warehouse. A warehouse-style club with multiple levels, full of students who have had one too many to drink.", {
        bar: southBar2Bar,
        dancefloor: southBar2Dance
      });
  
      // North side street that leads to clubs
      const northHub = new Location("North Side Street", "You see two clubs: The Razz to the east and McCooley's to the west.", {
        south: street,
        east: northBar1Interior,
        west: northBar2Interior,
        "the razz": northBar1Interior,
        "mccooley's": northBar2Interior
      });
  
      // South side street that leads to clubs and food
      const southHub = new Location("South Side Street", "Two more clubs are visible: Popworld to the east and Electrik Warehouse to the west.", {
        north: street,
        south: foodPlace,
        east: southBar1Interior,
        west: southBar2Interior,
        "popworld": southBar1Interior,
        "electrik warehouse": southBar2Interior
      });
  
      // Main street setup
      street.options = {
        north: northHub,
        south: southHub,
        home: () => "You decide to head home and call a taxi. You’ve survived the night out in Liverpool. Congrats, you win!"
      };
  
      // Navigation links
      northBar1Interior.options.west = northHub;
      northBar2Interior.options.east = northHub;
      southBar1Interior.options.west = southHub;
      southBar2Interior.options.east = southHub;
      foodPlace.options.north = southHub;
  
      this.locations = { street };
    }
  
    // Start the game
    start(name) {
      this.player = new Player(name, this.locations.street);
      updateDrinkCounter(this.player.drinks);
      return `Welcome, ${name}!\n${this.player.currentLocation.describe()}`;
    }
  
    // Handling user commands
    handleCommand(command) {
      if (!this.player) return "Please enter your name to start the game.";
      return this.player.move(command);
    }
  }
  
  let game = new Game();
  let gameStarted = false;
  
  // DOM 
  const textarea = document.getElementById("textarea");
  const input = document.getElementById("usertext");
  const drinkDisplay = document.getElementById("drink-counter");
  
  // Updates the drink count display
function updateDrinkCounter(count) {
    if (drinkDisplay) {
      drinkDisplay.textContent = `Drinks: ${count}`;
    }
  }
  
  // Initial welcome message
  textarea.textContent = "Welcome to the Liverpool Night Out Adventure!\n\nYour goal is to explore the nightlife, have a good time and survive the night.\nWill you be able to make it home unscathed? \n\nPlease enter your name to begin.\n\n";
  
// Command input
input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const value = input.value.trim();
      input.value = "";
      if (!value) return;
  
      if (!gameStarted) {
        textarea.textContent = `> ${value}\n`;
        textarea.textContent += game.start(value) + "\n";
        gameStarted = true;
      } else {

        textarea.textContent = `> ${value}\n`;
        const result = game.handleCommand(value);
  
      textarea.textContent += result + "\n";
      textarea.textContent += "\n";  
      textarea.textContent += `Drinks: ${game.player.drinks}\n`;  
    }
  }
});