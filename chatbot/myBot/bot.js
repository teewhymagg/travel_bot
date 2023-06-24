const readline = require('readline');
const fs = require('fs');

let currentContext = null;
let chosenVacation = '';
let chosenLocation = '';
let chosenDate = '';
let chosenTime = '';
let chosenActivity = '';
let chosenQuantity = '';
let userAppointments = [];;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const responses = JSON.parse(fs.readFileSync('responses.json', 'utf8'));

function askQuestion(question) {
    return new Promise(resolve => {
        rl.question(question, answer => {
            resolve(answer);
        });
    });
}

async function handleHelpCommand() {
    let helpInput = await askQuestion('Please choose an option (type the corresponding number):\n1. Guide service\n2. Office location\n3. Contacts\n4. Our rating\n5. Social networks\n6. Buy a Bayern ticket\nYour choice: ');

    switch (helpInput) {
        case '1':
            // Guide service
            let vacationTypes = await listVacationTypes();
            console.log("Guide Service:\n", vacationTypes);
            break;
        case '2':
            // Office location
            console.log("Office Location:\n Nordendstraße 14-17, 13156, Berlin, Germany");
            break;
        case '3':
            // Contacts
            console.log("Contacts:\n +7 777 777 0101, +7 777 777 0202, +7 777 777 0303");
            break;
        case '4':
            // Our rating
            console.log("Our Ratings:\n Overall rating: 4.9 of 5.0\n Rating for past 3 months: 4.8 of 5.0\n Rating for past 6 months: 4.9 of 5.0");
            break;
        case '5':
            // Social networks
            console.log("Social Networks:\n https://www.youtube.com/@MrBeast\n https://www.instagram.com/cristiano/\n https://www.twitch.tv/s1mple");
            break;
        case '6':
            // Bayern ticket
            console.log("Buy a Bayern ticket:\n https://www.bahn.de/angebot/regio/laender-tickets/bayern-ticket");
            break;
        default:
            console.log("Invalid choice. Please enter a number between 1 and 6.");
            break;
    }
}


async function bookActivity(type, cost, location) {
    // Additional control for the quantity.
    let quantity = '';
    do {
        quantity = await askQuestion(`How many ${type}s would you like to book? `);
        if (quantity.trim() === "/help") {
            await handleHelpCommand();
            return await bookActivity(type, cost, location); // Use recursion to repeat the process.
        }
    } while (isNaN(quantity) || quantity <= 0);

    let totalCost = quantity * cost;
    let confirmation = await askQuestion(`The total cost for ${quantity} ${type}(s) at ${location} would be $${totalCost}. Would you like to proceed? (yes/no) `);

    if (confirmation.toLowerCase() === "yes") {
        // Check the validity of the date.
        let userDate = '';
        do {
            userDate = await askQuestion("\nOn which date would you like to book? Please provide a date (in format YYYY-MM-DD): ");
            if (userDate.trim() === "/help") {
                await handleHelpCommand();
                continue;
            }
        } while (!Date.parse(userDate));

        // Check the validity of the time.
        let userTime = '';
        do {
            userTime = await askQuestion("\nAt what time would you like to book? Please provide a time (in 24-hour format HH:MM): ");
            if (userTime.trim() === "/help") {
                await handleHelpCommand();
                continue;
            }
        } while (!/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(userTime));

        let bookingType = quantity > 1 ? `${type}s` : `${type}`;
        let verb = quantity > 1 ? 'are' : 'is';
        let appointment = `Great! Your ${quantity} ${bookingType} at ${location} ${verb} booked for ${userDate} at ${userTime}. The total cost is $${totalCost}. We are excited to see you then!`;
        userAppointments.push(appointment);
        return appointment;
    } else {
        return "Alright! Let me know if you want to book anything else.";
    }
}


