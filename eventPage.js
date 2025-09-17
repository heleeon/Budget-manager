// You can have different context menus like for clicking image, or there is a video,more available on the chrome developer page

// Function to create context menu
function createContextMenu() {
  var contextMenuItem = {
    id: "spendMoney",
    title: "SpendMoney",
    contexts: ["selection"],
  };

  chrome.contextMenus.create(contextMenuItem, function () {
    if (chrome.runtime.lastError) {
      console.log("Context menu creation error:", chrome.runtime.lastError);
    } else {
      console.log("Context menu created successfully");
    }
  });
}

// Create context menu when extension is installed or updated
chrome.runtime.onInstalled.addListener(function () {
  createContextMenu();
});

// Create context menu when browser starts (for existing extensions)
chrome.runtime.onStartup.addListener(function () {
  createContextMenu();
});

function isInteger(value) {
  return (
    !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10))
  );
}

chrome.contextMenus.onClicked.addListener(function (clickData) {
  if (clickData.menuItemId == "spendMoney" && clickData.selectionText) {
    // Checked if the menu item is clicked and if the selection text is not empty

    // Now check if the user have selected an integer value
    if (isInteger(clickData.selectionText)) {
      chrome.storage.sync.get(["total", "limit"], function (budget) {
        // We will update the budget total that we have so far

        var newTotal = 0;

        // First we will check if we have a budget total already
        if (budget.total) {
          // If we have a budget total already, we will add the new amount to it
          newTotal += parseInt(budget.total);
        }

        // Now we will add the new amount selected with the selection to thwe new total
        newTotal += parseInt(clickData.selectionText);

        // Updating the total in the storage
        chrome.storage.sync.set({ total: newTotal }, function () {
          // Show notification with amount added and new total
          var amountAdded = parseInt(clickData.selectionText);
          var notifOptions = {
            type: "basic",
            title: "Amount Added",
            message:
              "Added $" +
              amountAdded +
              " to your budget. New total: $" +
              newTotal,
            iconUrl: "icon16.png",
          };
          chrome.notifications.create("amountAddedNotif", notifOptions);

          // Check if limit is exceeded and show warning
          if (newTotal >= budget.limit) {
            var limitNotifOptions = {
              type: "basic",
              title: "Limit Reached",
              message:
                "You have exceeded your budget limit of $" + budget.limit,
              iconUrl: "icon16.png",
            };
            chrome.notifications.create("limitNotif", limitNotifOptions);
          }
        });
      });
    }
  }
});

// Adding a badge for displaying the current Total Spent
chrome.storage.onChanged.addListener(function (changes, storageName) {
  if (changes.total && changes.total.newValue !== undefined) {
    chrome.action.setBadgeText({
      text: changes.total.newValue.toString(),
    });
  }
});
