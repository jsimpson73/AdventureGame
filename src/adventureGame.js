// ===========================================
// The Dragon's Quest - Text Adventure Game
// A progression-based learning project
// ===========================================

// Include readline for player input
const readline = require("readline-sync");

// Game state variables
let gameRunning = true;
let playerName = "";
let playerHealth = 100;
let playerGold = 20; // Starting gold
let currentLocation = "village";

// Weapon damage (starts at 0 until player buys a sword)
let weaponDamage = 0; // Base weapon damage
let monsterDefense = 5; // Monster's defense value
let healingPotionValue = 30; // How much health is restored

// Item templates with properties
const healthPotion = {
  name: "Health Potion",
  type: "potion",
  value: 5, // Cost in gold
  effect: 30, // Healing amount
  description: "Restores 30 health points",
};

const sword = {
  name: "Sword",
  type: "weapon",
  value: 10, // Cost in gold
  effect: 10, // Damage amount
  description: "A sturdy blade for combat",
};

// TASK 1: Additional item templates for progression
const woodenShield = {
  name: "Wooden Shield",
  type: "armor",
  value: 8, // Cost in gold
  effect: 5, // Protection amount
  description: "Reduces damage taken in combat",
};

const steelSword = {
  name: "Steel Sword",
  type: "weapon",
  value: 25, // Cost in gold
  effect: 20, // Damage amount
  description: "A masterwork blade forged from steel",
};

const ironShield = {
  name: "Iron Shield",
  type: "armor",
  value: 20, // Cost in gold
  effect: 10, // Protection amount
  description: "Heavy iron shield providing excellent protection",
};

// Create empty inventory array (from previous lab)
let inventory = []; // Will now store item objects instead of strings

// ===========================
// Display Functions
// Functions that show game information to the player
// ===========================

/**
 * Shows the player's current stats
 * Displays health, gold, and current location
 */
function showStatus() {
  console.log("\n=== " + playerName + "'s Status ===");
  console.log("❤️  Health: " + playerHealth);
  console.log("💰 Gold: " + playerGold);
  console.log("📍 Location: " + currentLocation);

  // Enhanced inventory display with item details
  console.log("🎒 Inventory: ");
  if (inventory.length === 0) {
    console.log("   Nothing in inventory");
  } else {
    inventory.forEach((item, index) => {
      console.log(
        "   " + (index + 1) + ". " + item.name + " - " + item.description
      );
    });
  }
}

/**
 * Shows the current location's description and available choices
 * TASK 3: Enhanced with numbered choices for all locations
 */