async function getBotResponse(userInput) {
    userInput = userInput.toLowerCase();

    if (currentContext) {
        for (let subkeyword in currentContext) {
            if (userInput.includes(subkeyword) || userInput.includes(subkeyword.split(" ")[0])) {
                chosenLocation = subkeyword;
                let subContext = currentContext[subkeyword];
                if (subContext) {
                    currentContext = subContext;
                    if (typeof currentContext.responses === "string") {
                        if (chosenVacation === "hiking") {
                            chosenActivity = currentContext.responses;
                            currentContext.responses = await setAppointment(); // Ask for date and time
                        }
                        return currentContext.responses;
                    } else {
                        return currentContext.responses[Math.floor(Math.random() * currentContext.responses.length)];
                    }
                }
            }
        }
        // if chosenLocation is not found in currentContext
        currentContext = responses; // Reset currentContext back to responses
    }

    for (let keyword in responses) {
        if (userInput.includes(keyword)) {
            chosenVacation = keyword;
            if (typeof responses[keyword].responses === "string") {
                return responses[keyword].responses;
            } else {
                let botResponse = responses[keyword].responses[Math.floor(Math.random() * responses[keyword].responses.length)];
                currentContext = responses[keyword];
                return botResponse;
            }
        }
    }

    // Check if user asked for help in the middle of the conversation
    if (userInput.trim() === "/help") {
        await handleHelpCommand();
        return "";  // Return empty string as handleHelpCommand() already prints help information
    }

    return null; // Return null when bot doesn't understand the user's input
}






async function setAppointment() {
    chosenDate = await askQuestion("\nWhen would you like to have your tour? Please provide a date (in format YYYY-MM-DD): ");

    if (Date.parse(chosenDate)) {
        chosenTime = await askQuestion("\nAnd what time would you prefer? Please provide a time (in 24-hour format HH:MM): ");

        if (/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(chosenTime)) {
            let appointment = `Great! Your ${chosenVacation} tour in ${chosenLocation} is set for ${chosenDate} at ${chosenTime}. We are excited to see you then!`;
            userAppointments.push(appointment);
            return appointment;
        } else {
            return "That doesn't seem like a valid time. Please try again with a valid time (24-hour format HH:MM).";
        }
    } else {
        return "That doesn't seem like a valid date. Please try again with a valid date (in format YYYY-MM-DD).";
    }
}

// This function lists all the vacation types and asks the user about their preferences
async function listVacationTypes() {
    chosenVacation = '';
    chosenLocation = '';
    let greeting = "I can help you plan different types of vacations. Here are some ideas: ";
    let idea1 = "Hiking";
    let idea2 = "Beach Vacation";
    let idea3 = "Exploring the attractions of Bavaria";
    console.log(`${greeting}\n${idea1}\n${idea2}\n${idea3}`);

    let preferenceQuestion = "\nWhich of these types of vacations are you interested in, or is there another type you prefer?";
    let userPreference = await askQuestion(preferenceQuestion);

    if (userPreference.trim().toLowerCase() === "/help") {
        await handleHelpCommand();
        return await listVacationTypes();
    } else {
        let question = await getBotResponse(userPreference);
        console.log(`Bot: ${question}`);
        return userPreference; // Return the selected vacation type
    }
}