function showLocation() {
  console.log("\n=== " + currentLocation.toUpperCase() + " ===");

  if (currentLocation === "village") {
    console.log(
      "You're in a bustling village. The blacksmith and market are nearby."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Go to blacksmith");
    console.log("2: Go to market");
    console.log("3: Enter forest");
    console.log("4: Travel to dragon's lair");
    console.log("5: Check status");
    console.log("6: Use item");
    console.log("7: Help");
    console.log("8: Quit game");
  } else if (currentLocation === "blacksmith") {
    console.log(
      "The heat from the forge fills the air. Weapons and armor line the walls."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Buy sword (" + sword.value + " gold)");
    console.log("2: Buy steel sword (" + steelSword.value + " gold)");
    console.log("3: Buy wooden shield (" + woodenShield.value + " gold)");
    console.log("4: Buy iron shield (" + ironShield.value + " gold)");
    console.log("5: Return to village");
    console.log("6: Check status");
    console.log("7: Use item");
    console.log("8: Help");
    console.log("9: Quit game");
  } else if (currentLocation === "market") {
    console.log(
      "Merchants sell their wares from colorful stalls. A potion seller catches your eye."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Buy potion (" + healthPotion.value + " gold)");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Use item");
    console.log("5: Help");
    console.log("6: Quit game");
  } else if (currentLocation === "forest") {
    console.log(
      "The forest is dark and foreboding. You hear strange noises all around you."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Return to village");
    console.log("2: Check status");
    console.log("3: Use item");
    console.log("4: Help");
    console.log("5: Quit game");
  } else if (currentLocation === "dragon_lair") {
    console.log(
      "🐉 The dragon's lair! Smoke and heat fill the cavern. The mighty dragon awaits!"
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Fight the dragon");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Use item");
    console.log("5: Help");
    console.log("6: Quit game");
  }
}

// ===========================
// TASK 1: Item Management Helper Functions
// Functions to find and manage items by type
// ===========================

/**
 * Gets all items of a specific type from inventory
 * @param {string} type The type of item to find (e.g., "weapon", "armor", "potion")
 * @returns {Array} Array of items matching the type
 */
function getItemsByType(type) {
  return inventory.filter((item) => item.type === type);
}

/**
 * Finds the item with the highest effect value of a given type
 * @param {string} type The type of item to find
 * @returns {Object|null} The best item or null if none found
 */
function getBestItem(type) {
  let items = getItemsByType(type);
  if (items.length === 0) {
    return null;
  }

  // Find item with highest effect value
  let bestItem = items[0];
  for (let i = 1; i < items.length; i++) {
    if (items[i].effect > bestItem.effect) {
      bestItem = items[i];
    }
  }
  return bestItem;
}

/**
 * Checks if player has good enough equipment to face the dragon
 * Requires steel sword and any armor
 * @returns {boolean} True if well-equipped, false otherwise
 */
function hasGoodEquipment() {
  // Check for steel sword specifically
  let hasSteelSword = inventory.some(
    (item) => item.name === "Steel Sword" && item.type === "weapon"
  );

  // Check for any armor
  let hasArmor = getItemsByType("armor").length > 0;

  return hasSteelSword && hasArmor;
}

// ===========================
// Combat Functions
// TASK 2: Enhanced combat with equipment selection and damage calculations
// ===========================

/**
 * Checks if player has an item of specified type
 * @param {string} type The type of item to check for
 * @returns {boolean} True if player has the item type
 */
function hasItemType(type) {
  return inventory.some((item) => item.type === type);
}

/**
 * Handles monster battles with automatic equipment selection
 * TASK 2: Enhanced with isDragon parameter and armor protection
 * @param {boolean} isDragon Whether this is a dragon battle (default: false)
 * @returns {boolean} true if player wins, false if they retreat/lose
 */
function handleCombat(isDragon = false) {
  // Get best weapon and armor
  let weapon = getBestItem("weapon");
  let armor = getBestItem("armor");

  // Set monster stats based on battle type
  let monsterDamage = isDragon ? 20 : 10;
  let monsterHealth = isDragon ? 50 : 20;
  let monsterName = isDragon ? "DRAGON" : "Monster";

  console.log("\n⚔️  BATTLE START ⚔️");
  console.log("You face the " + monsterName + "!");
  console.log(monsterName + " Health: " + monsterHealth);

  // Check if player has a weapon
  if (!weapon) {
    console.log("\n❌ Without a weapon, you must retreat!");
    updateHealth(-20);
    return false;
  }

  // Display equipment being used
  console.log("\n🗡️  Equipped Weapon: " + weapon.name + " (Damage: " + weapon.effect + ")");
  if (armor) {
    console.log("🛡️  Equipped Armor: " + armor.name + " (Protection: " + armor.effect + ")");
  } else {
    console.log("🛡️  No armor equipped!");
  }

  // Combat loop
  while (monsterHealth > 0 && playerHealth > 0) {
    // Player attacks
    console.log("\n--- Your Turn ---");
    console.log("You attack with your " + weapon.name + "!");
    monsterHealth -= weapon.effect;
    console.log("You deal " + weapon.effect + " damage!");
    console.log(monsterName + " Health: " + Math.max(0, monsterHealth));

    // Check if monster is defeated
    if (monsterHealth <= 0) {
      console.log("\n🎉 Victory! The " + monsterName + " is defeated!");
      if (isDragon) {
        console.log("💰 You found 50 gold and legendary treasure!");
        playerGold += 50;
      } else {
        console.log("💰 You found 10 gold!");
        playerGold += 10;
      }
      return true;
    }

    // Monster attacks
    console.log("\n--- " + monsterName + "'s Turn ---");
    let incomingDamage = monsterDamage;

    // Apply armor protection
    if (armor) {
      let protection = armor.effect;
      incomingDamage -= protection;
      console.log("🛡️  Your " + armor.name + " blocks " + protection + " damage!");
    }

    // Ensure minimum damage of 1
    if (incomingDamage < 1) {
      incomingDamage = 1;
    }

    console.log("The " + monsterName + " attacks!");
    console.log("You take " + incomingDamage + " damage!");
    updateHealth(-incomingDamage);

    // Check if player is defeated
    if (playerHealth <= 0) {
      console.log("\n💀 You have been defeated!");
      return false;
    }
  }

  return false;
}

/**
 * Updates player health, keeping it between 0 and 100
 * @param {number} amount Amount to change health by (positive for healing, negative for damage)
 * @returns {number} The new health value
 */
function updateHealth(amount) {
  playerHealth += amount;

  if (playerHealth > 100) {
    playerHealth = 100;
    console.log("You're at full health!");
  }
  if (playerHealth < 0) {
    playerHealth = 0;
    console.log("You're gravely wounded!");
  }

  console.log("Health is now: " + playerHealth);
  return playerHealth;
}

// ===========================
// Item Functions
// Functions that handle item usage and inventory
// ===========================

/**
 * Handles using items like potions
 * @returns {boolean} true if item was used successfully, false if not
 */
function useItem() {
  if (inventory.length === 0) {
    console.log("\nYou have no items!");
    return false;
  }

  console.log("\n=== Inventory ===");
  inventory.forEach((item, index) => {
    console.log(index + 1 + ". " + item.name);
  });

  let choice = readline.question("Use which item? (number or 'cancel'): ");
  if (choice === "cancel") return false;

  let index = parseInt(choice) - 1;
  if (index >= 0 && index < inventory.length) {
    let item = inventory[index];

    if (item.type === "potion") {
      console.log("\nYou drink the " + item.name + ".");
      updateHealth(item.effect);
      inventory.splice(index, 1);
      console.log("Health restored to: " + playerHealth);
      return true;
    } else if (item.type === "weapon") {
      console.log("\nYou ready your " + item.name + " for battle.");
      return true;
    } else if (item.type === "armor") {
      console.log("\nYou equip your " + item.name + " for protection.");
      return true;
    }
  } else {
    console.log("\nInvalid item number!");
  }
  return false;
}

/**
 * Displays the player's inventory
 */
function checkInventory() {
  console.log("\n=== INVENTORY ===");
  if (inventory.length === 0) {
    console.log("Your inventory is empty!");
    return;
  }

  // Display all inventory items with numbers and descriptions
  inventory.forEach((item, index) => {
    console.log(index + 1 + ". " + item.name + " - " + item.description);
  });
}

// ===========================
// Shopping Functions
// TASK 3: Enhanced shopping system
// ===========================

/**
 * Handles purchasing items at the blacksmith
 * Enhanced to support multiple items
 */
function buyFromBlacksmith() {
  console.log("\n=== BLACKSMITH SHOP ===");
  console.log("Your gold: " + playerGold);
  console.log("\nAvailable items:");
  console.log("1. " + sword.name + " - " + sword.value + " gold (" + sword.description + ")");
  console.log("2. " + steelSword.name + " - " + steelSword.value + " gold (" + steelSword.description + ")");
  console.log("3. " + woodenShield.name + " - " + woodenShield.value + " gold (" + woodenShield.description + ")");
  console.log("4. " + ironShield.name + " - " + ironShield.value + " gold (" + ironShield.description + ")");

  let choice = readline.question("\nWhat would you like to buy? (1-4 or 'cancel'): ");
  if (choice === "cancel") return;

  let itemToBuy = null;
  if (choice === "1") itemToBuy = sword;
  else if (choice === "2") itemToBuy = steelSword;
  else if (choice === "3") itemToBuy = woodenShield;
  else if (choice === "4") itemToBuy = ironShield;

  if (itemToBuy) {
    if (playerGold >= itemToBuy.value) {
      console.log("\nBlacksmith: 'A fine choice for a brave adventurer!'");
      playerGold -= itemToBuy.value;
      inventory.push({ ...itemToBuy });
      console.log("You bought a " + itemToBuy.name + " for " + itemToBuy.value + " gold!");
      console.log("Gold remaining: " + playerGold);
    } else {
      console.log("\nBlacksmith: 'Come back when you have more gold!'");
      console.log("You need " + (itemToBuy.value - playerGold) + " more gold.");
    }
  } else {
    console.log("\nInvalid choice!");
  }
}

/**
 * Handles purchasing items at the market
 */
function buyFromMarket() {
  if (playerGold >= healthPotion.value) {
    console.log("\nMerchant: 'This potion will heal your wounds!'");
    playerGold -= healthPotion.value;
    inventory.push({ ...healthPotion });
    console.log(
      "You bought a " +
        healthPotion.name +
        " for " +
        healthPotion.value +
        " gold!"
    );
    console.log("Gold remaining: " + playerGold);
  } else {
    console.log("\nMerchant: 'No gold, no potion!'");
    console.log("You need " + (healthPotion.value - playerGold) + " more gold.");
  }
}

// ===========================
// Help System
// Provides information about available commands
// ===========================

/**
 * Shows all available game commands and how to use them
 */
function showHelp() {
  console.log("\n=== AVAILABLE COMMANDS ===");

  console.log("\n📍 Movement Commands:");
  console.log("- In the village, choose numbered options to travel to different locations");
  console.log("- Visit the blacksmith to buy weapons and armor");
  console.log("- Visit the market to buy healing potions");
  console.log("- Enter the forest to fight monsters and earn gold");
  console.log("- Travel to the dragon's lair when you're ready for the final battle");

  console.log("\n⚔️  Battle Information:");
  console.log("- You need a weapon to win battles");
  console.log("- Better weapons deal more damage");
  console.log("- Armor reduces incoming damage");
  console.log("- Regular monsters: 10 damage, 20 health");
  console.log("- Dragon: 20 damage, 50 health (requires steel sword and armor!)");

  console.log("\n🎒 Item Usage:");
  console.log("- Health potions restore 30 health");
  console.log("- Weapons are automatically used in combat");
  console.log("- Armor automatically protects you in combat");
  console.log("- The game uses your best weapon and armor automatically");

  console.log("\n💰 Shopping:");
  console.log("- Sword: " + sword.value + " gold (10 damage)");
  console.log("- Steel Sword: " + steelSword.value + " gold (20 damage)");
  console.log("- Wooden Shield: " + woodenShield.value + " gold (5 protection)");
  console.log("- Iron Shield: " + ironShield.value + " gold (10 protection)");
  console.log("- Health Potion: " + healthPotion.value + " gold (30 healing)");

  console.log("\n🎯 Tips:");
  console.log("- Fight monsters in the forest to earn gold");
  console.log("- Buy better equipment before facing the dragon");
  console.log("- Keep healing potions for emergencies");
  console.log("- You need the steel sword AND armor to defeat the dragon");
  console.log("- Health can't go above 100");
}

// ===========================
// Movement Functions
// TASK 3: Enhanced movement with equipment requirements
// ===========================

/**
 * Handles movement between locations
 * @param {number} choiceNum The chosen option number
 * @returns {boolean} True if movement was successful
 */
function move(choiceNum) {
  let validMove = false;

  if (currentLocation === "village") {
    if (choiceNum === 1) {
      currentLocation = "blacksmith";
      console.log("\nYou enter the blacksmith's shop.");
      validMove = true;
    } else if (choiceNum === 2) {
      currentLocation = "market";
      console.log("\nYou enter the market.");
      validMove = true;
    } else if (choiceNum === 3) {
      currentLocation = "forest";
      console.log("\nYou venture into the forest...");
      validMove = true;

      // Trigger combat when entering forest
      console.log("\nA monster appears!");
      if (!handleCombat(false)) {
        currentLocation = "village";
      }
    } else if (choiceNum === 4) {
      // Check equipment before allowing dragon battle
      if (!hasGoodEquipment()) {
        console.log("\n⚠️  WARNING: You are not prepared for the dragon!");
        console.log("You need:");
        console.log("- Steel Sword (25 gold at blacksmith)");
        console.log("- Any armor (Wooden Shield: 8 gold, Iron Shield: 20 gold)");
        console.log("\nThe path to the dragon's lair remains blocked.");
        validMove = false;
      } else {
        currentLocation = "dragon_lair";
        console.log("\n🐉 You approach the dragon's lair...");
        console.log("The ground trembles beneath your feet.");
        validMove = true;
      }
    }
  } else if (currentLocation === "blacksmith") {
    if (choiceNum === 5) {
      currentLocation = "village";
      console.log("\nYou return to the village center.");
      validMove = true;
    }
  } else if (currentLocation === "market") {
    if (choiceNum === 2) {
      currentLocation = "village";
      console.log("\nYou return to the village center.");
      validMove = true;
    }
  } else if (currentLocation === "forest") {
    if (choiceNum === 1) {
      currentLocation = "village";
      console.log("\nYou hurry back to the safety of the village.");
      validMove = true;
    }
  } else if (currentLocation === "dragon_lair") {
    if (choiceNum === 2) {
      currentLocation = "village";
      console.log("\nYou retreat to the village to prepare better.");
      validMove = true;
    }
  }

  return validMove;
}

// ===========================
// Input Validation
// TASK 3: Enhanced input validation
// ===========================

/**
 * Validates if a choice number is within valid range
 * @param {string} input The user input to validate
 * @param {number} max The maximum valid choice number
 * @returns {boolean} True if choice is valid
 */
function isValidChoice(input, max) {
  if (input === "") return false;
  let num = parseInt(input);
  return num >= 1 && num <= max;
}

// ===========================
// Victory Conditions
// TASK 3: Game completion and victory
// ===========================

/**
 * Handles the dragon battle and victory condition
 * @returns {boolean} True if player wins
 */
function dragonBattle() {
  console.log("\n" + "=".repeat(50));
  console.log("🐉 THE FINAL BATTLE 🐉");
  console.log("=".repeat(50));
  console.log("\nThe dragon roars, shaking the very mountains!");
  console.log("This is the moment you've been preparing for.");

  let victory = handleCombat(true);

  if (victory) {
    // Victory sequence
    console.log("\n" + "=".repeat(50));
    console.log("🎉 VICTORY! 🎉");
    console.log("=".repeat(50));
    console.log("\nThe mighty dragon falls! You have saved the realm!");
    console.log("\n--- FINAL STATS ---");
    console.log("Hero: " + playerName);
    console.log("Final Health: " + playerHealth);
    console.log("Final Gold: " + playerGold);
    console.log("\nInventory:");
    inventory.forEach((item) => {
      console.log("- " + item.name);
    });
    console.log("\n" + "=".repeat(50));
    console.log("Thank you for playing The Dragon's Quest!");
    console.log("You are a true hero!");
    console.log("=".repeat(50));
    return true;
  } else {
    console.log("\nYou have been defeated by the dragon...");
    console.log("Perhaps you need better equipment or more health?");
    currentLocation = "village";
    return false;
  }
}

// ===========================
// Main Game Loop
// Controls the flow of the game
// ===========================

if (require.main === module) {
  console.log("=================================");
  console.log("       The Dragon's Quest        ");
  console.log("=================================");
  console.log("\nYour quest: Defeat the dragon in the mountains!");

  // Get player's name
  playerName = readline.question("\nWhat is your name, brave adventurer? ");
  console.log("\nWelcome, " + playerName + "!");
  console.log("You start with " + playerGold + " gold.");
  console.log("\n💡 Tip: Type 'help' anytime to see available commands!");

  while (gameRunning) {
    // Show current location and choices
    showLocation();

    // Get and validate player choice
    let validChoice = false;
    while (!validChoice) {
      try {
        let choice = readline.question("\nEnter choice (number): ");

        // Check for empty input
        if (choice.trim() === "") {
          throw "Please enter a number!";
        }

        // Convert to number and check if it's a valid number
        let choiceNum = parseInt(choice);
        if (isNaN(choiceNum)) {
          throw "That's not a number! Please enter a number.";
        }

        // Handle choices based on location
        if (currentLocation === "village") {
          if (choiceNum < 1 || choiceNum > 8) {
            throw "Please enter a number between 1 and 8.";
          }

          validChoice = true;

          if (choiceNum <= 4) {
            move(choiceNum);
          } else if (choiceNum === 5) {
            showStatus();
          } else if (choiceNum === 6) {
            useItem();
          } else if (choiceNum === 7) {
            showHelp();
          } else if (choiceNum === 8) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        } else if (currentLocation === "blacksmith") {
          if (choiceNum < 1 || choiceNum > 9) {
            throw "Please enter a number between 1 and 9.";
          }

          validChoice = true;

          if (choiceNum >= 1 && choiceNum <= 4) {
            buyFromBlacksmith();
          } else if (choiceNum === 5) {
            move(choiceNum);
          } else if (choiceNum === 6) {
            showStatus();
          } else if (choiceNum === 7) {
            useItem();
          } else if (choiceNum === 8) {
            showHelp();
          } else if (choiceNum === 9) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        } else if (currentLocation === "market") {
          if (choiceNum < 1 || choiceNum > 6) {
            throw "Please enter a number between 1 and 6.";
          }

          validChoice = true;

          if (choiceNum === 1) {
            buyFromMarket();
          } else if (choiceNum === 2) {
            move(choiceNum);
          } else if (choiceNum === 3) {
            showStatus();
          } else if (choiceNum === 4) {
            useItem();
          } else if (choiceNum === 5) {
            showHelp();
          } else if (choiceNum === 6) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        } else if (currentLocation === "forest") {
          if (choiceNum < 1 || choiceNum > 5) {
            throw "Please enter a number between 1 and 5.";
          }

          validChoice = true;

          if (choiceNum === 1) {
            move(choiceNum);
          } else if (choiceNum === 2) {
            showStatus();
          } else if (choiceNum === 3) {
            useItem();
          } else if (choiceNum === 4) {
            showHelp();
          } else if (choiceNum === 5) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        } else if (currentLocation === "dragon_lair") {
          if (choiceNum < 1 || choiceNum > 6) {
            throw "Please enter a number between 1 and 6.";
          }

          validChoice = true;

          if (choiceNum === 1) {
            // Dragon battle
            let victory = dragonBattle();
            if (victory) {
              gameRunning = false; // End game on victory
            }
          } else if (choiceNum === 2) {
            move(choiceNum);
          } else if (choiceNum === 3) {
            showStatus();
          } else if (choiceNum === 4) {
            useItem();
          } else if (choiceNum === 5) {
            showHelp();
          } else if (choiceNum === 6) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        }
      } catch (error) {
        console.log("\nError: " + error);
        console.log("Please try again!");
      }
    }

    // Check if player died
    if (playerHealth <= 0) {
      console.log("\n" + "=".repeat(50));
      console.log("💀 GAME OVER 💀");
      console.log("=".repeat(50));
      console.log("\nYour health reached 0!");
      console.log("The adventure ends here for " + playerName + "...");
      console.log("\n💡 Tip: Keep healing potions and use them before your health gets too low!");
      gameRunning = false;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("Thanks for playing The Dragon's Quest!");
  console.log("=".repeat(50));
}