async function startConversation() {
    chosenVacation = '';
    chosenLocation = '';
    let failedAttempts = 0;

    // Greeting message
    let response = await askQuestion("Hello, we are Turan company, which provides a guided tour for different places around Bavaria, Germany. Want to see our catalog? (yes/no) ");

    if (response.toLowerCase() === "yes") {
        await listVacationTypes();
    }
     else {
        console.log("Okay, let me know if you change your mind. Have a nice day!");
        return; // Stops the process if the user doesn't want to see the catalog
    }

    let turns = 0;
    let location;
    let awaitingLoungerSeatingResponse = false;

    while (true) {
        let userInput = await askQuestion('You: ');
        let botResponse = await getBotResponse(userInput);

        if (botResponse !== null) {
            console.log(`Bot: ${botResponse}`);
            failedAttempts = 0; // Reset failedAttempts
        } else {
            failedAttempts++; // Increment failedAttempts

            // If the bot failed to understand the user's input 5 times, start over
            if (failedAttempts >= 5) {
                console.log("I'm having trouble understanding you. Let's start over.");
                failedAttempts = 0; // Reset failedAttempts
                response = await askQuestion("Hello, we are Turan company, which provides a guided tour for different places around Bavaria, Germany. Want to see our catalog? (yes/no) ");
                if (response.toLowerCase() === "yes") {
                    await listVacationTypes();
                } else {
                    console.log("Okay, let me know if you change your mind. Have a nice day!");
                    return; // Stops the process if the user doesn't want to see the catalog
                }
                continue; // Skip the current loop iteration
            }
        }

        // If the user says "/help", provide help information
        if (userInput.trim() === "/help") {
            let helpInput = await askQuestion('Please choose an option (type the corresponding number):\n1. Guide service\n2. Office location\n3. Contacts\n4. Our rating\n5. Social networks\n6. Buy a Bayern ticket\nYour choice: ');

            switch (helpInput) {
                case '1':
                    // Guide service
                    let vacationTypes = await listVacationTypes();
                    console.log("Guide Service:\n", vacationTypes);
                    break;
                case '2':
                    // Office location
                    console.log("Office Location:\n Nordendstraße 14-17, 13156, Berlin, Germany");
                    break;
                case '3':
                    // Contacts
                    console.log("Contacts:\n +7 777 777 0101,\n +7 777 777 0202,\n +7 777 777 0303");
                    break;
                case '4':
                    // Our rating
                    console.log("Our Rating:\n Overall rating: 4.9 of 5.0\n Rating for past 3 months: 4.8 of 5.0\n Rating for past 6 months: 4.9 of 5.0");
                    break;
                case '5':
                    // Social networks
                    console.log("Social Networks:\n https://www.youtube.com/@MrBeast\n https://www.instagram.com/cristiano/\n https://www.twitch.tv/s1mple");
                    break;
                case '6':
                    // Bayern ticket
                    console.log("Buy a Bayern ticket:\n https://www.bahn.de/angebot/regio/laender-tickets/bayern-ticket");
                    break;
                default:
                    console.log("Invalid choice. Please enter a number between 1 and 6.");
                    break;
            }

            let continueInput = await askQuestion('Would you like to continue the previous conversation or start a new one? (continue/new) ');

            if (continueInput.trim().toLowerCase() === "new") {
                userPreference = await listVacationTypes();
                question = await getBotResponse(userPreference);
                console.log(`Bot: ${question}`);
            }
            else if (continueInput.trim().toLowerCase() === "continue") {
                console.log(`Bot: Back to our previous conversation.`);
                userInput = ''; // Clear userInput to allow conversation to continue
            }
            else {
                console.log("Invalid response. Please say either 'continue' or 'new'.");
            }

            continue;
        }


        // If the user says "bye", end the conversation
        if (userInput.toLowerCase().trim() === "bye") {
            console.log("\nIf you would like to monitor the weather in the area where you are planning to go, you can do this in our website!\nHere is a summary of your appointments:");
            for (let appointment of userAppointments) {
                console.log(appointment);
            }
            break;
        }

        if (awaitingLoungerSeatingResponse && (userInput.toLowerCase() === 'lounger' || userInput.toLowerCase() === 'guest house')) {
            awaitingLoungerSeatingResponse = false;
            let type = userInput;
            // Book an activity
            let appointment = '';
            do {
                appointment = await bookActivity(`${type} at ${location}`, type === 'lounger' ? 20 : 200, location);
            } while (appointment.includes('invalid'));

            // Ask user if they want to continue exploring
            let continueExploring = await askQuestion('Do you want to continue with exploring new places? (yes/no) ');
            if (continueExploring.toLowerCase() === 'yes') {
                userPreference = await listVacationTypes();
                question = await getBotResponse(userPreference);
                console.log(`Bot: ${question}`);
            } else {
                console.log("\nIf you would like to monitor the weather in the area where you are planning to go, you can do this in our website!\nHere is a summary of your appointments:");
                for (let appointment of userAppointments) {
                    console.log(appointment);
                }
                break;
            }
        }

        //let botResponse = await getBotResponse(userInput);

        turns++; // increase turn count after each user input


        // If botResponse includes "guided tour", then initiate the booking process
        if (botResponse && botResponse.includes("guided tour")) {
            let appointment = await setAppointment();
            console.log("Bot: ", appointment);

            // Ask user if they want to continue exploring
            let continueExploring = await askQuestion('Do you want to continue with exploring new places? (yes/no) ');
            if (continueExploring.toLowerCase() === 'yes') {
                userPreference = await listVacationTypes();
                question = await getBotResponse(userPreference);
                console.log(`Bot: ${question}`);
            } else {
                console.log("\nIf you would like to monitor the weather in the area where you are planning to go, you can do this in our website!\nHere is a summary of your appointments:");
                for (let appointment of userAppointments) {
                    console.log(appointment);
                }
                break;
            }
        }

        // If botResponse includes "book a lounger" or "guest house", then initiate the booking process
        if (botResponse && (botResponse.includes("book a lounger") || botResponse.includes("guest house"))) {
            location = userInput;
            awaitingLoungerSeatingResponse = true; // set the state variable
        }
    }

    rl.close();
}

startConversation();

